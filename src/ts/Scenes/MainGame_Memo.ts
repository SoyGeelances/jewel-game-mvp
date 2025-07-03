import Utilities from "../Utilities";
import { WinnerScreen, RetryScreen } from '../Screen';
import { prompt } from '../config';
import { CloseButton } from '../components';
import { EventObserver } from "../observer";
import { ButtonEventHandler } from "../handlers";

export type LevelConfig = {
	tilesRow: number;
	tilesColumn: number;
};

export default class MainGame extends Phaser.Scene {
	winnerScreen: WinnerScreen;
	retryScreen: RetryScreen;
	closeButton: CloseButton;
	eventObserver: EventObserver;
	group: Phaser.GameObjects.Group;
	score: Phaser.GameObjects.Image;
	scoreText: Phaser.GameObjects.Text;
	withPreview = true;
	withRestartTime = true;
	timer: Phaser.Time.TimerEvent;
	progressBar: Phaser.GameObjects.Image;
	scoreValue = 0;
	emptyGroup: Phaser.GameObjects.Group;
	resizeApplied = false;
	cellSizeX = 80;
	cellSizeY = 80;
	flipSpeed = 200;
	flipZoom = 1.05;
	limitTime = 10* 1000;
	maxTime = 60 * 1000;
	baseScale = 0.6;
	targetScore= 10000;
	splitter = {
		rows: 5,
		columns: 6,
	};
	nextLevelTimer: any = null
	state = "idle";
	previewGoing = false;
	flippedCards: Phaser.GameObjects.Sprite[] = [];
	levelDificulty = 1;
	configDificulty = [
		[2, 2],
		[2, 3],
		[2, 4],
		[2, 5],
		[3, 4],
		[4, 3],
		[6, 3],
		[4, 4],
		[4, 5],
		[4, 5],
		[5, 4],
		[6, 5],
	];

	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";

	public init() {
		this.resetGameState();
		if(window && window.innerHeight < 650 && !this.resizeApplied) {
			this.resizeApplied = true;
			this.cellSizeX = this.cellSizeX / 1.60;
			this.cellSizeY = this.cellSizeY / 1.60;
			this.flipZoom = this.flipZoom / 1.60;
			this.baseScale = this.baseScale / 1.60;
		}
	}

	public preload(): void {
		// Preload as needed.
	}

	public exist(a: any) {
		return a !== undefined && a !== null;
	}

	public getScoreValue() {
		return this.scoreValue;
	}

	private resetGameState(): void {
		this.scoreValue = 0;          // Reinicia el valor del puntaje
		this.levelDificulty = 1;      // Vuelve al nivel 1
		this.state = "idle";          // Cambia el estado del juego al inicial
		this.previewGoing = false;    // Restablece si hay un preview activo

	}

	public checkMatch(): void {

		if (this.previewGoing) return;
		if (
			(this.flippedCards[0] as any).behindFrame ===
			(this.flippedCards[1] as any).behindFrame
		) {
			this.flippedCards[0].disableInteractive();
			this.flippedCards[1].disableInteractive();
			(this.flippedCards[0] as any).pending = false;
			(this.flippedCards[1] as any).pending = false;

			this.tweens.add({
				targets: this.flippedCards,
				alpha: 0,
				duration: 500,
				yoyo: false,
			});
			if ( // chequea si no hay ninguna card dadas vueltas
				this.group
					.getChildren()
					.filter(
						(card: Phaser.GameObjects.Sprite & any) => card.pending
					).length === 0 && this.nextLevelTimer == null
			) {
				this.nextLevelTimer = setTimeout(() => {
					this.createNextGame();
					clearTimeout(this.nextLevelTimer);
					this.nextLevelTimer = null;
				}, 550);
			}

			this.scoreValue = (Number(this.scoreValue) + 100) + (50 * this.levelDificulty);
			if(this.state !== "end") {
				this.scoreText.setText(this.scoreValue.toString());
				this.tweens.add({
					targets: this.scoreText,
					y: 55 - 15,  // Hace que el texto suba
					scaleY: 1.2,  // Estira un poco el texto para simular el brinco
					duration: 200,  // Duración de la subida
					ease: 'Power1',
					yoyo: true,  // Hace que vuelva a su posición original
					onComplete: () => {
							// Animación de caída
							this.tweens.add({
									targets: this.scoreText,
									y: 55,  // Hace que caiga un poco más abajo
									duration: 300,  // Duración de la caída
									ease: 'Bounce.easeOut',  // Efecto de rebote al caer
							});
					}
				});
				this.sound.add('collectcoin').play();
			}

		} else {
			for (let i = 0; i < this.flippedCards.length; i++) {
				const obj = this.flippedCards[i];
				setTimeout(() => {
					this.flipTween(obj, true);
				}, 200);
			}
		}
		this.flippedCards = [];
	}

