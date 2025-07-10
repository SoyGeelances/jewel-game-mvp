import SplashScreen from "./SplashScreen";
import Utilities from "../Utilities";

export default class Preloader extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "Preloader";

	public preload(): void {

		this.load.path = window.assetFolder ?? "assets/";
		this.load.spritesheet('diamonds', 'diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
		this.load.spritesheet("cards", "spritesheet_cards_2x_new.png", { frameWidth: 58 * 2, frameHeight: 58 * 2 });
        this.load.spritesheet('candies', 'spritesheet_cards_candy.png', { frameWidth: 116, frameHeight: 116 })
        this.load.spritesheet('candies_logo', 'spritesheet_cards_candy_logo.png', { frameWidth: 116, frameHeight: 116 })

		this.load.image("progress_frame", "progress_bar_frame.png");
		this.load.image("progress_bar", "progress_bar_full.png");
		//this.load.image("powerBy", "powerBy_w.png");
		this.load.svg("powerBySvg", "powerBy_w.svg", {width:400, height:30, scale: 1});
		this.load.svg("tevas_title", "tevas_title.svg");
		this.load.svg("retry_button", "retry_button.svg");

		this.load.image("phaser_pixel_medium_flat");
		this.load.image("background", "background.png");
        this.load.image("background_main", "background_main.png");
        this.load.image('prompt_bg', 'background_main.png');
		
		this.load.image("sound_off", "sound_off.png");
		this.load.image("sound_on", "sound_on.png");
		
		this.load.image("score", "frame-score.png");
		this.load.image("final_score", "final_score.png");
		this.load.image("prompt_screen", "prompt_screen.png");
		this.load.image("retry_message", "cada-vez-mas-cerca.png");
		this.load.image("close_button", "close.png");
		// this.load.image("retry_button", "retry-btn.png");
		this.load.image("seguiintentando_title", "segui-intentando.png");
		this.load.image("porpoco_title", "porpoco_title.png");
		this.load.image("exit_arcor_button", "ir_a_tienda.png");
		this.load.image("winner_screen", "win_screen.png");
		this.load.image("win_title", "win_title.png");
		this.load.image("win_message", "win_message.png");
		this.load.image("background_secondary", "background_secondary.png");
		// this.load.image("tevas_title", "tevas_title.png");
		this.load.image("tevas_message", "tevas_message.png");
		this.load.image("tevas_button", "tevas_button.png");
		this.load.image("copy_coupon_button", "copy_coupon_button.png");
		this.load.image("copied_coupon_button", "copied_button.png");
		this.load.image("coupon_code_container", "coupon_code_container.png");

		this.load.image("logo_candy_Arcor", "logo-candy-arcor.png");
        this.load.image("logo_candy_Arcor_win", "logo_candy_Arcor_win.png");
        this.load.image("logo_Arcor", "logo-arcor-en-casa.png");
		this.load.image("logo", "logo-home.png");	
		this.load.image("play", "play.png");	
		this.load.image("reset", "reset_2x.png");	
		this.load.image("Phaser-Logo-Small");

		this.load.audio("music", "music.mp3");
		this.load.audio("coinsplash", "coinsplash.mp3");
		this.load.audio("collectcoin", "collectcoin.mp3");
		this.load.audio("tadaa", "tadaa.mp3");
		this.load.audio("retry", "retry.mp3");
		this.load.audio("cash", "cash-register.mp3");
		this.load.audio("cardFlip", "cardFlip.wav");
        this.load.audio("level_up", "level-up.mp3");
		this.load.audio("swap_candy", "swap-candy.mp3");
        this.load.audio("shuffle_candies", "shuffle_candies.mp3")
        this.load.audio("combo_sound", "combo_sound.mp3")

		// You should remove this logic; this is only included here to show off the progress bar.

	}

	public init(): void {
		this.addProgressBar();
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Preloader", "create");

		this.scene.start(SplashScreen.Name);

		const background = this.add.image(this.cameras.main.centerX,0, "background");
		background.setOrigin(0.5, 0);
		background.setScale(this.cameras.main.width / background.width);
		let baseScale = this.cameras.main.height / background.height
		if((this.cameras.main.width / background.width) > baseScale) baseScale = this.cameras.main.width / background.width;
		background.setScale(baseScale)

		const powerBy = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 2, "powerBy");
		powerBy.setInteractive();
		powerBy.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank");
		});
		powerBy.setOrigin(0.5, 1).setScale(1.15 / 3);

	}

	public update(): void {
		// preload handles updates to the progress bar, so nothing should be needed here.
	}

	/**
	 * Adds a progress bar to the display, showing the percentage of assets loaded and their name.
	 */
	private addProgressBar(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		/** Customizable. This text color will be used around the progress bar. */
		const outerTextColor = '#ffffff';

		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x009FAF, 0.8);
		progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
		progressBox.setDepth(110);
		progressBar.setDepth(110);
		
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: "Cargando",
			style: {
				font: "20px montserrat-memo",
				color: "#E2D64B"
			}
		});
		loadingText.setOrigin(0.5, 0.5);
		loadingText.setDepth(110);

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: "0%",
			style: {
				font: "18px montserrat-memo",
				color: "#E2D64B"
			}
		});
		percentText.setOrigin(0.5, 0.5);
		percentText.setDepth(110);

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: "",
			style: {
				font: "18px monospace",
				color: outerTextColor
			}
		});

		assetText.setOrigin(0.5, 0.5);
		assetText.setDepth(110);

		this.load.on("progress", (value: number) => {
			percentText.setText(parseInt(value * 100 + "", 10) + "%");
			progressBar.clear();
			progressBar.fillStyle(0x02055, 1); 
			progressBar.fillRect((width / 4) + 10, (height / 2) - 30 + 10, (width / 2 - 10 - 10) * value, 30);
		});

		// this.load.on("fileprogress", (file: Phaser.Loader.File) => {
		// 	assetText.setText("Loading asset: " + file.key);
		// });

		this.load.on("complete", () => {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});
	}
}
