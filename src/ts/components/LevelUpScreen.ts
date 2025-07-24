import Phaser from 'phaser'
import { applyButtonHoverEffect } from './HoverButtons';

export class LevelUpScreen extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Image;
  private levelText: Phaser.GameObjects.Text;
  private levelNumberText: Phaser.GameObjects.Text;
  private goalText: Phaser.GameObjects.Text;
  private continueButton: Phaser.GameObjects.Image;
  private logoMogul!: Phaser.GameObjects.Image;
  
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

    // Logo Mogul
    this.logoMogul = this.scene.add.image(centerX, centerY - 210, 'logo_mogul_color')
      .setScale(0.78)
      .setOrigin(0.5)

    // Título level
    this.levelText = this.scene.add.text(centerX, centerY - 90, '', {
      font: "53px 'Luckiest Guy'",
      color: '#FBB040',
      align: 'center'
    }).setOrigin(0.5).setStroke('#FFFFFF', 10);

    this.levelNumberText = this.scene.add.text(centerX, centerY - 10, '', {
      font: "140px 'Luckiest Guy'",
      color: '#FBB040',
      align: 'center'
    }).setOrigin(0.5).setStroke('#FFFFFF', 10); 

    // Meta
    this.goalText = this.scene.add.text(centerX, centerY + 95, '', {
      font: "20px 'Luckiest Guy'",
      color: '#FEC647',
      align: 'center',
    }).setOrigin(0.5);

    const boxMeta = this.scene.add.rectangle( this.goalText.x, this.goalText.y + 2, 250,this.goalText.height + 20, 0x3B0037)
    .setOrigin(0.5)
    .setStrokeStyle(4, 0xFFFFFF)
    boxMeta.setDepth(this.goalText.depth - 1);

    // Botón continuar
    this.continueButton = this.scene.add.image(centerX, centerY + 200, 'continuar_btn')
    .setOrigin(0.5).setInteractive({ useHandCursor: true });
    applyButtonHoverEffect(this.continueButton);
    this.continueButton.on('pointerdown', () => {
      this.container.setVisible(false);
      this.emit('closed'); // Control total desde MainGame
    });

    this.container = this.scene.add.container(0, 0, [
      this.background,
      this.logoMogul,
      this.levelText,
      this.levelNumberText,
      boxMeta, 
      this.goalText,
      this.continueButton
    ]).setDepth(1000).setVisible(false);
  }

  show(level: number, goal: number) {
    this.levelText.setText(`NIVEL`);
    this.levelNumberText.setText(`${level}`);
    this.goalText.setText(`META: ${goal} PUNTOS`);
    this.container.setVisible(true);
    this.createConfettiEmitter();
  }
}
