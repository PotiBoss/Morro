import Pawn from "./Pawn";

export default class Tile extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, sprite)
	{
		super(scene, x, y, sprite);

		this.scene = scene;

		this.pawn = null;

		this.indexX = 0;
		this.indexY = 0;

		this.XOffset = 0;
		this.YOffset = 0;

		this.sprite = scene.add.image(x, y, sprite);

		this.sprite.on('pointerdown', () => {
			if(this.scene.numberOfAI == 1)
			{
				if(this.scene.bGameStarted == false) { return;}
				if(this.pawn == null && this.scene.player.numberOfMoves > 0)
				{
					this.pawn = new Pawn(this.scene, this.XOffset, this.YOffset, 'BluePawn', this.scene.player);
					this.scene.numberOfPawns++;
					this.scene.player.numberOfMoves--;
					this.pawn.checkScore(this, this.scene.player);
	
					if(this.scene.numberOfPawns == 49)
					{
						this.scene.gameOver();
					}
	
					if(this.scene.player.numberOfMoves == 0)
					{
						for(let i = 0; i < this.scene.score; i++)
						{
							this.scene.Ai.makeMove(this.scene.Ai); 
							this.scene.player.numberOfMoves = this.scene.score;
						}
					}
				}
			}

			else if(this.scene.numberOfAI == 0)
			{
				if(this.scene.bGameStarted == false) { return;}
				if(this.pawn == null && this.scene.player.numberOfMoves > 0)
				{
					this.pawn = new Pawn(this.scene, this.XOffset, this.YOffset, 'BluePawn', this.scene.player);
					this.scene.numberOfPawns++;
					this.scene.player.numberOfMoves--;
					this.pawn.checkScore(this, this.scene.player);

					if(this.scene.numberOfPawns == 49)
					{
						this.scene.gameOver();
					}
	
					if(this.scene.player.numberOfMoves == 0)
					{
						this.scene.turnText.destroy();
						this.scene.turnText = this.scene.add.text(585, 325, this.scene.player2.name + ' turn').setFontSize(32);
						this.scene.player2.numberOfMoves = this.scene.score;
					}
				}
				else if(this.pawn == null && this.scene.player2.numberOfMoves > 0)
				{
					this.pawn = new Pawn(this.scene, this.XOffset, this.YOffset, 'RedPawn', this.scene.player2);
					this.scene.numberOfPawns++;
					this.scene.player2.numberOfMoves--;
					this.pawn.checkScore(this, this.scene.player2);

					if(this.scene.numberOfPawns == 49)
					{
						this.scene.gameOver();
					}
	
					if(this.scene.player2.numberOfMoves == 0)
					{
						this.scene.turnText.destroy();
						this.scene.turnText = this.scene.add.text(585, 325, this.scene.player.name + ' turn').setFontSize(32);
						this.scene.player.numberOfMoves = this.scene.score;
					}
				}
			}
		});
	}
}

