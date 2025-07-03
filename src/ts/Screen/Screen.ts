
export default abstract class Screen {
  scene: Phaser.Scene;
  private playButton: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
      this.scene = scene;
  }

  abstract show(): void;

  abstract hide(): void;

  protected setSplashBackground() {
    const background = this.scene.add.image(this.scene.cameras.main.centerX,0, "background_secondary");
		background.setOrigin(0.5, 0);
		background.setScale(this.scene.cameras.main.width / background.width);
		let baseScale = this.scene.cameras.main.height / background.height
		if((this.scene.cameras.main.width / background.width) > baseScale) baseScale = this.scene.cameras.main.width / background.width;
		background.setScale(baseScale)
  }

  protected addMask(): void {
    const mask = this.scene.add.graphics();
    mask.fillStyle(0x000000, 0.5);
    mask.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);
    mask.setDepth(3);
  }


  protected adjustDepth(score: Phaser.GameObjects.Image, scoreText: Phaser.GameObjects.Text, depthScore:number = 10, depthScoreText:number = 10): void {
		score.setDepth(depthScore);
		scoreText.setDepth(depthScoreText);
	}
}
