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

 private static handleCopyCode(scene: Phaser.Scene) {
  const isIOS = ButtonEventHandler.isIOS();
   /* const btn = document.getElementById("copyHiddenBtn") as HTMLButtonElement;
        if (btn) {
            // Simula un clic en el botón oculto
            copy(btn.value)
            btn.click();
        }*/
    }
}
