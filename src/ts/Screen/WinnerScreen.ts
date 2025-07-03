
import { Footer } from "../components/Footer";
import { promptContentConfig } from "../types";
import { PromptScreen } from "./PromptScreen";
import { EventObserver } from "../observer";
import { buttons } from "../config";

export class WinnerScreen  {
  private scene;
  private prompt: PromptScreen;
  public couponCode: Phaser.GameObjects.Text;
  private couponCodeContainer: Phaser.GameObjects.Image;
  private saphirusCoin: Phaser.GameObjects.Image;
  private finalScore: Phaser.GameObjects.Text;
  eventObserver: EventObserver;

  constructor( scene: Phaser.Scene ) {
    this.prompt = new PromptScreen(scene);
    this.scene = scene;
    this.eventObserver = EventObserver.getInstance();
  }

  show(promptContent: promptContentConfig, promptType: string) {
    this.scene.closeButton.destroy();
    this.prompt.setSplashBackground();
    this.setSplashLogo();
    this.prompt.setBackground(promptType, 0, 80, 1.1, 1.1); 
    this.prompt.setTitle(promptContent.title, 0, -90, 1.1, 1.1);
    this.setWinnerScore();
    this.prompt.setMessage(promptContent.message, 0, 60, 1.1, 1.1);
    this.setWinnerCouponCode();
    this.prompt.setActions(promptContent.actions, 0, 190, 60, 1.1, 1.1);
    this.scene.sound.add('tadaa').play({
      volume: 0.3
    });
    //this.scene.removeInteractivityCards(); solo para memo
    Footer.create(this.scene);

    this.eventObserver.on('button-clicked', (buttonId) => {
		if (buttonId == 'copy') {
            this.prompt.setActions([ buttons.copied ], 0, 190, 60, 1.1, 1.1);
        }

        setTimeout(() => {
            this.prompt.setActions([ buttons.copy ], 0, 190, 60, 1.1, 1.1);
        }, 1500);
	}, this);
  }

  private setSplashLogo() {
    const logo = this.scene.add.image(
      this.scene.cameras.main.centerX, 
      this.scene.cameras.main.centerY - 235, 
      "logo_candy_Arcor_win"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(0)

    this.scene.tweens.add({
			targets: logo,
			scale: 0.8,
			delay:0,
			duration: 10,
			ease: "Bounce.easeOut"
		});
  }

  private setWinnerCouponCode() {
    this.couponCodeContainer = this.scene.add.image(
        this.scene.cameras.main.centerX, 
        this.scene.cameras.main.centerY + 130, 
        "coupon_code_container"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);

    this.couponCode = this.scene.add.text(
      this.scene.cameras.main.centerX, 
      this.scene.cameras.main.centerY + 125,
      this.scene.game.getCouponCode(),
      {
          font: "20px montserrat-memo",
          color: "#FFFFFF",
      }
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);

    this.scene.tweens.add({
      targets: this.couponCode,
      y: this.couponCode.y - 30,  // Hace que el texto suba
      scaleY: 1.2,  // Estira un poco el texto para simular el brinco
      duration: 200,  // Duración de la subida
      ease: 'Power1',
      yoyo: true,  // Hace que vuelva a su posición original
      onComplete: () => {
          // Animación de caída
          this.scene.tweens.add({
              targets: this.couponCode,
              y: this.scene.cameras.main.centerY + 128,  // Hace que caiga un poco más abajo
              duration: 30,  // Duración de la caída
              ease: 'Bounce.easeOut',  // Efecto de rebote al caer
          });
      }
    });
  }

  private setWinnerScore() {
    /*this.saphirusCoin = this.scene.add.image(
        this.scene.cameras.main.centerX - 75,
        this.scene.cameras.main.centerY - 10,
        "saphirus_coin"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);*/

    this.finalScore = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY - 15,
      this.scene.getScoreValue(),
      {
          font: "40px montserrat-memo",
          color: "#E2D64B",
      }
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);

    /*this.scene.tweens.add({
      targets: this.saphirusCoin,
      scaleX: 0, // Achica la moneda en su eje X
      duration: 500, // Duración de la primera mitad del giro
      yoyo: true, // Hace que el tween vuelva a su estado original
      repeat: -1, // Repetir indefinidamente
      ease: 'Sine.easeInOut', // Tipo de easing
      onUpdate: () => {
          // Cambia el frame de la moneda en el punto medio de la animación (cuando scaleX llega a 0)
          if (this.saphirusCoin.scaleX === 0) {
              // Aquí podrías cambiar la imagen o el frame si quieres
          }
      }
    });*/
    
  }

  hide(): void {
    this.prompt.hide();
  }
}
