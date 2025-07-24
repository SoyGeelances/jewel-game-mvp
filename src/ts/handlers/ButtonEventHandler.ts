import Game from "../Game";
import copy from 'copy-to-clipboard';

export class ButtonEventHandler {
    public static handleButtonEvents(buttonId: string, scene: Phaser.Scene) {
        let sound = scene.sound.add("cash");

        switch (buttonId) {
            case "close":
                ButtonEventHandler.handleCloseEvent(scene);
                break;

            case "back":
                ButtonEventHandler.handleBackEvent(scene);
                break;

            case "exit":
                if ((scene.game as Game).onCloseGame) (scene.game as Game).onCloseGame();
                window.location.href = 'https://arcorencasa.com/tienda/';
                break;
            
            case "gotoshop":
                if ((scene.game as Game).onCloseGame) (scene.game as Game).onCloseGame();
                window.location.href = 'https://arcorencasa.com/';
                break;

            case "retry":
                ButtonEventHandler.handlePlayAgain(scene);
                break;

            case "copy":
                ButtonEventHandler.handleCopyCode(scene);
                sound.play();
                break;

            default:
                console.log("Botón no reconocido:", buttonId);
                break;
        }
    }

    private static handleCloseEvent(scene: Phaser.Scene) {
        scene.scene.launch("LeavingGameScene");
        scene.scene.pause();
    }

    private static handleBackEvent(scene: Phaser.Scene) {
        scene.scene.resume();
        scene.scene.stop("LeavingGameScene");
    }

    private static handlePlayAgain(scene: Phaser.Scene) {
        scene.scene.stop('MainMenu');
        scene.scene.restart();
    }

    // Método que detecta si es iOS
    /*private static isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }*/
    
    // Método para copiar el texto en otros navegadores o usando el fallback
        // Modificar handleCopyCode para usar la nueva lógica
    private static isIOS(): boolean {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            return /iPad|iPhone|iPod/.test(userAgent);
    }
private static fallbackCopyTextToClipboard(text: string) {
    const input = document.createElement("input");
    input.value = text;
    input.readOnly = true;
    input.style.position = "fixed";
    input.style.opacity = "0";
    input.style.top = "0";
    input.style.left = "0";
    input.style.pointerEvents = "none";

    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      console.log("Copiado (fallback)");
    } catch (err) {
      console.error("Error al copiar (fallback)", err);
    }

    document.body.removeChild(input);
  }

  private static showCouponInput(scene: Phaser.Scene, code: string): HTMLInputElement {
    // Eliminar si ya existe
    const existing = document.getElementById("couponInput");
    if (existing) existing.remove();

    const input = document.createElement("input");
    input.type = "text";
    input.value = code;
    input.readOnly = true;
    input.id = "couponInput";

    // Estilos visuales
    Object.assign(input.style, {
      position: "absolute",
      top: `${scene.scale.height / 2 + 85}px`,
      left: "50%",
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
      visibility: "hidden"
    });

    // Acción al hacer click en el input
    input.onclick = () => {
        
        console.log("input presionado");
      input.select();
      document.execCommand("copy");
      input.blur();

      const toast = scene.add.text(scene.scale.width / 2, scene.scale.height - 40, "¡Copiado!", {
        font: "18px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      }).setOrigin(0.5).setDepth(1000);

      scene.time.delayedCall(1500, () => toast.destroy());
    };

    document.body.appendChild(input);
    return input; // 👈 importante: devolvemos el input
  }

  private static handleCopyCode(scene: Phaser.Scene) {
    const code = (scene.game as Game).selectedCoupon;

    if (ButtonEventHandler.isIOS()) {
      // Crea el input y dispara su click directamente
      console.log("ios precionado");
      alert("ios")
      const input = ButtonEventHandler.showCouponInput(scene, code);
      input.click(); // 👈 fuerza el click = selecciona y copia
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        console.log("2do else");
        alert("android")
        navigator.clipboard.writeText(code).catch(() => {
          ButtonEventHandler.fallbackCopyTextToClipboard(code);
        });
      } else {
        console.log("3er else");
        ButtonEventHandler.fallbackCopyTextToClipboard(code);
      }
    }
  }
}
