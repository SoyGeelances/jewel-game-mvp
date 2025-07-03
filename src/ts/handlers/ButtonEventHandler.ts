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
    private static isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    // Método para copiar usando la función probada que usaste en tu HTML
    private static copyToClipboard(text: string) {
        copy(text,{
            debug: true,
            message: 'Selecciona todo el texto en el recuadro, presiona “Copiar” y luego “Cancelar”.',
        });
    }
    
    // Método para copiar el texto en otros navegadores o usando el fallback
    private static fallbackCopyTextToClipboard(text: string) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px'; // Moverlo fuera de la pantalla
        document.body.appendChild(textArea);

        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Texto copiado usando el fallback');
        } catch (err) {
            console.error('Error al copiar el texto usando el fallback', err);
        }

        document.body.removeChild(textArea);
    }

    // Modificar handleCopyCode para usar la nueva lógica
    private static handleCopyCode(scene: Phaser.Scene) {
        const code = (scene.game as Game).selectedCoupon;

        // Usamos la función de copia que probaste con éxito
        if (ButtonEventHandler.isIOS()) {
            ButtonEventHandler.copyToClipboard(code); // Para iOS también usamos esta lógica
        } else {
            ButtonEventHandler.copyToClipboard(code);
        }
    }
}
