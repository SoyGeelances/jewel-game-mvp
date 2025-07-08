import Utilities from "../Utilities";
import MainGame from "./MainGame_Memo";
import { CloseButton } from "../components";
import { RetryScreen } from '../Screen';
import { EventObserver } from "../observer";
import { ButtonEventHandler } from "../handlers";
import { Footer } from "../components/Footer";

export default class MainMenu extends Phaser.Scene {
	music: Phaser.Sound.BaseSound;
	alreadyPlayignMusic = false
	closeButton: CloseButton;
	retryScreen: RetryScreen;
	eventObserver: EventObserver;
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainMenu";

	public init(){
		//this.closeButton = new CloseButton(this);
		this.retryScreen = new RetryScreen(this);
		this.eventObserver = EventObserver.getInstance();

		// this.game.config.audio.disableWebAudio = true;
		this.game.config.audio.disableWebAudio = false;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		this.game.soundManager = Phaser.Sound.SoundManagerCreator.create(this.game)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		this.music = this.game.soundManager;
		this.game.sound.mute = false;

	}

	public preload(): void {
		// Preload as needed.
	}

	public pauseScene() {
		this.scene.pause(MainMenu.Name)
	}

	public resumeScene() {
		this.scene.resume(MainMenu.Name)
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainMenu", "create");

		if(!this.alreadyPlayignMusic) {
			this.alreadyPlayignMusic = true;
			// this.music.play("music",{
			// 	volume: 0.06,
			// 	loop: true
			// });
		}

        const background = this.add.image(this.cameras.main.centerX, this.cameras.main.height, "background_main");
        background.setOrigin(0.5, 1); 

        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);

        background.setScale(scale);


		// const soundBtn = this.add.image(35, 55, "sound_on").setScale(0.5);
		// soundBtn.setOrigin(0.5, 0.5);
		// soundBtn.setInteractive();
		// soundBtn.on("pointerdown", () => {
		// 	const newMuteValue = !this.game.sound.mute;
		// 	this.game.sound.mute = newMuteValue
		// 	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// 	//@ts-ignore
		// 	this.music.setMute(newMuteValue)
		// 	soundBtn.setTexture(newMuteValue ? "sound_off" : "sound_on");
		// }, this);


        const logoArcor = this.add.image(this.cameras.main.centerX, 50, "logo_Arcor").setScale(0).setOrigin(0.5, 0);
        this.tweens.add({
			targets: logoArcor,
			scale: 1,
			delay:0,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        const candie1 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies_logo", 7).setOrigin(0.5).setScale(0).setDepth(1);
		const candie2 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies_logo", 2).setOrigin(0.5).setScale(0).setDepth(2);
		const candie3 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies_logo", 4).setOrigin(0.5).setScale(0).setDepth(0);
        const candie4 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies_logo", 5).setOrigin(0.5).setScale(0).setDepth(0);
		const candie5 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies_logo", 3).setOrigin(0.5).setScale(0).setDepth(2);
		const candie6 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies_logo", 8).setOrigin(0.5).setScale(0).setDepth(1);

		const baseX = candie1.x
		const baseY = candie1.y

		this.tweens.add({
			targets: candie1,
			scale: 1.2,
			x: baseX - 115,
			y: baseY - 15,
			angle: -15,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie1],
			scale: 1.3,
			delay:1300,
			angle: -20,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});
		
		this.tweens.add({
			targets: candie2,
			scale: 0.8,
			x: baseX - 80,
			y: baseY - 40,
			angle: -25,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie2],
			scale: 0.9,
			delay:1100,
			angle: -19,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        this.tweens.add({
			targets: candie3,
			scale: 0.7,
			x: baseX - 55,
			y: baseY - 50,
			angle: -10,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie3],
			scale: 0.7,
			delay:1100,
			angle: -11,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        this.tweens.add({
			targets: candie4,
			scale: 0.7,
			x: baseX + 50,
			y: baseY - 50,
			angle: -10,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie4],
			scale: 0.8,
			delay: 1300,
			angle: -11,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        this.tweens.add({
			targets: candie5,
			scale: 1,
			x: baseX + 85,
			y: baseY - 40,
			angle: -40,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie5],
			scale: 1.1,
			delay: 1200,
			angle: -45,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        this.tweens.add({
			targets: candie6,
			scale: 1.1,
			x: baseX + 120,
			y: baseY - 30,
			angle: 20,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie6],
			scale: 1.1,
			delay: 900,
			angle: 25,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 0.5, "logo_candy_Arcor").setScale(0).setDepth(6);
        this.tweens.add({
			targets: logo,
			scale: 1.1,
			delay:0,
			duration: 600,
			ease: "Bounce.easeOut"
		});
		logo.setOrigin(0.5, 0);

        const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 1.2, "play").setScale(0);
        this.tweens.add({
			targets: playButton,
			scale: 1,
			delay:200,
			duration: 600,
			ease: "Bounce.easeOut"
		});
		playButton.setOrigin(0.5, 0.5);
		playButton.setInteractive();
		playButton.on("pointerover", () => { playButton.setTint(0xeeeeee); }, this);
		playButton.on("pointerout", () => { playButton.setTint(0xffffff); }, this);
		playButton.on("pointerdown", () => { this.scene.start(MainGame.Name); }, this);

        Footer.create(this);
	}

	public update(): void {
		// Update logic, as needed.
	}
}
