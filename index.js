import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfdf6ee);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2.8, 4.5);
camera.lookAt(0, 0.6, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.6, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI / 2.05;
controls.update();

// === ROOM ===
const roomW = 10, roomH = 5, roomD = 10;

const floorMat = new THREE.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.7 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
floor.name = 'floor'; floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
scene.add(floor);

const wallMat = new THREE.MeshStandardMaterial({ color: 0xfaf0e6, roughness: 0.95, side: THREE.DoubleSide });
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
backWall.name = 'backWall'; backWall.position.set(0, roomH / 2, -roomD / 2); backWall.receiveShadow = true;
scene.add(backWall);
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
leftWall.name = 'leftWall'; leftWall.position.set(-roomW / 2, roomH / 2, 0); leftWall.rotation.y = Math.PI / 2; leftWall.receiveShadow = true;
scene.add(leftWall);
const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
rightWall.name = 'rightWall'; rightWall.position.set(roomW / 2, roomH / 2, 0); rightWall.rotation.y = -Math.PI / 2; rightWall.receiveShadow = true;
scene.add(rightWall);
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), new THREE.MeshStandardMaterial({ color: 0xfffef8, roughness: 1.0, side: THREE.DoubleSide }));
ceiling.name = 'ceiling'; ceiling.rotation.x = Math.PI / 2; ceiling.position.y = roomH;
scene.add(ceiling);

// Baseboards
const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.6 });
[{ s: [roomW, 0.15, 0.05], p: [0, 0.075, -roomD / 2 + 0.025] },
 { s: [0.05, 0.15, roomD], p: [-roomW / 2 + 0.025, 0.075, 0] },
 { s: [0.05, 0.15, roomD], p: [roomW / 2 - 0.025, 0.075, 0] }].forEach((d, i) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...d.s), baseboardMat);
  m.name = 'baseboard_' + i; m.position.set(...d.p); scene.add(m);
});

// === LIGHTING ===
scene.add(new THREE.AmbientLight(0xffeedd, 0.8));
const sunLight = new THREE.DirectionalLight(0xfff0d4, 2.5);
sunLight.name = 'sunLight'; sunLight.position.set(3, 4.5, 2);
sunLight.castShadow = true; sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 0.1; sunLight.shadow.camera.far = 15;
sunLight.shadow.camera.left = -6; sunLight.shadow.camera.right = 6;
sunLight.shadow.camera.top = 6; sunLight.shadow.camera.bottom = -3;
sunLight.shadow.bias = -0.001; sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);
const fillLight = new THREE.DirectionalLight(0xffe8c8, 0.8);
fillLight.name = 'fillLight'; fillLight.position.set(-3, 3, 3); scene.add(fillLight);
const ceilingLight = new THREE.PointLight(0xffebc8, 1.5, 12);
ceilingLight.name = 'ceilingLight'; ceilingLight.position.set(0, 4.5, 0); scene.add(ceilingLight);
const frontLight = new THREE.DirectionalLight(0xfff5e0, 1.0);
frontLight.name = 'frontLight'; frontLight.position.set(0, 3, 5); scene.add(frontLight);

// Floor lamp
const lampGroup = new THREE.Group(); lampGroup.name = 'lampGroup'; lampGroup.position.set(3.5, 0, -3); scene.add(lampGroup);
const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0x8B7355, metalness: 0.3, roughness: 0.6 }));
lampBase.name = 'lampBase'; lampBase.position.y = 0.04; lampGroup.add(lampBase);
const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0x8B7355, metalness: 0.4, roughness: 0.5 }));
lampPole.name = 'lampPole'; lampPole.position.y = 1.68; lampGroup.add(lampPole);
const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.45, 0.5, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xfff5e0, emissive: 0xffddaa, emissiveIntensity: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
lampShade.name = 'lampShade'; lampShade.position.y = 3.4; lampGroup.add(lampShade);
const lampLight = new THREE.PointLight(0xffddaa, 2.0, 8);
lampLight.name = 'lampLight'; lampLight.position.set(3.5, 3.4, -3); lampLight.castShadow = true; scene.add(lampLight);

// === WINDOW ===
const windowGroup = new THREE.Group(); windowGroup.name = 'windowGroup'; windowGroup.position.set(-2, 2.5, -roomD / 2 + 0.02); scene.add(windowGroup);
const wfMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.5 });
[{ s: [2.2, 0.1, 0.08], p: [0, 1.05, 0] }, { s: [2.2, 0.1, 0.08], p: [0, -1.05, 0] },
 { s: [0.1, 2.2, 0.08], p: [-1.05, 0, 0] }, { s: [0.1, 2.2, 0.08], p: [1.05, 0, 0] },
 { s: [0.06, 2.1, 0.08], p: [0, 0, 0] }, { s: [2.1, 0.06, 0.08], p: [0, 0, 0] }
].forEach((d, i) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...d.s), wfMat);
  m.name = 'windowFrame_' + i; m.position.set(...d.p); windowGroup.add(m);
});
const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), new THREE.MeshStandardMaterial({ color: 0xfff8e7, emissive: 0xffeebb, emissiveIntensity: 0.4, transparent: true, opacity: 0.5 }));
windowGlass.name = 'windowGlass'; windowGlass.position.z = -0.02; windowGroup.add(windowGlass);
const windowLight = new THREE.SpotLight(0xfff5dd, 3.0, 10, Math.PI / 5, 0.6, 1);
windowLight.name = 'windowLight'; windowLight.position.set(-2, 3.5, -4);
windowLight.target.position.set(-1, 0, 1); scene.add(windowLight); scene.add(windowLight.target);

