export class ProgressBar {
	private scene: Phaser.Scene;
	private barBg: Phaser.GameObjects.Rectangle;
	private barFill: Phaser.GameObjects.Rectangle;
	private x: number;
	private y: number;
	private width: number;
	private height: number;
	private maxTime: number;
	private elapsedTime: number = 0;
	private fillColor: number;
	private bgColor: number;

	constructor(config: {
		scene: Phaser.Scene;
		x: number;
		y: number;
		width?: number;
		height?: number;
		maxTime: number;
		fillColor?: number;
		bgColor?: number;
	}) {
		this.scene = config.scene;
		this.x = config.x;
		this.y = config.y;
		this.width = config.width ?? 200;
		this.height = config.height ?? 20;
		this.maxTime = config.maxTime;
		this.fillColor = config.fillColor ?? 0x00ff00;
		this.bgColor = config.bgColor ?? 0x444444;

		this.barBg = this.scene.add.rectangle(this.x, this.y, this.width, this.height, this.bgColor).setOrigin(0, 0);
		this.barFill = this.scene.add.rectangle(this.x, this.y, this.width, this.height, this.fillColor).setOrigin(0, 0);
	}

	public update(delta: number): void {
		this.elapsedTime += delta;
		const progress = Phaser.Math.Clamp(1 - this.elapsedTime / this.maxTime, 0, 1);
		this.barFill.width = this.width * progress;
	}

	public reset(): void {
		this.elapsedTime = 0;
		this.barFill.width = this.width;
	}

	public destroy(): void {
		this.barBg.destroy();
		this.barFill.destroy();
	}
}
