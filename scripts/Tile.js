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
		});
	}
}

