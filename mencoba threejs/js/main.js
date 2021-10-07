let scene, camera, renderer;
    
// set up the environment - 
// initiallize scene, camera, objects and renderer
    
// 1. create the scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0x262626);

// 2. create an locate the camera       
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 9;
camera.position.y = 8;
camera.rotation.x = -0.5;

// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 0, 0);

const color = 0x353500;
const alight = new THREE.AmbientLight(color);
alight.position.set(0, -4, 0);
scene.add(alight);

const intensity = 2;
const dlight1 = new THREE.DirectionalLight(0xFF0000, intensity);
dlight1.position.set(6, 0, -4);
scene.add(dlight1);
const dlight2 = new THREE.DirectionalLight(0x0000FF, 5);
dlight2.position.set(-6, 0, -4);
scene.add(dlight2);
const dlight3 = new THREE.DirectionalLight(0x00FF00, 1);
dlight3.position.set(0, -5, 3);
scene.add(dlight3);
const dlight4 = new THREE.DirectionalLight(0xFFFFFF, 1);
dlight4.position.set(0, 5, 2);
scene.add(dlight4);
        
// 3. create an locate the object on the scene
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial( { color: 0x777777, shininess: 150 } ) );
scene.add( plane );
plane.rotation.x = -1.57;
plane.position.set(0, -0.75, -5);
let objects = [];
objects.push(new THREE.Mesh( new THREE.TorusGeometry(0.5, 0.15, 16, 32), new THREE.MeshPhongMaterial( { color: 0x262626, shininess: 150 } ) ));
scene.add( objects[0] );
objects[0].position.set(0, 0, 0);

objects.push(new THREE.Mesh( new THREE.BoxGeometry(1, 1, 2), new THREE.MeshPhongMaterial( { color: 0x262626, shininess: 150 } ) ));
scene.add( objects[1] );
objects[1].position.set(1, 0, -4);

objects.push(new THREE.Mesh( new THREE.OctahedronGeometry(0.75), new THREE.MeshPhongMaterial( { color: 0x262626, shininess: 150 } ) ));
// objects[2].rotation.y = 0.2;
scene.add( objects[2] );
objects[2].position.set(2, 0, -8);
        
// 4. create the renderer     
renderer = new THREE.WebGLRenderer({antialias: true});   
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// main animation loop - calls 50-60 in a second.
let dataObject = [];
objects.forEach(element => {
    dataObject.push({
        rotationSpeed: 0.02,
        rollingSpeed: -0.02,
    });
});
console.log(dataObject);
function moveCamera() {
    camera.rotation.y += 0.001;
    requestAnimationFrame(moveCamera);
}

let mainLoop = function() {
  renderer.render(scene, camera);
  objects.forEach((element, index) => {
      element.rotation.y += dataObject[index].rotationSpeed;
      element.rotation.z += dataObject[index].rotationSpeed;
      element.position.x += dataObject[index].rollingSpeed;
      if(element.position.x < -4) {
          dataObject[index].rollingSpeed = -dataObject[index].rollingSpeed;
          dataObject[index].rotationSpeed = -dataObject[index].rotationSpeed;
      } else if(element.position.x > 4) {
          dataObject[index].rotationSpeed = -dataObject[index].rotationSpeed;
          dataObject[index].rollingSpeed = -dataObject[index].rollingSpeed;
      }
  });
  requestAnimationFrame(mainLoop);
};

mainLoop();