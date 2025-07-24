
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
    leavingScreen.show(prompt.leaving, "te_vas_background")
    leavingScreen['prompt']['promptTitle'].setY(this.cameras.main.centerY - 110)
    leavingScreen['prompt']['promptMessage'].setY(this.cameras.main.centerY - 27);
    leavingScreen['prompt']['actions'].forEach((btn, i) => {
        btn['button'].setY(this.cameras.main.centerY + 45 + i * 55);
    });
  }
}
