import { Injectable } from '@angular/core';
import { Media } from '@capacitor-community/media';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AudioReproducerService {
  private audio: any; // Tipo específico para el plugin de Capacitor Media

  constructor() {}

  playAudioFromBase64(base64Data: string): void {

      this.audio = Media;
      this.audio.init();
      const audioBlob = this.base64toBlob(base64Data, 'audio/mp3');
      const audioUrl = URL.createObjectURL(audioBlob);
      this.audio.preloadAudio({
        src: audioUrl,
        id: 'myAudio',
        audioChannelNum: 1,
        volume: 1.0,
        success: () => this.audio.playAudio({ id: 'myAudio' }),
      });

  }

  pauseAudio(): void {

      this.audio.pauseAudio({ id: 'myAudio' });

  }

  stopAudio(): void {

      this.audio.stopAudio({ id: 'myAudio' });

  }

  private base64toBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }
}