// === CARDBOARD BOX ===
const boxGroup = new THREE.Group(); boxGroup.name = 'boxGroup'; scene.add(boxGroup);
const boxMat = new THREE.MeshStandardMaterial({ color: 0xc9a66b, roughness: 0.85 });
const boxSideMat = new THREE.MeshStandardMaterial({ color: 0xb8944f, roughness: 0.85 });
const boxW = 1.6, boxH = 0.8, boxD = 1.2, thick = 0.05;

const bottom = new THREE.Mesh(new THREE.BoxGeometry(boxW, thick, boxD), boxMat);
bottom.name = 'boxBottom'; bottom.position.y = thick / 2; bottom.castShadow = true; bottom.receiveShadow = true; boxGroup.add(bottom);

const fwb = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH * 0.55, thick), boxSideMat);
fwb.name = 'boxFront'; fwb.position.set(0, boxH * 0.55 / 2 + thick, boxD / 2); fwb.castShadow = true; boxGroup.add(fwb);
const bwb = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, thick), boxSideMat);
bwb.name = 'boxBack'; bwb.position.set(0, boxH / 2 + thick, -boxD / 2); bwb.castShadow = true; boxGroup.add(bwb);
const lwb = new THREE.Mesh(new THREE.BoxGeometry(thick, boxH, boxD), boxSideMat);
lwb.name = 'boxLeft'; lwb.position.set(-boxW / 2, boxH / 2 + thick, 0); lwb.castShadow = true; boxGroup.add(lwb);
const rwb = new THREE.Mesh(new THREE.BoxGeometry(thick, boxH, boxD), boxSideMat);
rwb.name = 'boxRight'; rwb.position.set(boxW / 2, boxH / 2 + thick, 0); rwb.castShadow = true; boxGroup.add(rwb);

const flapMat = boxSideMat;
const flapFront = new THREE.Mesh(new THREE.BoxGeometry(boxW * 0.98, boxD * 0.4, thick * 0.8), flapMat);
flapFront.name = 'flapFront'; flapFront.position.set(0, boxH + thick, boxD / 2 + 0.1); flapFront.rotation.x = -Math.PI / 2.5; flapFront.castShadow = true; boxGroup.add(flapFront);
const flapBack = new THREE.Mesh(new THREE.BoxGeometry(boxW * 0.98, boxD * 0.4, thick * 0.8), flapMat);
flapBack.name = 'flapBack'; flapBack.position.set(0, boxH + thick, -boxD / 2 - 0.1); flapBack.rotation.x = Math.PI / 2.5; flapBack.castShadow = true; boxGroup.add(flapBack);

// === BUILD THE CAT ===
const catGroup = new THREE.Group();
catGroup.name = 'theCat';

const furColor = 0xd4a054;
const darkStripe = 0x8b5e2a;
const bellyColor = 0xf5e6cc;
const furMat = new THREE.MeshStandardMaterial({ color: furColor, roughness: 0.92 });
const stripeMat = new THREE.MeshStandardMaterial({ color: darkStripe, roughness: 0.92 });
const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, roughness: 0.95 });
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf5a0a0, roughness: 0.7 });
const noseMat = new THREE.MeshStandardMaterial({ color: 0xe88888, roughness: 0.5 });
const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x7ab648, roughness: 0.2, metalness: 0.1 });
const pupilMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Body
const torso = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 18), furMat);
torso.name = 'catTorso'; torso.scale.set(0.85, 1.0, 0.95); torso.position.set(0, 0.32, 0); torso.castShadow = true; catGroup.add(torso);
const belly = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), bellyMat);
belly.name = 'catBelly'; belly.scale.set(0.7, 0.85, 0.7); belly.position.set(0, 0.26, 0.1); catGroup.add(belly);
const chest = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), bellyMat);
chest.name = 'catChest'; chest.scale.set(0.8, 0.7, 0.8); chest.position.set(0, 0.46, 0.14); catGroup.add(chest);


// HEAD
const headGroup = new THREE.Group(); headGroup.name = 'catHeadGroup'; headGroup.position.set(0, 0.64, 0.2); catGroup.add(headGroup);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 18), furMat);
head.name = 'catHead'; head.scale.set(1.0, 0.92, 0.95); head.castShadow = true; headGroup.add(head);
const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), furMat);
cheekL.name = 'catCheekL'; cheekL.scale.set(1, 0.8, 0.9); cheekL.position.set(-0.12, -0.05, 0.1); headGroup.add(cheekL);
const cheekR = cheekL.clone(); cheekR.name = 'catCheekR'; cheekR.position.set(0.12, -0.05, 0.1); headGroup.add(cheekR);
const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), bellyMat);
muzzle.name = 'catMuzzle'; muzzle.scale.set(1.1, 0.75, 1.0); muzzle.position.set(0, -0.06, 0.16); headGroup.add(muzzle);
const chin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), bellyMat);
chin.name = 'catChin'; chin.position.set(0, -0.1, 0.14); headGroup.add(chin);

// Forehead M
const mMark1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.01), stripeMat);
mMark1.name = 'catMmark1'; mMark1.position.set(-0.04, 0.1, 0.14); mMark1.rotation.z = 0.5; headGroup.add(mMark1);
const mMark2 = mMark1.clone(); mMark2.name = 'catMmark2'; mMark2.position.set(0.04, 0.1, 0.14); mMark2.rotation.z = -0.5; headGroup.add(mMark2);

