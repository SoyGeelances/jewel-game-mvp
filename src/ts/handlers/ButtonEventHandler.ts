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

private static copyToClipboard(text: string, scene: Phaser.Scene): boolean {
        const showNotification = (message: string, color: string = "#ffffff") => {
            const notification = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                message,
                { fontSize: "24px", color, align: "center" }
            ).setDepth(55555).setOrigin(0.5);
            scene.time.delayedCall(2000, () => notification.destroy());
        };

        let input: HTMLInputElement | null = null;
        let result: boolean = false;

        try {
            // Crear un input temporal
            input = document.createElement("input");
            input.setAttribute("readonly", "true");
            input.style.position = "fixed"; // Evitar desplazamiento en iOS
            input.style.opacity = "0";
            input.style.pointerEvents = "none";
            input.value = text;

            document.body.appendChild(input);

            // Enfocar y seleccionar el contenido
            input.focus();
            input.select();

            // Selección manual para mayor compatibilidad con iOS
            const range = document.createRange();
            range.selectNodeContents(input);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            input.setSelectionRange(0, input.value.length);
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
            if (input) {
                document.body.removeChild(input);
            }
        }

        return result;
    }


    private static handleCopyCode(scene: Phaser.Scene): void {
        const input = document.getElementById("couponInput") as HTMLInputElement | null;
        if (!input || !input.value) {
            const notification = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                "No hay código para copiar",
                { fontSize: "24px", color: "#ff0000", align: "center" }
            ).setOrigin(0.5);
            scene.time.delayedCall(2000, () => notification.destroy());
            return;
        }

        this.copyToClipboard(input.value, scene);
    }
}
