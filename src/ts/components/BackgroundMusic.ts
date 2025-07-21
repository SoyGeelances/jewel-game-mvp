import Phaser from 'phaser';

// components/BackgroundMusic.ts
export class BackgroundMusic {
  private static instance: BackgroundMusic;
  private sound: Phaser.Sound.BaseSound | null = null;
  private isMuted: boolean = false;

  private constructor() {}

  public static getInstance(): BackgroundMusic {
    if (!BackgroundMusic.instance) {
      BackgroundMusic.instance = new BackgroundMusic();
    }
    return BackgroundMusic.instance;
  }

  public init(scene: Phaser.Scene, key: string, volume: number = 0.13) {
    if (!this.sound) {
      this.sound = scene.sound.add(key, {
        loop: true,
        volume: volume
      });
      this.sound.play();
    }
  }

public toggleMute(): boolean {
  if (!this.sound) return this.isMuted;

  this.isMuted = !this.isMuted;
  (this.sound as Phaser.Sound.WebAudioSound).setMute(this.isMuted);
  return this.isMuted;
}

  public stop(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.destroy();
      this.sound = null;
    }
  }

  public isPlaying(): boolean {
    return this.sound?.isPlaying ?? false;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }
}
