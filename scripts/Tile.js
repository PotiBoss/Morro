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
			if(this.pawn == null)
			{
				this.pawn = new Pawn(this.scene, this.XOffset, this.YOffset, 'BluePawn', this.scene.player);

				this.pawn.checkScore(this, this.pawn.owner);

				this.scene.numberOfPawns++;

				//this.scene.AI.makeMove(); 
			}
		});
	}
}

