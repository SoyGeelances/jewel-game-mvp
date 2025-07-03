import Utilities from "../Utilities";

export default class MainGame extends Phaser.Scene {
	deadZone = 13;
	maxSpace = 32;
	group: Phaser.GameObjects.Group;
	cellSize = 40;
	splitter = {
		rows: 5,
		columns: 5,
	};

	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";

	public preload(): void {
		// Preload as needed.
	}

	public considerDeadZone(drag: number, original: number): boolean {
		return Math.abs(drag - original) > this.deadZone;
	}

	public considerMaxSpace(drag: number, original: number): number {
		if (drag - original > this.maxSpace) {
			return original + this.maxSpace;
		} else if (drag - original < this.maxSpace * -1) {
			return original + this.maxSpace * -1;
		} else {
			return drag;
		}
	}

	public changePositions(
		a: Phaser.GameObjects.Sprite & any,
		b: Phaser.GameObjects.Sprite & any
	): void {
		const tempOriginalA = {
			x: a.originalX,
			y: a.originalY,
		};

		const tempOriginalB = {
			x: b.originalX,
			y: b.originalY,
		};

		a.x = tempOriginalB.x;
		a.y = tempOriginalB.y;

		b.x = tempOriginalA.x;
		b.y = tempOriginalA.y;

		b.originalX = tempOriginalA.x;
		b.originalY = tempOriginalA.y;

		a.originalX = tempOriginalB.x;
		a.originalY = tempOriginalB.y;

		b.setTint(0xffffff);

		// change positions in the group
		const aIndex = this.group.getChildren().indexOf(a);
		const bIndex = this.group.getChildren().indexOf(b);
		this.group.getChildren()[aIndex] = b;
		this.group.getChildren()[bIndex] = a;
	}

	public exist(a: any) {
		return a !== undefined && a !== null;
	}

