import Phaser from 'phaser';

export class BackgroundMusic {
  private static instance: BackgroundMusic;
  private sound: Phaser.Sound.BaseSound | null = null;
  private isMuted: boolean = false;
  private soundButton?: Phaser.GameObjects.Image;

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

    this.createSoundButton(scene);
  }

  private createSoundButton(scene: Phaser.Scene) {
    if (this.soundButton && !this.soundButton.active) {
        this.soundButton.destroy();
        this.soundButton = undefined;
    }

    // Si ya existe un botón activo, no lo volvemos a crear
    if (this.soundButton) return;

    this.soundButton = scene.add.image(scene.scale.width - 15, 80, this.isMuted ? 'sound_off' : 'sound_on')
        .setOrigin(1, 0)
        .setScale(1)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true });

    this.soundButton.on('pointerdown', () => {
        this.toggleMute();
        this.soundButton?.setTexture(this.isMuted ? 'sound_off' : 'sound_on');
    });
  }


public recreateButton(scene: Phaser.Scene) {
  this.createSoundButton(scene);
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

  public hideButton() {
    this.soundButton?.setVisible(false);
  }

  public showButton() {
    this.soundButton?.setVisible(true);
  }

  public destroy() {
    if (this.soundButton && this.isPlaying) {
        this.soundButton.destroy();
        this.isMuted = false;
    }
  }

  showMuteButton(scene: Phaser.Scene) {
    const iconKey = this.isMuted ? 'sound_off' : 'sound_on';
    const btn = scene.add.image(scene.scale.width - 15, 84, iconKey)
      .setOrigin(1, 0.5)
      .setInteractive()
      .setScale(1)
      .setScrollFactor(0)

    btn.on('pointerdown', () => {
      this.toggleMute();
      btn.setTexture(this.isMuted ? 'sound_off' : 'sound_on');
    });
  }
}
