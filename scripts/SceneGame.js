import Tile from "./Tile";
import AI from "./AI";
import Player from "./Player";

export default class SceneGame extends Phaser.Scene 
{

	// 64 every tile
	// 14 offset 
	// 5 to center pawn 

	// Complexity 25^49

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
	}

	create() 
	{   
        this.add.image(0, 0, "BGN").setScale(5);
   		this.add.image(0, 0, "Grid").setOrigin(0, 0);

		this.bGameStarted = false;
		this.gameOverText = null;


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

			this.numberOfAI = 2;
			this.startGame(2);
		});

		this.createMap(7);

		this.numberOfGames = 0;
	}

	createMap(numberOfColumns)
	{
        let offSetX = 0;
		let offSetY = 0;

		this.boardArray = Array.from(Array(7), () => new Array(7));

		this.arrayXIndex = 0;
		this.arrayYIndex = 0;

		this.numberOfPawns = 0;

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

		for(let i = 0; i < this.score; i++)
		{
			Ai.makeMove(Ai); 
		}
		this.AITurn(OtherAi, Ai)
	}

	startGame(numberOfAI)
	{
		this.numberOfGames++;

		if(this.gameOverText != null)
		{
			this.gameOverText.destroy();
		}

		if(this.turnText != null)
		{
			this.turnText.destroy();
		}

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