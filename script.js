// Scene, Camera, and Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("globe-container").appendChild(renderer.domElement);

// Adding the Globe
const geometry = new THREE.SphereGeometry(5, 64, 64);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Earth_Eastern_Hemisphere.jpg/1200px-Earth_Eastern_Hemisphere.jpg');
const material = new THREE.MeshBasicMaterial({ map: earthTexture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Light and Marker Setup
const light = new THREE.PointLight(0xff0000, 2, 10);
scene.add(light);

const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const marker = new THREE.Mesh(markerGeometry, markerMaterial);
scene.add(marker);

// Position the Camera
camera.position.z = 10;

// Animate the Globe and Marker Blinking Effect
function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002;
  light.intensity = Math.abs(Math.sin(Date.now() * 0.005)) * 2; // Blinking effect
  renderer.render(scene, camera);
}
animate();

// Responsive Design
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Highlight Country Function
function highlightCountry(countryName) {
  const countries = {
    "usa": { x: 2, y: 1 },
    "india": { x: 1, y: -2 },
    "australia": { x: -1, y: -3 },
    "canada": { x: 3, y: 2 },
    "uk": { x: 0, y: 3 },
  };

  if (countries[countryName]) {
    const coords = countries[countryName];
    console.log(`Highlighting ${countryName} at coordinates:`, coords);

    // Move marker and light to the location
    marker.position.set(coords.x, coords.y, 5);
    light.position.set(coords.x, coords.y, 5);

    camera.position.set(coords.x, coords.y, 10);
    camera.lookAt(coords.x, coords.y, 0);
  } else {
    console.log("Sorry, country not found.");
  }
}

// Web Speech API Setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Mic Icon Click Event to Start Voice Recognition
document.getElementById("mic-icon").addEventListener("click", () => {
  console.log("Voice recognition started. Speak now...");
  recognition.start();
});

// Voice Recognition Result
recognition.onresult = (event) => {
  const countrySpoken = event.results[0][0].transcript.trim().toLowerCase();
  console.log("You said:", countrySpoken);
  highlightCountry(countrySpoken);
};

recognition.onerror = (event) => {
  console.error('Voice recognition error:', event.error);
};
