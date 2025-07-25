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

private static async copyToClipboard(text: string): Promise<boolean> {
  let textarea;
  let result;

  try {
    textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', true);
    textarea.setAttribute('contenteditable', 'true');
    textarea.style.position = 'fixed';
    textarea.value = text;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand('copy');
  } catch (err) {
    console.error('Error en copyToClipboard:', err);
    result = null;
  } finally {
    if (textarea) {
      document.body.removeChild(textarea);
    }
  }

  // fallback solo si el método anterior falla
  if (!result) {
    console.warn('Fallo execCommand, mostrando prompt manual');
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
    const fallback = prompt(`Presiona ${copyHotkey} para copiar`, text);
    return !!fallback;
  }

  return true;
}

private static async handleCopyCode(scene: Phaser.Scene) {
  const code = (scene.game as Game).selectedCoupon;
  const textarea = document.getElementById("couponTextarea") as HTMLTextAreaElement | null;

  if (!textarea || !textarea.value) {
    console.warn("No se encontró el textarea o está vacío");
    return;
  }

  const textToCopy = textarea.value;

  try {
    // API moderna
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Texto copiado con clipboard API");
    } else {
      const success = await ButtonEventHandler.copyToClipboard(textToCopy);
      if (!success) {
        console.warn("Fallo el copiado incluso con fallback");
      }
    }
  } catch (err) {
    console.error("Error intentando copiar:", err);
    // fallback
    const success = await ButtonEventHandler.copyToClipboard(textToCopy);
    if (!success) {
      console.warn("Fallo el fallback también");
    }
  }
}

}