// Ears
const earGeo = new THREE.ConeGeometry(0.075, 0.14, 4);
const earL = new THREE.Mesh(earGeo, furMat); earL.name = 'catEarL'; earL.position.set(-0.13, 0.2, 0); earL.rotation.z = 0.2; earL.rotation.x = -0.1; earL.castShadow = true; headGroup.add(earL);
const earR = new THREE.Mesh(earGeo, furMat); earR.name = 'catEarR'; earR.position.set(0.13, 0.2, 0); earR.rotation.z = -0.2; earR.rotation.x = -0.1; earR.castShadow = true; headGroup.add(earR);
const innerEarGeo = new THREE.ConeGeometry(0.045, 0.09, 4);
const ieL = new THREE.Mesh(innerEarGeo, pinkMat); ieL.name = 'catInnerEarL'; ieL.position.set(-0.13, 0.19, 0.02); ieL.rotation.z = 0.2; ieL.rotation.x = -0.1; headGroup.add(ieL);
const ieR = new THREE.Mesh(innerEarGeo, pinkMat); ieR.name = 'catInnerEarR'; ieR.position.set(0.13, 0.19, 0.02); ieR.rotation.z = -0.2; ieR.rotation.x = -0.1; headGroup.add(ieR);

// Eyes
const eyeSocketGeo = new THREE.SphereGeometry(0.048, 12, 10);
const eyeWhiteL = new THREE.Mesh(eyeSocketGeo, whiteMat); eyeWhiteL.name = 'catEyeWhiteL'; eyeWhiteL.position.set(-0.09, 0.02, 0.16); headGroup.add(eyeWhiteL);
const irisL = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), eyeIrisMat); irisL.name = 'catIrisL'; irisL.position.set(-0.09, 0.02, 0.2); headGroup.add(irisL);
const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), pupilMat); pupilL.name = 'catPupilL'; pupilL.scale.set(0.6, 1.4, 1); pupilL.position.set(-0.09, 0.02, 0.225); headGroup.add(pupilL);
const shineL = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), shineMat); shineL.name = 'catShineL'; shineL.position.set(-0.078, 0.032, 0.235); headGroup.add(shineL);
const eyeWhiteR = new THREE.Mesh(eyeSocketGeo, whiteMat); eyeWhiteR.name = 'catEyeWhiteR'; eyeWhiteR.position.set(0.09, 0.02, 0.16); headGroup.add(eyeWhiteR);
const irisR = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), eyeIrisMat); irisR.name = 'catIrisR'; irisR.position.set(0.09, 0.02, 0.2); headGroup.add(irisR);
const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), pupilMat); pupilR.name = 'catPupilR'; pupilR.scale.set(0.6, 1.4, 1); pupilR.position.set(0.09, 0.02, 0.225); headGroup.add(pupilR);
const shineR = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 6), shineMat); shineR.name = 'catShineR'; shineR.position.set(0.102, 0.032, 0.235); headGroup.add(shineR);

// Nose & mouth
const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), noseMat);
nose.name = 'catNose'; nose.scale.set(1.3, 0.8, 1.0); nose.position.set(0, -0.035, 0.21); headGroup.add(nose);
const mouthMat2 = new THREE.LineBasicMaterial({ color: 0x8b5e3c });
headGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.045, 0.215), new THREE.Vector3(-0.03, -0.06, 0.21), new THREE.Vector3(-0.055, -0.055, 0.2)]), mouthMat2));
headGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.045, 0.215), new THREE.Vector3(0.03, -0.06, 0.21), new THREE.Vector3(0.055, -0.055, 0.2)]), mouthMat2));

// Whiskers
const whiskerMat = new THREE.LineBasicMaterial({ color: 0xe0d8cc });
[{ s: [-0.06, -0.05, 0.2], m: [-0.2, -0.03, 0.26], e: [-0.35, -0.02, 0.24] },
 { s: [-0.06, -0.055, 0.2], m: [-0.22, -0.06, 0.28], e: [-0.36, -0.065, 0.26] },
 { s: [-0.06, -0.06, 0.2], m: [-0.2, -0.08, 0.26], e: [-0.33, -0.1, 0.23] },
 { s: [0.06, -0.05, 0.2], m: [0.2, -0.03, 0.26], e: [0.35, -0.02, 0.24] },
 { s: [0.06, -0.055, 0.2], m: [0.22, -0.06, 0.28], e: [0.36, -0.065, 0.26] },
 { s: [0.06, -0.06, 0.2], m: [0.2, -0.08, 0.26], e: [0.33, -0.1, 0.23] },
].forEach((w, i) => {
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...w.s), new THREE.Vector3(...w.m), new THREE.Vector3(...w.e));
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(10)), whiskerMat);
  line.name = 'catWhisker_' + i; headGroup.add(line);
});

// Legs
const legFL = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.18, 8, 12), furMat);
legFL.name = 'catLegFL'; legFL.position.set(-0.14, 0.12, 0.18); legFL.rotation.x = -0.3; legFL.castShadow = true; catGroup.add(legFL);
const legFR = legFL.clone(); legFR.name = 'catLegFR'; legFR.position.set(0.14, 0.12, 0.18); catGroup.add(legFR);
const pawGeo = new THREE.SphereGeometry(0.06, 10, 8);
const pawFL = new THREE.Mesh(pawGeo, bellyMat); pawFL.name = 'catPawFL'; pawFL.scale.set(0.85, 0.55, 1.3); pawFL.position.set(-0.14, 0.04, 0.3); catGroup.add(pawFL);
const pawFR = pawFL.clone(); pawFR.name = 'catPawFR'; pawFR.position.set(0.14, 0.04, 0.3); catGroup.add(pawFR);

for (let side = -1; side <= 1; side += 2) {
  for (let t = -1; t <= 1; t++) {
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.013, 6, 6), pinkMat);
    toe.name = 'catToe_' + (side < 0 ? 'L' : 'R') + '_' + (t + 1);
    toe.position.set(side * 0.14 + t * 0.022, 0.03, 0.35); catGroup.add(toe);
  }
}

