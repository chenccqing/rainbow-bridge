import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a1a0e);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 7);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Raycaster for clicking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// === ROOM ===
const roomSize = 12;
// Floor
const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Walls
const wallMat = new THREE.MeshStandardMaterial({ color: 0xd4a76a, roughness: 0.9, side: THREE.DoubleSide });
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 6), wallMat);
backWall.position.set(0, 3, -roomSize / 2);
backWall.receiveShadow = true;
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 6), wallMat);
leftWall.position.set(-roomSize / 2, 3, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 6), wallMat);
rightWall.position.set(roomSize / 2, 3, 0);
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

// === WARM LIGHTING ===
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.3);
scene.add(ambientLight);

const warmLight = new THREE.PointLight(0xffaa44, 2, 15);
warmLight.position.set(2, 4, 2);
warmLight.castShadow = true;
warmLight.shadow.mapSize.set(1024, 1024);
scene.add(warmLight);

const warmLight2 = new THREE.PointLight(0xff8833, 1.2, 10);
warmLight2.position.set(-3, 3.5, -1);
scene.add(warmLight2);

// Lamp visual
const lampPole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 3, 8),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
lampPole.position.set(2, 1.5, 2);
scene.add(lampPole);
const lampShade = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 0.6, 16, 1, true),
  new THREE.MeshStandardMaterial({ color: 0xffcc66, emissive: 0xffaa33, emissiveIntensity: 0.5, side: THREE.DoubleSide })
);
lampShade.position.set(2, 3.2, 2);
scene.add(lampShade);

// === BOX ===
const boxGroup = new THREE.Group();
boxGroup.position.set(0, 0, 0);
scene.add(boxGroup);

const boxMat = new THREE.MeshStandardMaterial({ color: 0xb5651d, roughness: 0.7 });
const boxW = 1.8, boxH = 1.2, boxD = 1.4, thick = 0.06;

// Bottom
const bottom = new THREE.Mesh(new THREE.BoxGeometry(boxW, thick, boxD), boxMat);
bottom.position.y = thick / 2;
bottom.castShadow = true;
bottom.receiveShadow = true;
boxGroup.add(bottom);

// Sides
const sideMat = new THREE.MeshStandardMaterial({ color: 0xc47832, roughness: 0.7 });
const frontWallBox = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, thick), sideMat);
frontWallBox.position.set(0, boxH / 2 + thick, boxD / 2);
frontWallBox.castShadow = true;
boxGroup.add(frontWallBox);

const backWallBox = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, thick), sideMat);
backWallBox.position.set(0, boxH / 2 + thick, -boxD / 2);
backWallBox.castShadow = true;
boxGroup.add(backWallBox);

const leftWallBox = new THREE.Mesh(new THREE.BoxGeometry(thick, boxH, boxD), sideMat);
leftWallBox.position.set(-boxW / 2, boxH / 2 + thick, 0);
leftWallBox.castShadow = true;
boxGroup.add(leftWallBox);

const rightWallBox = new THREE.Mesh(new THREE.BoxGeometry(thick, boxH, boxD), sideMat);
rightWallBox.position.set(boxW / 2, boxH / 2 + thick, 0);
rightWallBox.castShadow = true;
boxGroup.add(rightWallBox);

// Flaps (open)
const flapMat = new THREE.MeshStandardMaterial({ color: 0xc47832, roughness: 0.7 });
const flapFront = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxD / 2, thick), flapMat);
flapFront.position.set(0, boxH + thick + 0.01, boxD / 2);
flapFront.rotation.x = -Math.PI / 3;
boxGroup.add(flapFront);

const flapBack = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxD / 2, thick), flapMat);
flapBack.position.set(0, boxH + thick + 0.01, -boxD / 2);
flapBack.rotation.x = Math.PI / 3;
boxGroup.add(flapBack);

// === CAT (procedural) ===
const catGroup = new THREE.Group();
catGroup.position.set(0, thick, 0);
scene.add(catGroup);

const catMat = new THREE.MeshStandardMaterial({ color: 0xff9933, roughness: 0.6 });
const catDarkMat = new THREE.MeshStandardMaterial({ color: 0xcc6600, roughness: 0.6 });
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff9999 });

// Body
const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.5, 8, 16), catMat);
body.position.set(0, 0.5, 0);
body.rotation.x = Math.PI / 2;
body.castShadow = true;
catGroup.add(body);

// Head
const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), catMat);
head.position.set(0, 0.75, 0.4);
head.castShadow = true;
catGroup.add(head);

