import Phaser from 'phaser'

const GRID_WIDTH = 5
const GRID_HEIGHT = 6

export default class GameScene extends Phaser.Scene {
  private grid: Phaser.GameObjects.Image[][] = []
  private selectedCandy: Phaser.GameObjects.Sprite | null = null

  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.spritesheet('candies', '/assets/candiesx6.png', { frameWidth: 98, frameHeight: 101 })
  }

  create() {
    this.createGrid()
  }

  createGrid() {
    const CANDY_WIDTH = 98
    const CANDY_HEIGHT = 101

    for (let row = 0; row < GRID_HEIGHT; row++) {
        this.grid[row] = []

        for (let col = 0; col < GRID_WIDTH; col++) {
        const candyType = Phaser.Math.Between(0, 5) // del 0 al 5 (6 tipos)
        //const candyType = (row === 0 && col < 3) ? 1 : Phaser.Math.Between(0, 5)  //forzá una fila de 3 iguales

        const x = col * CANDY_WIDTH + CANDY_WIDTH / 2 + 100
        const y = row * CANDY_HEIGHT + CANDY_HEIGHT / 2 + 100

        const candy = this.add.sprite(x, y, 'candies', candyType)
        candy.setData('type', candyType)
        candy.setData('row', row)
        candy.setData('col', col)

        this.grid[row][col] = candy
        candy.setInteractive()
        candy.on('pointerdown', () => this.handleCandyClick(candy))
        }
    }
  }

  private handleCandyClick(candy: Phaser.GameObjects.Sprite) {
    if (!this.selectedCandy) {
        // Primer clic: seleccionamos este caramelo
        this.selectedCandy = candy
        candy.setScale(1.1) // Lo agrandamos visualmente
    } else {
        // Segundo clic: intercambiamos o reseteamos selección
        const prevCandy = this.selectedCandy
        prevCandy.setScale(1) // restauramos tamaño

        if (prevCandy !== candy) {
        // Aquí más adelante verificaremos si es movimiento válido
        //console.log('Intercambiar:', prevCandy.getData('row'), prevCandy.getData('col'), '<->',candy.getData('row'), candy.getData('col')).
            if (this.areAdjacent(prevCandy, candy)) {
                this.swapCandies(prevCandy, candy)
                
            } else {
                console.log('No son adyacentes')
            }
        }

        this.selectedCandy = null // reiniciamos selección
    }
  }

  private areAdjacent(c1: Phaser.GameObjects.Sprite, c2: Phaser.GameObjects.Sprite): boolean {
    const row1 = c1.getData('row')
    const col1 = c1.getData('col')
    const row2 = c2.getData('row')
    const col2 = c2.getData('col')

    const isNextTo = (Math.abs(row1 - row2) === 1 && col1 === col2) ||
                    (Math.abs(col1 - col2) === 1 && row1 === row2)

    return isNextTo
  }

  private swapCandies(c1: Phaser.GameObjects.Sprite, c2: Phaser.GameObjects.Sprite) {
    const row1 = c1.getData('row')
    const col1 = c1.getData('col')
    const row2 = c2.getData('row')
    const col2 = c2.getData('col')
    
    // Animación visual (puedes usar .setPosition si no quieres animar)
    this.tweens.add({
        targets: c1,       // El sprite que queremos mover (caramelo 1)
        x: c2.x,           // Nueva posición en X: la del caramelo 2
        y: c2.y,           // Nueva posición en Y: la del caramelo 2
        duration: 200      // Tiempo que dura la animación: 200 milisegundos (0.2 segundos)
    })

    this.tweens.add({
        targets: c2,
        x: c1.x,
        y: c1.y,
        duration: 200
    })
    
    // Intercambio lógico en la grilla
    this.grid[row1][col1] = c2
    this.grid[row2][col2] = c1

    // Actualizar los datos de posición
    c1.setData('row', row2)
    c1.setData('col', col2)
    c2.setData('row', row1)
    c2.setData('col', col1)

    this.time.delayedCall(250, () => {
        const matches = this.getMatches()
            if (matches.length > 0) {
                console.log('MATCH FOUND:', matches.length, 'caramelos')
                this.removeMatches(matches)

                this.time.delayedCall(300, () => {
                this.dropCandies()

                this.time.delayedCall(300, () => {
                    this.refillGrid()
                })
                })
            } else {
                console.log('No hay combinaciones')
            }
    })
  }

  private getMatches(): Phaser.GameObjects.Sprite[] {
    const matches: Set<Phaser.GameObjects.Sprite> = new Set()

    // Detectar combinaciones horizontales
    for (let row = 0; row < GRID_HEIGHT; row++) {
        let match: Phaser.GameObjects.Sprite[] = []

        for (let col = 0; col < GRID_WIDTH; col++) {
        const current = this.grid[row][col]
        const prev = col > 0 ? this.grid[row][col - 1] : null

        if (prev && current.getData('type') === prev.getData('type')) {
            match.push(current)
            if (match.length === 1) {
            match.unshift(prev)
            }
        } else {
            if (match.length >= 3) {
            match.forEach(c => matches.add(c))
            }
            match = []
        }
        }
        if (match.length >= 3) {
        match.forEach(c => matches.add(c))
        }
    }

    // Detectar combinaciones verticales
    for (let col = 0; col < GRID_WIDTH; col++) {
        let match: Phaser.GameObjects.Sprite[] = []

        for (let row = 0; row < GRID_HEIGHT; row++) {
        const current = this.grid[row][col]
        const prev = row > 0 ? this.grid[row - 1][col] : null

        if (prev && current.getData('type') === prev.getData('type')) {
            match.push(current)
            if (match.length === 1) {
            match.unshift(prev)
            }
        } else {
            if (match.length >= 3) {
            match.forEach(c => matches.add(c))
            }
            match = []
        }
        }
        if (match.length >= 3) {
        match.forEach(c => matches.add(c))
        }
    }

    return Array.from(matches)
  }

  private removeMatches(matches: Phaser.GameObjects.Sprite[]) {
    matches.forEach(candy => {
        const row = candy.getData('row')
        const col = candy.getData('col')

        // Eliminar visualmente
        candy.destroy()

        // Eliminar de la grilla lógica
        this.grid[row][col] = null
    })
  }

  private dropCandies() {
    for (let col = 0; col < GRID_WIDTH; col++) {
        for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
            if (this.grid[row][col] === null) {
                // Buscar el caramelo más cercano arriba
                for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                const candyAbove = this.grid[aboveRow][col]
                    if (candyAbove) {
                        // Moverlo visualmente
                        const newY = row * 101 + 101 / 2 + 100
                        this.tweens.add({
                        targets: candyAbove,
                        y: newY,
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

  private refillGrid() {
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (!this.grid[row][col]) {
                const candyType = Phaser.Math.Between(0, 5)
                const x = col * 98 + 98 / 2 + 100
                const y = row * 101 + 101 / 2 + 100
                const candy = this.add.sprite(x, y - 150, 'candies', candyType) // aparece desde arriba
                candy.setData('type', candyType)
                candy.setData('row', row)
                candy.setData('col', col)
                candy.setInteractive()
                candy.on('pointerdown', () => this.handleCandyClick(candy))

                this.grid[row][col] = candy

                // animar caída
                this.tweens.add({
                    targets: candy,
                    y: y,
                    duration: 300
                })
            }
        }
    }
  }
}
