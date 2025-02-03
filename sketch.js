let faceMesh;
let faces = [];
let video;


let options = {
  maxFaces: 1,          
  refineLandmarks: false,
  flipHorizontal: false 
};

// 4 Jingju masks
let masks = [];
let currentMaskIndex = 0;


const FOREHEAD = 10;
const CHIN = 152;
const LEFT_FACE = 234;
const RIGHT_FACE = 454;

function preload() {
  //  Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
  masks[0] = loadImage('mask2.png');
  masks[1] = loadImage('mask3.png');
  masks[2] = loadImage('mask4.png');
  masks[3] = loadImage('mask5.png');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  //  Start FaceMesh detection
  faceMesh.detectStart(video, gotFaces);

  //  Create a button to toggle masks
  let toggleButton = createButton('Toggle Mask');
  toggleButton.mousePressed(toggleMask);
}


// draw on the canvas

function draw() {
  image(video, 0, 0, width, height);

  // If we have at least one face, overlay the mask
  if (faces.length > 0) {
    drawMask(faces[0]);
  }
}


// Callback for when FaceMesh finds faces
 
function gotFaces(results) {
  faces = results;
}


//Draw the currently selected Jingju mask on the face
 
function drawMask(face) {
  // Each element of face.keypoints has { x, y, z, ... } for each landmark
  let keypoints = face.keypoints;

  //get the forehead, chin, left face boundary, and right face boundary
  let forehead = keypoints[FOREHEAD];
  let chin = keypoints[CHIN];
  let leftBoundary = keypoints[LEFT_FACE];
  let rightBoundary = keypoints[RIGHT_FACE];

  // If any of them is undefined, skip drawing (face not fully in frame, etc.)
  if (!forehead || !chin || !leftBoundary || !rightBoundary) return;

  // Measure face height (forehead -> chin)
  let faceHeight = dist(forehead.x, forehead.y, chin.x, chin.y);

  // Measure face width (left boundary -> right boundary)
  let faceWidth = dist(leftBoundary.x, leftBoundary.y, rightBoundary.x, rightBoundary.y);

  // Midpoint between forehead and chin for positioning
  let midX = (forehead.x + chin.x) / 2;
  let midY = (forehead.y + chin.y) / 2;

  // Pick the current mask image
  let img = masks[currentMaskIndex];

  // Scale the mask to be slightly larger than the face dimensions
  let maskWidth = faceWidth * 1.2;
  let maskHeight = faceHeight * 1.3;

  // Position so the mask is centered on the midpoint
  let x = midX - maskWidth / 2;
  let y = midY - maskHeight / 2;

  // Draw the mask on the canvas
  image(img, x, y, maskWidth, maskHeight);
}

//shift and change mask
function toggleMask() {
  currentMaskIndex = (currentMaskIndex + 1) % masks.length;
}