	public flipTween(
		card: Phaser.GameObjects.Sprite & any,
		isReversed = false,
		callback = () => null,
		check = true
	): void {
		if (!isReversed && card.isFlipping) return;

		if (isReversed && check) {
			card.isFlipping = false;
		} else if (check) {
			card.isFlipping = true;
			this.flippedCards.push(card);
		}
		if(!this.game.sound.mute) this.sound.add('cardFlip', {
			volume: 0.3
		}).play();

		this.tweens.add({
			targets: card,
			scaleX: 0.01,
			duration: this.flipSpeed / 2,
			yoyo: false,
			onComplete: () => {
				if (isReversed) card.setFrame(1);
				else card.setFrame(card.behindFrame);
				this.tweens.add({
					targets: card,
					scaleX: this.baseScale,
					duration: this.flipSpeed / 2,
					yoyo: false,
					onComplete: () => {
						callback();
					},
				});
			},
		});
	}

	public makeCardInteractive(card: Phaser.GameObjects.Sprite & any): void {
		card.setScale(this.baseScale);

		card.isFlipping = false;
		if (card.frame.name != 0) {
			card.setInteractive();
			card.on("pointerdown", () => {
				if(this.flippedCards.length < 2) {
					this.flipTween(card, false, () => {
						if (!this.previewGoing && this.flippedCards.length === 2) {
							this.checkMatch();
						}
					});
				}
			});
		}
	}

	public createGrid(config: LevelConfig) {
		const middlePoint = {
			x: this.cameras.main.centerX,
			y: this.cameras.main.centerY,
		};
		const tilesUsed = config.tilesRow * config.tilesColumn;
		const amountOfTiles = tilesUsed / 2;

		const possibleFrames = this.textures.get("cards").getFrameNames();
		possibleFrames.shift();
		possibleFrames.shift();

		const frames = [];
		for (let i = 0; i < amountOfTiles; i++) {
			const frame = Phaser.Math.RND.pick(possibleFrames);
			frames.push(frame);
			frames.push(frame);
		}
		// *** DEBUG ***
		// console.log("frames",frames)
		// const countFrames = {};
		// frames.forEach((frame) => {
		// 	if (!countFrames[frame]) countFrames[frame] = 0;
		// 	countFrames[frame]++;
		// });
		// console.log("countFrames",countFrames)

		this.emptyGroup = this.add.group();
		this.group = this.add.group();

		// fill the group with the cards and shuffle them, two for each frame, fill the center first and leave the sides empty

		Phaser.Utils.Array.Shuffle(frames);

		for (let i = 0; i < this.splitter.rows * this.splitter.columns; i++) {
			const card = this.add.sprite(0, 0, "cards", 0).setScale(this.baseScale)
			this.emptyGroup.add(card);
		}

		for (let i = 0; i < config.tilesRow * config.tilesColumn; i++) {
			const card = this.add.sprite(0, 0, "cards", 0).setScale(this.baseScale)
			this.group.add(card);
		}

		Phaser.Utils.Array.Shuffle(this.group.getChildren());

		for (let i = 0; i < this.group.getChildren().length; i++) {
			if (i >= frames.length) break;
			(this.group.getChildren()[i] as Phaser.GameObjects.Sprite).setFrame(1);
			(this.group.getChildren()[i] as any).behindFrame = frames[i];
			(this.group.getChildren()[i] as any).pending = true;
			
		}

		Phaser.Actions.GridAlign(this.emptyGroup.getChildren(), {
			width: this.splitter.columns,
			height: this.splitter.rows,
			cellWidth: this.cellSizeX,
			cellHeight: this.cellSizeY,
			position: Phaser.Display.Align.CENTER,
			x: middlePoint.x - (this.splitter.columns * this.cellSizeX) / 2,
			y: middlePoint.y - (this.splitter.rows * this.cellSizeY) / 2,
		});

		let correctionX = 0;
		let correctionY = 0;

		// Checkear si tilesRow es impar y si config.tilesRow es impar

		if (
			(this.splitter.columns % 2 === 0 && config.tilesColumn % 2 !== 0) ||
			(this.splitter.columns % 2 !== 0 && config.tilesColumn % 2 === 0)
		) {
			correctionX = this.cellSizeX / 2;
		}

		if (
			(this.splitter.rows % 2 === 0 && config.tilesRow % 2 !== 0) ||
			(this.splitter.rows % 2 !== 0 && config.tilesRow % 2 === 0)
		) {
			correctionY = this.cellSizeY / 2;
		}

		Phaser.Actions.GridAlign(this.group.getChildren(), {
			width: config.tilesColumn,
			height: config.tilesRow,
			cellWidth: this.cellSizeX,
			cellHeight: this.cellSizeY,
			position: Phaser.Display.Align.CENTER,
			x:
				middlePoint.x - (config.tilesColumn * this.cellSizeX) / 2 - correctionX,
			y: middlePoint.y - (config.tilesRow * this.cellSizeY) / 2 - correctionY,
		});
		if (this.withPreview) {
			this.previewGoing = true;
			this.group.getChildren().forEach((card: any) => {
				if (card) {
					this.flipTween(
						card,
						false,
						() => {
							setTimeout(() => {
								this.flipTween(
									card,
									true,
									() => {
										if(card) {
											this.makeCardInteractive(card);
											this.previewGoing = false;
										}
									},
									false
								);
							}, 1000);
						},
						false
					);
				}
			});
		} else {
			this.group
				.getChildren()
				.forEach((card: Phaser.GameObjects.Sprite & any) => {
					if (card) this.makeCardInteractive(card);
				});
		}
	}

