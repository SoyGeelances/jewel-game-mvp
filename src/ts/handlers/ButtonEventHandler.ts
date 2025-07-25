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

    private static async copyToClipboard(text: string, scene: Phaser.Scene): Promise<boolean> {
        const showNotification = (message: string, color: string = "#ffffff") => {
            const notification = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                message,
                { fontSize: "24px", color, align: "center" }
            ).setDepth(55555).setOrigin(0.5);
            scene.time.delayedCall(2000, () => notification.destroy());
        };

        // Intentar con navigator.clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                showNotification("¡Código copiado!");
                return true;
            } catch (err) {
                console.error("Error al copiar con navigator.clipboard:", err);
            }
        }

        // Fallback con textarea
        let textarea: HTMLTextAreaElement | null = null;
        let result: boolean = false;

        try {
            textarea = document.createElement("textarea");
            textarea.setAttribute("readonly", "true");
            textarea.setAttribute("contenteditable", "true");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            textarea.style.pointerEvents = "none";
            textarea.value = text;

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            const range = document.createRange();
            range.selectNodeContents(textarea);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            textarea.setSelectionRange(0, textarea.value.length);
            result = document.execCommand("copy");

            if (result) {
                showNotification("¡Código copiado!");
            } else {
                throw new Error("document.execCommand('copy') falló");
            }
        } catch (err) {
            console.error("Error al copiar al portapapeles:", err);
            showNotification("Error al copiar el código", "#ff0000");
            result = false;
        } finally {
            if (textarea) {
                document.body.removeChild(textarea);
            }
        }

        return result;
    }

    private static handleCopyCode(scene: Phaser.Scene): void {
        const textarea = document.getElementById("couponTextarea") as HTMLTextAreaElement | null;
        if (!textarea || !textarea.value) {
            const notification = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                "No hay código para copiar",
                { fontSize: "24px", color: "#ff0000", align: "center" }
            ).setDepth(55555).setOrigin(0.5);
            scene.time.delayedCall(2000, () => notification.destroy());
            return;
        }

        this.copyToClipboard(textarea.value, scene);
    }
}
