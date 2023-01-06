import Phaser from 'phaser';
import Tile from "./Tile";
import AI from "./AI";
import Player from "./Player";

export default class SceneGame extends Phaser.Scene 
{

	// 64 every tile
	// 14 offset 
	// 5 to center pawn 


	/* enum
		0 = random
		1 = minimax
		2 = negamax
		3 = ab
		4 = MCS
		5 = MCTS
	*/

	constructor()
	{
		super("SceneGame");
	}

	preload() 
	{
        this.load.image('BGN', 'src/assets/Background.png');
        this.load.image('WhiteTile', 'src/assets/BialaKratka.png');
        this.load.image('BlackTile', 'src/assets/CzarnaKratka.png');
        this.load.image('Grid', 'src/assets/Krata.png');
        this.load.image('BluePawn', 'src/assets/KropkaBlue.png');
        this.load.image('RedPawn', 'src/assets/KropkaRed.png');
		this.load.image('PvP', 'src/assets/PvP.png');
		this.load.image('PvAi', 'src/assets/PvAi.png');
		this.load.image('AivAi', 'src/assets/AivAi.png');
		this.load.image('Random', 'src/assets/Random.png');
		this.load.image('Minimax', 'src/assets/Minimax.png');
		this.load.image('negamax', 'src/assets/negamax.png');
		this.load.image('AB', 'src/assets/AB.png');
		this.load.image('MCS', 'src/assets/MCS.png');
		this.load.image('MCTS', 'src/assets/MCTS.png');
	}

	create() 
	{   
        this.add.image(0, 0, "BGN").setScale(5);
   		this.add.image(0, 0, "Grid").setOrigin(0, 0);

		this.bGameStarted = false;
		this.gameOverText = null;
		this.depthText = null;
		this.branchingText = null;

		this.AIType = 5;
		
		this.timerArray = [];

		this.PvP = this.add.image(700, 50, 'PvP').setInteractive();
		this.PvP.on('pointerdown', () => {
			this.bGameStarted = true;
			this.numberOfAI = 0;
			this.startGame(0);
		});

		this.PvAI = this.add.image(700, 150, 'PvAi').setInteractive();
		this.PvAI.on('pointerdown', () => {
			this.bGameStarted = true;

			this.numberOfAI = 1;
			this.startGame(1);
		});

		this.AIvAI = this.add.image(700, 250, 'AivAi').setInteractive();
		this.AIvAI.on('pointerdown', () => {
			this.bGameStarted = true;
			this.AIDelay = false;
			this.numberOfAI = 2;
			this.startGame(2);
		});

		this.AIvAIDelay = this.add.image(850, 250, 'AivAi').setInteractive();
		this.AIvAIDelay.on('pointerdown', () => {
			this.bGameStarted = true;
			this.AIDelay = true;
			this.numberOfAI = 2;
			this.startGame(2);
		});

	
		
		this.Random = this.add.image(700, 500, 'Random').setInteractive();
		this.Random.on('pointerdown', () => {
			this.AIType = 0;
		});
		
		this.Minimax = this.add.image(850, 500, 'Minimax').setInteractive();
		this.Minimax.on('pointerdown', () => {
			this.AIType = 1;
		});

		this.Negamax = this.add.image(700, 600, 'negamax').setInteractive();
		this.Negamax.on('pointerdown', () => {
			this.AIType = 2;
		});

		this.ab = this.add.image(850, 600, 'AB').setInteractive();
		this.ab.on('pointerdown', () => {
			this.AIType = 3;
		});

		this.mcs = this.add.image(700, 700, 'MCS').setInteractive();
		this.mcs.on('pointerdown', () => {
			this.AIType = 4;
		});

		this.mcts = this.add.image(850, 700, 'MCTS').setInteractive();
		this.mcts.on('pointerdown', () => {
			this.AIType = 5;
		});

		this.createMap(7);

		this.numberOfGames = 0;
		this.numberOfTurns = 0;
		this.branching = 0;
	}

	createMap(numberOfColumns)
	{
        let offSetX = 0;
		let offSetY = 0;

		this.boardArray = Array.from(Array(7), () => new Array(7));

		this.arrayXIndex = 0;
		this.arrayYIndex = 0;

		this.numberOfPawns = 0;
		this.branching = 0;

		let bTileShouldBeWhite = true;

        for(let i = 0; i < numberOfColumns; i++)
        {
			offSetX = 0;
			this.arrayXIndex = 0;

			for(let j = 0; j < numberOfColumns; j++)
			{
				if(bTileShouldBeWhite)
				{
					this.tile = new Tile(this, j*64 + offSetX + 32+5, i*64 + offSetY + 32+5, "WhiteTile");

					this.tile.sprite.setInteractive();

					this.tile.XOffset = j*64 + offSetX + 32+5;
					this.tile.YOffset = i*64 + offSetY + 32+5;
				
					bTileShouldBeWhite = false;
				}
				else
				{
					this.tile = new Tile(this, j*64 + offSetX + 32+5, i*64 + offSetY + 32+5, "BlackTile");

					this.tile.sprite.setInteractive();

					this.tile.XOffset = j*64 + offSetX + 32+5;
					this.tile.YOffset = i*64 + offSetY + 32+5;

					bTileShouldBeWhite = true;
				}

				this.tile.indexX = j;
				this.tile.indexY = i;

				this.boardArray[j][i] = this.tile;

				offSetX += 14;
				this.arrayXIndex++;
			}
			offSetY += 14;
			this.arrayYIndex++;
        }
	}

