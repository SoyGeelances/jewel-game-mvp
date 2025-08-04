
import { Footer } from "../components/Footer";
import { promptContentConfig } from "../types";
import { PromptScreen } from "./PromptScreen";

export class RetryScreen  {
  private prompt: PromptScreen;
  private finalScore: Phaser.GameObjects.Image;
  private finalScoreText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
  ) {
    this.prompt = new PromptScreen(scene);
  }

  addMask() {
    this.prompt.addMask();
  }

  show(promptContent: promptContentConfig, promptType: string, showPromoText: boolean = true) {
    this.prompt.setBackground(promptType, 0, 0, 1, 1);
    this.prompt.setTitle(promptContent.title, 0, -115, 1, 1);
    if (showPromoText) {
        document.fonts.load('14px "Open Sans"').then(() => {
            this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 30,
                "Estás cada vez más cerca de tu\nCupón de Descuento 🎉",
                {
                fontFamily: 'Open Sans',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 4,
                }
            )
            .setOrigin(0.5, 0.5)
            .setDepth(11);
        });
    }
    this.prompt.setActions(promptContent.actions, 0, 25, 55, 1, 1);
    this.scene.sound.add('retry').play();
  }


  public setFinalScore(scoreValue) {
    this.prompt.setSplashBackground();
    this.finalScore = this.scene.add.image(this.scene.cameras.main.centerX, 60, "final_score")
    .setScale(1, 1)
    .setDepth(110)
    .setOrigin(0.5, 0.5);

    this.finalScoreText = this.scene.add.text(
      this.scene.cameras.main.centerX + 135 + 20,
      55,
      scoreValue,
      {
        font: "40px 'Luckiest Guy'",
        color: "#E2D64B",
      }
    )
    .setDepth(110)
    .setOrigin(1, 0.5);

  }

  hide(): void {
    this.prompt.hide();
  }
}
