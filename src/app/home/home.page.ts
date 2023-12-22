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

  
  mensaje: string = ''
  prevSTR: string = 'prevBS64'
  actSTR: string = 'actualBS64'
  nextSTR: string = 'nextBS64'
  player: Howl | undefined =  undefined;
  totalSongs: number = 0
  idActual: number = 2
  reproduciendo: boolean = false
  actual: any
  prev: any
  next: any
  titulo: string | null = ''
  duracion: any = 0
  progresoSegundos: any = 0
  progreso: number = 0
  intervalo: any
  progresoStr: any
  duracionStr: any


  async ngOnInit() {
    this.getTotalSongs()
    this.cargarCancionActual()
    this.cargcarCancionPrevia()
    await this.cargarCancionNext()
    this.actualizarTitulo()

  }

  obtenerProgreso(){
    this.progresoSegundos = this.player?.seek()
  }

  obtenerDuracion(){
    this.duracion = this.player?.duration()
  }

  calcularProgreso(){
    this.progreso = this.progresoSegundos / this.duracion
  }

  formatearAMinutos(secs: number){
    let minutos = Math.floor(secs / 60);
    let segundos = Math.floor(secs % 60);
    let duracionTexto = minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
    return duracionTexto
  }

  actualizarContadorSegundos(){
    this.progresoStr = this.formatearAMinutos(this.progresoSegundos)
  }

  actualizarDuracionStr(){
    this.obtenerDuracion()
    console.log(this.duracion)
    this.duracionStr = this.formatearAMinutos(this.duracion)
  }

  barraDeReproduccion() {
    this.intervalo = setInterval(() => {
      if(this.player?.playing()){
        this.obtenerProgreso()
        this.obtenerDuracion()
        this.actualizarDuracionStr()
        if (this.progresoSegundos < this.duracion) {
          this.calcularProgreso()
          this.actualizarContadorSegundos()
        } else{
          console.log('Termino la cancion')
          this.siguienteCancion()
          clearInterval(this.intervalo);
        }
      }else if (this.progreso !== 0 && this.duracion !== 0){
        console.log('Termino la cancion')
        this.siguienteCancion()
        clearInterval(this.intervalo);
      }
    }, 1000);  // Actualiza cada segundo
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
  
  guardarTitulo(path:string, nom:string | Blob){
    let nuevoPath = path + 'nom'
    if (typeof nom === 'string') {
    localStorage.setItem(nuevoPath, nom)
    }
  }


  async escribirArchivo(path: string, data: string | Blob, nom: string | Blob): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: path,
        data: data,
        directory: Directory.Data,
      });

    } catch (error) {
      console.error(`Error al escribir en el archivo ${path}`, error);
      // Puedes manejar el error de otra manera según tus necesidades
    }

    this.guardarTitulo(path, nom)

  }


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
    .select('archivo_mp3,nombre_archivo')
    .eq('id', this.idActual);

    if (!(data && data.length > 0 && data[0]['archivo_mp3'])) {
      return;
    }
    
    await this.escribirArchivo(this.actSTR, data[0]['archivo_mp3'], data[0]['nombre_archivo'])

  }

  async cargcarCancionPrevia() {

    if(this.idActual === 1) {
      return
    }

    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3,nombre_archivo')
    .eq('id', this.idActual - 1);

    if (!(data && data.length > 0 && data[0]['archivo_mp3'])) {
      return;
    }

    await this.escribirArchivo(this.prevSTR, data[0]['archivo_mp3'], data[0]['nombre_archivo'])

  }

  async cargarCancionNext() {

    if(this.idActual === this.totalSongs) {
      return
    }

    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3,nombre_archivo')
    .eq('id', (this.idActual + 1));

    if (!(data && data.length > 0 && data[0]['archivo_mp3'])) {
      return;
    }

    await this.escribirArchivo(this.nextSTR, data[0]['archivo_mp3'], data[0]['nombre_archivo'])

  }

  async comprobar() {
    // const prev = await Filesystem.readFile({      
    //   path: 'prevBS64',
    //   directory: Directory.Data,}
    // )
    // const actual = await Filesystem.readFile({      
    //   path: 'actualBS64',
    //   directory: Directory.Data,}
    // )
    // const next = await Filesystem.readFile({      
    //   path: 'nextBS64',
    //   directory: Directory.Data,}
    // )
    // console.log(prev.data)
    // console.log(actual.data)
    // console.log(next.data)

    const prev = localStorage.getItem(this.prevSTR + 'nom')
    const act = localStorage.getItem(this.actSTR + 'nom')
    const next = localStorage.getItem(this.nextSTR + 'nom')
    console.log(prev)
    console.log(act)
    console.log(next)
  }

  async reproducirOpausar(){

    if(this.reproduciendo){
      this.player?.pause()
      this.reproduciendo = false
      clearInterval(this.intervalo);
      return
    }

    if(this.player?.playing){
      this.player?.play()
      this.reproduciendo = true
      this.barraDeReproduccion()
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
    this.barraDeReproduccion()
  }

  async siguienteCancion() {
    const actual = await this.leerArchivo(this.actSTR)
    const actNom = localStorage.getItem(this.actSTR + 'nom')
    if(typeof actNom === 'string'){
      await this.escribirArchivo(this.prevSTR, actual, actNom)
    }


    const next = await this.leerArchivo(this.nextSTR)
    const nextNom = localStorage.getItem(this.nextSTR + 'nom')
    if(typeof nextNom === 'string'){
      await this.escribirArchivo(this.actSTR, next, nextNom)
    }

    this.idActual = this.idActual + 1;
    this.reiniciarCancion()
    await this.cargarCancionNext()
    this.actualizarTitulo()
    this.actualizarDuracionStr()
    
  }

  async previaCancion(){
    const actual = await this.leerArchivo(this.actSTR)
    const actNom = localStorage.getItem(this.actSTR + 'nom')
    if(typeof actNom === 'string'){
      await this.escribirArchivo(this.nextSTR, actual, actNom)
    }

    const prev = await this.leerArchivo(this.prevSTR)
    const prevNom = localStorage.getItem(this.prevSTR + 'nom')
    if(typeof prevNom === 'string'){
      await this.escribirArchivo(this.actSTR, prev, prevNom)
    }
    this.idActual = this.idActual - 1;
    this.reiniciarCancion()
    await this.cargcarCancionPrevia()
    this.actualizarTitulo()
    this.actualizarDuracionStr()
  }

  reiniciarCancion(){
    this.player?.stop()
    this.player = undefined
    this.reproduciendo = false
    clearInterval(this.intervalo)
    this.reproducirOpausar()
  }

  validarCambiarNext(){
    return this.idActual !== this.totalSongs
  }

  validarCambiarPrev(){
    return this.idActual !== 1
  }

  actualizarTitulo(){
    let path = this.actSTR + 'nom'
    this.titulo = localStorage.getItem(path)
  }

  async playAudio() {
    const { data, error } = await this.supabase
    .from('tabla_mp3')
    .select('archivo_mp3')
    .eq('id', '5');
    
    if (data && data.length > 0 && data[0]['archivo_mp3']) {
      let base64String = data[0]['archivo_mp3']

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
    } catch (error) {
        console.error('Error al obtener información del archivo', error);
    }
  }



  ngOnDestroy(){
    localStorage.clear()
  }


}
