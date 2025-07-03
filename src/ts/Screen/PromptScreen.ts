import Screen from "./Screen";
import { Button } from "../components";
import { promptActions } from "../types";

export class PromptScreen extends Screen {
  protected promptTitle: Phaser.GameObjects.Image;
  protected promptMessage: Phaser.GameObjects.Image;
  protected background: Phaser.GameObjects.Image;
  protected actions: Button[] = [];

  constructor(
    scene: Phaser.Scene
  ) {
    super(scene);
  }

  setSplashBackground() {
    super.setSplashBackground();
  }

  addMask() {
    super.addMask();
  }

  setBackground(promptType: string, deviationX=0, deviationY=0, scaleX=1, scaleY=1) {
    this.background = this.scene.add.image(this.scene.cameras.main.centerX + (deviationX), this.scene.cameras.main.centerY + (deviationY), promptType)
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(scaleX, scaleY);
  }

  setTitle(promptTitle: string, deviationX=0, deviationY=0, scaleX=1, scaleY=1) {
    this.promptTitle = this.scene.add.image(this.scene.cameras.main.centerX + (deviationX), this.scene.cameras.main.centerY + (deviationY), promptTitle)
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(scaleX, scaleY);
  }

  setMessage(promptMessage: string, deviationX=0, deviationY=0, scaleX=1, scaleY=1) {
    this.promptMessage = this.scene.add.image(this.scene.cameras.main.centerX + (deviationX), this.scene.cameras.main.centerY + (deviationY), promptMessage)
    .setOrigin(0.5, 0.5)
    .setDepth(10)
    .setScale(scaleX, scaleY);
  }

  setActions(promptActions: Array<promptActions>, deviationX=0, deviationY=0, separation=0, scaleX=1, scaleY=1) {
    promptActions.forEach((action, index) => {
      const button = new Button(
          this.scene,
          this.scene.cameras.main.centerX + deviationX,
          this.scene.cameras.main.centerY + deviationY + (index * separation),
          action,
          scaleX,
          scaleY
      );
      button.createButton();
      this.actions.push(button);
    });
  }

  show(): void {}

  hide(): void {
    this.promptTitle.destroy();
    this.promptMessage.destroy();
    this.background.destroy();    
    this.actions.forEach(button => button.destroy());
  }
}