const legBL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), furMat);
legBL.name = 'catLegBL'; legBL.scale.set(0.8, 0.6, 1.0); legBL.position.set(-0.18, 0.12, -0.08); legBL.castShadow = true; catGroup.add(legBL);
const legBR = legBL.clone(); legBR.name = 'catLegBR'; legBR.position.set(0.18, 0.12, -0.08); catGroup.add(legBR);

// Tail
const tailCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.12, -0.28), new THREE.Vector3(0.2, 0.1, -0.34),
  new THREE.Vector3(0.38, 0.12, -0.24), new THREE.Vector3(0.4, 0.16, -0.06),
  new THREE.Vector3(0.32, 0.19, 0.08), new THREE.Vector3(0.2, 0.2, 0.14)
]);
const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 20, 0.04, 8, false), furMat);
tail.name = 'catTail'; tail.castShadow = true; catGroup.add(tail);
const tailTipCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.2, 0.2, 0.14), new THREE.Vector3(0.14, 0.22, 0.18)]);
const tailTip = new THREE.Mesh(new THREE.TubeGeometry(tailTipCurve, 5, 0.038, 8, false), stripeMat);
tailTip.name = 'catTailTip'; catGroup.add(tailTip);
for (let i = 0; i < 3; i++) {
  const pt = tailCurve.getPoint(0.3 + i * 0.2);
  const strp = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), stripeMat);
  strp.name = 'catTailStripe_' + i; strp.scale.set(1, 0.3, 1); strp.position.copy(pt); catGroup.add(strp);
}

catGroup.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });

// Cat starts INSIDE the box
catGroup.position.set(0, thick, 0);
boxGroup.add(catGroup);

// === ROOM FURNITURE ===
const tableGroup = new THREE.Group(); tableGroup.name = 'sideTable'; tableGroup.position.set(-3.5, 0, -2); scene.add(tableGroup);
const tMat = new THREE.MeshStandardMaterial({ color: 0x9e7c5a, roughness: 0.65 });
const tTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 16), tMat);
tTop.name = 'tableTop'; tTop.position.y = 1.8; tTop.castShadow = true; tTop.receiveShadow = true; tableGroup.add(tTop);
const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), tMat);
tLeg.name = 'tableLeg'; tLeg.position.y = 0.9; tLeg.castShadow = true; tableGroup.add(tLeg);
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xd4836a, roughness: 0.8 }));
pot.name = 'plantPot'; pot.position.set(-3.5, 1.93, -2); pot.castShadow = true; scene.add(pot);
const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x5a9e4f, roughness: 0.8 });
for (let i = 0; i < 5; i++) {
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), leafMat2);
  leaf.name = 'leaf_' + i; const angle = (i / 5) * Math.PI * 2;
  leaf.position.set(-3.5 + Math.cos(angle) * 0.08, 2.1 + Math.random() * 0.08, -2 + Math.sin(angle) * 0.08);
  leaf.scale.set(1, 1.5, 1); scene.add(leaf);
}

const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.8), new THREE.MeshStandardMaterial({ color: 0xb09070, roughness: 0.95 }));
rugBorder.name = 'rugBorder'; rugBorder.rotation.x = -Math.PI / 2; rugBorder.position.set(0, 0.003, 0.5); rugBorder.receiveShadow = true; scene.add(rugBorder);
const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.5), new THREE.MeshStandardMaterial({ color: 0xc8a882, roughness: 0.95 }));
rug.name = 'rug'; rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.005, 0.5); rug.receiveShadow = true; scene.add(rug);

// Dust motes
const dustCount = 80;
const dustGeo = new THREE.BufferGeometry();
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
  dustPositions[i * 3] = (Math.random() - 0.5) * 6;
  dustPositions[i * 3 + 1] = Math.random() * 4 + 0.5;
  dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustParticles = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xfff5dd, size: 0.03, transparent: true, opacity: 0.4 }));
dustParticles.name = 'dustParticles'; scene.add(dustParticles);

// === CAT TOYS ===
const toyGroup = new THREE.Group();
toyGroup.name = 'toyGroup';
scene.add(toyGroup);

// TOY 1: Red Yarn Ball (front-left)
const yarnBall = new THREE.Group();
yarnBall.name = 'yarnBall';
yarnBall.position.set(-2.0, 0.18, 1.5);
const yarnCore = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 14), new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.95 }));
yarnCore.name = 'yarnCore'; yarnCore.castShadow = true; yarnBall.add(yarnCore);
// Yarn wrapping lines
const yarnLineMat = new THREE.MeshStandardMaterial({ color: 0xdd5555, roughness: 0.9 });
for (let i = 0; i < 6; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.015, 6, 20), yarnLineMat);
  ring.name = 'yarnRing_' + i;
  ring.rotation.x = (i / 6) * Math.PI;
  ring.rotation.y = (i / 6) * Math.PI * 0.5;
  yarnBall.add(ring);
}
// Dangling yarn tail
const yarnTailCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.15, -0.05, 0), new THREE.Vector3(0.3, -0.1, 0.05),
  new THREE.Vector3(0.4, -0.15, -0.03), new THREE.Vector3(0.5, -0.16, 0.02)
]);
const yarnTail = new THREE.Mesh(new THREE.TubeGeometry(yarnTailCurve, 12, 0.012, 6, false), new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.9 }));
yarnTail.name = 'yarnTail'; yarnBall.add(yarnTail);
toyGroup.add(yarnBall);

