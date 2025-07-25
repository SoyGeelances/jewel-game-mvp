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

  if (isIOS) {
    const btn = document.getElementById("copyHiddenBtn") as HTMLButtonElement;
    if (btn) {
      btn.focus(); // puede ayudar a iOS
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    alert("Toca el botón amarillo 'Copiar código' para copiar el cupón"); // ayuda visual
  } else {
    // Copiado automático para no-iOS
    const textarea = document.getElementById("couponTextarea") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.select();
      document.execCommand("copy");

      const toast = scene.add.text(
        scene.scale.width / 2,
        scene.scale.height - 40,
        "¡Copiado!",
        {
          font: "18px Arial",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }
      ).setOrigin(0.5).setDepth(1000);

      scene.time.delayedCall(1500, () => toast.destroy());
    }
  }
}

}
