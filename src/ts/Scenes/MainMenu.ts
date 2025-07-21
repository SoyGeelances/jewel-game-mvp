import Utilities from "../Utilities";
import MainGame from "./MainGame_Memo";
import { CloseButton } from "../components";
import { RetryScreen } from '../Screen';
import { EventObserver } from "../observer";
import { ButtonEventHandler } from "../handlers";
import { Footer } from "../components/Footer";
import { BackgroundMusic } from "../components/BackgroundMusic";

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
		//this.game.config.audio.disableWebAudio = false;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		//this.game.soundManager = Phaser.Sound.SoundManagerCreator.create(this.game)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		//this.music = this.game.soundManager;
		//this.game.sound.mute = false;

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
        const bgMusic = BackgroundMusic.getInstance();
        if (!bgMusic.isPlaying()) {
            bgMusic.init(this, 'candy_music_background_sound', 0.13);
        }

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

        const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 0.5, "logo_candy_Arcor").setScale(0).setDepth(3);
        this.tweens.add({
			targets: logo,
			scale: 1.05,
			delay:0,
			duration: 600,
			ease: "Bounce.easeOut"
		});
		logo.setOrigin(0.5, 0);

        const candie1 = this.add.image(this.cameras.main.centerX, logo.y + (logo.height * 1.05) + 10, "candies_logo", 0).setOrigin(0.5).setScale(0).setDepth(5);
		const candie2 = this.add.image(this.cameras.main.centerX, logo.y + (logo.height * 1.05) + 10 + 40, "candies_logo", 3).setOrigin(0.5).setScale(0).setDepth(6);
		const candie3 = this.add.image(this.cameras.main.centerX, logo.y + (logo.height * 1.05) + 10 + 40, "candies_logo", 2).setOrigin(0.5).setScale(0).setDepth(5);
        const candie4 = this.add.image(this.cameras.main.centerX, logo.y + (logo.height * 1.05) + 10 + 40, "candies_logo", 7).setOrigin(0.5).setScale(0).setDepth(4);
		//const candie5 = this.add.image(this.cameras.main.centerX, logo.y + (logo.height * 1.05) + 10 + 40, "candies_logo", 3).setOrigin(0.5).setScale(0).setDepth(6);
		//const candie6 = this.add.image(this.cameras.main.centerX, logo.y + (logo.height * 1.05) + 10 + 40, "candies_logo", 8).setOrigin(0.5).setScale(0).setDepth(5);

		const baseX = candie1.x
		const baseY = candie1.y

		this.tweens.add({
			targets: candie1,
			scale: 1,
			x: baseX - 120,
			y: baseY - 15,
			angle: -125,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie1],
			scale: 1.1,
			delay:1300,
			angle: -130,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});
		
		this.tweens.add({
			targets: candie2,
			scale: 1,
			x: baseX - 80,
			y: baseY - 5,
			angle: + 15,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie2],
			scale: 1.1,
			delay:1100,
			angle: + 10,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        this.tweens.add({
			targets: candie3,
			scale: 0.95,
			x: baseX + 80,
			y: baseY - 5,
			angle: + 135,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie3],
			scale: 0.9,
			delay:1080,
			angle: + 115 ,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        this.tweens.add({
			targets: candie4,
			scale: 1.2,
			x: baseX + 110,
			y: baseY - 8,
			angle: + 130,
			delay:600,
			duration: 600,
			ease: "Bounce.easeOut"
		});

        this.tweens.add({
			targets: [candie4],
			scale: 1.3,
			delay: 1300,
			angle: + 120,
			duration: 300,
			ease: "Power1",
			yoyo: true,
			loop: -1
		});

        const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 1.3, "play").setScale(0).setDepth(7);
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