// Ears
const earGeo = new THREE.ConeGeometry(0.1, 0.18, 4);
const earL = new THREE.Mesh(earGeo, catMat);
earL.position.set(-0.15, 0.98, 0.4);
earL.rotation.z = 0.2;
catGroup.add(earL);
const earR = new THREE.Mesh(earGeo, catMat);
earR.position.set(0.15, 0.98, 0.4);
earR.rotation.z = -0.2;
catGroup.add(earR);

// Inner ears
const innerEarGeo = new THREE.ConeGeometry(0.05, 0.1, 4);
const innerEarL = new THREE.Mesh(innerEarGeo, pinkMat);
innerEarL.position.set(-0.15, 0.97, 0.42);
innerEarL.rotation.z = 0.2;
catGroup.add(innerEarL);
const innerEarR = new THREE.Mesh(innerEarGeo, pinkMat);
innerEarR.position.set(0.15, 0.97, 0.42);
innerEarR.rotation.z = -0.2;
catGroup.add(innerEarR);

// Eyes
const eyeGeo = new THREE.SphereGeometry(0.055, 8, 8);
const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
eyeL.position.set(-0.1, 0.8, 0.63);
catGroup.add(eyeL);
const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
eyeR.position.set(0.1, 0.8, 0.63);
catGroup.add(eyeR);

const pupilGeo = new THREE.SphereGeometry(0.03, 8, 8);
const pupilL = new THREE.Mesh(pupilGeo, blackMat);
pupilL.position.set(-0.1, 0.8, 0.68);
catGroup.add(pupilL);
const pupilR = new THREE.Mesh(pupilGeo, blackMat);
pupilR.position.set(0.1, 0.8, 0.68);
catGroup.add(pupilR);

// Nose
const nose = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pinkMat);
nose.position.set(0, 0.72, 0.67);
catGroup.add(nose);

// Tail
const tailCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.5, -0.55),
  new THREE.Vector3(0.1, 0.7, -0.7),
  new THREE.Vector3(0.15, 0.95, -0.65),
  new THREE.Vector3(0.05, 1.05, -0.5),
]);
const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.04, 8, false);
const tail = new THREE.Mesh(tailGeo, catDarkMat);
tail.castShadow = true;
catGroup.add(tail);

// Front paws (visible peeking over box)
const pawGeo = new THREE.SphereGeometry(0.1, 8, 8);
const pawL = new THREE.Mesh(pawGeo, catMat);
pawL.position.set(-0.2, 0.35, 0.55);
pawL.scale.set(1, 0.7, 1.2);
catGroup.add(pawL);
const pawR = new THREE.Mesh(pawGeo, catMat);
pawR.position.set(0.2, 0.35, 0.55);
pawR.scale.set(1, 0.7, 1.2);
catGroup.add(pawR);

// Legs (for walking)
const legGeo = new THREE.CapsuleGeometry(0.06, 0.2, 4, 8);
const legFL = new THREE.Mesh(legGeo, catMat);
legFL.position.set(-0.18, 0.15, 0.3);
catGroup.add(legFL);
const legFR = new THREE.Mesh(legGeo, catMat);
legFR.position.set(0.18, 0.15, 0.3);
catGroup.add(legFR);
const legBL = new THREE.Mesh(legGeo, catMat);
legBL.position.set(-0.18, 0.15, -0.3);
catGroup.add(legBL);
const legBR = new THREE.Mesh(legGeo, catMat);
legBR.position.set(0.18, 0.15, -0.3);
catGroup.add(legBR);

// === STATE ===
let catState = 'in_box'; // 'in_box', 'jumping_out', 'walking'
let walkTime = 0;
let jumpProgress = 0;
let walkTarget = null;
let walkDirection = new THREE.Vector3();
let catClicked = false;

// Position cat inside box initially
catGroup.position.set(0, 0.05, 0);

// Hide legs initially (cat is sitting in box)
legFL.visible = false;
legFR.visible = false;
legBL.visible = false;
legBR.visible = false;

// Make cat clickable
const clickableObjects = [body, head, earL, earR, pawL, pawR, nose, tail];

// Hint text
const hintDiv = document.createElement('div');
hintDiv.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);color:#ffcc88;font-family:Georgia,serif;font-size:18px;text-shadow:0 0 10px rgba(255,170,68,0.5);pointer-events:none;transition:opacity 1s;';
hintDiv.textContent = '🐱 Click the cat to let it out!';
document.body.appendChild(hintDiv);

