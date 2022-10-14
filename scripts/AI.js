import Pawn from "./Pawn";


export default class AI 
{
	constructor(scene, pawn, name)
	{
		this.scene = scene;

		this.name = name

		this.pawn = pawn

		this.score = 0;
	}

	makeMove(Ai)
	{
		let randomTileX = Math.floor(Math.random() * 7);
		let randomTileY = Math.floor(Math.random() * 7);

		if(this.scene.boardArray[randomTileX][randomTileY].pawn == null)
		{
			this.tile = this.scene.boardArray[randomTileX][randomTileY];

			this.tile.pawn = new Pawn(this.scene, this.tile.XOffset, this.tile.YOffset, this.pawn, this);

			this.tile.pawn.checkScore(this.tile, Ai);

			this.scene.numberOfPawns++;
		}
		else if(this.scene.numberOfPawns < 49)
		{
			this.makeMove(Ai);
		}
		else
		{
			this.scene.gameOver();
		}
	}
}