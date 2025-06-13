import Phaser from 'phaser'
import GameScene from './GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 700,
  height: window.innerHeight,
  backgroundColor: '#222',
  parent: "content",
  title: "Juego de jewel mvp",
  scene: [GameScene],
}

new Phaser.Game(config)