// TOY 2: Mouse Toy (right side)
const mouseToy = new THREE.Group();
mouseToy.name = 'mouseToy';
mouseToy.position.set(2.5, 0.08, -0.5);
const mouseBody = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.85 }));
mouseBody.name = 'mouseBody'; mouseBody.scale.set(1, 0.75, 1.6); mouseBody.castShadow = true; mouseToy.add(mouseBody);
const mouseNose = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 8), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 }));
mouseNose.name = 'mouseNose'; mouseNose.rotation.x = -Math.PI / 2; mouseNose.position.set(0, 0, 0.2); mouseToy.add(mouseNose);
const mouseEarL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf0a0a0, roughness: 0.7 }));
mouseEarL.name = 'mouseEarL'; mouseEarL.position.set(-0.07, 0.06, 0.05); mouseToy.add(mouseEarL);
const mouseEarR = mouseEarL.clone(); mouseEarR.name = 'mouseEarR'; mouseEarR.position.set(0.07, 0.06, 0.05); mouseToy.add(mouseEarR);
// Mouse eyes
const mouseEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), new THREE.MeshStandardMaterial({ color: 0x111111 }));
mouseEyeL.name = 'mouseEyeL'; mouseEyeL.position.set(-0.04, 0.03, 0.14); mouseToy.add(mouseEyeL);
const mouseEyeR = mouseEyeL.clone(); mouseEyeR.name = 'mouseEyeR'; mouseEyeR.position.set(0.04, 0.03, 0.14); mouseToy.add(mouseEyeR);
// Mouse tail
const mouseTailCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, -0.18), new THREE.Vector3(0.05, 0.04, -0.32),
  new THREE.Vector3(-0.04, 0.02, -0.42), new THREE.Vector3(0.03, 0.05, -0.52)
]);
const mouseTail = new THREE.Mesh(new THREE.TubeGeometry(mouseTailCurve, 10, 0.008, 6, false), new THREE.MeshStandardMaterial({ color: 0xbb9999, roughness: 0.8 }));
mouseTail.name = 'mouseTail'; mouseToy.add(mouseTail);
toyGroup.add(mouseToy);

// TOY 3: Jingle Ball (back-left)
const jingleBall = new THREE.Group();
jingleBall.name = 'jingleBall';
jingleBall.position.set(-1.8, 0.12, -1.8);
const jingleCore = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshStandardMaterial({ color: 0xdaa520, metalness: 0.6, roughness: 0.3 }));
jingleCore.name = 'jingleCore'; jingleCore.castShadow = true; jingleBall.add(jingleCore);
// Slots in the ball
for (let i = 0; i < 4; i++) {
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.01, 0.12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  slot.name = 'jingleSlot_' + i;
  slot.rotation.y = (i / 4) * Math.PI;
  slot.position.y = -0.02;
  jingleBall.add(slot);
}
// Small bell inside (visible through slots)
const bellInner = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 }));
bellInner.name = 'bellInner'; bellInner.position.y = -0.02; jingleBall.add(bellInner);
toyGroup.add(jingleBall);

// Collect toy meshes for raycasting
const toyMeshes = [];
const toyObjects = [yarnBall, mouseToy, jingleBall];
toyObjects.forEach(toy => {
  toy.traverse(c => { if (c.isMesh) toyMeshes.push(c); });
});

// === STATE MACHINE ===
// States: 'in_box', 'jumping_out', 'walking', 'jumping_back', 'looking_at_camera', 'playing_with_toy'
let catState = 'in_box';
let stateTimer = 0;
let walkTimer = 0;
let walkDuration = 7.0;
let isLookingAtCamera = false;
let lookTimer = 0;

// Toy play state
let activeToy = null;
let playTimer = 0;
let playDuration = 5.0;
let toyOriginalPos = new THREE.Vector3();

// Walk path - waypoints the cat will walk to
const walkPath = [
  new THREE.Vector3(1.2, 0, 1.5),
  new THREE.Vector3(2.0, 0, 0.5),
  new THREE.Vector3(1.5, 0, -0.5),
  new THREE.Vector3(0.5, 0, -1.0),
  new THREE.Vector3(-0.8, 0, -0.3),
  new THREE.Vector3(-1.2, 0, 1.0),
  new THREE.Vector3(-0.3, 0, 1.8),
  new THREE.Vector3(0.8, 0, 1.2),
];
let currentWaypointIndex = 0;
let walkSpeed = 1.2;

// Jump animation vars
let jumpProgress = 0;
let jumpStartPos = new THREE.Vector3();
let jumpEndPos = new THREE.Vector3();
let jumpPeakY = 0.8;

// Meow sound
const meowAudio = new Audio('https://rrzvgzjttmyseqsmmyvn.supabase.co/storage/v1/object/sign/attachments/623c6fe2-48fc-4f8f-9f86-67b552caef31/generated-audio/vza8sfrufrp-1777342380726-2uk1.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xMjY1MWQ4My04ODE0LTQ3NzMtOGRlNS00MzliNDBkODY2NmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdHRhY2htZW50cy82MjNjNmZlMi00OGZjLTRmOGYtOWY4Ni02N2I1NTJjYWVmMzEvZ2VuZXJhdGVkLWF1ZGlvL3Z6YThzZnJ1ZnJwLTE3NzczNDIzODA3MjYtMnVrMS5tcDMiLCJpYXQiOjE3NzczNDIzODEsImV4cCI6MjA5MjcwMjM4MX0.OHvIwWnCc8UOrSlITOPwVp8wrIbjD-6Gd-zGxtjrc4Y');
meowAudio.volume = 0.7;

// === MEOW BUBBLE ===
const meowDiv = document.createElement('div');
meowDiv.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);color:#7a5c3a;font-family:Inter,system-ui,sans-serif;font-size:28px;font-weight:500;pointer-events:none;opacity:0;transition:opacity 0.3s,transform 0.3s;background:rgba(255,252,245,0.95);padding:12px 28px;border-radius:20px;border:1px solid rgba(180,160,130,0.4);z-index:100;';
meowDiv.textContent = '🐱 Meow!';
document.body.appendChild(meowDiv);

