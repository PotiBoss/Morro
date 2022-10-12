import Pawn from "./Pawn";


export default class AI 
{
	constructor(scene)
	{
		this.scene = scene;
	}

	makeMove()
	{
		let randomTileX = Math.floor(Math.random() * 7);
		let randomTileY = Math.floor(Math.random() * 7);

		if(this.scene.boardArray[randomTileX][randomTileY].pawn == null)
		{
			this.tile = this.scene.boardArray[randomTileX][randomTileY];

			this.tile.pawn = new Pawn(this.scene, this.tile.XOffset, this.tile.YOffset, 'RedPawn');

			this.scene.numberOfPawns++;
		}
		else if(this.scene.numberOfPawns < 49)
		{
			this.makeMove();
		}
		else
		{
			console.log('gameover');
		}
	}
}