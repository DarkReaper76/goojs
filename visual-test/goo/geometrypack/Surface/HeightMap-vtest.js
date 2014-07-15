require([
	'goo/renderer/Material',
	'goo/renderer/shaders/ShaderLib',
	'goo/math/Vector3',
	'goo/geometrypack/Surface',
	'goo/renderer/TextureCreator',
	'lib/V'
], function (
	Material,
	ShaderLib,
	Vector3,
	Surface,
	TextureCreator,
	V
	) {
	'use strict';

	V.describe('A terrain-like surface generated from a heightmap stored as a matrix of floats');

	function getHeightMap(nLin, nCol) {
		var matrix = [];
		for (var i = 0; i < nLin; i++) {
			matrix.push([]);
			for (var j = 0; j < nCol; j++) {
				var value =
					Math.sin(i * 0.3) +
					Math.cos(j * 0.3) +
					Math.sin(Math.sqrt(i*i + j*j) * 0.7) * 2;
				matrix[i].push(value);
			}
		}
		return matrix;
	}

	var goo = V.initGoo();
	var world = goo.world;

	var heightMapSize = 64;

	var matrix = getHeightMap(heightMapSize, heightMapSize);
	var meshData = Surface.createFromHeightMap(matrix);

	var material = new Material(ShaderLib.texturedLit);
	var texture = new TextureCreator().loadTexture2D('../../../resources/check.png');
	material.setTexture('DIFFUSE_MAP', texture);

	world.createEntity(meshData, material, [-heightMapSize / 2, 0, -heightMapSize / 2]).addToWorld();

	V.addLights();

	V.addOrbitCamera(new Vector3(100, Math.PI / 2, 0));
});
