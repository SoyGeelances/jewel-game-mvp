import 'phaser';
import Boot from "./Scenes/Boot";
import Preloader from "./Scenes/Preloader";
import MainMenu from "./Scenes/MainMenu";
import SplashScreen from "./Scenes/SplashScreen";
import Utilities from "./Utilities";
import MainGameJewel from "./Scenes/MainGame_Jewel";
import MainGameCandy from "./Scenes/MainGame_Candy";
import MainGameMemo from "./Scenes/MainGame_Memo";
import MainSettings from "./Scenes/MainSettings";
import LeavingGameScene from "./Scenes/LeavingGameScene";

const MIN_HEIGHT = 700;
const dynamicHeight = Math.max(window.innerHeight, MIN_HEIGHT);

const gameConfig: Phaser.Types.Core.GameConfig = {
	width: 400,
	height: window.innerHeight > MIN_HEIGHT ? window.innerHeight : dynamicHeight,
	type: Phaser.AUTO,
	transparent: true,
	parent: "content",
	title: "Juego Candy para Arcor"
};

export default class Game extends Phaser.Game {
	onCloseGame?: () => void;
	selectedCoupon: string = 'MOGULMASTI15';

	constructor(config: Phaser.Types.Core.GameConfig & PhaserGameOptions) {
		Utilities.LogSceneMethodEntry("Game", "constructor");
		super(config);
		this.onCloseGame = config.onClose;
		this.scene.add(Boot.Name, Boot);
		this.scene.add(Preloader.Name, Preloader);
		this.scene.add(SplashScreen.Name, SplashScreen);
		this.scene.add(MainMenu.Name, MainMenu);
		//this.scene.add(MainGameJewel.Name, MainGameJewel);
        this.scene.add(MainGameCandy.Name, MainGameCandy);
		//this.scene.add(MainGameMemo.Name, MainGameMemo);
		this.scene.add(LeavingGameScene.Name, LeavingGameScene);
		this.scene.add(MainSettings.Name, MainSettings);
		this.scene.start(Boot.Name);
		this.selectedCoupon = this.getRandomCoupon();
	}

	public getRandomCoupon() {
		const coupons = [
			'MOGULMASTI15'
		];
    const randomIndex = Math.floor(Math.random() * coupons.length);
    return coupons[randomIndex];
	}

	public getCouponCode() {
		return this.selectedCoupon;
	}
}

/**
 * Workaround for inability to scale in Phaser 3.
 * From http://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
 */
function resizeCanvas(): void {
	const canvas = document.querySelector("canvas") as HTMLCanvasElement;
	const windowWidth = window.innerWidth - 5;
	const windowHeight = window.innerHeight;
	const windowRatio = windowWidth / windowHeight;

	// NUEVO: actualizar altura dinámica
	const gameWidth = gameConfig.width as number;
	const gameHeight = Math.max(window.innerHeight, 700);
	const gameRatio = gameWidth / gameHeight;
	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + "px";
		canvas.style.height = window.innerHeight + "px";
	} else {
		canvas.style.width = (windowHeight * gameRatio) + "px";
		canvas.style.height = windowHeight + "px";
	}
}

type PhaserGameOptions = {
	parent?: string;
	assetFolder? : string;
	onClose?: () => void;
	couponcode?: string;
	// more options
}

declare global {
	interface Window {
		newGame: (options: PhaserGameOptions) => void;
		assetFolder?: string;
		game?: Game;
	}
}


if (window) {
	window.newGame = (options: PhaserGameOptions) => {
		const newOptions = {...gameConfig, ...options}

		if(newOptions.assetFolder) window.assetFolder = newOptions.assetFolder;
		const game = new Game(newOptions as Phaser.Types.Core.GameConfig & PhaserGameOptions);	
		window.game = game;
		// Uncomment the following two lines if you want the game to scale to fill the entire page, but keep the game ratio.
		resizeCanvas();
	    window.addEventListener("resize", resizeCanvas, true);
	}

	window.onload = (): void => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const async = urlParams.get('async')
		
		if(!async) {
			window.newGame({});
		} else {
			console.log("Waiting for instructions")
		}

	}
}
