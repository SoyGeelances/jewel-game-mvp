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
                ButtonEventHandler.notifyParent("EXIT_GAME", "https://arcorencasa.com/tienda/");
                break;
            
            case "gotoshop":
                if ((scene.game as Game).onCloseGame) (scene.game as Game).onCloseGame();
                ButtonEventHandler.notifyParent("GO_TO_SHOP", "https://arcorencasa.com/");
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

    private static notifyParent(type: string, url?: string) {
        const inIframe = window.self !== window.top;

        if (inIframe && window.parent) {
            try {
            const parentOrigin =
                (window.location as any).ancestorOrigins?.[0] || 
                (document.referrer ? new URL(document.referrer).origin : "*"); 

            window.parent.postMessage({ type, url }, parentOrigin);
            return;
            } catch (e) {
            console.warn("postMessage falló:", e);
            }
        }

        // Fallback si no está embebido
        if (url) window.location.href = url;
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
    /*logica pasada a winnerScreen.ts*/
    }
}
