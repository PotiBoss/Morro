import Tile from "./Tile";
import AI from "./AI";
import Player from "./Player";

export default class SceneGame extends Phaser.Scene 
{

	// 64 every tile
	// 14 offset 
	// 5 to center pawn 

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
	}

	create() 
	{   
        this.add.image(0, 0, "BGN").setScale(5);
   		this.add.image(0, 0, "Grid").setOrigin(0, 0);

		this.createMap(7);

		this.score = 1;
		this.scoreOwner = null;;
		this.bIsGameOver = false;

		this.player =  new Player(this);
		this.Ai = new AI(this);
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
		if(!this.bIsGameOver)
		{
			this.bIsGameOver = true;
			console.log('gameover');
			console.log(this.player.score);
			console.log(this.Ai.score);
			console.log(this.scoreOwner.name);
		}
	}
}