import 'phaser';
import Boot from "./Scenes/Boot";
import Preloader from "./Scenes/Preloader";
import MainMenu from "./Scenes/MainMenu";
import SplashScreen from "./Scenes/SplashScreen";
import Utilities from "./Utilities";
import MainGameCandy from "./Scenes/MainGame_Candy";
import MainSettings from "./Scenes/MainSettings";
import LeavingGameScene from "./Scenes/LeavingGameScene";

const MIN_HEIGHT = 700;
const dynamicHeight = Math.max(window.innerHeight, MIN_HEIGHT);

const gameConfig: Phaser.Types.Core.GameConfig = {
	width: 400,
	height: dynamicHeight, // dinámico según pantalla
	type: Phaser.AUTO,
	transparent: true,
	parent: "content",
	title: "Juego Candy para Arcor"
};


export default class Game extends Phaser.Game {
	onCloseGame?: () => void;
	selectedCoupon: string = 'TESTCUPONCANDYGAME';

	constructor(config: Phaser.Types.Core.GameConfig & PhaserGameOptions) {
		Utilities.LogSceneMethodEntry("Game", "constructor");
		super(config);
		this.onCloseGame = config.onClose;

		this.scene.add(Boot.Name, Boot);
		this.scene.add(Preloader.Name, Preloader);
		this.scene.add(SplashScreen.Name, SplashScreen);
		this.scene.add(MainMenu.Name, MainMenu);
		this.scene.add(MainGameCandy.Name, MainGameCandy);
		this.scene.add(LeavingGameScene.Name, LeavingGameScene);
		this.scene.add(MainSettings.Name, MainSettings);

		this.scene.start(Boot.Name);
		this.selectedCoupon = this.getRandomCoupon();
	}

	public getRandomCoupon() {
		const coupons = [
			'TESTCUPONCANDYGAME'
		];
		const randomIndex = Math.floor(Math.random() * coupons.length);
		return coupons[randomIndex];
	}

	public getCouponCode() {
		return this.selectedCoupon;
	}
}

// ✅ Nueva función resize que escala visualmente el canvas
function resizeCanvas(): void {
	const canvas = document.querySelector("canvas") as HTMLCanvasElement;
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;
	const windowRatio = windowWidth / windowHeight;

	// Aseguramos que son números
	const gameWidth = gameConfig.width as number;
	const gameHeight = gameConfig.height as number;
	const gameRatio = gameWidth / gameHeight;

	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + "px";
		canvas.style.height = (windowWidth / gameRatio) + "px";
	} else {
		canvas.style.width = (windowHeight * gameRatio) + "px";
		canvas.style.height = windowHeight + "px";
	}
}


// ✅ Tipado extra
type PhaserGameOptions = {
	parent?: string;
	assetFolder?: string;
	onClose?: () => void;
	couponcode?: string;
}

declare global {
	interface Window {
		newGame: (options: PhaserGameOptions) => void;
		assetFolder?: string;
		game?: Game;
	}
}

// ✅ Inicializador global
if (window) {
	window.newGame = (options: PhaserGameOptions) => {
		const newOptions = { ...gameConfig, ...options };

		if (newOptions.assetFolder) window.assetFolder = newOptions.assetFolder;

		const game = new Game(newOptions as Phaser.Types.Core.GameConfig & PhaserGameOptions);
		window.game = game;

		// Escalar canvas al inicio
		resizeCanvas();
		window.addEventListener("resize", () => resizeCanvas(), true);
	};

	window.onload = (): void => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const async = urlParams.get('async');

		if (!async) {
			window.newGame({});
		} else {
			console.log("Waiting for instructions");
		}
	};
}
