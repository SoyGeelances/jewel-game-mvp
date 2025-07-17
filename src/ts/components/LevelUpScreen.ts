import Phaser from 'phaser'

export class LevelUpScreen extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Image;
  private titleText: Phaser.GameObjects.Text;
  private goalText: Phaser.GameObjects.Text;
  private continueButton: Phaser.GameObjects.Text;
  
  private createConfettiEmitter(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    const emitter = this.scene.add.particles(0, 0, 'spritesheet_confetti', {
        frame: Phaser.Utils.Array.NumberArray(0, 6),
        speed: { min: 80, max: 160 },
        angle: { min: -110, max: -70 },
        gravityY: 80,
        scale: { start: 0.6, end: 0, ease: 'sine.out' },
        lifespan: { min: 3000, max: 7500 },
        quantity: 40,
        rotate: { min: 0, max: 360 },
        alpha: { start: 1, end: 0 },
        frequency: -1
    });

    this.container.addAt(emitter, 1); //posicionamiento en las capas

    emitter.explode(100, centerX, centerY);

    this.scene.time.delayedCall(500, () => {
        emitter.explode(80, centerX, centerY);
    });

    this.scene.time.delayedCall(8000, () => {
        emitter.destroy();
    });
  }

  constructor(scene: Phaser.Scene) {
    super();
    this.scene = scene;

    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;

    // Fondo
    this.background = this.scene.add.image(centerX, centerY, 'prompt_bg')
      .setOrigin(0.5)
      .setScale(1.2);

    // Título
    this.titleText = this.scene.add.text(centerX, centerY - 40, '', {
      font: '32px montserrat-memo',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5);

    // Meta
    this.goalText = this.scene.add.text(centerX, centerY + 20, '', {
      font: '26px montserrat-memo',
      color: '#FEC647',
      align: 'center'
    }).setOrigin(0.5);

    // Botón continuar
    this.continueButton = this.scene.add.text(centerX, centerY + 90, 'Continuar', {
      font: '26px montserrat-memo',
      color: '#FFFFFF',
      backgroundColor: '#002E55',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      align: 'center'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.continueButton.on('pointerdown', () => {
      this.container.setVisible(false);
      this.emit('closed'); // Control total desde MainGame
    });

    this.container = this.scene.add.container(0, 0, [
      this.background,
      this.titleText,
      this.goalText,
      this.continueButton
    ]).setDepth(1000).setVisible(false);
  }

  show(level: number, goal: number) {
    this.titleText.setText(`¡Nivel ${level}!`);
    this.goalText.setText(`Meta: ${goal} puntos`);
    this.container.setVisible(true);
    this.createConfettiEmitter();
  }
}
