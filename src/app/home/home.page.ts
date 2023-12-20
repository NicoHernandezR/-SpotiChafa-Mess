import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createClient, SupabaseClient} from "@supabase/supabase-js";
import { environment } from 'src/environments/environment';
import { AudioReproducerService } from '../services/audio-reproducer.service'; 
import { Filesystem, Directory } from '@capacitor/filesystem';
import {Howl, Howler} from 'howler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  @ViewChild('audioPlayer')
  audioPlayer!: ElementRef;
  supabase: SupabaseClient;
  constructor(private audioService: AudioReproducerService) {
    this.supabase = createClient(environment.supaBaseUrl, environment.supaBaseKey);
  }


  ngOnInit(): void {
    this.getTotalSongs()
    this.cargarCancionActual()
    this.cargcarCancionPrevia()
    this.cargarCancionNext()
  }

  async leerArchivo(path: string): Promise<string | Blob>{
    try {
      const contenido = await Filesystem.readFile({
        path: path,
        directory: Directory.Data,
      });
      return contenido.data;
    } catch (error) {
      console.error(`Error al leer el archivo ${path}`, error);
      return ''; 
    }
  }
  
  async escribirArchivo(path: string, data: string | Blob): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: path,
        data: data,
        directory: Directory.Data,
      });
      console.log(`Archivo ${path} guardado correctamente`);
    } catch (error) {
      console.error(`Error al escribir en el archivo ${path}`, error);
      // Puedes manejar el error de otra manera según tus necesidades
    }
  }

  mensaje: string = ''
  prevSTR: string = 'prevBS64'
  actSTR: string = 'actualBS64'
  nextSTR: string = 'nextBS64'
  player: Howl | undefined =  undefined;
  totalSongs: number = 0
  idActual: number = 2
  reproduciendo: boolean = false

  async getTotalSongs(){
    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('count');

    if (data && data.length > 0 && data[0].count) {
    this.totalSongs = data[0].count
    }

  }

  async cargarCancionActual(){
    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3')
    .eq('id', this.idActual);

    if (!(data && data.length > 0 && data[0]['archivo_mp3'])) {
      return;
    }

    await this.escribirArchivo(this.actSTR, data[0]['archivo_mp3'])

  }

  async cargcarCancionPrevia() {

    if(this.idActual === 1) {
      return
    }

    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3')
    .eq('id', this.idActual - 1);

    if (!(data && data.length > 0 && data[0]['archivo_mp3'])) {
      return;
    }

    await this.escribirArchivo(this.prevSTR, data[0]['archivo_mp3'])

  }

  async cargarCancionNext() {

    if(this.idActual === this.totalSongs) {
      return
    }

    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3')
    .eq('id', (this.idActual + 1));

    if (!(data && data.length > 0 && data[0]['archivo_mp3'])) {
      return;
    }

    await this.escribirArchivo(this.nextSTR, data[0]['archivo_mp3'])

  }

  async comprobar() {
    const prev = await Filesystem.readFile({      
      path: 'prevBS64',
      directory: Directory.Data,}
    )
    const actual = await Filesystem.readFile({      
      path: 'actualBS64',
      directory: Directory.Data,}
    )
    const next = await Filesystem.readFile({      
      path: 'nextBS64',
      directory: Directory.Data,}
    )
    console.log(prev.data)
    console.log(actual.data)
    console.log(next.data)
  }

  async reproducirOpausar(){

    if(this.reproduciendo){
      this.player?.pause()
      this.reproduciendo = false
      return
    }

    const actual = await this.leerArchivo(this.actSTR)
    let mediaType = "audio/mp3";

    let dataURI = `data:${mediaType};base64,${actual}`;
    this.player = new Howl({
      src: dataURI,
      format: ['mp3']
    })
    this.player.play()
    this.reproduciendo = true

  }

  async siguienteCancion() {
    const actual = await this.leerArchivo(this.actSTR)
    await this.escribirArchivo(this.prevSTR, actual)

    const next = await this.leerArchivo(this.nextSTR)
    await this.escribirArchivo(this.actSTR, next)

    this.idActual = this.idActual + 1;
    this.cargarCancionNext()
    
  }

  async previaCancion(){
    const actual = await this.leerArchivo(this.actSTR)
    await this.escribirArchivo(this.nextSTR, actual)

    const prev = await this.leerArchivo(this.prevSTR)
    await this.escribirArchivo(this.actSTR, prev)

    this.idActual = this.idActual - 1;
    this.cargcarCancionPrevia()
  }

  validarCambiarNext(){
    return this.idActual !== this.totalSongs
  }

  validarCambiarPrev(){
    return this.idActual !== 1
  }

  async playAudio() {
    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3')
    .eq('id', '5');

    console.log("data")
    console.log(data)
    console.log("error")
    console.log(error)
    
    if (data && data.length > 0 && data[0]['archivo_mp3']) {
      let base64String = data[0]['archivo_mp3']
      console.log(base64String)

      let mediaType = "audio/mp3"; // Reemplaza esto con el tipo de medio correcto

      let dataURI = `data:${mediaType};base64,${base64String}`;
      this.player = new Howl({
        src: dataURI,
        format: ['mp3']
      })
      this.player.play()

      // const fileName = '2' + '.mp3';
      // const savedFile = await Filesystem.writeFile({
      //   path: fileName,
      //   data: base64String,
      //   directory: Directory.Data
      // });
      // console.log(savedFile)

    }
  }

  async comprobarMp3(){
    const directory = Directory.Data;
    const fileName = '2.mp3';
    // Ruta completa del archivo
    const filePath = `${directory}/${fileName}`;
    try {
        const fileStat = await Filesystem.stat({
            path: fileName,
            directory: Directory.Data,
        });

        this.mensaje = fileStat.uri;
        console.log('Información del archivo:', fileStat);
        console.log('Archivo MP3 guardado correctamente');
    } catch (error) {
        console.error('Error al obtener información del archivo', error);
    }
  }




}
