
import { RetryScreen } from "../Screen";
import { prompt } from "../config";

export default class LeavingGameScene extends Phaser.Scene {

  public static Name = 'LeavingGameScene';
  
  constructor() {
      super({ key: 'LeavingGameScene' });
  }

  create() {
    const leavingScreen = new RetryScreen(this);
    leavingScreen.addMask();
    leavingScreen.show(prompt.leaving, "te_vas_background", false)
    leavingScreen['prompt']['promptTitle'].setY(this.cameras.main.centerY - 110)
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 27,
        "¿Estas seguro que queres salir \ndel juego? Se perderá \nel progreso.",
        {
            fontFamily: 'Open Sans',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 4,
        }
        )
    .setOrigin(0.5, 0.5).setDepth(11);
    leavingScreen['prompt']['actions'].forEach((btn, i) => {
        btn['button'].setY(this.cameras.main.centerY + 45 + i * 55);
    });
  }
}
