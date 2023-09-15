import { useState, useEffect, useRef } from 'react';

import "./App.css";
import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { XRButton } from 'three/addons/webxr/XRButton.js';

import hdr from './assets/night_light.hdr';

function App() {
  const ref = useRef();
  // Init renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.xr.enabled = true;

  // Init Scene
  const scene = new THREE.Scene();

  // Add Grid
  // const gridHelper = new THREE.GridHelper(10, 10);
  // scene.add(gridHelper);

  // Init Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(8, 5, 8);


  new RGBELoader().load( hdr, function ( texture ) {

						texture.mapping = THREE.EquirectangularReflectionMapping;

						scene.background = texture;
						scene.environment = texture;

          } );
          				//

				let cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
				cubeRenderTarget.texture.type = THREE.HalfFloatType;


  // Init Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  // Animate
  function animate() {
    // We need to adjust the animate function from what three.js usually recommends does'nt work with web xr
    // requestAnimationFrame(animate) // This should'nt work
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    if (ref.current) {
      ref.current.appendChild(renderer.domElement);
      document.body.appendChild(XRButton.createButton(renderer));
    }
    animate();
  }, []);

  return <div className="App" id="App" ref={ref}></div>;
}

export default App;
