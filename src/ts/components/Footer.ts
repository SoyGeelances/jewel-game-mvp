
export class Footer {

  public static create(scene: Phaser.Scene) {
    scene.add.image(scene.cameras.main.centerX * 2, (scene.cameras.main.centerY * 2), "powerBySvg")
		.setInteractive()
		.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank")
		})
		.setOrigin(1, 1)
    .setDepth(110);
  }

}
