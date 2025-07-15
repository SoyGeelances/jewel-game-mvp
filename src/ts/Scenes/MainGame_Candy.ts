import Phaser from 'phaser'
import { WinnerScreen, RetryScreen } from '../Screen';
import { prompt } from '../config'
import { ButtonEventHandler } from '../handlers';
import { EventObserver } from '../observer';
import { CloseButton } from "../components";
import { Footer } from "../components/Footer";
import { LevelUpScreen } from "../components/LevelUpScreen";

// GRID
const GRID_WIDTH = 5
const GRID_HEIGHT = 6
const CANDY_WIDTH = 116 * 0.6;
const CANDY_HEIGHT = 116 * 0.6;
const GAP = 6
const CANDY_FRAME_START = 1;
const CANDY_FRAME_END = 4;

// LEVELS
const LEVELS = [
  { level: 1, goal: 600, time: 30 },
  { level: 2, goal: 1300, time: 35 },
  { level: 3, goal: 2500, time: 36 },
  { level: 4, goal: 3800, time: 41 },
  { level: 5, goal: 5200, time: 46 },
  { level: 6, goal: 6700, time: 47 },
  { level: 7, goal: 8100, time: 48 },
  { level: 8, goal: 10000, time: 49 }
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
  private currentLevelIndex = 0;
  private totalTime = LEVELS[0].time; // en segundos
  private matchValue = 20;
  private levelUpSound!: Phaser.Sound.BaseSound;
  private levelUpScreen!: LevelUpScreen;
  private swapCandySound!: Phaser.Sound.BaseSound;
  private shuffleCandySound!: Phaser.Sound.BaseSound;
  private comboCount = 1;
  private comboTimer!: Phaser.Time.TimerEvent;
  private comboThreshold = 1500; // 1.5 segundos
  private comboText!: Phaser.GameObjects.Text;
  private comboSound!: Phaser.Sound.BaseSound;
  private comboX5Sound!: Phaser.Sound.BaseSound;
  private logoColor!: Phaser.GameObjects.Image;

  private progressBar!: Phaser.GameObjects.Graphics
  private progressFrame!: Phaser.GameObjects.Image
  private progressTimer!: Phaser.Time.TimerEvent
  private eventObserver: EventObserver;
  private gameState: 'playing' | 'paused' | 'ended' = 'playing';
  private closeButton: CloseButton;

  preload() {
    this.load.image('progress-frame', 'assets/progress_bar_frame.png')
  }

  private getCandyPosition(row: number, col: number): { x: number; y: number } {
    const x = this.offsetX + col * (CANDY_WIDTH + GAP) + CANDY_WIDTH / 2
    const y = this.offsetY + row * (CANDY_HEIGHT + GAP) + CANDY_HEIGHT / 2
    return { x, y }
  }

  async createGrid() {
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
    await this.processMatches(); // ✅ evitar errores al iniciar
    }

    this.comboText.setY(this.offsetY - 50);
  }

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
    console.log("triyng swap");

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
        console.log("fuera de limites");
        this.selectedCandy.setScale(0.6); 
        return;
    }

    const areAdjacent = this.grid[targetRow][targetCol];
    if (!areAdjacent) {
        console.log("es adjacente");
        this.selectedCandy.setScale(0.6); 
        return;
    }

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
        // Si no hay match, revertir
        this.tweens.add({ targets: c1, x: c2.x, y: c2.y, duration: 200 });
        this.tweens.add({ targets: c2, x: c1.x, y: c1.y, duration: 200 });
        this.grid[row1][col1] = c1;
        this.grid[row2][col2] = c2;
        c1.setData('row', row1).setData('col', col1);
        c2.setData('row', row2).setData('col', col2);
        }

        this.movingCandiesInProcess = false;
    });
  }


  private getMatches(): Phaser.GameObjects.Sprite[] {
    const matches: Set<Phaser.GameObjects.Sprite> = new Set()

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
    const progress = Phaser.Math.Clamp(this.scoreValue / this.scoreGoal, 0, 1);
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
    const barWidth = 320
    const barHeight = 29
    const x = this.cameras.main.centerX - barWidth / 2
    const y = this.scale.height - 86
    const radius = 5;

    this.progressBar.clear()

    // Simula gradiente con color base sólido
    this.progressBar.fillStyle(0x3dc51f, 1)
    this.progressBar.fillRoundedRect(x, y, barWidth * progress, barHeight, radius);
  }

  private nextLevel() {
    this.currentLevelIndex++;
    if (this.currentLevelIndex >= LEVELS.length) {
        this.endGame(); // WIN
        return;
    }

    const newLevel = LEVELS[this.currentLevelIndex];
    this.scoreGoal = newLevel.goal;
    this.totalTime = newLevel.time;

    // Pausar lógica del juego
    this.gameState = 'paused';

    // Mostrar pantalla de nivel
    this.levelUpScreen.show(newLevel.level, newLevel.goal);
    this.levelUpSound.play();
    this.updateProgressBar(1);
    //console.log(`Nivel ${newLevel.level} iniciado. Meta: ${newLevel.goal}, Tiempo: ${newLevel.time}s`);

    // Esperar a que se cierre el popup y luego reiniciar el timer
    this.time.delayedCall(2700, async () => {
        this.progressTimer?.destroy();

        // Esperar a que se rellene completamente antes de continuar
        await this.refillGrid();

        this.progressTimer = this.time.addEvent({
            delay: this.totalTime * 1000,
            callback: () => this.endGame(),
        });

        this.gameState = 'playing';
    });
  }

  private endGame() {
    if (this.gameState === 'ended') return; 
    this.gameState = 'ended';
    this.movingCandiesInProcess = false

    this.progressTimer?.remove(false);

    if (this.scoreValue >= this.scoreGoal) {
        this.winnerScreen.show(prompt.win, "winner_screen");
        console.log('WIN');
    } else {
        console.log('ELSE');
        this.retryScreen.setFinalScore(this.scoreValue);
        this.retryScreen.show(prompt.retry, "prompt_screen");
    }
  }

  private removeMatches(matches: Phaser.GameObjects.Sprite[]) {
    //console.log("matches: ", matches);
    console.log("removematches");

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
            scale: 0,       // contraer completamente
            duration: 200,  // animación rápida
            ease: 'Back.easeIn', // animación con rebote hacia adentro
            onComplete: () => candy.destroy()
        });
    });

    this.lastMovedCandy = null; //limpiar caramelo seleccionado
 }

  private showComboX5Bonus(x: number, y: number) {
        this.comboX5Sound.play()
        const bonusImage = this.add.image(x, y, 'combo_x5_mogul').setScale(0.5).setDepth(20).setAlpha(0.9);

        this.tweens.add({
            targets: bonusImage,
            y: y - 45,
            x: this.scale.width / 2 - 18,
            alpha: 0,
            duration: 1300,
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
        duration: 800,
        ease: 'Cubic.easeOut'
    });
  }

  private dropCandies() {
    console.log("droppcandies");
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
    console.log("reffill");

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
            if (right.getData('type') !== currentType) {
            this.swapData(current, right)
            const matches = this.getMatches()
            this.swapData(current, right) // revertir
            if (matches.length > 0) return true
            }
        }

        // Verificamos abajo
        if (row < GRID_HEIGHT - 1) {
            const down = this.grid[row + 1][col]
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
        fontFamily: 'montserrat-memo',
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


  init(data: { levelIndex: number; score: number }) {
    this.currentLevelIndex = data.levelIndex ?? 0;
    this.scoreValue = data.score ?? 0;

    const level = LEVELS[this.currentLevelIndex];
    this.scoreGoal = level.goal;
    this.totalTime = level.time;
  }


  create() {
    this.gameState = 'playing';
    this.closeButton = new CloseButton(this);
    this.retryScreen = new RetryScreen(this)
    this.winnerScreen = new WinnerScreen(this)
    this.eventObserver = EventObserver.getInstance();
    this.levelUpScreen = new LevelUpScreen(this);
    this.levelUpSound = this.sound.add("level_up", { volume: 0.6, loop: false, });
    this.swapCandySound = this.sound.add("swap_candy");
    this.shuffleCandySound = this.sound.add("shuffle_candies");
const logoX = this.cameras.main.centerX;
const logoY = 100; // o cualquier valor fijo que prefieras

this.add.image(logoX, logoY, 'logo_mogul_white').setOrigin(0.5).setDepth(30);

this.logoColor = this.add.image(logoX, logoY, 'logo_mogul_color')
    .setOrigin(0.5)
    .setDepth(31)
    .setCrop(0, 0, 0, 60);


    this.comboSound = this.sound.add("combo_sound");
    this.comboX5Sound = this.sound.add("combo_x5_sound");
    this.comboText = this.add.text(this.cameras.main.centerX, this.scale.height / 2, '', {
    font: '48px montserrat-memo',
    color: '#FFD700',
    fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setAlpha(0)
    .setDepth(999);

    document.addEventListener('mouseup', this.handleGlobalMouseUp); //Detectar movimiento fuera del canvas

    const scoreImage = this.add.image(20, 16, 'score').setOrigin(0, 0)
    const scoreWidth = scoreImage.width;
    const scoreHeight = scoreImage.height;

    this.scoreText = this.add.text(20 + scoreWidth - 30, 17 + scoreHeight / 2, '0', {
        fontFamily: 'montserrat-memo',
        fontSize: '40px',
        color: '#FEC647',
        fontStyle: 'bold',
    })
    .setOrigin(1, 0.5)

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
      const progress = Phaser.Math.Clamp(1 - this.progressTimer.getElapsed() / this.progressTimer.delay, 0, 1)
      this.updateProgressBar(progress)
    })

    this.closeButton.create();
	this.eventObserver.on('button-clicked', (buttonId) => {
		ButtonEventHandler.handleButtonEvents(buttonId, this)
	}, this);

    Footer.create(this);
    this.createGrid()

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
    return this.scoreValue.toString();
  }
}
