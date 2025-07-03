
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
    leavingScreen.show(prompt.leaving, "prompt_screen")
  }
}
