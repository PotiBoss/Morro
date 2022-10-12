//import Kratka from './assets/Krata.png';

export default class SceneGame extends Phaser.Scene 
{
	constructor()
	{
		super("SceneGame");

	}

	preload() 
	{
        this.load.image('BGN', 'assets/Background.png');
        this.load.image('WhiteTile', 'assets/BialaKratka.png');
        this.load.image('BlackTile', 'assets/CzarnaKratka.png');
        this.load.image('Krata', 'assets/Krata.png');
        this.load.image('BluePawn', 'assets/KropkaBlue.png');
        this.load.image('RedPawn', 'assets/KropkaRed.png');
	}

	create() 
	{   
        console.log("qwe");
        
        this.add.image(0, 0, "BGN").setScale(5);

        this.add.image(0, 0, "Krata").setOrigin(0, 0);

        let offSet = 0;
        for(let i = 0; i < 7; i++)
        {
            this.add.image(i*64 + offSet, 0, "WhiteTile").setOrigin(0, 0);
            offSet += 20;
        }


	}
}