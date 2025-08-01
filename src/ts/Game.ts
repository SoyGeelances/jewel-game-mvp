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

const gameConfig: Phaser.Types.Core.GameConfig = {
	width: 400 > window.innerWidth ? window.innerWidth : 400,
	height: window.innerHeight,
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
			'TESTCUPONCANDYGAME'
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
function resize(game: Game): void {
    let width = 400;
    
    if (window.innerWidth === 428) { 
        width = 440;
    } else if (window.innerWidth === 414) { 
        width = 414; 
    } else if (width > window.innerWidth) {
        width = window.innerWidth;
    }

    const height = window.innerHeight;

    if (game) {
        game.scale.resize(width, height);
        game.renderer.resize(width, height);
        game.scene.scenes.forEach((scene) => {    
            if (scene.cameras.main && scene.scene.isActive()) {
                scene.cameras.main.setViewport(0, 0, width, height);
                
                const zoomFactor = window.innerWidth / 400;
                scene.cameras.main.setZoom(zoomFactor);
                
                game.scale.refresh();
                if (scene.scene.isActive() && scene.scene.settings.active) {
                    scene.cameras.main.setViewport(0, 0, width, height);
                    const zoomFactor = window.innerWidth / 400;
                    scene.cameras.main.setZoom(zoomFactor);
                }
            }
        });
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
		resize(game);
		window.addEventListener("resize", () => resize(game), true);
        
        //Fix Resize IOS
        window.addEventListener('pageshow', () => {
        if (window.game) {
            resize(window.game);      // re-dimensionar juego
            window.scrollTo(0, 0);    // volver al top visual
        }
        });
        document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.game) {
            resize(window.game);     
            window.scrollTo(0, 0);    
        }
        });
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
