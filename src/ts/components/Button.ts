
import { promptActions } from "../types"
import { EventObserver } from "../observer";

export class Button {
    private button: Phaser.GameObjects.Image;
	  eventObserver: EventObserver;
    
    constructor(
        private scene: Phaser.Scene,         // La escena actual de Phaser
        private x: number,                   // Coordenada X
        private y: number,                   // Coordenada Y
        private action: promptActions,
        private scaleX: number = 1,
        private scaleY: number = 1,    
    ) {
		 this.eventObserver =  EventObserver.getInstance();
    }

    public createButton(): Phaser.GameObjects.Image {
        this.button = this.scene.add.image(this.x, this.y, this.action.background)
        .setInteractive()
        .on('pointerdown', (e) => {
            // this.pressButtonEffect();
            this.eventObserver.emit('button-clicked', this.action.eventName);
        })
        .on('pointerup', () => {
            this.releaseButtonEffect();
        })
        .on('pointerout', () => {
            this.button.setTint(0xffffff);
            this.releaseButtonEffect();
        })
        .setOrigin(0.5, 0.5)
        .setDepth(100)
        .setScale(this.scaleX, this.scaleY);

        return this.button;
    }

    private pressButtonEffect(): void {
        this.scene.tweens.add({
          targets: this.button,
          scaleX: this.scaleX * 0.9,  // Reduce la escala en el eje X
          scaleY: this.scaleY * 0.9,  // Reduce la escala en el eje Y
          duration: 100,
          ease: 'Power1'
        });
      }
    
      private releaseButtonEffect(): void {
        this.scene.tweens.add({
          targets: this.button,
          scaleX: this.scaleX,  // Vuelve a la escala original en el eje X
          scaleY: this.scaleY,  // Vuelve a la escala original en el eje Y
          duration: 300,
          ease: 'Power1'
        });
      }

    public destroy(): void {
        this.button.destroy();
    }
}
