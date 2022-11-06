import Pawn from "./Pawn";


export default class AI 
{
	constructor(scene, pawn, name)
	{
		this.scene = scene;

		this.name = name

		this.pawn = pawn

		this.score = 0;

		this.chosenTile = null;

		this.fitnessArray = [];
	}

	makeMove(Ai)
	{
		switch(this.scene.AIType)
		{
			case 0:
				this.makeMoveRandom(Ai);
				break;
			case 1: 
				this.makeMoveMiniMax(Ai);
				break;
			default:
				this.makeMoveRandom(Ai);
				break;
		}
	}

	makeMoveRandom(Ai)
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
			this.makeMoveRandom(Ai);
		}
		else
		{
			this.scene.gameOver();
		}
	}

	makeMoveMiniMax(Ai)
	{
		if(Ai == this.scene.AiPlayer)
		{
			this.minimax(Ai, this.scene.score, true);
		}
		else if(Ai == this.scene.Ai)
		{
			this.minimax(Ai, this.scene.score, false);
		}
		

		this.fitnessArray.sort(function(a,b){
			return b.fitness - a.fitness;
		});


		var cleanedArray = this.fitnessArray.filter(function(value, index, arr){

			return value.fitness >= arr[0].fitness;

		});
		this.addPawn(cleanedArray, Ai);
	}

	addPawn(cleanedArray, Ai)
	{

		if(this.fitnessArray.length < 1) { 
			this.makeMoveRandom(this);
			return;
		}

		if(cleanedArray != undefined)
		{
			var randomItem = Math.floor(Math.random()*cleanedArray.length);
			this.chosenTile = this.scene.boardArray[cleanedArray[randomItem].indexY][cleanedArray[randomItem].indexX];
		}
		else
		{
			this.chosenTile = this.scene.boardArray[this.fitnessArray[0].indexY][this.fitnessArray[0].indexX];
		}
		

		if(this.chosenTile.pawn != null)
		{
			this.fitnessArray.shift();
			this.addPawn();
			return;
		}

		this.fitnessArray = [];


		if(this.chosenTile != null && Ai == this.scene.AiPlayer)
		{
			this.chosenTile.pawn = new Pawn(this.scene, this.chosenTile.XOffset, this.chosenTile.YOffset, 'BluePawn', this.scene.AiPlayer);
			this.scene.numberOfPawns++;
			this.chosenTile.pawn.checkScore(this.chosenTile, this.scene.AiPlayer);
		}
		
		else if(this.chosenTile != null && Ai == this.scene.Ai)
		{
			this.chosenTile.pawn = new Pawn(this.scene, this.chosenTile.XOffset, this.chosenTile.YOffset, 'RedPawn', this.scene.Ai);
			this.scene.numberOfPawns++;
			this.chosenTile.pawn.checkScore(this.chosenTile, this.scene.Ai);
		}
	}

	minimax(Ai, depth, bIsMaximizingPlayer)
	{
		if(this.scene.numberOfPawns > 48)
		{
			this.scene.gameOver();
			//return;
		}

		if(depth == 0)
		{
			return;
		}

		if(bIsMaximizingPlayer)
		{
			this.value = -Infinity;

			this.scene.boardArray.forEach(element => {
				this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {
					if(this.scene.boardArray[element2.indexY][element2.indexX].pawn != null) 
					{ 
						return; 
					}
					this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn = true;
					this.checkPointsForPlayer(true, element2.indexY, element2.indexX);
					//this.minimax(5, depth - 1, bIsMaximizingPlayer);
					this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn = false;
				});
			});
		}
		else
		{
			this.value = Infinity;

			this.scene.boardArray.forEach(element => {
				this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {
					if(this.scene.boardArray[element2.indexY][element2.indexX].pawn != null) 
					{ 
						return; 
					}
			
					this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn = true;
					this.checkPointsForPlayer(false, element2.indexY, element2.indexX);
					//this.minimax(5, depth - 1, bIsMaximizingPlayer);
					this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn = false;
				});
			});
		}
	}

	checkPointsForPlayer(bIsMaximizingPlayer, indexY, indexX)
	{
		this.predictedScore = 0;

	/*	if(bIsMaximizingPlayer)
		{
			this.dummyPawn = new Pawn(this.scene, -100, -100, 'BluePawn', this.scene.AiPlayer);

			var fitnessObject =
			{
				fitness: 0,
				score:  0,
				indexX: 0,
				indexY: 0,
				potential: 0, // means potential for future turns aka how many empty or taken by the same player tiles are near
			}

			this.dummyPawn.checkScore(this.scene.boardArray[indexY][indexX], this.scene.AiPlayer, true, fitnessObject);
			this.dummyPawn.checkPotential(this.scene.boardArray[indexY][indexX], this.scene.AiPlayer, fitnessObject);

			fitnessObject.fitness = fitnessObject.score * 10 + fitnessObject.potential;

			this.fitnessArray.push(fitnessObject);
			//console.log(this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.AiPlayer, true));
			this.dummyPawn.destroy();
		}
	/*	 else
		{
			this.dummyPawn = new Pawn(this.scene, -100, -100, 'RedPawn', this.scene.Ai);

			var fitnessObject =
			{
				fitness: 0,
				score:  0,
				indexX: 0,
				indexY: 0,
				potential: 0, // means potential for future turns aka how many empty or taken by the same player tiles are near
			}

			this.dummyPawn.checkScore(this.scene.boardArray[indexY][indexX], this.scene.Ai, true, fitnessObject);
			this.dummyPawn.checkPotential(this.scene.boardArray[indexY][indexX], this.scene.Ai, fitnessObject);

			fitnessObject.fitness = fitnessObject.score * 10 + fitnessObject.potential;

			this.fitnessArray.push(fitnessObject);
			//console.log(this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.AiPlayer, true));
			this.dummyPawn.destroy();
		}
		
		
		*/
		if(false){}
		else
		{
			this.scene.boardArray.forEach(element => {
				this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {
					if(this.scene.boardArray[element2.indexY][element2.indexX].pawn == null || this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn == true)
					{
						this.dummyPawn = new Pawn(this.scene, -100, -100, 'RedPawn', this.scene.Ai);
						var fitnessObject =
						{
							fitness: 0,
							score:  0,
							indexX: 0,
							indexY: 0,
							potential: 0, // means potential for future turns aka how many empty or taken by the same player tiles are near
						}

				//		this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.Ai, true, fitnessObject);
						this.dummyPawn.checkPotential(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.Ai, fitnessObject);

						fitnessObject.fitness = fitnessObject.score * 10 + fitnessObject.potential;

						this.fitnessArray.push(fitnessObject);
						//console.log(this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.AiPlayer, true));
						this.dummyPawn.destroy();
					}
				});
			});
		}

		if(bIsMaximizingPlayer)
		{
			this.scene.boardArray.forEach(element => {
				this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {
					if(this.scene.boardArray[element2.indexY][element2.indexX].pawn == null || this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn == true)
					{
						this.dummyPawn = new Pawn(this.scene, -100, -100, 'BluePawn', this.scene.AiPlayer);

						var fitnessObject =
						{
							fitness: 0,
							score:  0,
							indexX: 0,
							indexY: 0,
							potential: 0, // means potential for future turns aka how many empty or taken by the same player tiles are near
						}

					//	this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.AiPlayer, true, fitnessObject);
						this.dummyPawn.checkPotential(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.AiPlayer, fitnessObject);

						fitnessObject.fitness = fitnessObject.score * 10 + fitnessObject.potential;

						this.fitnessArray.push(fitnessObject);
						//console.log(this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.AiPlayer, true));
						this.dummyPawn.destroy();
					}
				});
			});
		}
	}
}