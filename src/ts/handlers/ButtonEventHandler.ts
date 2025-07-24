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
 console.log(input.value);
    try {
       
      document.execCommand("copy");
      console.log("Copiado (fallback)");
    } catch (err) {
      console.error("Error al copiar (fallback)", err);
    }

    document.body.removeChild(input);
  }

private static copyToClipboard(value: string): boolean {
  let input: HTMLInputElement | null = null;
  let result: boolean | null = null;

  try {
    input = document.createElement('input');
    input.setAttribute('readonly', 'true');
    input.setAttribute('contenteditable', 'true');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    input.value = value;

    document.body.appendChild(input);

    input.focus();
    input.select();

    // Extra: iOS necesita también esto
    input.setSelectionRange(0, input.value.length);

    result = document.execCommand('copy');
  } catch (err) {
    console.error(err);
    result = null;
  } finally {
    if (input) {
      document.body.removeChild(input);
    }
  }

  // Fallback manual
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
    result = prompt(`Presioná ${copyHotkey} y luego Enter`, value) !== null;
  }

  return !!result;
}



  private static paraIOS(inputElement: HTMLInputElement) {
    console.log("nueva accion");
  inputElement.focus();
  inputElement.select();

  // Extra: por compatibilidad total
  inputElement.setSelectionRange(0, 99999);

  let success = false;

  try {
    success = document.execCommand("copy");
  } catch (err) {
    console.warn("Error al copiar (iOS):", err);
  }
}

  private static handleCopyCode(scene: Phaser.Scene) {
    const code = (scene.game as Game).selectedCoupon;

    if (ButtonEventHandler.isIOS()) {
      // Crea el input y dispara su click directamente
      const input = document.getElementById("couponInput") as HTMLInputElement;
      console.log("ios precionado");
      alert("ios")
      //input.click(); // 👈 fuerza el click = selecciona y copia
      ButtonEventHandler.copyToClipboard(input.value);
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        console.log("2do else");
        const input = document.getElementById("couponInput") as HTMLInputElement;
        ButtonEventHandler.copyToClipboard(input.value);
        /*navigator.clipboard.writeText(code).catch(() => {
          ButtonEventHandler.fallbackCopyTextToClipboard(code);
        });*/
      } else {
        console.log("3er else");
       /* ButtonEventHandler.fallbackCopyTextToClipboard(code);*/
      }
    }
  }
}
