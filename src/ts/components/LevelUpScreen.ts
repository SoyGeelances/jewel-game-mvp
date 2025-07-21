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
        frame: Phaser.Utils.Array.NumberArray(0, 23),
        speed: { min: 50, max: 130 },         
        angle: { min: 0, max: 300 },        
        gravityY: 60,                        
        scale: { start: 0.25, end: 0 },
        lifespan: 7000,                       
        rotate: { min: -120, max: 120 },
        alpha: { start: 1, end: 0.2 },
        quantity: 30,
        frequency: -1,
        emitZone: {
            type: 'random',
            source: new Phaser.Geom.Circle(centerX, centerY, 60) // círculo completo
        }
    });

    this.container.addAt(emitter, 1); //posicionamiento en las capas

    emitter.explode(170); // Densidad

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
      font: "32px 'Luckiest Guy'",
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5);

    // Meta
    this.goalText = this.scene.add.text(centerX, centerY + 20, '', {
      font: "26px 'Luckiest Guy'",
      color: '#FEC647',
      align: 'center'
    }).setOrigin(0.5);

    // Botón continuar
    this.continueButton = this.scene.add.text(centerX, centerY + 90, 'Continuar', {
      font: "26px 'Luckiest Guy'",
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
