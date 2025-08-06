import Phaser from 'phaser'
import { WinnerScreen, RetryScreen } from '../Screen';
import { prompt } from '../config'
import { ButtonEventHandler } from '../handlers';
import { EventObserver } from '../observer';
import { CloseButton } from "../components";
import { Footer } from "../components/Footer";
import { LevelUpScreen } from "../components/LevelUpScreen";
import { BackgroundMusic } from '../components/BackgroundMusic';


// GRID
const GRID_WIDTH = 5
const GRID_HEIGHT = 6
const CANDY_WIDTH = 116 * 0.6;
const CANDY_HEIGHT = 116 * 0.6;
const GAP = 6
const CANDY_FRAME_START = 1;
const CANDY_FRAME_END = 6;
const LOGO_X = 16;
const LOGO_Y = 25; 

// LEVELS
const LEVELS = [
  { level: 1, goal: 300, time: 25 },
 
];

export default class MainGame extends Phaser.Scene {
  public static Name = "MainGame"

  private grid: Phaser.GameObjects.Sprite[][] = []
  private offsetX = 0
  private offsetY = 0
  private selectedCandy: Phaser.GameObjects.Sprite | null = null
  private lastMovedCandy: Phaser.GameObjects.Sprite | null = null;
  private movingCandiesInProcess = false
  private retryScreen!: RetryScreen
  private winnerScreen!: WinnerScreen
  private scoreValue = 0
  private scoreGoal = LEVELS[0].goal;
  private scoreText!: Phaser.GameObjects.Text
  private levelStartScore = 0;
  private currentLevelIndex = 0;
  private totalTime = LEVELS[0].time; // en segundos
  private matchValue = 20;
  private levelUpSound!: Phaser.Sound.BaseSound;
  private levelUpScreen!: LevelUpScreen;
  private swapCandySound!: Phaser.Sound.BaseSound;
  private matchSound!: Phaser.Sound.BaseSound;
  private startLevelSound!: Phaser.Sound.BaseSound;
  private shuffleCandySound!: Phaser.Sound.BaseSound;
  private comboCount = 1;
  private comboTimer!: Phaser.Time.TimerEvent;
  private comboThreshold = 1500; // 1.5 segundos
  private comboText!: Phaser.GameObjects.Text;
  private comboSound!: Phaser.Sound.BaseSound;
  private comboX5Sound!: Phaser.Sound.BaseSound;
  private earthRocksSound!: Phaser.Sound.BaseSound;
  private electricSparksSound!: Phaser.Sound.BaseSound;
  private powerDowmSound!: Phaser.Sound.BaseSound;
  private logoColor!: Phaser.GameObjects.Image;
  private logoWhite!: Phaser.GameObjects.Image;
  private recargaMasti!: Phaser.GameObjects.Image;
  private progressBar!: Phaser.GameObjects.Graphics
  private progressFrame!: Phaser.GameObjects.Image
  private progressTimer!: Phaser.Time.TimerEvent
  private clockTickingSound!: Phaser.Sound.BaseSound;
  private eventObserver: EventObserver;
  private gameState: 'playing' | 'paused' | 'ended' = 'playing';
  private closeButton: CloseButton;
  private bgMusic!: BackgroundMusic;
  private levelText!: Phaser.GameObjects.Text;
  private goalText!: Phaser.GameObjects.Text;


  preload() {
    this.load.image('progress-frame', 'assets/progress_bar_frame.png')
  }

  private getCandyPosition(row: number, col: number): { x: number; y: number } {
    const x = this.offsetX + col * (CANDY_WIDTH + GAP) + CANDY_WIDTH / 2
    const y = this.offsetY + row * (CANDY_HEIGHT + GAP) + CANDY_HEIGHT / 2
    return { x, y }
  }

