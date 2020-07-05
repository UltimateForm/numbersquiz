import * as THREE from 'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from "https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js";

var container;
var camera, controls, scene, renderer, material, objects;

function init() {
	objects = [];

	var width = window.innerWidth;
	var height = window.innerHeight;

	// camera

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1500;

	// renderer

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	renderer.outputEncoding = THREE.sRGBEncoding;

	container = document.getElementById("background_container");
	container.appendChild(renderer.domElement);

	// scene

	scene = new THREE.Scene();
	scene.background = new THREE.Color("#222831");

	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.autoRotate = true;
	controls.enableZoom = false;
	controls.enablePan = false;


	// listeners

	window.addEventListener('resize', onWindowResize, false);

	Object.assign(window, { scene });

}

function createMeshes() {
	var loader = new THREE.FontLoader();
	loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {

		/* 		var geometry = new THREE.TextGeometry('1', {
					font: font,
					size: 1,
					height: 0.5,
					curveSegments: 4,
					bevelEnabled: true,
					bevelThickness: 0.02,
					bevelSize: 0.05,
					bevelSegments: 3
				});
				geometry.computeVertexNormals();
		
				var material = new THREE.MeshNormalMaterial();
				var mesh = new THREE.Mesh(geometry, material);
				mesh.position.x = Math.random() * 8000 - 4000;
				mesh.position.y = Math.random() * 8000 - 4000;
				mesh.position.z = Math.random() * 8000 - 4000;
				mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 500 + 1000;
				mesh.rotation.x = Math.random() * 2 * Math.PI;
				mesh.rotation.y = Math.random() * 2 * Math.PI;
				scene.add(mesh);
						return;
		
				*/
		for (var i = 0; i < 500; i++) {
			var n = Math.floor(Math.random() * (10 - 1)) + 1;
			var geometry = new THREE.TextGeometry(n.toString(), {
				font: font,
				size: 1,
				height: 0.5,
				curveSegments: 4,
				bevelEnabled: true,
				bevelThickness: 0.02,
				bevelSize: 0.05,
				bevelSegments: 3
			});
			geometry.computeVertexNormals();
			var material = new THREE.MeshNormalMaterial();
			var mesh = new THREE.Mesh(geometry, material);

			mesh.position.x = Math.random() * 6000 - 3000; //these positions form a square space, remember to clamp to magnitude
			mesh.position.y = Math.random() * 6000 - 3000;
			mesh.position.z = Math.random() * 6000 - 3000;
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50 + 100;
			mesh.rotation.x = Math.random() * 2 * Math.PI;
			mesh.rotation.y = Math.random() * 2 * Math.PI;

			objects.push(mesh);
			scene.add(mesh);
		}

	});
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
	requestAnimationFrame(animate);
	controls.update()
	render();
}

function render() {
	for (var i = 0, il = objects.length; i < il; i++) {
		objects[i].rotation.x += 0.01;
		objects[i].rotation.y += 0.02;
	}
	renderer.render(scene, camera);
}

init();
createMeshes();
animate();