function showMeowBubble(text) {
  meowDiv.textContent = text || '🐱 Meow!';
  meowDiv.style.opacity = '1';
  meowDiv.style.transform = 'translateX(-50%) translateY(-10px)';
  setTimeout(() => {
    meowDiv.style.opacity = '0';
    meowDiv.style.transform = 'translateX(-50%) translateY(0)';
  }, 1500);
}

// === STATE TRANSITIONS ===
function startJumpOut(targetPos) {
  catState = 'jumping_out';
  jumpProgress = 0;

  // Get cat's current world position (inside box)
  const worldPos = new THREE.Vector3();
  catGroup.getWorldPosition(worldPos);
  jumpStartPos.copy(worldPos);

  // Jump to target position (toy or first waypoint)
  jumpEndPos.copy(targetPos || walkPath[0]);
  jumpPeakY = 1.0;

  // Remove cat from box, add to scene
  boxGroup.remove(catGroup);
  catGroup.position.copy(worldPos);
  scene.add(catGroup);

  meowAudio.currentTime = 0;
  meowAudio.play().catch(() => {});
  showMeowBubble('🐱 Meow!');
}

function startPlayingWithToy(toy) {
  catState = 'playing_with_toy';
  activeToy = toy;
  playTimer = 0;
  toyOriginalPos.copy(toy.position);
  updateHint('🐱 The cat is playing! Click it to get its attention!');
}

function startWalking() {
  catState = 'walking';
  walkTimer = 0;
  currentWaypointIndex = 0;
  catGroup.position.copy(walkPath[0]);
  catGroup.position.y = 0;
}

function startJumpBack() {
  catState = 'jumping_back';
  jumpProgress = 0;

  const worldPos = new THREE.Vector3();
  catGroup.getWorldPosition(worldPos);
  jumpStartPos.copy(worldPos);

  // Jump back to box center (world coords)
  const boxWorldPos = new THREE.Vector3();
  boxGroup.getWorldPosition(boxWorldPos);
  jumpEndPos.set(boxWorldPos.x, boxWorldPos.y + thick, boxWorldPos.z);
  jumpPeakY = 1.0;
}

function finishJumpBack() {
  catState = 'in_box';
  scene.remove(catGroup);
  catGroup.position.set(0, thick, 0);
  catGroup.rotation.y = 0;
  boxGroup.add(catGroup);
  isLookingAtCamera = false;
}

let lookPauseActive = false;
let lookPauseDuration = 3.0;
let lookPauseTimer = 0;
let savedWaypointIndex = 0;
let savedWalkTimer = 0;

function startLookAtCamera() {
  isLookingAtCamera = true;
  lookTimer = 999; // stays looking until pause ends
  lookPauseActive = true;
  lookPauseTimer = lookPauseDuration;

  // Save current walk state — pause walking
  savedWalkTimer = walkTimer;

  const pL = headGroup.getObjectByName('catPupilL');
  const pR = headGroup.getObjectByName('catPupilR');
  if (pL) pL.scale.set(0.9, 1.6, 1);
  if (pR) pR.scale.set(0.9, 1.6, 1);

  meowAudio.currentTime = 0;
  meowAudio.play().catch(() => {});
  showMeowBubble('🐱 Meow!');
  updateHint('🐱 The cat is watching you...');
}

// === CLICK HANDLER ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const allCatMeshes = [];
catGroup.traverse(c => { if (c.isMesh) allCatMeshes.push(c); });
const boxMeshes = [];
boxGroup.traverse(c => { if (c.isMesh && !allCatMeshes.includes(c)) boxMeshes.push(c); });

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if (catState === 'in_box') {
    // Check toys first
    const toyHits = raycaster.intersectObjects(toyMeshes, true);
    if (toyHits.length > 0) {
      // Find which toy was clicked
      const hitObj = toyHits[0].object;
      let clickedToy = null;
      for (const toy of toyObjects) {
        let found = false;
        toy.traverse(c => { if (c === hitObj) found = true; });
        if (found) { clickedToy = toy; break; }
      }
      if (clickedToy) {
        activeToy = clickedToy;
        const toyPos = new THREE.Vector3();
        clickedToy.getWorldPosition(toyPos);
        // Jump to near the toy
        const nearToy = toyPos.clone();
        nearToy.x += 0.3;
        nearToy.y = 0;
        startJumpOut(nearToy);
        return;
      }
    }
    // Click box or cat to make cat jump out
    const allTargets = [...allCatMeshes, ...boxMeshes];
    const intersects = raycaster.intersectObjects(allTargets, true);
    if (intersects.length > 0) {
      activeToy = null;
      startJumpOut();
    }
  } else if (catState === 'playing_with_toy') {
    // Click cat during toy play to look at camera
    const intersects = raycaster.intersectObjects(allCatMeshes, true);
    if (intersects.length > 0) {
      startLookAtCamera();
    }
  } else if (catState === 'walking') {
    // Click the cat during walk to make it look at camera
    const intersects = raycaster.intersectObjects(allCatMeshes, true);
    if (intersects.length > 0) {
      startLookAtCamera();
    }
  }
});

renderer.domElement.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const allTargets = [...allCatMeshes, ...boxMeshes, ...toyMeshes];
  const intersects = raycaster.intersectObjects(allTargets, true);
  renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
});

// === UI HINT ===
const hintDiv = document.createElement('div');
hintDiv.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);color:#a08060;font-family:Inter,system-ui,sans-serif;font-size:15px;letter-spacing:0.02em;pointer-events:none;background:rgba(255,252,245,0.85);padding:8px 20px;border-radius:8px;border:1px solid rgba(180,160,130,0.3);z-index:10;transition:opacity 0.5s;';
hintDiv.textContent = '📦 Click the box or a toy to let the cat out!';
document.body.appendChild(hintDiv);

function updateHint(text) {
  hintDiv.textContent = text;
  hintDiv.style.opacity = '1';
}