  /*async createGrid() {
    this.offsetX = (this.scale.width - (GRID_WIDTH * CANDY_WIDTH + (GRID_WIDTH - 1) * GAP)) / 2
    const gridHeight = GRID_HEIGHT * CANDY_HEIGHT + (GRID_HEIGHT - 1) * GAP
    this.offsetY = (this.scale.height - gridHeight) / 2

    for (let row = 0; row < GRID_HEIGHT; row++) {
      this.grid[row] = []

      for (let col = 0; col < GRID_WIDTH; col++) {
        const candyType = Phaser.Math.Between(CANDY_FRAME_START, CANDY_FRAME_END);

        const x = this.offsetX + col * (CANDY_WIDTH + GAP) + CANDY_WIDTH / 2
        const y = this.offsetY + row * (CANDY_HEIGHT + GAP) + CANDY_HEIGHT / 2

        const candy = this.createCandy(x, y, candyType, row, col)
        //this.add.rectangle(x, y, 40, 40, 0x00ff00).setStrokeStyle(2, 0x000000) 
        this.grid[row][col] = candy
      }
    }

    const matches = this.getMatches();
    if (matches.length > 0) {
    console.log('MATCH FOUND:', matches.length, 'caramelos')
    await this.processMatches(); 
    }

    this.comboText.setY(this.offsetY - 50);
  }*/