	public createNextGame() {
		if (this.state === "end") return;
		this.levelDificulty++;
		this.group.clear(true, true);
		this.emptyGroup.clear(true, true);
		if (!this.configDificulty[this.levelDificulty - 1])
			this.levelDificulty = this.configDificulty.length;
		const dificulty = this.configDificulty[this.levelDificulty - 1];
		this.createGrid({
			tilesRow: dificulty[0],
			tilesColumn: dificulty[1],
		});
		this.timer.remove();
		this.startTimer();
	}

	public endGame() {
		// add gray mask over all the scene
		this.previewGoing = false;
		this.state = "end";

		if (this.scoreValue >= this.targetScore) {
			this.winnerScreen.show(prompt.win, "winner_screen");
		} else if( this.scoreValue >= 6501 &&  this.scoreValue <= 9999) {
			const scoreValue = this.scoreValue;
			this.retryScreen.setFinalScore(scoreValue);
			this.retryScreen.show(prompt.narrowly, "prompt_screen");
		} else if (this.scoreValue < 6501)  {
			const scoreValue = this.scoreValue;
			this.retryScreen.setFinalScore(scoreValue);
			this.retryScreen.show(prompt.retry, "prompt_screen");
		};

		//For Test

		// if (this.scoreValue >= this.targetScore) {
		// 	this.winnerScreen.show(prompt.win, "winner_screen");
		// 	this.removeInteractivityCards()
		// } else if( this.scoreValue >= 2501 &&  this.scoreValue <= 2999) {
		// 	const scoreValue = this.scoreValue;
		// 	this.retryScreen.setFinalScore(scoreValue);
		// 	this.retryScreen.show(prompt.narrowly, "prompt_screen");
		// 	this.removeInteractivityCards()
		// } else if (this.scoreValue < 2501)  {
		// 	const scoreValue = this.scoreValue;
		// 	this.retryScreen.setFinalScore(scoreValue);
		// 	this.retryScreen.show(prompt.retry, "prompt_screen");
		// 	this.removeInteractivityCards()
		// };
		return;	
	}

	public removeInteractivityCards() {
		this.group.getChildren().forEach((card: any) => {
			card.disableInteractive();
		})
	}