// Click handler
window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(catGroup.children, true);

  if (intersects.length > 0 && catState === 'in_box') {
    catState = 'jumping_out';
    jumpProgress = 0;
    hintDiv.style.opacity = '0';
    setTimeout(() => hintDiv.remove(), 1000);
  }
});

// Rug
const rugGeo = new THREE.CircleGeometry(2, 32);
const rugMat = new THREE.MeshStandardMaterial({ color: 0x8B2252, roughness: 0.95 });
const rug = new THREE.Mesh(rugGeo, rugMat);
rug.rotation.x = -Math.PI / 2;
rug.position.set(-1.5, 0.01, 1.5);
scene.add(rug);

// Small rug pattern
const rugInner = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), new THREE.MeshStandardMaterial({ color: 0xa0335e, roughness: 0.95 }));
rugInner.rotation.x = -Math.PI / 2;
rugInner.position.set(-1.5, 0.015, 1.5);
scene.add(rugInner);

// === Animation ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const time = clock.getElapsedTime();

  // Warm light flicker
  warmLight.intensity = 2 + Math.sin(time * 3) * 0.1 + Math.sin(time * 7) * 0.05;

  if (catState === 'in_box') {
    // Idle breathing in box
    body.scale.y = 1 + Math.sin(time * 2) * 0.03;
    // Tail sway
    tail.rotation.y = Math.sin(time * 1.5) * 0.2;
    // Ear twitch
    earL.rotation.z = 0.2 + Math.sin(time * 4) * 0.05;
    earR.rotation.z = -0.2 - Math.sin(time * 4 + 1) * 0.05;
    // Blink
    const blinkCycle = time % 4;
    const blinkScale = blinkCycle < 0.1 ? 0.1 : 1;
    eyeL.scale.y = blinkScale;
    eyeR.scale.y = blinkScale;
    pupilL.scale.y = blinkScale;
    pupilR.scale.y = blinkScale;
  }

  if (catState === 'jumping_out') {
    jumpProgress += dt * 1.2;
    if (jumpProgress <= 1) {
      // Jump arc
      const t = jumpProgress;
      catGroup.position.x = t * 1.5;
      catGroup.position.y = 0.05 + Math.sin(t * Math.PI) * 1.2;
      catGroup.position.z = t * 1.8;
      catGroup.rotation.y = -t * 0.3;
      // Show legs mid-jump
      if (t > 0.3) {
        legFL.visible = true;
        legFR.visible = true;
        legBL.visible = true;
        legBR.visible = true;
        pawL.visible = false;
        pawR.visible = false;
      }
    } else {
      catState = 'walking';
      catGroup.position.y = 0.05;
      walkTarget = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        0.05,
        (Math.random() - 0.5) * 4 + 1
      );
      walkDirection.copy(walkTarget).sub(catGroup.position).normalize();
      catGroup.rotation.y = Math.atan2(walkDirection.x, walkDirection.z);
    }
  }

  if (catState === 'walking') {
    walkTime += dt;
    const speed = 1.2;
    catGroup.position.add(walkDirection.clone().multiplyScalar(speed * dt));

    // Walk animation - legs
    const legSwing = Math.sin(walkTime * 10) * 0.3;
    legFL.rotation.x = legSwing;
    legBR.rotation.x = legSwing;
    legFR.rotation.x = -legSwing;
    legBL.rotation.x = -legSwing;

    // Body bob
    body.position.y = 0.5 + Math.abs(Math.sin(walkTime * 10)) * 0.03;
    head.position.y = 0.75 + Math.abs(Math.sin(walkTime * 10)) * 0.03;

    // Tail sway while walking
    tail.rotation.y = Math.sin(walkTime * 5) * 0.4;

    // Check if reached target
    const dist = catGroup.position.distanceTo(walkTarget);
    if (dist < 0.3) {
      // Pick new target
      walkTarget = new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        0.05,
        (Math.random() - 0.5) * 5
      );
      walkDirection.copy(walkTarget).sub(catGroup.position).normalize();
      catGroup.rotation.y = Math.atan2(walkDirection.x, walkDirection.z);
    }

    // Keep in room bounds
    catGroup.position.x = THREE.MathUtils.clamp(catGroup.position.x, -5, 5);
    catGroup.position.z = THREE.MathUtils.clamp(catGroup.position.z, -5, 5);

    // Blink
    const blinkCycle = time % 3.5;
    const blinkScale = blinkCycle < 0.1 ? 0.1 : 1;
    eyeL.scale.y = blinkScale;
    eyeR.scale.y = blinkScale;
    pupilL.scale.y = blinkScale;
    pupilR.scale.y = blinkScale;
  }

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});