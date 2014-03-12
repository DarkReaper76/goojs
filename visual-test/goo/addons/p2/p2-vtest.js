require([
	'goo/entities/GooRunner',
	'goo/renderer/Material',
	'goo/renderer/Camera',
	'goo/entities/components/CameraComponent',
	'goo/shapes/Sphere',
	'goo/shapes/Box',
	'goo/shapes/Quad',
	'goo/renderer/TextureCreator',
	'goo/entities/components/ScriptComponent',
	'goo/renderer/shaders/ShaderLib',
	'goo/entities/World',
	'goo/scripts/OrbitCamControlScript',
	'goo/math/Vector3',
	'goo/addons/p2/p2System',
	'goo/addons/p2/p2Component',
	'goo/renderer/light/PointLight',
	'goo/entities/components/LightComponent',
	'../../lib/V'
], function (
	GooRunner,
	Material,
	Camera,
	CameraComponent,
	Sphere,
	Box,
	Quad,
	TextureCreator,
	ScriptComponent,
	ShaderLib,
	World,
	OrbitCamControlScript,
	Vector3,
	P2System,
	P2Component,
	PointLight,
	LightComponent,
	V
) {
	'use strict';

	var resourcePath = '../../resources';

	function init() {
		var goo = V.initGoo();

		var p2System = new P2System();
		goo.world.setSystem(p2System);
		p2System.world.gravity[1] = -20;

		function addPrimitives() {
			for (var i = 0; i < 40; i++) {
				var x = Math.random() * 16 - 8;
				var y = Math.random() * 16 + 8;
				var z = Math.random() * 16 - 8;
				if (Math.random() < 0.5) {
					var w = 1 + Math.random() * 2,
						h = 1 + Math.random() * 2;
					createEntity(goo, new Box(w, h, 1 + Math.random() * 2), {
						mass: 1,
						shapes: [{
							type: 'box',
							width: w,
							height: h
						}]
					}, [x, y, z]);
				} else {
					var radius = 1 + Math.random();
					createEntity(goo, new Sphere(10, 10, radius), {
						mass: 1,
						shapes: [{
							type: 'circle',
							radius: radius
						}]
					}, [x, y, z]);
				}
			}
		}

		addPrimitives();
		document.addEventListener('keypress', addPrimitives, false);

		createEntity(goo, new Quad(1000, 1000, 100, 100), {
			mass: 0,
			offsetAngleX: -Math.PI / 2,
			shapes: [{
				type: 'plane'
			}]
		}, [0, -10, 0]);

		V.addLights();

		V.addOrbitCamera(new Vector3(40, Math.PI / 2, Math.PI / 4));
	}

	function createEntity(goo, meshData, p2Settings, pos) {
		var material = new Material(ShaderLib.texturedLit);
		var texture = new TextureCreator().loadTexture2D(resourcePath + '/goo.png');
		material.setTexture('DIFFUSE_MAP', texture);
		var entity = goo.world.createEntity(meshData, material, pos);
		entity.setComponent(new P2Component(p2Settings));
		entity.addToWorld();
		return entity;
	}

	init();
});
