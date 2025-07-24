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
  private static handleCopyCode(scene: Phaser.Scene) {
    const code = (scene.game as Game).selectedCoupon;

    if (ButtonEventHandler.isIOS()) {
      // Crea el input y dispara su click directamente
      const input = document.getElementById("couponInput") as HTMLInputElement;
      console.log("ios precionado");
      alert("ios")
      input.click(); // 👈 fuerza el click = selecciona y copia
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        console.log("2do else");
        alert("android")
         const input = document.getElementById("couponInput") as HTMLInputElement;
      input.click(); // 👈 fuerza el click = selecciona y copia
      } else {
        console.log("3er else");
        ButtonEventHandler.fallbackCopyTextToClipboard(code);
      }
    }
  }
}
