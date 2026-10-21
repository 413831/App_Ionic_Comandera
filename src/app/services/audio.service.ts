import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

interface Sound
{
  key: string;
  asset: string;
  isNative: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService
{
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;
  private muted: boolean = false;

  constructor(private platform: Platform, private nativeAudio: NativeAudio) 
  {
    this.cargarAssets();
  }

  preload(key: string, asset: string): Promise<any> 
  {
    return new Promise<any>((resolve) =>
    {
      const cleanAsset = asset.startsWith('/') ? asset.substring(1) : asset;

      if ((this.platform.is('capacitor') || this.platform.is('cordova')) && !this.forceWebAudio)
      {
        try 
        {
          this.nativeAudio.preloadSimple(key, cleanAsset);
        } 
        catch (e) 
        {
          console.warn('[AudioService] NativeAudio preload fallback:', e);
        }

        this.sounds.push({
          key: key,
          asset: cleanAsset,
          isNative: true
        });
      }
      else 
      {
        const audio = new Audio();
        audio.src = cleanAsset;
        audio.preload = 'auto';

        this.sounds.push({
          key: key,
          asset: cleanAsset,
          isNative: false
        });
      }
      resolve(true);
    });
  }

  play(key: string): void
  {
    if (this.muted) 
    {
      return;
    }

    const soundToPlay = this.sounds.find((sound) => sound.key === key);

    if (!soundToPlay)
    {
      console.warn(`[AudioService] Sound '${key}' not found.`);
      return;
    }

    if (soundToPlay.isNative && (this.platform.is('capacitor') || this.platform.is('cordova')))
    {
      this.nativeAudio.play(soundToPlay.key)
        .then(
          (res) => console.log('[AudioService] Native played:', res),
          (err) => console.warn('[AudioService] Native play error:', err)
        );
    }
    else 
    {
      try 
      {
        this.audioPlayer.src = soundToPlay.asset;
        this.audioPlayer.volume = 0.8;
        const playPromise = this.audioPlayer.play();
        if (playPromise !== undefined) 
        {
          playPromise.catch((err) => 
          {
            console.log('[AudioService] Autoplay policy prevented playback until user gesture:', err.message || err);
          });
        }
      } 
      catch (err) 
      {
        console.warn('[AudioService] Play error:', err);
      }
    }
  }

  setMuted(muted: boolean): void
  {
    this.muted = muted;
    if (muted && this.audioPlayer) 
    {
      this.audioPlayer.pause();
    }
  }

  isMuted(): boolean
  {
    return this.muted;
  }

  cargarAssets()
  {
    this.preload("cierre", 'assets/audio/cierre_app.mp3');
    this.preload("inicio", 'assets/audio/inicio_app.mp3');
  }
}
