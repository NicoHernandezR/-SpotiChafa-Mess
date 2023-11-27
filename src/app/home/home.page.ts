import { Component, ElementRef, ViewChild } from '@angular/core';
import { createClient, SupabaseClient} from "@supabase/supabase-js";
import { environment } from 'src/environments/environment';
import { AudioReproducerService } from '../services/audio-reproducer.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('audioPlayer')
  audioPlayer!: ElementRef;
  supabase: SupabaseClient;
  constructor(private audioService: AudioReproducerService) {
    this.supabase = createClient(environment.supaBaseUrl, environment.supaBaseKey);
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
    this.audioService.playAudioFromBase64(data[0]['archivo_mp3'])
  }
  }

  pauseAudio() {
    this.audioService.pauseAudio();
  }

  stopAudio() {
    this.audioService.stopAudio();
  }

  playBase64Audio(base64Text: string) {
    // Decodifica la cadena base64 a un ArrayBuffer
    const binaryData = atob(base64Text);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const byteArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    // Crea un Blob a partir del ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });

    // Obtiene la URL del Blob
    const audioUrl = URL.createObjectURL(blob);

    // Asigna la URL al elemento audio
    this.audioPlayer.nativeElement.src = audioUrl;

    // Reproduce el audio
    this.audioPlayer.nativeElement.play();
  } 

}
