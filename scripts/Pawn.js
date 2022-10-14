export default class Pawn extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, sprite, owner)
	{
		super(scene, x, y, sprite);

		this.scene = scene;
		this.owner = owner;

		scene.add.image(x, y, sprite);

	}

	checkScore(tile, owner)
	{
		this.scoreTemp = 1;
		
		this.checkScoreLeft(tile.indexX, tile.indexY, owner);
		this.checkScoreRight(tile.indexX, tile.indexY, owner);
		this.sumScore();

		this.checkScoreUp(tile.indexX, tile.indexY, owner);
		this.checkScoreDown(tile.indexX, tile.indexY, owner);
		this.sumScore();

		this.checkScoreLeftUp(tile.indexX, tile.indexY, owner);
		this.checkScoreRightDown(tile.indexX, tile.indexY, owner);
		this.sumScore();

		this.checkScoreRightUp(tile.indexX, tile.indexY, owner);
		this.checkScoreLeftDown(tile.indexX, tile.indexY, owner);
		this.sumScore();

		if(owner.score > this.scene.score)
		{
			this.scene.score = owner.score;
			this.scene.scoreOwner = owner;
		}
	}

	sumScore()
	{
		if(this.scoreTemp > this.owner.score)
		{
			this.owner.score = this.scoreTemp;
		}
		this.scoreTemp = 1;
	}

	checkScoreLeft(indexX, indexY, owner)
	{
		if(indexX > 0)
		{ 
			if(this.scene.boardArray[indexX - 1][indexY].pawn != null && this.scene.boardArray[indexX - 1][indexY].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreLeft(indexX - 1, indexY, owner);
			}
		}
	}

	checkScoreRight(indexX, indexY, owner)
	{
		if(indexX < 6)
		{
			if(this.scene.boardArray[indexX + 1][indexY].pawn != null && this.scene.boardArray[indexX + 1][indexY].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreRight(indexX + 1, indexY, owner);
			}
		}
	}

	checkScoreUp(indexX, indexY, owner)
	{
		if(indexY > 0)
		{ 
			if(this.scene.boardArray[indexX][indexY - 1].pawn != null && this.scene.boardArray[indexX][indexY - 1].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreUp(indexX, indexY - 1, owner);
			}
		}
	}

	checkScoreDown(indexX, indexY, owner)
	{
		if(indexY < 6)
		{ 
			if(this.scene.boardArray[indexX][indexY + 1].pawn != null && this.scene.boardArray[indexX][indexY + 1].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreDown(indexX, indexY + 1, owner);
			}
		}
	}

	checkScoreLeftUp(indexX, indexY, owner)
	{
		if(indexX > 0 && indexY > 0)
		{ 
			if(this.scene.boardArray[indexX - 1][indexY - 1].pawn != null && this.scene.boardArray[indexX - 1][indexY - 1].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreLeftUp(indexX - 1, indexY - 1, owner);
			}
		}
	}

	checkScoreRightDown(indexX, indexY, owner)
	{
		if(indexX < 6 && indexY < 6)
		{ 
			if(this.scene.boardArray[indexX + 1][indexY + 1].pawn != null && this.scene.boardArray[indexX + 1][indexY + 1].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreRightDown(indexX + 1, indexY + 1, owner);
			}
		}
	}

	checkScoreRightUp(indexX, indexY, owner)
	{
		if(indexX < 6 && indexY > 0)
		{ 
			if(this.scene.boardArray[indexX + 1][indexY - 1].pawn != null && this.scene.boardArray[indexX + 1][indexY - 1].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreRightUp(indexX + 1, indexY - 1, owner);
			}
		}
	}

	checkScoreLeftDown(indexX, indexY, owner)
	{
		if(indexX > 0 && indexY < 6)
		{ 
			if(this.scene.boardArray[indexX - 1][indexY + 1].pawn != null && this.scene.boardArray[indexX - 1][indexY + 1].pawn.owner == owner)
			{
				this.scoreTemp++;
				this.checkScoreLeftDown(indexX - 1, indexY + 1, owner);
			}
		}
	}
}

