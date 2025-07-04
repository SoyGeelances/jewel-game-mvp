export class LevelUpScreen {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Image;
  private titleText: Phaser.GameObjects.Text;
  private goalText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;

    // Fondo del modal
    this.background = this.scene.add.image(centerX, centerY, 'prompt_bg')
      .setOrigin(0.5)
      .setScale(1.2);

    // Título
    this.titleText = this.scene.add.text(centerX, centerY - 40, '', {
      font: '32px montserrat-memo',
      color: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5);

    // Meta de puntos
    this.goalText = this.scene.add.text(centerX, centerY + 20, '', {
      font: '26px montserrat-memo',
      color: '#FEC647',
      align: 'center'
    }).setOrigin(0.5);

    // Agrupamos todo en un contenedor y lo ocultamos inicialmente
    this.container = this.scene.add.container(0, 0, [
      this.background,
      this.titleText,
      this.goalText
    ]).setDepth(1000).setVisible(false);
  }

  show(level: number, goal: number) {
    this.titleText.setText(`¡Nivel ${level}!`);
    this.goalText.setText(`Meta: ${goal} puntos`);
    this.container.setVisible(true);

    // Ocultarlo automáticamente después de 2.5 segundos
    this.scene.time.delayedCall(2700, () => {
      this.container.setVisible(false);
    });
  }
}
