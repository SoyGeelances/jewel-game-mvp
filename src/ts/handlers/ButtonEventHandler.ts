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

private static async copyToClipboard(text: string, scene: Phaser.Scene): Promise<void> {
        // Función para mostrar notificación en la escena
        const showNotification = (message: string, color: string = "#ffffff") => {
            const notification = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                message,
                { fontSize: "24px", color, align: "center" }
            ).setOrigin(0.5);
            scene.time.delayedCall(2000, () => notification.destroy()); // Desaparece tras 2 segundos
        };

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                showNotification("¡Código copiado!");
            } else {
                this.fallbackCopyTextToClipboard(text);
                showNotification("¡Código copiado!");
            }
        } catch (err) {
            console.error("Error al copiar al portapapeles:", err);
            showNotification("Error al copiar el código", "#ff0000");
        }
    }

    private static fallbackCopyTextToClipboard(text: string): void {
        const input = document.createElement("input");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        input.style.pointerEvents = "none";
        document.body.appendChild(input);

        // Seleccionar texto
        input.select();
        input.setSelectionRange(0, 99999); // Para compatibilidad con móviles

        try {
            document.execCommand("copy");
            console.log("Texto copiado (fallback)");
        } catch (err) {
            console.error("Error al copiar (fallback):", err);
        } finally {
            document.body.removeChild(input);
        }
    }

    private static handleCopyCode(scene: Phaser.Scene): void {
        const code = (scene.game as Game).selectedCoupon ?? "";
        if (!code) {
            console.warn("No hay código para copiar");
            // Mostrar notificación en la escena
            const notification = scene.add.text(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                "No hay código disponible",
                { fontSize: "24px", color: "#ff0000", align: "center" }
            ).setOrigin(0.5);
            scene.time.delayedCall(2000, () => notification.destroy());
            return;
        }

        // Copiar el código al portapapeles
        this.copyToClipboard(code, scene);
    }
}
