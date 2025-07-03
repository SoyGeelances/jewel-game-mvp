

export class Score {
	score: Phaser.GameObjects.Image;
	scoreText: Phaser.GameObjects.Text;

  constructor( private scene: Phaser.Scene ) {

    this.score = this.scene.add.image(this.scene.cameras.main.centerX -30, 60, "score");
		this.score.setOrigin(0.5, 0.5);
  }


}
