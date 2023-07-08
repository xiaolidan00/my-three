import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
function loadGLTFModel(url) {
  return new Promise((resolve) => {
    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource
    loader.load(
      // resource URL
      url,
      // called when the resource is loaded
      function (gltf) {
        resolve(gltf);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened');
      }
    );
  });
}
