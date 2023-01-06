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

	makeMove(Ai, OtherAi)
	{
		switch(this.scene.AIType)
		{
			case 0:
				this.makeMoveRandom(Ai);
				break;
			case 1: 
				this.makeMoveMiniMax(Ai);
				break;
			case 2:
				this.makeMoveNegaMax(Ai);
				break;
			case 3:
				this.makeMoveAB(Ai);
				break;
			case 4:
				this.makeMoveAB(Ai);
				break;
			case 5:
				this.makeMoveNegaMax(Ai);
				break;
				this.makeMoveMCTS(Ai, OtherAi);
			default:
				this.makeMoveRandom(Ai);
				break;
		}
	}


	makeMoveMCTS(Ai, OtherAi)
	{
		

		// We start with saving current board state and add new node to our Tree structure
		var nodeArray = [];
		var boardStateArray = [];
		this.MCTSTree.add(nodeArray);

		this.scene.boardArray.forEach(element => {
			this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {

				if(element2.pawn == null)
				{
					nodeArray.push(element2);
				}
			});
		});

		// Then we randomly choose tiles to play our move
		var chosenNodes = [];
		for(let i = 0; i < this.scene.score; i++)
		{
			chosenNodes.push(nodeArray[Math.floor(Math.random() * nodeArray.length)]);
			boardStateArray.push(nodeArray[Math.floor(Math.random() * nodeArray.length)]);

			var chosenNodeIndex = this.MCTSTree.length - 1;
		}

		chosenNodes.forEach(element => {
			element.pawn = new Pawn(this.scene, element.XOffset, element.YOffset, this.pawn, this);
		});

		// We start random game simulation
		this.scene.MCTSAITurn(Ai, OtherAi);

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
		else if(this.scene.numberOfPawns < 48)
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

	makeMoveNegaMax(Ai)
	{
		if(Ai == this.scene.AiPlayer)
		{
			this.negamax(Ai, this.scene.score, 1);
		}
		else if(Ai == this.scene.Ai)
		{
			this.negamax(Ai, this.scene.score, 1);
		}
		
		this.fitnessArray.sort(function(a,b){
			return b.fitness - a.fitness;
		});


		var cleanedArray = this.fitnessArray.filter(function(value, index, arr){

			return value.fitness >= arr[0].fitness;

		});
		this.addPawn(cleanedArray, Ai);
	}

	makeMoveAB(Ai)
	{
		if(Ai == this.scene.AiPlayer)
		{
			this.minimaxAB(Ai, this.scene.score, true);
		}
		else if(Ai == this.scene.Ai)
		{
			this.minimaxAB(Ai, this.scene.score, false);
		}
		

		this.fitnessArray.sort(function(a,b){
			return b.fitness - a.fitness;
		});


		var cleanedArray = this.fitnessArray.filter(function(value, index, arr){

			return value.fitness >= arr[0].fitness;

		});
		this.addPawn(cleanedArray, Ai);
	}

	makeMoveMCS(Ai)
	{
		numberOfSimulations = 10;

		this.bestChild = null;
		this.bestProbability = -1;

		this.scene.boardArray.forEach(element => {
			this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {
				let r = 0;
				let child = element2;

				let currentSimulationTable = [];

				for (let i = 0; i < numberOfSimulations; i++) {
					if (this.scene.AiPlayer.score < 7 && this.scene.Ai.score < 7) {
						child = this.MCSRandomMove(Ai, currentSimulationTable);
					}

					if (this.child.scoreOwner == Ai) {
						r++
					}

					let probability = r / numberOfSimulations

					if (probability > this.bestProbability) {
						this.bestChild = child;
						this.bestProbability = probability;
					}
				}
				return this.bestChild;
			});
		});
	}

	MCSRandomMove(Ai, currentSimulationTable)
	{
		let randomTileX = Math.floor(Math.random() * 7);
		let randomTileY = Math.floor(Math.random() * 7);

		if(this.scene.boardArray[randomTileX][randomTileY].pawn == null)
		{
			this.tile = this.scene.boardArray[randomTileX][randomTileY].shadowPawn = true;

			currentSimulationTable.push(this.tile);

			this.tile.checkScore(Ai, true);
		}
		else
		{
			this.MCSRandomMove(Ai, currentSimulationTable);
		}
	}

	negamax(Ai, depth, sign = 1)
	{
		if(this.scene.numberOfPawns > 48)
		{
			this.scene.gameOver();
			return;
		}
		if(depth == 0)
		{
			return;
		}

		this.value = -Infinity;
		this.scene.boardArray.forEach(element => {
			this.scene.boardArray[this.scene.boardArray.indexOf(element)].forEach(element2 => {
				if(this.scene.boardArray[element2.indexY][element2.indexX].pawn != null) 
				{ 
					return; // dont check already occupied tiles
				}
				this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn = true;
				this.checkPointsForPlayer(true, element2.indexY, element2.indexX);
				//this.negamax(Ai, depth - 1, -sign);
				this.scene.boardArray[element2.indexY][element2.indexX].shadowPawn = false;
			});
		});
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

	minimaxAB(Ai, depth, bIsMaximizingPlayer, alpha = -Infinity, beta = Infinity)
	{
		if(this.scene.numberOfPawns > 48)
		{
			this.scene.gameOver();
			//return;
		}

	
		if(depth == 0)
		{
			return Ai;
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
					if(this.scene.numberOfPawns < 100) {return;}
				

					alpha = Math.max(alpha, this.minimaxAB(this.scene.boardArray[element2.indexY][element2.indexX], depth - 1,
						alpha, beta, false));
						if(alpha >= beta)
						{
							return beta;
						}
						return alpha;
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
					if(this.scene.numberOfPawns < 100) {return;}
				

					beta = Math.min(alpha, this.minimaxAB(this.scene.boardArray[element2.indexY][element2.indexX], depth - 1,
						alpha, beta, true));
						if(alpha >= beta)
						{
							return alpha;
						}
						return beta;
				});
			});
		}
	}

	checkPointsForPlayer(bPlayer, indexY, indexX)
	{
		this.predictedScore = 0;

		if(!bPlayer)
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

					//	this.dummyPawn.checkScore(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.Ai, true, fitnessObject);
						this.dummyPawn.checkPotential(this.scene.boardArray[element2.indexY][element2.indexX], this.scene.Ai, fitnessObject);

						fitnessObject.fitness = fitnessObject.score * 10 + fitnessObject.potential;
 
						this.fitnessArray.push(fitnessObject);
						this.dummyPawn.destroy();
					}
				});
			});
		}

		if(bPlayer)
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
						this.dummyPawn.destroy();
					}
				});
			});
		}
	}
}