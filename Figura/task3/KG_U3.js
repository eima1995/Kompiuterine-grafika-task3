var renderer;
var scene = new THREE.Scene();
var camera;
var control;
var cameraControls;

var cubesObject;
var rockObject;

var lookingAt = 1;
var cameraLookAtPosition = new THREE.Vector3(0, 0, 0);
var cameraStep = 0;

var AllControls = function() {
  this.rockRadius = 2;
  
  this.positionDiff = 10;
  this.freeCamera = false;
  this.cameraLookDiff = 0.1;
  this.lookingAt = "Kubai";
  this.switchCameraObject = function(){
    if (lookingAt === 1){
      this.lookingAt = 'Sfera';
      lookingAt = 2;
      cameraStep = this.cameraLookDiff;
    } else if (lookingAt === 2){
      this.lookingAt = 'Kubeliai';
      lookingAt = 1;
      cameraStep = -this.cameraLookDiff;
    }
  };
  this.cameraPosition = 1;
  this.setCameraAbove = function(){
    camera.position.x = 0;
    camera.position.y = 20;
    camera.position.z = 0;
    camera.lookAt(cameraLookAtPosition);
    this.cameraPosition = 2;
  };
  this.setDefaultCameraPosition = function(){
    this.dobyEffect = 45;
    camera.up =  new THREE.Vector3(0, 1, 0);
    camera.position.x = -50;
    camera.position.y = 20;
    camera.position.z = 0;
    camera.fov = this.dobyEffect;
    camera.lookAt(cameraLookAtPosition);
    this.cameraPosition = 1;
    camera.updateProjectionMatrix();
  };
  this.fovIncrement = 0.2;
  this.setDollyZoom = function(){
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 60;
    camera.lookAt(rockObject);
    this.cameraPosition = 3;
  };
  
  
};

var controls = new AllControls();

function init() {
  /*
  var axes = new THREE.AxisHelper( 20 );
  scene.add(axes);
  */
  
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;
  
  var ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(50, 80, 30);
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  controls.freeCamera = true;

  addRock();

 
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  //camera.zoom(20);
  camera.position.x = -50;
  camera.position.y = 20;
  camera.position.z = 0;
  camera.lookAt(new THREE.Vector3(0, -1, 0));
  
  document.body.appendChild(renderer.domElement);
  cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
  render();
}

function render(){
  controls.freeCamera = true;
  cameraControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}


var rockRadius = 2;
function addRock(){
  var dif = 0.7;
  var points = [];
  for (var i = 0; i < 2500; i++){
    var randomX = - rockRadius + Math.random() * rockRadius * 2;
    var randomY = - rockRadius + Math.random() * rockRadius * 2;
    var randomZ = - rockRadius + Math.random() * rockRadius * 2;
    if ((randomX * randomX + randomY * randomY + randomZ * randomZ) <= (rockRadius * rockRadius)){
      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
  }
  
  var rockGeometry = new THREE.ConvexGeometry(points);
  
  var faceVertexUvs = rockGeometry.faceVertexUvs[ 0 ];
  for ( i = 0; i < faceVertexUvs.length; i ++ ) {
    var tat;
    var uvs = faceVertexUvs[ i ];
    var face = rockGeometry.faces[ i ];
    for ( var j = 0; j < 3; j ++ ) {
      var x, y, z;
      if (j === 0){
        tat = rockGeometry.vertices[face.a].clone().normalize();
        x = tat.x;
        y = tat.y;
        z = tat.z;
      }
      if (j === 1){
        tat = rockGeometry.vertices[face.b].clone().normalize();
        x = tat.x;
        y = tat.y;
        z = tat.z;
      }
      if (j === 2){
        tat = rockGeometry.vertices[face.c].clone().normalize();
        x = tat.x;
        y = tat.y;
        z = tat.z;
      }
      uvs[ j ].x = 1 * (0.5 + (Math.atan2(z, x)) / (2 * Math.PI));
      uvs[ j ].y = 0.5 + Math.asin(y)  / Math.PI;
    }
	
    if (Math.abs(uvs[0].x - uvs[1].x) > dif || Math.abs(uvs[1].x - uvs[2].x) > dif || Math.abs(uvs[2].x - uvs[0].x) > dif){
      if (uvs[0].x > dif) {
        uvs[0].x = uvs[0].x - 1;
      }
      if (uvs[1].x > dif){
       uvs[1].x = uvs[1].x - 1;
      }
      if (uvs[2].x > dif){
        uvs[2].x = uvs[2].x - 1;
      }
    }
	
  }

  var rockMesh = createRockMesh(rockGeometry);
  rockObject = new THREE.Object3D();
  rockObject.add(rockMesh);
  scene.add(rockObject);
}

function createRockMesh(geom) {
  var texture = THREE.ImageUtils.loadTexture("finalChes.png");
  var material = new THREE.MeshPhongMaterial();
  material.map = texture;

  var wireFrameMat = new THREE.MeshBasicMaterial();
  //wireFrameMat.wireframe = true;
  
  var rockMesh= new THREE.SceneUtils.createMultiMaterialObject(geom, [material, wireFrameMat]);
  return rockMesh;
}
window.onload = init;