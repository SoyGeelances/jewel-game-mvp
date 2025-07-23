export function applyButtonHoverEffect(button: Phaser.GameObjects.Image) {
  button.setInteractive({ useHandCursor: true });

  button.on('pointerover', () => {
    button.setScale(1.03); 
  });

  button.on('pointerout', () => {
    button.setScale(1);
  });
}
