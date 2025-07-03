import Utilities from "../Utilities";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "SplashScreen";

	public preload(): void {
		this.load.path = window.assetFolder ?? "assets/";

	}

	public create(): void {
		Utilities.LogSceneMethodEntry("SplashScreen", "create");

		this.setBackground();

		const powerBy = this.add.image(this.cameras.main.centerX * 2, (this.cameras.main.centerY * 2), "powerBySvg");
		
		powerBy.setOrigin(1, 1);
		powerBy.setInteractive();
		powerBy.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank");
		});
		this.time.addEvent({
			// Run after three seconds.
			delay: 1000,
			callback: this.loadMainMenu,
			callbackScope: this,
			loop: false
		});
	}

	public setBackground() {
		const background = this.add.image(this.cameras.main.centerX,0, "background");
		background.setOrigin(0.5, 0);
		background.setScale(this.cameras.main.width / background.width);
		let baseScale = this.cameras.main.height / background.height
		if((this.cameras.main.width / background.width) > baseScale) baseScale = this.cameras.main.width / background.width;
		background.setScale(baseScale)
	}

	/**
	 * Load the next scene, the main menu.
	 */
	private loadMainMenu(): void {
		this.scene.start(MainMenu.Name);
	}
}