// === ANIMATION ===
const clock = new THREE.Clock();

function animate() {
  const dt = clock.getDelta();
  const time = clock.getElapsedTime();

  // Lamp flicker
  lampLight.intensity = 2.0 + Math.sin(time * 2) * 0.1;
  ceilingLight.intensity = 1.5 + Math.sin(time * 1.5 + 1) * 0.05;

  // Dust
  const positions = dustGeo.attributes.position.array;
  for (let i = 0; i < dustCount; i++) {
    positions[i * 3 + 1] += Math.sin(time * 0.5 + i) * 0.001;
    positions[i * 3] += Math.cos(time * 0.3 + i * 0.7) * 0.0005;
    if (positions[i * 3 + 1] > 4.5) positions[i * 3 + 1] = 0.5;
  }
  dustGeo.attributes.position.needsUpdate = true;

  // === CAT STATE MACHINE ===
  if (catState === 'jumping_out') {
    jumpProgress += dt * 1.5; // jump takes ~0.67s
    const t = Math.min(jumpProgress, 1);
    const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    catGroup.position.x = THREE.MathUtils.lerp(jumpStartPos.x, jumpEndPos.x, easeT);
    catGroup.position.z = THREE.MathUtils.lerp(jumpStartPos.z, jumpEndPos.z, easeT);
    // Parabolic arc for Y
    const arcY = jumpPeakY * 4 * t * (1 - t);
    catGroup.position.y = THREE.MathUtils.lerp(jumpStartPos.y, jumpEndPos.y, easeT) + arcY;

    // Face direction of travel
    const dir = new THREE.Vector3().subVectors(jumpEndPos, jumpStartPos).normalize();
    catGroup.rotation.y = Math.atan2(dir.x, dir.z);

    if (t >= 1) {
      catGroup.position.y = 0;
      if (activeToy) {
        startPlayingWithToy(activeToy);
      } else {
        startWalking();
        updateHint('🐱 Click the cat while it walks!');
      }
    }
  }

  if (catState === 'walking') {
    // Handle look-at-camera pause
    if (lookPauseActive) {
      lookPauseTimer -= dt;

      // Cat sits still and watches camera — no walking movement
      // Gentle breathing while paused
      catGroup.position.y = 0;

      if (lookPauseTimer <= 0) {
        // Resume walking
        lookPauseActive = false;
        isLookingAtCamera = false;
        lookTimer = 0;

        const pL2 = headGroup.getObjectByName('catPupilL');
        const pR2 = headGroup.getObjectByName('catPupilR');
        if (pL2) pL2.scale.set(0.6, 1.4, 1);
        if (pR2) pR2.scale.set(0.6, 1.4, 1);

        updateHint('🐱 Click the cat while it walks!');
      }
    } else {
      // Normal walking
      walkTimer += dt;

      if (walkTimer >= walkDuration) {
        startJumpBack();
        updateHint('📦 Cat is going back...');
      } else {
        // Move toward current waypoint
        const target = walkPath[currentWaypointIndex];
        const catPos = catGroup.position;
        const dx = target.x - catPos.x;
        const dz = target.z - catPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 0.15) {
          currentWaypointIndex = (currentWaypointIndex + 1) % walkPath.length;
        } else {
          const moveX = (dx / dist) * walkSpeed * dt;
          const moveZ = (dz / dist) * walkSpeed * dt;
          catGroup.position.x += moveX;
          catGroup.position.z += moveZ;

          // Face walking direction
          catGroup.rotation.y = Math.atan2(dx, dz);
        }

        // Walking bounce
        catGroup.position.y = Math.abs(Math.sin(time * 8)) * 0.04;

        // Leg animation
        const legAngle = Math.sin(time * 10) * 0.4;
        if (legFL) { legFL.rotation.x = -0.3 + legAngle; }
        if (legFR) { legFR.rotation.x = -0.3 - legAngle; }

        // Tail up and swaying while walking
        if (tail) tail.rotation.y = Math.sin(time * 3) * 0.15;
      }
    }
  }

  // === TOY PLAY STATE ===
  if (catState === 'playing_with_toy') {
    if (lookPauseActive) {
      lookPauseTimer -= dt;
      if (lookPauseTimer <= 0) {
        lookPauseActive = false;
        isLookingAtCamera = false;
        const pL2 = headGroup.getObjectByName('catPupilL');
        const pR2 = headGroup.getObjectByName('catPupilR');
        if (pL2) pL2.scale.set(0.6, 1.4, 1);
        if (pR2) pR2.scale.set(0.6, 1.4, 1);
        updateHint('🐱 The cat is playing!');
      }
    } else {
      playTimer += dt;
      if (playTimer >= playDuration) {
        // Done playing, jump back
        if (activeToy) activeToy.position.copy(toyOriginalPos);
        activeToy = null;
        startJumpBack();
        updateHint('📦 Cat is going back...');
      } else {
        // Play animations based on which toy
        const pt = playTimer;
        if (activeToy === yarnBall) {
          // Bat the yarn ball around
          const batAngle = Math.sin(pt * 4) * 0.3;
          catGroup.rotation.y = Math.atan2(
            activeToy.position.x - catGroup.position.x,
            activeToy.position.z - catGroup.position.z
          ) + batAngle * 0.3;
          // Paw batting motion
          if (legFL) legFL.rotation.x = -0.3 + Math.sin(pt * 8) * 0.5;
          // Ball rolls
          yarnBall.position.x = toyOriginalPos.x + Math.sin(pt * 3) * 0.25;
          yarnBall.position.z = toyOriginalPos.z + Math.cos(pt * 2.5) * 0.2;
          yarnBall.rotation.x += dt * 5;
          yarnBall.rotation.z += dt * 3;
          // Cat bounces
          catGroup.position.y = Math.abs(Math.sin(pt * 6)) * 0.05;
        } else if (activeToy === mouseToy) {
          // Pounce and stalk
          const pouncePhase = (pt % 2.0) / 2.0;
          if (pouncePhase < 0.4) {
            // Crouch
            catGroup.scale.y = 0.85;
            catGroup.position.y = -0.02;
          } else if (pouncePhase < 0.6) {
            // Pounce!
            catGroup.scale.y = 1.1;
            catGroup.position.y = Math.sin((pouncePhase - 0.4) / 0.2 * Math.PI) * 0.2;
          } else {
            catGroup.scale.y = 1.0;
            catGroup.position.y = 0;
          }
          // Mouse skitters
          mouseToy.position.x = toyOriginalPos.x + Math.sin(pt * 5) * 0.15;
          mouseToy.position.z = toyOriginalPos.z + Math.cos(pt * 4) * 0.15;
          mouseToy.rotation.y = pt * 8;
          // Cat faces mouse
          catGroup.rotation.y = Math.atan2(
            mouseToy.position.x - catGroup.position.x,
            mouseToy.position.z - catGroup.position.z
          );
        } else if (activeToy === jingleBall) {
          // Swat the ball
          if (legFL) legFL.rotation.x = -0.3 + Math.sin(pt * 6) * 0.6;
          if (legFR) legFR.rotation.x = -0.3 + Math.cos(pt * 6) * 0.6;
          jingleBall.position.x = toyOriginalPos.x + Math.sin(pt * 4) * 0.3;
          jingleBall.position.z = toyOriginalPos.z + Math.cos(pt * 3.5) * 0.25;
          jingleBall.rotation.x += dt * 10;
          jingleBall.rotation.z += dt * 7;
          // Cat follows
          const jDir = new THREE.Vector3(
            jingleBall.position.x - catGroup.position.x, 0,
            jingleBall.position.z - catGroup.position.z
          );
          if (jDir.length() > 0.3) {
            jDir.normalize();
            catGroup.position.x += jDir.x * dt * 1.5;
            catGroup.position.z += jDir.z * dt * 1.5;
          }
          catGroup.rotation.y = Math.atan2(jDir.x, jDir.z);
          catGroup.position.y = Math.abs(Math.sin(pt * 8)) * 0.04;
        }
      }
    }
  }

  if (catState === 'jumping_back') {
    jumpProgress += dt * 1.5;
    const t = Math.min(jumpProgress, 1);
    const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    catGroup.position.x = THREE.MathUtils.lerp(jumpStartPos.x, jumpEndPos.x, easeT);
    catGroup.position.z = THREE.MathUtils.lerp(jumpStartPos.z, jumpEndPos.z, easeT);
    const arcY = jumpPeakY * 4 * t * (1 - t);
    catGroup.position.y = THREE.MathUtils.lerp(jumpStartPos.y, jumpEndPos.y, easeT) + arcY;

    const dir2 = new THREE.Vector3().subVectors(jumpEndPos, jumpStartPos).normalize();
    catGroup.rotation.y = Math.atan2(dir2.x, dir2.z);

    if (t >= 1) {
      finishJumpBack();
      updateHint('📦 Click the box or a toy to let the cat out again!');
    }
  }

  // === HEAD / LOOK BEHAVIOR ===
  // Look timer is now managed by the pause system — no standalone timeout needed

  const hg = headGroup;
  if (hg) {
    if (isLookingAtCamera) {
      const catWorldPos = new THREE.Vector3();
      hg.getWorldPosition(catWorldPos);
      const dirCam = new THREE.Vector3().subVectors(camera.position, catWorldPos).normalize();
      // Convert to local space relative to cat body facing
      const catFacing = catGroup.rotation.y;
      const angleToCamera = Math.atan2(dirCam.x, dirCam.z) - catFacing;
      const targetY = THREE.MathUtils.clamp(angleToCamera, -1.0, 1.0);
      const targetX = THREE.MathUtils.clamp(-Math.asin(dirCam.y) * 0.4, -0.3, 0.3);
      hg.rotation.y += (targetY - hg.rotation.y) * 0.1;
      hg.rotation.x += (targetX - hg.rotation.x) * 0.1;
    } else {
      const idleY = Math.sin(time * 0.4) * 0.08;
      const idleX = Math.sin(time * 0.25) * 0.03;
      hg.rotation.y += (idleY - hg.rotation.y) * 0.05;
      hg.rotation.x += (idleX - hg.rotation.x) * 0.05;
    }
  }

  // Breathing (only when in box or walking idle)
  if (catState === 'in_box' || catState === 'walking') {
    catGroup.scale.y = 1 + Math.sin(time * 1.8) * 0.012;
    catGroup.scale.x = 1;
    catGroup.scale.z = 1;
  }

  // Ear twitch
  if (earL && earR) {
    const twitch = Math.sin(time * 3.0) > 0.95 ? 0.15 : 0;
    earL.rotation.z = 0.2 + twitch;
    earR.rotation.z = -0.2 - twitch * 0.5;
  }

  // Eye blink
  if (!isLookingAtCamera) {
    const pL3 = headGroup.getObjectByName('catPupilL');
    const pR3 = headGroup.getObjectByName('catPupilR');
    if (pL3 && pR3) {
      const blinkCycle = time % 4.0;
      const blinkScale = (blinkCycle > 3.8 && blinkCycle < 3.95) ? 0.1 : 1.0;
      pL3.scale.set(0.6, 1.4 * blinkScale, 1);
      pR3.scale.set(0.6, 1.4 * blinkScale, 1);
    }
  }

  // Tail sway in box
  if (catState === 'in_box' && tail) {
    tail.rotation.y = Math.sin(time * 0.6) * 0.05;
  }

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});