  private createCandy(x: number, y: number, candyType: number, row: number, col: number): Phaser.GameObjects.Sprite {
    const candy = this.add.sprite(x, y, 'candies', candyType).setScale(0.6);
    candy.setData('type', candyType);
    candy.setData('row', row);
    candy.setData('col', col);
    candy.setInteractive();

    // Eventos de drag
    candy.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this.movingCandiesInProcess || this.gameState !== 'playing') return;
        this.selectedCandy = candy;
        candy.setScale(0.7); 
        candy.setData('startX', pointer.x);
        candy.setData('startY', pointer.y);
    });
    return candy;
  }

  private trySwap(direction: 'up' | 'down' | 'left' | 'right') {
    if (!this.selectedCandy || this.movingCandiesInProcess) return;
    //console.log("triyng swap");

    const row = this.selectedCandy.getData('row');
    const col = this.selectedCandy.getData('col');

    let targetRow = row;
    let targetCol = col;

    switch (direction) {
        case 'up': targetRow--; break;
        case 'down': targetRow++; break;
        case 'left': targetCol--; break;
        case 'right': targetCol++; break;
    }

    // Fuera de límites
    if ( targetRow < 0 || targetRow >= GRID_HEIGHT || targetCol < 0 || targetCol >= GRID_WIDTH ) {
        //console.log("fuera de limites");
        this.selectedCandy.setScale(0.6); 
        return;
    }

    const areAdjacent = this.grid[targetRow][targetCol];
    if (!areAdjacent) {
        //console.log("es adjacente");
        this.selectedCandy.setScale(0.6); 
        return;
    }
    //console.log("tryswap")
    this.swapCandies(this.selectedCandy, areAdjacent);
  }

  /*private areAdjacent(c1: Phaser.GameObjects.Sprite, c2: Phaser.GameObjects.Sprite): boolean {
    const row1 = c1.getData('row')
    const col1 = c1.getData('col')
    const row2 = c2.getData('row')
    const col2 = c2.getData('col')

    const isNextTo = (Math.abs(row1 - row2) === 1 && col1 === col2) ||
                    (Math.abs(col1 - col2) === 1 && row1 === row2)

    return isNextTo
  }*/


  private swapCandies(c1: Phaser.GameObjects.Sprite, c2: Phaser.GameObjects.Sprite) {
    //console.log("swapcandiesvv")
    this.movingCandiesInProcess = true;

    const row1 = c1.getData('row');
    const col1 = c1.getData('col');
    const row2 = c2.getData('row');
    const col2 = c2.getData('col');

    // Intercambiar visualmente
    this.tweens.add({ targets: c1, x: c2.x, y: c2.y, duration: 200 });
    this.tweens.add({ targets: c2, x: c1.x, y: c1.y, duration: 200 });

    // Intercambiar en la grilla
    this.swapCandySound.play();
    this.grid[row1][col1] = c2;
    this.grid[row2][col2] = c1;
    c1.setData('row', row2).setData('col', col2);
    c2.setData('row', row1).setData('col', col1);

    this.lastMovedCandy = c1; //candy seleecionado 

    this.time.delayedCall(250, async () => {
        const matches = this.getMatches();
        if (matches.length > 0) {
            this.removeMatches(matches);
            this.dropCandies();
            await this.delay(300);
            await this.refillGrid();
            await this.processMatches(); // 🔁 encadenar combos
        } else {
        this.tweens.add({
                targets: c1,
                x: c2.x,
                y: c2.y,
                duration: 200
            });

            this.tweens.add({
                targets: c2,
                x: c1.x,
                y: c1.y,
                duration: 200,
                onComplete: () => {
                    this.grid[row1][col1] = c1;
                    this.grid[row2][col2] = c2;
                    c1.setData('row', row1).setData('col', col1);
                    c2.setData('row', row2).setData('col', col2);
                    this.movingCandiesInProcess = false; 
                }
            });
        }
    });
  }


  private getMatches(): Phaser.GameObjects.Sprite[] {
    const matches: Set<Phaser.GameObjects.Sprite> = new Set()
    //console.log("getmatches")
    // Detectar combinaciones horizontales
    for (let row = 0; row < GRID_HEIGHT; row++) {
        let match: Phaser.GameObjects.Sprite[] = []

        for (let col = 0; col < GRID_WIDTH; col++) {
            const current = this.grid[row][col]
            const prev = col > 0 ? this.grid[row][col - 1] : null
            if (!current || !prev) {
                if (match.length >= 3) match.forEach(c => matches.add(c));
                match = [];
                continue;
            }

            if (current.getData('type') === prev.getData('type')) {
                match.push(current)
                if (match.length === 1) match.unshift(prev)
            } else {
                if (match.length >= 3) match.forEach(c => matches.add(c))
                match = []
            }
        }
        if (match.length >= 3) {
            match.forEach(c => matches.add(c)) // por si hay un match al final de la fila
        }
    }

    // Detectar combinaciones verticales
    for (let col = 0; col < GRID_WIDTH; col++) {
        let match: Phaser.GameObjects.Sprite[] = []

        for (let row = 0; row < GRID_HEIGHT; row++) {
            const current = this.grid[row][col]
            const prev = row > 0 ? this.grid[row - 1][col] : null
            if (!current || !prev) {
                if (match.length >= 3) match.forEach(c => matches.add(c));
                match = [];
                continue;
            }

            if (current.getData('type') === prev.getData('type')) {
                match.push(current)
                if (match.length === 1) match.unshift(prev)
            } else {
                if (match.length >= 3) match.forEach(c => matches.add(c))
                match = []
                }
        }
        if (match.length >= 3) {
        match.forEach(c => matches.add(c))
        }
    }

    return Array.from(matches)
  }

  private updateScore(points: number) {
    this.scoreValue += points
    //console.log("score",this.scoreValue);
    this.scoreText.setText(this.scoreValue.toString())
    const relativeScore = this.scoreValue - this.levelStartScore;
    const goalForLevel = this.scoreGoal - this.levelStartScore;
    const progress = Phaser.Math.Clamp(relativeScore / goalForLevel, 0, 1);
    const width = this.logoColor.width * progress;
    this.logoColor.setCrop(0, 0, width, this.logoColor.height);

    if (this.scoreValue >= this.scoreGoal && this.gameState !== 'ended') {
        this.progressTimer?.remove(false); 
        if (this.currentLevelIndex === LEVELS.length - 1) {
            this.endGame(); // nivel final
        } else {
            this.nextLevel(); // avanzar al siguiente
        }
    }
  }

  private updateProgressBar(progress: number) {
    //console.log("pdateprogresbar")
    const barWidth = 357
    const barHeight = 26
    const x = this.cameras.main.centerX - barWidth / 2
    const y = this.scale.height - 85
    const radius = 5;

    this.progressBar.clear()

    // Simula gradiente con color base sólido
    this.progressBar.fillStyle(0x3dc51f, 1)
    this.progressBar.fillRoundedRect(x, y, barWidth * progress, barHeight, radius);
  }

  private nextLevel() {
    this.currentLevelIndex++;
    this.clockTickingSound?.stop();

    if (this.currentLevelIndex >= LEVELS.length) {
        this.endGame(); // nivel final
        return;
    }

    const newLevel = LEVELS[this.currentLevelIndex];

    this.scoreGoal = newLevel.goal;
    this.totalTime = newLevel.time;
    this.levelStartScore = this.scoreValue;

    this.gameState = 'paused';

    // Mostrar LevelUpScreen y esperar confirmación del jugador
    this.showLevelUpScreen(newLevel.level, newLevel.goal);
  }

  private showLevelUpScreen(level: number, goal: number) {
    this.levelUpSound.play();
    this.updateProgressBar(1);
    this.logoColor.setCrop(0, 0, 0, this.logoColor.height);

    this.levelUpScreen.once('closed', () => {
        this.startNextLevel();
    });

    this.levelUpScreen.show(level, goal);
  }


  private async startNextLevel() {
    await this.refillGrid(); // se asegura que esté lleno y sin matches

    this.progressTimer?.destroy();
    this.progressTimer = this.time.addEvent({
        delay: this.totalTime * 1000,
        callback: () => this.endGame(),
    });

    this.gameState = 'playing';
  }


  private endGame() {
    if (this.gameState === 'ended') return; 
    this.gameState = 'ended';
    this.movingCandiesInProcess = false
    this.logoWhite?.destroy?.()
    this.logoColor?.destroy?.()
    this.closeButton?.destroy?.();
    this.events.off('update');
    this.progressTimer?.remove(false);
    this.clockTickingSound?.stop();
    this.comboTimer?.remove(false);
    BackgroundMusic.getInstance().destroy();

    if (this.scoreValue >= this.scoreGoal) {
        this.winnerScreen.show(prompt.win, "winner_screen");
    } else {
        this.retryScreen.setFinalScore(this.scoreValue);
        this.retryScreen.show(prompt.retry, "prompt_screen");
    }
  }

  private removeMatches(matches: Phaser.GameObjects.Sprite[]) {
    //this.matchSound.play()
    //console.log("matches: ", matches);
    // Calcular Combos
    const basePoints = matches.length * 10;
    const points = basePoints * this.comboCount;
    //console.log("basePoints: ", basePoints);
    //console.log("this.comboCount: ", this.comboCount);
    //console.log("combo points: ", points);
    this.updateScore(points);

    // Mostrar texto de combo si es mayor a x1
    if (this.comboCount > 1 && this.gameState === 'playing') {
        this.comboSound.play();
        this.showComboText(`x${this.comboCount}`);
    }
    this.comboCount++;

    // Reiniciar el temporizador de combo
    if (this.comboTimer) this.comboTimer.remove();

    this.comboTimer = this.time.delayedCall(this.comboThreshold, () => {
        this.comboCount = 1;
    });

    if (matches.length >= 5) {
        this.cameras.main.shake(220, 0.006); // duración, intensidad
        //this.cameras.main.flash(50, 100, 100, 255);
        //this.earthRocksSound.play();

        if (this.lastMovedCandy) {
            this.showComboX5Bonus(this.lastMovedCandy.x, this.lastMovedCandy.y);
            //console.log("scoreValue antes: ", this.scoreValue);
            this.updateScore(50);
            //console.log("scoreValue despues: ", this.scoreValue);
        }
    }

    // Eliminar los caramelos del grid
    matches.forEach(candy => {
        const row = candy.getData('row');
        const col = candy.getData('col');
        this.grid[row][col] = null;

        // animar un fade rápido y luego destruir
        this.tweens.add({
            targets: candy,
            scale: 0,      
            duration: 200,  
            ease: 'Back.easeIn', 
             onComplete: () => {
                //this.SparkleEffect(candy.x, candy.y); 
                candy.destroy();
            }
        });
    });

    this.lastMovedCandy = null; //limpiar caramelo seleccionado
 }

  private showComboX5Bonus(x: number, y: number) {
        this.comboX5Sound.play()
        const bonusImage = this.add.image(x, y, 'combo_x5_mogul').setScale(0.5).setAlpha(0.9);

        this.tweens.add({
            targets: bonusImage,
            y: y - 45,
            x: this.scale.width / 2 - 18,
            alpha: 0,
            duration: 1900,
            ease: 'Cubic.easeOut',
            onComplete: () => bonusImage.destroy()
        });
  }


  private showComboText(text: string) {
    this.comboText.setText(text);
    this.comboText.setAlpha(1);
    this.comboText.setScale(1);
    this.comboText.setY(this.scale.height / 2 - 50); 

    this.tweens.add({
        targets: this.comboText,
        y: this.scale.height / 2 - 80,
        alpha: 0,
        duration: 900,
        ease: 'Cubic.easeOut'
    });
  }

  private dropCandies() {
    //console.log("droppcandies");
    if (this.gameState !== 'playing') return;
    for (let col = 0; col < GRID_WIDTH; col++) {
        for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
            if (this.grid[row][col] === null) {
                // Buscar el caramelo más cercano arriba
                for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                const candyAbove = this.grid[aboveRow][col]
                    if (candyAbove) {
                        // Moverlo visualmente
                        const { x, y } = this.getCandyPosition(row, col)
                        this.tweens.add({
                        targets: candyAbove,
                        y: y,
                        duration: 200
                        })
                        // Actualizar datos
                        this.grid[row][col] = candyAbove
                        candyAbove.setData('row', row)

                        this.grid[aboveRow][col] = null
                        break
                    }
                }
            }
        }
    }
  }

  private refillGrid(): Promise<void> {
    //console.log("reffill");
    this.movingCandiesInProcess = true; //Bloquear movimientos

    return new Promise((resolve) => {
        if (this.gameState !== 'playing' && this.gameState !== 'paused') return resolve();

        for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (!this.grid[row][col]) {
            const candyType = Phaser.Math.Between(CANDY_FRAME_START, CANDY_FRAME_END);
            const { x, y } = this.getCandyPosition(row, col);
            const initialY = y - 2 * (CANDY_HEIGHT + GAP);

            const candy = this.createCandy(x, y, candyType, row, col);
            candy.y = initialY;

            this.tweens.add({
                targets: candy,
                y: y,
                duration: 300
            });

            this.grid[row][col] = candy;
            }
        }
        }

        this.time.delayedCall(350, async () => {
        const newMatches = this.getMatches();

        if (newMatches.length > 0) {
            this.removeMatches(newMatches);

            this.time.delayedCall(300, () => {
            this.dropCandies();

            this.time.delayedCall(300, async () => {
                await this.refillGrid();
                resolve();
            });
            });

        } else {
            if (!this.hasPossibleMoves()) {
            this.showShuffleMessage();
            this.shuffleCandySound.play();
            this.shuffleBoard();

            this.time.delayedCall(200, async () => {
                await this.refillGrid();
                resolve();
            });

            } else {
            this.movingCandiesInProcess = false; 
            resolve();
            }
        }
        });
    });
  }

  private swapData(c1: Phaser.GameObjects.Sprite, c2: Phaser.GameObjects.Sprite) {
    const row1 = c1.getData('row')
    const col1 = c1.getData('col')
    const row2 = c2.getData('row')
    const col2 = c2.getData('col')

    this.grid[row1][col1] = c2
    this.grid[row2][col2] = c1

    c1.setData('row', row2)
    c1.setData('col', col2)
    c2.setData('row', row1)
    c2.setData('col', col1)
  }

  private hasPossibleMoves(): boolean {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
        const current = this.grid[row][col]
        if (!current) continue;
        const currentType = current.getData('type')

        // Verificamos derecha
        if (col < GRID_WIDTH - 1) {
            const right = this.grid[row][col + 1]
            if (!right) continue;
            if (right.getData('type') !== currentType) {
            this.swapData(current, right)
            const matches = this.getMatches()
            this.swapData(current, right) // revertir
            if (matches.length > 0) return true
            }
        }

        // Verificamos abajo
        if (row < GRID_HEIGHT - 1) {
            const down = this.grid[row + 1][col];
            if (!down) continue;
            if (down.getData('type') !== currentType) {
            this.swapData(current, down)
            const matches = this.getMatches()
            this.swapData(current, down) // revertir
            if (matches.length > 0) return true
            }
        }
        }
    }
    return false
  }

  private shuffleBoard() {
    const maxAttempts = 20; // evitar bucle infinito
    let attempts = 0;

    const candies: Phaser.GameObjects.Sprite[] = [];

    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const candy = this.grid[row][col];
            if (candy) candies.push(candy);
        }
    }

    if (candies.length !== GRID_WIDTH * GRID_HEIGHT) {
        console.warn('⚠️ Grilla incompleta antes de barajar. Se completará.');
        this.refillGrid();
        return;
    }

    let hasMoves = false;

    do {
        Phaser.Utils.Array.Shuffle(candies);

        let i = 0;
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                const candy = candies[i++];
                const { x, y } = this.getCandyPosition(row, col);

                candy.setPosition(x, y);
                candy.setData('row', row);
                candy.setData('col', col);
                this.grid[row][col] = candy;
            }
        }

        hasMoves = this.hasPossibleMoves();
        attempts++;
    } while (!hasMoves && attempts < maxAttempts);

    if (!hasMoves) {
        console.warn("🔁 No se pudieron generar jugadas después de múltiples intentos.");
        this.showShuffleMessage();
    }
 }


  private showShuffleMessage() {
    const width = this.scale.width;
    const height = this.scale.height;

    const bg = this.add.rectangle(
        width / 2,
        height / 2,
        width * 0.9,     // Ancho en porcentaje
        60,              // Alto 
        0x002340,        // Color 
        0.95             // Opacidad
    ).setOrigin(0.5).setDepth(10);

    const text = this.add.text(
        width / 2,
        height / 2,
        'No hay jugadas disponibles',
        {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Luckiest Guy',
        }
    ).setOrigin(0.5).setDepth(11)

    this.time.delayedCall(700, () => {
        bg.destroy()
        text.destroy()
    })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => this.time.delayedCall(ms, resolve));
  }

  private async processMatches(): Promise<void> {
    //console.log("processmatches");
    if (this.gameState !== 'playing') return;
    this.movingCandiesInProcess = true;

    const matches = this.getMatches();
    if (matches.length > 0) {
        this.removeMatches(matches);
        this.dropCandies();
        await this.delay(300);
        await this.refillGrid(); 
    } else {
        this.movingCandiesInProcess = false;
    }
  }

  private async playIntroAnimation(): Promise<void> {
    return new Promise((resolve) => {
        // UI y elementos iniciales
        const scoreImage = this.add.image(10, 18, 'score').setOrigin(0, 0);
        const scoreWidth = scoreImage.width;
        const scoreHeight = scoreImage.height;

        this.scoreText = this.add.text(20 + scoreWidth - 30, 17 + scoreHeight / 2, '0', {
            fontFamily: 'Luckiest Guy',
            fontSize: '40px',
            color: '#FEC647',
            fontStyle: 'bold',
        }).setOrigin(1, 0.5);

        this.closeButton.create();
        this.eventObserver.on('button-clicked', (buttonId) => {
        ButtonEventHandler.handleButtonEvents(buttonId, this);
        }, this);

        Footer.create(this);
        this.startLevelSound.play()
        this.showIntroText();

        // Efectos del logo
        this.time.delayedCall(1600, () => {
            this.spawnFallingCandies(35);
            this.powerDowmSound.play();
            this.electricSparksSound.play();

            const lightning = this.add.particles(0, 0, 'ray_effect', {
                x: { min: LOGO_X - 10, max: LOGO_X + this.logoColor.displayWidth + 10 },
                y: { min: LOGO_Y - 10, max: LOGO_Y + this.logoColor.displayHeight + 10 },
                lifespan: 600,
                speed: 0,
                quantity: 1,
                scale: { start: 0.15, end: 0 },
                angle: { min: 0, max: 360 },
                alpha: { start: 0.3, end: 0 },
                rotate: { min: 0, max: 360 },
                gravityY: 0,
                blendMode: 'ADD'
            });

            lightning.setDepth(0);

            this.time.delayedCall(2000, () => {
                lightning.stop();
            });

            this.tweens.addCounter({
                from: 1,
                to: 0,
                duration: 2700,
                onUpdate: (tween) => {
                const value = tween.getValue();
                const width = this.logoColor.width * value;
                this.logoColor.setCrop(0, 0, width, this.logoColor.height);
                },
                onComplete: () => resolve()
            });
        });
    });
  }

  private showIntroText() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.scale.height / 2;

    const targetX = LOGO_X + this.logoColor.displayWidth / 2;
    const targetY = LOGO_Y + this.logoColor.displayHeight / 2;

    this.recargaMasti = this.add.image(centerX, centerY, 'recarga_masti')
        .setScale(1)
        .setAlpha(0)
        .setDepth(999);

    // Título level
    this.levelText = this.add.text(centerX, centerY + 165, 'NIVEL 1', {
        font: "53px 'Luckiest Guy'",
        color: '#FBB040',
        align: 'center'
    }).setOrigin(0.5).setStroke('#FFFFFF', 10);

    // Meta
    this.goalText = this.add.text(centerX, centerY + 230, 'META: 300 PUNTOS', {
        font: "20px 'Luckiest Guy'",
        color: '#FEC647',
        align: 'center',
    }).setOrigin(0.5);

    const boxMeta = this.add.rectangle( this.goalText.x, this.goalText.y + 2, 250,this.goalText.height + 20, 0x3B0037)
    .setOrigin(0.5)
    .setStrokeStyle(4, 0xFFFFFF)
    boxMeta.setDepth(this.goalText.depth - 1);

    this.tweens.add({
        targets: this.levelText,
        scale: { from: 0.89, to: 1 },
        duration: 700,
        ease: "Sine.easeIn",
	});

    this.tweens.add({
        targets: [this.goalText, boxMeta],
        scale: { from: 0.89, to: 1 },
        duration: 700,
        ease: "Sine.easeIn",
	});

    // RecargaMAsti
    this.tweens.add({
        targets: this.recargaMasti,
        scale: { from: 1, to: 0.65 },
        alpha: 0.9,
        duration: 700,
        ease: 'Back.Out',
        onComplete: () => {

        this.time.delayedCall(700, () => {
            
            this.tweens.add({
                targets: this.recargaMasti,
                x: targetX,
                y: targetY,
                scale: 0.15,
                alpha: 0,
                duration: 2300,
                ease: 'Cubic.easeInOut',
                onComplete: () => ( this.recargaMasti.destroy())
                });
            });

            // levelTExt
            this.tweens.add({
                targets: this.levelText,
                alpha: 0,
                duration: 2300,
                ease: 'Sine.easeInOut',
                onComplete: () => (this.levelText.destroy())
            });

            // goalText y boxMeta
            this.tweens.add({
                targets: [this.goalText, boxMeta],
                alpha: 0,
                duration: 2300,
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    this.goalText.destroy();
                    boxMeta.destroy();
                }
            });
        }
    });
  }

  private spawnFallingCandies(amount: number) {
    for (let i = 0; i < amount; i++) {
        const type = Phaser.Math.Between(CANDY_FRAME_START, CANDY_FRAME_END);
        const x = Phaser.Math.Between(0, this.scale.width + 50);
        const y = Phaser.Math.Between(-200, -40);

        const candy = this.add.sprite(x, y, 'candies_logo', type)
        .setAlpha(0.25)
        .setScale(Phaser.Math.FloatBetween(0.5, 0.6))
        .setDepth(1)
        .setAngle(Phaser.Math.Between(-30, 30));

        this.tweens.add({
        targets: candy,
        y: this.scale.height + 60,
        delay: Phaser.Math.Between(600, 1900),
        duration: 2300,
        ease: 'Linear',
        onComplete: () => candy.destroy()
        });
    }
  }


  private async createGridWithoutMatches() {
    this.offsetX = (this.scale.width - (GRID_WIDTH * CANDY_WIDTH + (GRID_WIDTH - 1) * GAP)) / 2;
    const gridHeight = GRID_HEIGHT * CANDY_HEIGHT + (GRID_HEIGHT - 1) * GAP;
    this.offsetY = (this.scale.height - gridHeight) / 2;

    for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
        this.grid[row] = [];
        for (let col = 0; col < GRID_WIDTH; col++) {
        let candyType;
        do {
            candyType = Phaser.Math.Between(CANDY_FRAME_START, CANDY_FRAME_END);
        } while (
            (col >= 2 &&
            this.grid[row][col - 1]?.getData('type') === candyType &&
            this.grid[row][col - 2]?.getData('type') === candyType) ||
            (row <= GRID_HEIGHT - 3 &&
            this.grid[row + 1]?.[col]?.getData('type') === candyType &&
            this.grid[row + 2]?.[col]?.getData('type') === candyType)
        );

        const { x, y } = this.getCandyPosition(row, col);
        const candy = this.createCandy(x, y, candyType, row, col);
        candy.setAlpha(0);

        this.grid[row][col] = candy;

        this.tweens.add({
            targets: candy,
            alpha: 1,
            duration: 300,
            delay: (GRID_HEIGHT - row + col) * 40
        });
        }
    }

    return this.delay(900); // Esperar a que termine la animación
  }


  init(data: { levelIndex: number; score: number }) {
    this.currentLevelIndex = data.levelIndex ?? 0;
    this.scoreValue = data.score ?? 0;

    const level = LEVELS[this.currentLevelIndex];
    this.scoreGoal = level.goal;
    this.totalTime = level.time;
    this.levelStartScore = this.scoreValue;
    BackgroundMusic.getInstance().showMuteButton(this);
  }


  async create() {
    this.gameState = 'playing';
    this.movingCandiesInProcess = false;
    this.selectedCandy = null;
    this.closeButton = new CloseButton(this);
    this.retryScreen = new RetryScreen(this)
    this.winnerScreen = new WinnerScreen(this)
    this.eventObserver = EventObserver.getInstance();
    this.levelUpScreen = new LevelUpScreen(this);
    this.levelUpSound = this.sound.add("level_up", { volume: 0.6, loop: false, });
    this.swapCandySound = this.sound.add("swap_candy");
    this.matchSound = this.sound.add("match_sound");
    this.shuffleCandySound = this.sound.add("shuffle_candies");
    this.logoWhite = this.add.image(LOGO_X, LOGO_Y, 'logo_mogul_white').setScale(0.43).setOrigin(0,0).setDepth(1);
    this.logoColor = this.add.image(LOGO_X, LOGO_Y, 'logo_mogul_color').setScale(0.43).setOrigin(0,0).setDepth(2).setCrop(0, 0, 0, 60);
    this.powerDowmSound = this.sound.add("power_down_sound");
    this.electricSparksSound = this.sound.add("electric_sparks_sound");
    this.comboSound = this.sound.add("combo_sound");
    this.comboX5Sound = this.sound.add("combo_x5_sound");
    this.clockTickingSound = this.sound.add("clock_ticking_sound", { loop: false });
    this.earthRocksSound = this.sound.add("earth_rocks_sound");
    this.startLevelSound = this.sound.add("start_level_sound");
    this.comboText = this.add.text(this.cameras.main.centerX, this.scale.height / 2, '', {
        font: "48px 'Luckiest Guy'",
        color: '#FFD700',
        fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0).setDepth(999);
    document.addEventListener('mouseup', this.handleGlobalMouseUp); //Detectar movimiento fuera del canvas

    await this.playIntroAnimation(); 
    await this.delay(400);
    await this.createGridWithoutMatches();

    this.progressFrame = this.add.image(this.cameras.main.centerX, this.scale.height - 68, 'progress-frame').setOrigin(0.5)
    this.progressBar = this.add.graphics()
    this.updateProgressBar(1)

    this.progressTimer = this.time.addEvent({
      delay: this.totalTime * 1000,

      callback: () => {
        this.endGame()
        //console.log('Tiempo terminado')
        //console.log('scoreValue: ', this.scoreValue )
      }
    })

    this.events.on('update', () => {
        const elapsed = this.progressTimer.getElapsed();
        const remaining = Math.ceil((this.progressTimer.delay - elapsed) / 1000);
        const progress = Phaser.Math.Clamp(1 - elapsed / this.progressTimer.delay, 0, 1);
        this.updateProgressBar(progress);

        if (remaining === 10 && !this.clockTickingSound.isPlaying) {
            this.clockTickingSound.play();
        }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        if (!this.selectedCandy) return;

        const dx = pointer.x - this.selectedCandy.getData('startX');
        const dy = pointer.y - this.selectedCandy.getData('startY');

        const distanceLimit = 15;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > distanceLimit) this.trySwap('right');
            else if (dx < -distanceLimit) this.trySwap('left');
        } else {
            if (dy > distanceLimit) this.trySwap('down');
            else if (dy < -distanceLimit) this.trySwap('up');
        }

        this.selectedCandy.setScale(0.6);
        this.selectedCandy = null;
    });
  }

  private handleGlobalMouseUp = (event: MouseEvent) => { //Fix pointer up fuera del canvas
    if (!this.selectedCandy) return;

    // Convertir coordenadas absolutas del mouse a coordenadas relativas del canvas
    const canvasBounds = this.game.canvas.getBoundingClientRect();
    const pointerX = event.clientX - canvasBounds.left;
    const pointerY = event.clientY - canvasBounds.top;

    const dx = pointerX - this.selectedCandy.getData('startX');
    const dy = pointerY - this.selectedCandy.getData('startY');

    const distanceLimit = 15;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > distanceLimit) this.trySwap('right');
        else if (dx < -distanceLimit) this.trySwap('left');
    } else {
        if (dy > distanceLimit) this.trySwap('down');
        else if (dy < -distanceLimit) this.trySwap('up');
    }

    this.selectedCandy.setScale(0.6);
    this.selectedCandy = null;
  }


  public getScoreValue(): string {
    //console.log("getscorevalue");
    return this.scoreValue.toString();
  }
}
