
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
  const code = this.scene.game.getCouponCode();

  // Eliminar cualquier input existente
  const existing = document.getElementById("couponInput");
  if (existing) existing.remove();

  const input = document.createElement("input");
  input.type = "text";
  input.value = code;
  input.readOnly = true;
  input.id = "couponInput";

  // Estilo para que se vea como el cupón anterior
  Object.assign(input.style, {
    position: "absolute",
    top: `${this.scene.scale.canvas.offsetTop + this.scene.cameras.main.centerY + 80}px`,
    left: `${this.scene.scale.canvas.offsetLeft + this.scene.cameras.main.centerX}px`,
    transform: "translate(-50%, -50%)",
    fontSize: "23px",
    lineHeight: "23px",
    fontFamily: "'Luckiest Guy', sans-serif",
    fontWeight: "normal",
    color: "#ffffff",
    backgroundColor: "#294256",
    border: "none",
    borderRadius: "10px",
    padding: "15px 7px 12px 7px",
    textAlign: "center",
    zIndex: "9999",
    pointerEvents: "auto",
    textShadow: "none",
    WebkitTextStroke: "0",
    outline: "none",
    boxShadow: "none",
    height: "auto",
    boxSizing: "border-box",
  });

  input.onclick = () => {
    input.select();
    document.execCommand("copy");
    input.blur();

    const toast = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height - 40, "¡Copiado!", {
      font: "18px Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setOrigin(0.5).setDepth(1000);

    this.scene.time.delayedCall(1500, () => toast.destroy());
  };

  document.body.appendChild(input);
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
