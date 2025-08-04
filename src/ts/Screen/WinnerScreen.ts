
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
  private actionButtons: Phaser.GameObjects.GameObject[] = [];
  private resizeListener: () => void; 
  eventObserver: EventObserver;

  constructor( scene: Phaser.Scene ) {
    this.prompt = new PromptScreen(scene);
    this.scene = scene;
    this.eventObserver = EventObserver.getInstance();
  }

  show(promptContent: promptContentConfig, promptType: string) {
    this.scene.closeButton.destroy();
    this.prompt.setSplashBackground();
    this.scene.add.image( this.scene.cameras.main.centerX, this.scene.cameras.main.centerY - 250, "logo_candy_Arcor_win").setOrigin(0.5, 0.5).setDepth(10).setScale(1)

    this.prompt.setBackground(promptType, 0, 80, 1.1, 1.1); 
    this.prompt.setTitle(promptContent.title, 0, -105, 1, 1);
    this.setWinnerScore();
    this.actionButtons = this.prompt.setActions(promptContent.actions, 0, 150, 55, 1, 1);
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

private setWinnerCouponCode() {
  const code = this.scene.game.getCouponCode();

  // Eliminar anteriores si existieran
  document.getElementById("couponTextarea")?.remove();
  document.getElementById("copyHiddenBtn")?.remove();

  // Crear elementos
  const textarea = document.createElement("textarea");
  textarea.id = "couponTextarea";
  textarea.readOnly = true;
  textarea.value = code;

  Object.assign(textarea.style, {
    position: "absolute",
    textShadow: "rgb(255 255 255 / 40%) 0px 0px 2px)",
    fontSize: "23px",
    lineHeight: "23px",
    width: "294px",
    height: "52px",
    fontFamily: "'Luckiest Guy', sans-serif",
    color: "#ffffff",
    backgroundColor: "#294256",
    border: "none",
    borderRadius: "10px",
    padding: "18px 0px 10px",
    textAlign: "center",
    zIndex: "9999",
    pointerEvents: "auto",
    outline: "none",
    resize: "none",
    boxSizing: "border-box",
    transform: "translate(-50%, -50%)",
  });

  const btn = document.createElement("button");
  btn.id = "copyHiddenBtn";
  btn.innerText = "";
  Object.assign(btn.style, {
    position: "absolute",
    width: "216px",
    height: "49px",
    zIndex: "9999",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "rgb(170 71 115 / 2%)",
    color: "#000",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
  });

  btn.onclick = () => {
    textarea.focus();
    textarea.select();
    try {
      const copied = document.execCommand("copy");
      if (!copied) {
        prompt(`Selecciona el texto y copia manualmente`, textarea.value);
      }
    } catch (e) {
      console.warn("Error al copiar en iOS", e);
    }
  };

  document.body.appendChild(textarea);
  document.body.appendChild(btn);

  const updatePositions = () => {
    const canvasRect = this.scene.game.canvas.getBoundingClientRect();
    const firstBtn = this.actionButtons[0] as Phaser.GameObjects.Image | Phaser.GameObjects.Text;
    const bounds = firstBtn.getBounds();

    const btnCenterX = canvasRect.left + bounds.centerX * (canvasRect.width / this.scene.game.scale.width);
    const btnCenterY = canvasRect.top + bounds.centerY * (canvasRect.height / this.scene.game.scale.height);

    btn.style.left = `${btnCenterX}px`;
    btn.style.top = `${btnCenterY}px`;

    textarea.style.left = `${btnCenterX}px`;
    textarea.style.top = `${btnCenterY - 65}px`;
  };

  updatePositions();

  // Guardamos el listener para luego removerlo
  this.resizeListener = () => {
    btn.remove();
    textarea.remove();
    window.removeEventListener("resize", this.resizeListener); // se remueve a sí mismo
  };

  window.addEventListener("resize", this.resizeListener);
}




  private setMessageWinner() {
    /*this.couponCodeContainer = this.scene.add.image(
        this.scene.cameras.main.centerX, 
        this.scene.cameras.main.centerY + 30, 
        "win_message"
    )
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(1, 1);*/

    document.fonts.load('14px "Open Sans"').then(() => {
        this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY + 27,
            "¡Eso sí fue un match \nMoguloso 🍬!",
            {
            fontFamily: 'Open Sans',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 4,
            }
        )
        .setOrigin(0.5, 0.5)
        .setDepth(11);
    });
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
  // Limpia DOM si aún existe
  document.getElementById("couponTextarea")?.remove();
  document.getElementById("copyHiddenBtn")?.remove();

  // Limpia listener
  if (this.resizeListener) {
    window.removeEventListener("resize", this.resizeListener);
    this.resizeListener = undefined;
  }
  }
}
