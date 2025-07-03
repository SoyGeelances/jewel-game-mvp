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


		const detail1 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies", 2).setOrigin(0.5).setScale(0);
		const detail2 = this.add.image(this.cameras.main.centerX, (this.cameras.main.centerY * 0.6) + 40, "candies", 3).setOrigin(0.5).setScale(0);

        const logoArcor = this.add.image(this.cameras.main.centerX, 50, "logo_Arcor").setScale(0).setOrigin(0.5, 0);

		const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 0.5, "logo_candy_Arcor").setScale(0);
		logo.setOrigin(0.5, 0);

		const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 1.2, "play").setScale(0);

        this.tweens.add({
			targets: logoArcor,
			scale: 1,
			delay:0,
			duration: 600,
			ease: "Bounce.easeOut"
		});

		this.tweens.add({
			targets: logo,
			scale: 1.1,
			delay:0,
			duration: 600,
			ease: "Bounce.easeOut"
		});

		this.tweens.add({
			targets: playButton,
			scale: 1,
			delay:200,
			duration: 600,
			ease: "Bounce.easeOut"
		});
		const baseX = detail1.x
		const baseY = detail1.y
		this.tweens.add({
			targets: detail1,
			scale: 0.6,
			x: baseX - 110,
			y: baseY - 20,
			angle: 45,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});
		
		this.tweens.add({
			targets: detail2,
			scale: 0.6,
			x: baseX + 100,
			y: baseY - 20,
			angle: 45,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

		this.tweens.add({
			targets: [detail2],
			scale: 0.65,
			delay:1200,
			angle: 40,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

		this.tweens.add({
			targets: [detail1],
			scale: 0.65,
			delay:1300,
			angle: 42,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
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