	public resetValues(): void {
 		this.scoreValue = 0;
		this.levelDificulty = 1;
	}

	public adjustDepth(score: Phaser.GameObjects.Image, scoreText: Phaser.GameObjects.Text, depthScore:number = 10, depthScoreText:number = 10): void {
		score.setDepth(depthScore);
		scoreText.setDepth(depthScoreText);
	}

	public startTimer() {
		const newLimit = this.limitTime + ((this.levelDificulty * 2) * 1000);
		let baseTime = Number(newLimit);
		if( baseTime > this.maxTime) baseTime = this.maxTime;
		let progress = 100;
		this.timer = this.time.addEvent({
			delay: 1,
			callback: () => {
				baseTime--;
				progress = baseTime / newLimit;
				// display image full height and % over with
				if(this.progressBar) {
					this.progressBar.setCrop(
						0,
						0,
						this.progressBar.width * progress,
						this.progressBar.height
					);
				}
				if (baseTime <= 0) {
					this.timer.remove();
					this.endGame();
				}
			},
			loop: true,
		});
	}

	setSoundBtn() {
		const soundBtn = this.add.image(35, 55, this.game.sound.mute ? "sound_off" : "sound_on").setScale(0.5);
		soundBtn.setOrigin(0.5, 0.5);
		soundBtn.setInteractive();
		soundBtn.on("pointerdown", () => {
			const newMuteValue = !this.game.sound.mute;
			this.game.sound.mute = newMuteValue
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			this.game.soundManager.setMute(newMuteValue)
			soundBtn.setTexture(newMuteValue ? "sound_off" : "sound_on");
		}, this);
	}

	public create(): void {
		this.resetGameState();
		this.previewGoing = false;
		this.winnerScreen = new WinnerScreen(this);
		this.retryScreen = new RetryScreen(this);
		this.closeButton = new CloseButton(this);
		this.eventObserver =  EventObserver.getInstance();

		Utilities.LogSceneMethodEntry("MainGame", "create");

		const background = this.add.image(
			this.cameras.main.centerX,
			0,
			"background_secondary"
		);
		background.setOrigin(0.5, 0);
		background.setScale(this.cameras.main.width / background.width);
		let baseScale = this.cameras.main.height / background.height;
		if (this.cameras.main.width / background.width > baseScale)
			baseScale = this.cameras.main.width / background.width;
		background.setScale(baseScale);

		// this.setSoundBtn();

		this.closeButton.create();

		this.score = this.add.image(this.cameras.main.centerX -23, 60, "score")
		.setScale(1.09, 1.05)
		.setOrigin(0.5, 0.5);


		this.scoreText = this.add.text(
			this.cameras.main.centerX + 100 + 20,
			55,
			this.scoreValue.toString(),
			{
				font: "40px montserrat-memo",
				color: "#E2D64B",
			}
		);
		this.scoreText.setOrigin(1, 0.5);

		const progressFrame = this.add.image(
			this.cameras.main.centerX,
			this.cameras.main.centerY * 2 - 60,
			"progress_frame"
		);
		progressFrame.setOrigin(0.5, 0.5).setScale(1.12);

		const overProgressFrame = this.add.image(
			this.cameras.main.centerX,
			this.cameras.main.centerY * 2 - 60,
			"progress_bar"
		);
		overProgressFrame.setOrigin(0.5, 0.5).setScale(1.12);
		this.progressBar = overProgressFrame;
		this.startTimer();
		this.splitter.rows = 6;
		this.splitter.columns = 5;

		const dificulty = this.configDificulty[this.levelDificulty - 1];

		this.createGrid({
			tilesRow: dificulty[0],
			tilesColumn: dificulty[1],
		});

		const powerBy = this.add.image(
			this.cameras.main.centerX * 2,
			(this.cameras.main.centerY * 2),
			"powerBySvg"
		);
		powerBy.setInteractive();
		powerBy.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank");
		});
		powerBy.setOrigin(1, 1);
		this.state = "start";
		this.registry.set('score', this.score);
		this.registry.set('scoreText', this.scoreText);

		this.eventObserver.on('button-clicked', (buttonId) => {
			ButtonEventHandler.handleButtonEvents(buttonId, this)
		}, this);
	}
	
}
