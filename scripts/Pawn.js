export default class Pawn extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, sprite, owner)
	{
		super(scene, x, y, sprite);

		this.scene = scene;
		this.owner = owner;

		scene.add.image(x, y, sprite);


	}

	checkScore(tile, owner, bShouldReturnScore, fitnessObject)
	{
		this.scoreTemp = 1;

		this.potentialScore = 0;
		
		this.checkScoreLeft(tile.indexX, tile.indexY, owner);
		this.checkScoreRight(tile.indexX, tile.indexY, owner);
		this.sumScore(bShouldReturnScore, owner, tile);

		this.checkScoreUp(tile.indexX, tile.indexY, owner);
		this.checkScoreDown(tile.indexX, tile.indexY, owner);
		this.sumScore(bShouldReturnScore, owner, tile);

		this.checkScoreLeftUp(tile.indexX, tile.indexY, owner);
		this.checkScoreRightDown(tile.indexX, tile.indexY, owner);
		this.sumScore(bShouldReturnScore, owner, tile);

		this.checkScoreRightUp(tile.indexX, tile.indexY, owner);
		this.checkScoreLeftDown(tile.indexX, tile.indexY, owner);
		this.sumScore(bShouldReturnScore, owner, tile);

		if(owner.score > this.scene.score)
		{
			this.scene.score = owner.score;
			this.scene.scoreOwner = owner;
		}

		if(bShouldReturnScore)
		{
			//return owner.score;
			fitnessObject.score = this.potentialScore;
			fitnessObject.indexX = tile.indexX;
			fitnessObject.indexY = tile.indexY;

			return this.potentialScore;
		}
	}

	sumScore(bShouldReturnScore, owner, tile)
	{
		if(bShouldReturnScore)
		{
			if(this.scoreTemp > owner.predictedScore)
			{
				owner.predictedScore = this.bestScoreAI;
				owner.chosenTile = tile;
			}

			if(this.potentialScore < this.scoreTemp)
			{
				this.potentialScore = this.scoreTemp;
			}
		}
		else
		{
			if(this.scoreTemp > this.owner.score)
			{
				this.owner.score = this.scoreTemp;
			}
		}

		this.scoreTemp = 1;
	}

	checkScoreLeft(indexX, indexY, owner)
	{
		if(indexX > 0)
		{ 
			if((this.scene.boardArray[indexX - 1][indexY].pawn != null && this.scene.boardArray[indexX - 1][indexY].pawn.owner == owner) 
			|| this.scene.boardArray[indexX - 1][indexY].shadowPawn == true)
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
			if((this.scene.boardArray[indexX + 1][indexY].pawn != null && this.scene.boardArray[indexX + 1][indexY].pawn.owner == owner) 
			|| this.scene.boardArray[indexX + 1][indexY].shadowPawn == true)
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
			if((this.scene.boardArray[indexX][indexY - 1].pawn != null && this.scene.boardArray[indexX][indexY - 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX][indexY - 1].shadowPawn == true)
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
			if((this.scene.boardArray[indexX][indexY + 1].pawn != null && this.scene.boardArray[indexX][indexY + 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX][indexY + 1].shadowPawn == true)
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
			if((this.scene.boardArray[indexX - 1][indexY - 1].pawn != null && this.scene.boardArray[indexX - 1][indexY - 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX - 1][indexY - 1].shadowPawn == true)
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
			if((this.scene.boardArray[indexX + 1][indexY + 1].pawn != null && this.scene.boardArray[indexX + 1][indexY + 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX + 1][indexY + 1].shadowPawn == true)
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
			if((this.scene.boardArray[indexX + 1][indexY - 1].pawn != null && this.scene.boardArray[indexX + 1][indexY - 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX + 1][indexY - 1].shadowPawn == true)
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
			if((this.scene.boardArray[indexX - 1][indexY + 1].pawn != null && this.scene.boardArray[indexX - 1][indexY + 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX - 1][indexY + 1].shadowPawn == true)
			{
				this.scoreTemp++;
				this.checkScoreLeftDown(indexX - 1, indexY + 1, owner);
			}
		}
	}

	checkPotential(tile, owner, fitnessObject)
	{
		this.potential = 0;
		
		this.checkPotentialLeft(tile.indexX, tile.indexY, owner);
		this.checkPotentialRight(tile.indexX, tile.indexY, owner);

		this.checkPotentialUp(tile.indexX, tile.indexY, owner);
		this.checkPotentialDown(tile.indexX, tile.indexY, owner);

		this.checkPotentialLeftUp(tile.indexX, tile.indexY, owner);
		this.checkPotentialRightDown(tile.indexX, tile.indexY, owner);

		this.checkPotentialRightUp(tile.indexX, tile.indexY, owner);
		this.checkPotentialLeftDown(tile.indexX, tile.indexY, owner);

		this.sumPotential(owner, tile, fitnessObject);
	}

	sumPotential(owner, tile, fitnessObject)
	{
		fitnessObject.potential = this.potential;
	}
	
	checkPotentialLeft(indexX, indexY, owner)
	{
		if(indexX > 0)
		{ 
			if((this.scene.boardArray[indexX - 1][indexY].pawn != null && this.scene.boardArray[indexX - 1][indexY].pawn.owner == owner) 
			|| this.scene.boardArray[indexX - 1][indexY].shadowPawn == true || this.scene.boardArray[indexX - 1][indexY].pawn == null)
			{
				this.potential++;
				this.checkPotentialLeft(indexX - 1, indexY, owner);
			}
		}
	}

	checkPotentialRight(indexX, indexY, owner)
	{
		if(indexX < 6)
		{
			if((this.scene.boardArray[indexX + 1][indexY].pawn != null && this.scene.boardArray[indexX + 1][indexY].pawn.owner == owner) 
			|| this.scene.boardArray[indexX + 1][indexY].shadowPawn == true || this.scene.boardArray[indexX + 1][indexY].pawn == null) 
			{
				this.potential++;
				this.checkPotentialRight(indexX + 1, indexY, owner);
			}
		}
	}

	checkPotentialUp(indexX, indexY, owner)
	{
		if(indexY > 0)
		{ 
			if((this.scene.boardArray[indexX][indexY - 1].pawn != null && this.scene.boardArray[indexX][indexY - 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX][indexY - 1].shadowPawn == true || this.scene.boardArray[indexX][indexY - 1].pawn == null)
			{
				this.potential++;
				this.checkPotentialUp(indexX, indexY - 1, owner);
			}
		}
	}

	checkPotentialDown(indexX, indexY, owner)
	{
		if(indexY < 6)
		{ 
			if((this.scene.boardArray[indexX][indexY + 1].pawn != null && this.scene.boardArray[indexX][indexY + 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX][indexY + 1].shadowPawn == true || this.scene.boardArray[indexX][indexY + 1].pawn == null)
			{
				this.potential++;
				this.checkPotentialDown(indexX, indexY + 1, owner);
			}
		}
	}

	checkPotentialLeftUp(indexX, indexY, owner)
	{
		if(indexX > 0 && indexY > 0)
		{ 
			if((this.scene.boardArray[indexX - 1][indexY - 1].pawn != null && this.scene.boardArray[indexX - 1][indexY - 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX - 1][indexY - 1].shadowPawn == true || this.scene.boardArray[indexX - 1][indexY - 1].pawn == null)
			{
				this.potential++;
				this.checkPotentialLeftUp(indexX - 1, indexY - 1, owner);
			}
		}
	}

	checkPotentialRightDown(indexX, indexY, owner)
	{
		if(indexX < 6 && indexY < 6)
		{ 
			if((this.scene.boardArray[indexX + 1][indexY + 1].pawn != null && this.scene.boardArray[indexX + 1][indexY + 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX + 1][indexY + 1].shadowPawn == true || this.scene.boardArray[indexX + 1][indexY + 1].pawn == null)
			{
				this.potential++;
				this.checkPotentialRightDown(indexX + 1, indexY + 1, owner);
			}
		}
	}

	checkPotentialRightUp(indexX, indexY, owner)
	{
		if(indexX < 6 && indexY > 0)
		{ 
			if((this.scene.boardArray[indexX + 1][indexY - 1].pawn != null && this.scene.boardArray[indexX + 1][indexY - 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX + 1][indexY - 1].shadowPawn == true || this.scene.boardArray[indexX + 1][indexY - 1].pawn == null)
			{
				this.potential++;
				this.checkPotentialRightUp(indexX + 1, indexY - 1, owner);
			}
		}
	}

	checkPotentialLeftDown(indexX, indexY, owner)
	{
		if(indexX > 0 && indexY < 6)
		{ 
			if((this.scene.boardArray[indexX - 1][indexY + 1].pawn != null && this.scene.boardArray[indexX - 1][indexY + 1].pawn.owner == owner)
			|| this.scene.boardArray[indexX - 1][indexY + 1].shadowPawn == true || this.scene.boardArray[indexX - 1][indexY + 1].pawn == null)
			{
				this.potential++;
				this.checkPotentialLeftDown(indexX - 1, indexY + 1, owner);
			}
		}
	}
}