	public checkMatch(): void {
		//generate a matrix from group children

		const matrix = [];

		const children = this.group.getChildren();
		for (let i = 0; i < this.splitter.rows; i++) {
			matrix.push([]);
			for (let j = 0; j < this.splitter.columns; j++) {
				matrix[i].push(children[i * this.splitter.columns + j]);
			}
		}

		const frameMatrix = [];

		matrix.forEach((row) => {
			frameMatrix.push([]);
			row.forEach((diamond) => {
				frameMatrix[frameMatrix.length - 1].push(diamond.frame.name);
			});
		});

		// generate a new matrix that i ll use later for override with an x the diamons to explode
		const explodeMatrix = [];
		for (let i = 0; i < this.splitter.rows; i++) {
			explodeMatrix.push([]);
			for (let j = 0; j < this.splitter.columns; j++) {
				explodeMatrix[i].push(0);
			}
		}

		// check for horizontal matches without going out of bounds
		for (let i = 0; i < this.splitter.rows; i++) {
			for (let j = 0; j < this.splitter.columns; j++) {
				if (
					this.exist(frameMatrix[i][j + 1]) &&
					this.exist(frameMatrix[i][j + 2]) &&
					frameMatrix[i][j] === frameMatrix[i][j + 1] &&
					frameMatrix[i][j] === frameMatrix[i][j + 2]
				) {
					explodeMatrix[i][j] = 1;
					explodeMatrix[i][j + 1] = 1;
					explodeMatrix[i][j + 2] = 1;
					let cancelIteration = false;
					for (let k = j + 2; k < frameMatrix[i].length; k++) {
						if (cancelIteration) break;
						if (frameMatrix[i][k] != frameMatrix[i][j]) {
							cancelIteration = true;
							break;
						}
						explodeMatrix[i][k] = 1;
					}
				}
			}
		}

		// check for vertical matches without going out of bounds
		for (let i = 0; i < this.splitter.rows; i++) {
			for (let j = 0; j < this.splitter.columns; j++) {
				if (
					this.exist(frameMatrix[i + 1]) &&
					this.exist(frameMatrix[i + 2]) &&
					frameMatrix[i][j] === frameMatrix[i + 1][j] &&
					frameMatrix[i][j] === frameMatrix[i + 2][j]
				) {
					explodeMatrix[i][j] = 1;
					explodeMatrix[i + 1][j] = 1;
					explodeMatrix[i + 2][j] = 1;
					let cancelIteration = false;

					for (let k = i + 2; k < frameMatrix.length; k++) {
						if (cancelIteration) break;
						if (frameMatrix[k][j] != frameMatrix[i][j]) {
							cancelIteration = true;
							break;
						}
						explodeMatrix[k][j] = 1;
					}
				}
			}
		}


		let checkMatch = false;

		for (let i = 0; i < this.splitter.rows; i++) {
			for (let j = 0; j < this.splitter.columns; j++) {
				if (explodeMatrix[i][j]) {
					// tween the diamond to explode
					this.tweens.add({
						targets: matrix[i][j],
						scaleX: 0,
						scaleY: 0,
						duration: 500,
						onComplete: () => {
							// create a random diamon in the place
							const randomFrame = Phaser.Math.Between(0, 3);
							const aIndex = this.group.getChildren().indexOf(matrix[i][j]);

							const diamond = this.add.sprite(0, 0, "diamonds", randomFrame);

							this.group.getChildren()[aIndex] = diamond;
							diamond.x = matrix[i][j].x;
							diamond.y = matrix[i][j].y;
							this.makeDiamondInteractive(diamond);

							matrix[i][j].destroy();
							checkMatch = true;
						},
					});
				}
			}
		}

		setTimeout(() => {
			if (checkMatch) {
				this.checkMatch();
			}
		}, 600);
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainGame", "create");
		const middlePoint = {
			x: this.cameras.main.centerX,
			y: this.cameras.main.centerY,
		};

		this.group = this.add.group();

		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 3));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));

		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 1));
		this.group.add(this.add.sprite(0, 0, "diamonds", 2));
		this.group.add(this.add.sprite(0, 0, "diamonds", 3));

		this.group.add(this.add.sprite(0, 0, "diamonds", 2));
		this.group.add(this.add.sprite(0, 0, "diamonds", 3));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));

		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 1));
		this.group.add(this.add.sprite(0, 0, "diamonds", 2));
		this.group.add(this.add.sprite(0, 0, "diamonds", 3));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));

		this.group.add(this.add.sprite(0, 0, "diamonds", 2));
		this.group.add(this.add.sprite(0, 0, "diamonds", 3));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));
		this.group.add(this.add.sprite(0, 0, "diamonds", 0));

		Phaser.Actions.GridAlign(this.group.getChildren(), {
			width: this.splitter.columns,
			height: this.splitter.rows,
			cellWidth: this.cellSize,
			position: 1,
			cellHeight: this.cellSize,
			x: middlePoint.x - (this.splitter.columns * this.cellSize) / 2,
			y: middlePoint.y - (this.splitter.rows * this.cellSize) / 2,
		});

		this.group
			.getChildren()
			.forEach((diamond: Phaser.GameObjects.Sprite & any) => {
				this.makeDiamondInteractive(diamond);
			});

		this.checkMatch();
	}

	public makeDiamondInteractive(diamond: Phaser.GameObjects.Sprite & any) {
		diamond.originalX = diamond.x;
		diamond.originalY = diamond.y;
		diamond.setInteractive();
		this.input.setDraggable(diamond);

		diamond.on(
			"drag",
			(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
				diamond.setDepth(1);
				diamond.beeingDragged = true;
				if (this.considerDeadZone(dragX, diamond.x)) {
					diamond.x = this.considerMaxSpace(dragX, diamond.originalX);
					diamond.y = diamond.originalY;
				} else if (this.considerDeadZone(dragY, diamond.y)) {
					diamond.y = this.considerMaxSpace(dragY, diamond.originalY);
					diamond.x = diamond.originalX;
				}
				this.group
					.getChildren()
					.forEach((otherDiamond: Phaser.GameObjects.Sprite & any) => {
						if (!otherDiamond.beeingDragged) {
							if (
								diamond.x < otherDiamond.x + this.cellSize &&
								diamond.x + this.cellSize > otherDiamond.x &&
								diamond.y < otherDiamond.y + this.cellSize &&
								diamond.y + this.cellSize > otherDiamond.y
							) {
								diamond.willChangeWith = otherDiamond;
								otherDiamond.setTint(0xff0000);
							} else {
								diamond.setTint(0xffffff);
							}
						}
					});
			}
		);
		diamond.on("dragend", (pointer: Phaser.Input.Pointer) => {
			if (diamond.willChangeWith) {
				this.changePositions(diamond, diamond.willChangeWith);
				this.checkMatch();
			} else {
				diamond.x = diamond.originalX;
				diamond.y = diamond.originalY;
			}
			diamond.setDepth(0);
			diamond.beeingDragged = false;
		});
	}
}