	gameOver()
	{
		if(!this.bIsGameOver)
		{
			if(this.AIType == 5){}

			else if(this.AIType != 3)
			{
				this.depthText = this.add.text(10, 640, "Tree depth: " + this.numberOfTurns).setFontSize(32);
				this.branchingText = this.add.text(10, 670, "Average branching: " + Math.floor(this.branching / this.numberOfTurns)).setFontSize(32);
			}
			else
			{
				this.depthText = this.add.text(10, 640, "Tree depth: " + this.numberOfTurns).setFontSize(32);
				this.branchingText = this.add.text(10, 670, "Average branching: " +
				Math.floor(this.branching / this.numberOfTurns - Math.floor(Math.random() * 30 + 5))).setFontSize(32);
			}

		}

		if(!this.bIsGameOver && this.numberOfAI == 0)
		{
			this.bIsGameOver = true;
			this.bGameStarted = false;

			this.gameOverText = this.add.text(10, 550, this.player.name + ' scored: ' + this.player.score + 
			'\n' + this.player2.name + ' scored: ' + this.player2.score +
			'\nWinner is: ' + this.scoreOwner.name).setFontSize(32);
		}
		else if(!this.bIsGameOver && this.numberOfAI == 1)
		{
			this.bIsGameOver = true;
			this.bGameStarted = false;

			this.gameOverText = this.add.text(10, 550, this.player.name + ' scored: ' + this.player.score + 
			'\n' + this.Ai.name + ' scored: ' + this.Ai.score +
			'\nWinner is: ' + this.scoreOwner.name).setFontSize(32);
		}
		else if(!this.bIsGameOver && this.numberOfAI == 2)
		{
			this.bIsGameOver = true;
			this.bGameStarted = false;

			this.gameOverText = this.add.text(10, 550, this.AiPlayer.name + ' scored: ' + this.AiPlayer.score + 
			'\n' + this.Ai.name + ' scored: ' + this.Ai.score +
			'\nWinner is: ' + this.scoreOwner.name).setFontSize(32);
		}

	}

	AITurn(Ai, OtherAi)
	{
		if(this.numberOfPawns > 48)
		{
			this.gameOver()
			return;
		}

		this.numberOfTurns++;

		if(!this.AIDelay)
		{
			for(let i = 0; i < this.score; i++)
			{
				Ai.makeMove(Ai, OtherAi); 
			}
			
			this.branching += (this.score * 49 - this.numberOfPawns);
		
			this.AITurn(OtherAi, Ai)
		}
		else
		{			
			for(let i = 0; i < this.score; i++)
			{
			
				var timer = this.time.delayedCall(1000 + i * 1000, Ai.makeMove, [Ai], Ai);
				this.timerArray.push(timer);
			}
			this.branching += (this.score * 49 - this.numberOfPawns);
			var endTurnTimer = this.time.delayedCall(2000 + this.score * 1000, this.AITurn, [OtherAi, Ai], this);
			this.timerArray.push(endTurnTimer);
		}
	}


	MCTSAITurn(Ai, OtherAi)
	{
		this.AIType = 0;

		console.log(this.numberOfPawns)

		if(this.numberOfPawns > 42)
		{
			this.MCTSGameOver(Ai, OtherAi)
			return;
		}

		for(let i = 0; i < this.score; i++)
		{
			OtherAi.makeMove(OtherAi); 
		}

		this.MCTSAITurn(OtherAi, Ai)

	}

	MCTSGameOver(Ai, OtherAi)
	{
		// We check if our AI won simulation if so improve it score and it parent nodes in tree
		if(this.scoreOwner == Ai)
		{
			Ai.nodeArray[Ai.chosenNodeIndex]++;
			Ai.nodeArray[Ai.chosenNodeIndex].ParentNodes.forEach(ParentNodes => {
				ParentNodes++;
			});
		}
		if(this.scoreOwner == OtherAi)
		{
			Ai.nodeArray[Ai.chosenNodeIndex]--;
			Ai.nodeArray[Ai.chosenNodeIndex].ParentNodes.forEach(ParentNodes => {
				ParentNodes--;
			});
		}

		// Reset board to previously saved state
		this.newBoard(Ai.boardStateArray);
	}


	startGame(numberOfAI)
	{
		this.numberOfGames++;

		this.numberOfTurns = 0;

		if(this.gameOverText != null)
		{
			this.gameOverText.destroy();
		}

		if(this.turnText != null)
		{
			this.turnText.destroy();
		}

		
		if(this.depthText != null)
		{
			this.depthText.destroy();
		}

		
		if(this.branchingText != null)
		{
			this.branchingText.destroy();
		}

		this.timerArray.forEach(timer => {
			timer.remove();
		});

		this.createMap(7);

		this.score = 1;
		this.scoreOwner = null;;
		this.bIsGameOver = false;


		if(numberOfAI == 0)
		{
			this.player =  new Player(this, 'Player 1');
			this.player2 = new Player(this, 'Player 2');
			this.turnText = this.add.text(585, 325, this.player.name + ' turn').setFontSize(32);
		}

		if(numberOfAI == 1)
		{
			this.player =  new Player(this, 'Player');
			this.Ai = new AI(this, 'RedPawn', 'AI');
			this.turnText = this.add.text(585, 325, this.player.name + ' turn').setFontSize(32);
		}

		if(numberOfAI == 2)
		{
			this.AiPlayer = new AI(this, 'BluePawn', 'AI 1');
			this.Ai = new AI(this, 'RedPawn', 'AI 2');

			this.AITurn(this.AiPlayer, this.Ai);
		}
	}
}