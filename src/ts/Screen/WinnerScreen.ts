
import { Footer } from "../components/Footer";
import { promptContentConfig } from "../types";
import { PromptScreen } from "./PromptScreen";
import { EventObserver } from "../observer";
import { buttons } from "../config";
import { applyButtonHoverEffect } from "../components/HoverButtons";

export class WinnerScreen  {
  private scene;
  private prompt: PromptScreen;
  public couponCode: Phaser.GameObjects.Text;
  private couponCodeContainer: Phaser.GameObjects.Image;
  private arcorCoin: Phaser.GameObjects.Image;
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
    this.prompt.setTitle(promptContent.title, 0, -105, 1, 1);
    this.setWinnerScore();
    this.setMessageWinner();
    this.setWinnerCouponCode();
    this.prompt.setActions(promptContent.actions, 0, 150, 55, 1, 1);
    this.scene.sound.add('tadaa').play({
      volume: 0.3
    });
    //this.scene.removeInteractivityCards(); solo para memo
    Footer.create(this.scene);

    this.eventObserver.on('button-clicked', (buttonId) => {
		if (buttonId == 'copy') {
            const copyButtons = this.prompt.setActions([buttons.copied], 0, 150, 55, 1, 1);
            copyButtons.forEach(applyButtonHoverEffect); 

        }

        setTimeout(() => {
            const resetButtons = this.prompt.setActions([buttons.copy], 0, 150, 55, 1, 1);
            resetButtons.forEach(applyButtonHoverEffect);
        }, 1500);
	}, this);
  }

  private setSplashLogo() {
    const logo = this.scene.add.image(
      this.scene.cameras.main.centerX, 
      this.scene.cameras.main.centerY - 250, 
      "logo_candy_Arcor_win"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(0)

    this.scene.tweens.add({
			targets: logo,
			scale: 1,
			delay:0,
			duration: 10,
			ease: "Bounce.easeOut"
		});
  }

  private setWinnerCouponCode() {
    this.couponCodeContainer = this.scene.add.image(
        this.scene.cameras.main.centerX, 
        this.scene.cameras.main.centerY + 85, 
        "coupon_code_container"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);

    this.couponCode = this.scene.add.text(
      this.scene.cameras.main.centerX, 
      this.scene.cameras.main.centerY + 70,
      this.scene.game.getCouponCode(),
      {
          font: "23px 'Luckiest Guy'",
          color: "#FFFFFF",
      }
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1, 1);

    this.scene.tweens.add({
      targets: this.couponCode,
      y: this.couponCode.y - 50,  // Hace que el texto suba
      scaleY: 1,  // Estira un poco el texto para simular el brinco
      duration: 200,  // Duración de la subida
      ease: 'Power1',
      yoyo: true,  // Hace que vuelva a su posición original
      onComplete: () => {
          // Animación de caída
          this.scene.tweens.add({
              targets: this.couponCode,
              y: this.scene.cameras.main.centerY + 83,  // Hace que caiga un poco más abajo
              duration: 30,  // Duración de la caída
              ease: 'Bounce.easeOut',  // Efecto de rebote al caer
          });
      }
    });
  }

    private setMessageWinner() {
    this.couponCodeContainer = this.scene.add.image(
        this.scene.cameras.main.centerX, 
        this.scene.cameras.main.centerY + 30, 
        "win_message"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);
  }

  private setWinnerScore() {
    /*this.arcorCoin = this.scene.add.image(
        this.scene.cameras.main.centerX - 75,
        this.scene.cameras.main.centerY - 10,
        "arcor_coin"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1.1, 1.1);*/

    this.finalScore = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY - 30,
      this.scene.getScoreValue(),
      {
          font: "40px 'Luckiest Guy'",
          color: "#E2D64B",
      }
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1, 1);

    /*this.scene.tweens.add({
      targets: this.arcorCoin,
      scaleX: 0, // Achica la moneda en su eje X
      duration: 500, // Duración de la primera mitad del giro
      yoyo: true, // Hace que el tween vuelva a su estado original
      repeat: -1, // Repetir indefinidamente
      ease: 'Sine.easeInOut', // Tipo de easing
      onUpdate: () => {
          // Cambia el frame de la moneda en el punto medio de la animación (cuando scaleX llega a 0)
          if (this.arcorCoin.scaleX === 0) {
              // Aquí podrías cambiar la imagen o el frame si quieres
          }
      }
    });*/
    
  }

  hide(): void {
    this.prompt.hide();
  }
}
