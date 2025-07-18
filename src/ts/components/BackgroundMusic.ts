import Phaser from 'phaser';

export class BackgroundMusic {
  private scene: Phaser.Scene;
  private music!: Phaser.Sound.WebAudioSound;
  private key: string;
  private muted: boolean = false;

  constructor(scene: Phaser.Scene, key: string, volume: number = 0.2) {
    this.scene = scene;
    this.key = key;

    this.music = this.scene.sound.add(this.key, {
      loop: true,
      volume: volume
    }) as Phaser.Sound.WebAudioSound;
  }

public play() {
  this.music.play();
}


  public stop() {
    if (this.music && this.music.isPlaying) {
      this.music.stop();
    }
  }

  public pause() {
    if (this.music && this.music.isPlaying) {
      this.music.pause();
    }
  }

  public resume() {
    if (this.music && this.music.isPaused) {
      this.music.resume();
    }
  }

  public setVolume(value: number) {
    this.music.setVolume(value);
  }

  public mute() {
    this.music.setMute(true);
    this.muted = true;
  }

  public unmute() {
    this.music.setMute(false);
    this.muted = false;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    this.music.setMute(this.muted);
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }
}
