export default class Pawn extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, sprite)
	{
		super(scene, x, y, sprite);

		this.scene = scene;

		scene.add.image(x, y, sprite);
	}
}

