import { Button } from "./Button";
import { buttons } from "../config";
import { prompt } from "../config";

export class CloseButton {
	public static Name = "CloseButtonScene";
	private scene;
	private button: Button;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	public create(deviationX = 0, deviationY = 4) {
		const margin = 35;
		this.button = new Button(
			this.scene,
			this.scene.cameras.main.scrollX +
				this.scene.cameras.main.width -
				margin +
				deviationX,
			this.scene.cameras.main.scrollY + margin + deviationY,
			buttons.close,
			1.05,
			1.05
		);

		this.button.createButton();

	}

	public destroy() {
		this.button.destroy();
	}
}
