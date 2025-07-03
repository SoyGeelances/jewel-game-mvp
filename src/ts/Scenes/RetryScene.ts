import Phaser from 'phaser'

export default class RetryScene extends Phaser.Scene {
  public static Name = 'RetryScene'

  constructor() {
    super(RetryScene.Name)
  }

  preload() {
    this.load.image('retry-bg', '/assets/bg-modal-pause.png')
    this.load.image('retry-text', '/assets/segui-intentando.png')
    this.load.image('trying-text', '/assets/cada-vez-mas-cerca.png')
    this.load.image('retry-btn', '/assets/jugar-otra-vez-btn.png')
    this.load.image('go-to-shop-btn', '/assets/ir-a-tienda-btn.png')
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.image(centerX, centerY, 'retry-bg').setOrigin(0.5);

    // Textos uno sobre otro
    this.add.image(centerX, centerY - 60, 'trying-text').setOrigin(0.5);
    this.add.image(centerX, centerY + 30, 'retry-text').setOrigin(0.5);


    // Botón "Jugar otra vez"
    const buttonRetry = this.add.image(centerX, this.scale.height - 160, 'retry-btn').setOrigin(0.5).setInteractive();
    buttonRetry.on('pointerdown', () => {
        this.scene.start('MainGameCandy');
    });

    // Botón "Ir a tienda"
    const buttonGoToShop = this.add.image(centerX, this.scale.height - 90, 'go-to-shop-btn').setOrigin(0.5).setInteractive();
    buttonGoToShop.on('pointerdown', () => {
        window.location.href = 'https://tu-tienda.com'; // URL real de tu tienda
    });
  }
}
