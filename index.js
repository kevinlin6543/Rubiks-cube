var gl;
var canvas;
var program;
var cBuffer;
var vColor;
var fileContent;
var fileLoaded = false;
var s = 1; // Side length
var spacing = 2.1;
var rotationAngle = 3; 
var animateTime = 1;
var numOfVertices = 36;

// projection and modelView matrices
var _projectionMatrix;
var _modelViewMatrix;
var PROJMATRIX = mat4();
var MVMATRIX = mat4();

// Used for Camera
var eye = vec3(0.0, 0.0, 4.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var cameraRadius = 20.0;
var cameraRadiusMinimum = 12.5; 
var cameraRadiusMaximum = 50.0; 
var THETA = radians(20);
var PHI = radians(70);
var fovy = 45.0;  
var aspect = 1.0;
var near = 0.3;
var far = 1000;

var vertices = [
  vec3(-s,-s,-s), vec3( s,-s,-s), vec3( s, s,-s), vec3(-s, s,-s),
  vec3(-s,-s, s), vec3( s,-s, s), vec3( s, s, s), vec3(-s, s, s),
  vec3(-s,-s,-s), vec3(-s, s,-s), vec3(-s, s, s), vec3(-s,-s, s),
  vec3( s,-s,-s), vec3( s, s,-s), vec3( s, s, s), vec3( s,-s, s),
  vec3(-s,-s,-s), vec3(-s,-s, s), vec3( s,-s, s), vec3( s,-s,-s),
  vec3(-s, s,-s), vec3(-s, s, s), vec3( s, s, s), vec3( s, s,-s),
];

var startVertexColors = [
  // Green (Back face)
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  // Blue (Front face)
  vec4( 0.0, 0.0, 1.0, 1.0 ), 
  vec4( 0.0, 0.0, 1.0, 1.0 ),  
  vec4( 0.0, 0.0, 1.0, 1.0 ),   
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  // Orange (Left face)
  vec4( 1.0, 0.5, 0.0, 1.0 ),   
  vec4( 1.0, 0.5, 0.0, 1.0 ),   
  vec4( 1.0, 0.5, 0.0, 1.0 ),   
  vec4( 1.0, 0.5, 0.0, 1.0 ),
  // Red (Right face)
  vec4( 1.0, 0.0, 0.0, 1.0 ),   
  vec4( 1.0, 0.0, 0.0, 1.0 ),  
  vec4( 1.0, 0.0, 0.0, 1.0 ),   
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  // White (Bottom face)
  vec4( 1.0, 1.0, 1.0, 1.0 ), 
  vec4( 1.0, 1.0, 1.0, 1.0 ), 
  vec4( 1.0, 1.0, 1.0, 1.0 ),  
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  // Yellow (Top face)
  vec4( 1.0, 1.0, 0.0, 1.0 ),   
  vec4( 1.0, 1.0, 0.0, 1.0 ),   
  vec4( 1.0, 1.0, 0.0, 1.0 ),  
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  // Black
  vec4( 0.0, 0.0, 0.0, 1.0 ),  
];
var vertexColors = [
  // Green (Back face)
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  // Blue (Front face)
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  // Orange (Left face)
  vec4( 1.0, 0.5, 0.0, 1.0 ),
  vec4( 1.0, 0.5, 0.0, 1.0 ),
  vec4( 1.0, 0.5, 0.0, 1.0 ),
  vec4( 1.0, 0.5, 0.0, 1.0 ),
  // Red (Right face)
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  // White (Bottom face)
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  // Yellow (Top face)
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
];

var cubeState = [ [[[],[],[]], [[],[],[]], [[],[],[]]],
                  [[[],[],[]], [[],[],[]], [[],[],[]]],
                  [[[],[],[]], [[],[],[]], [[],[],[]]] ];

// Define indices for each position of cube
var index = [
    0,1,2,      0,2,3,   
    4,5,6,      4,6,7,   
    8,9,10,     8,10,11,  
    12,13,14,   12,14,15,
    16,17,18,   16,18,19, 
    20,21,22,   20,22,23  
];

// Moves for random generation. Duplicates are present in case rng results in identical moves
var moves = [
  "L","l","R","r","U","u",
  "D","d","F","f","B","b",
  "L","l","R","r","U","u",
  "D","d","F","f","B","b"
];

var txtFile = null,
  maketextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});
    if (txtFile !== null)
      window.URL.revokeObjectURL(txtFile);
    txtFile = window.URL.createObjectURL(data);
    return txtFile;
};

// Detects what face and orientation the cube is at.
function decipherMove(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  if(animationQueue.length < 9999) {
    var theta = degrees(THETA)%360;
    var phi = degrees(PHI)%360;
    if ((phi >= -135 && phi < -45) || (phi >= 225 && phi < 315)) {
      if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
        pushAnimation(a);
      } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
        pushAnimation(b);
      } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
        pushAnimation(c);
      } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
        pushAnimation(d);
      }
    } else if (phi < -315 || (phi >= -45 && phi < 45) || phi >= 315) {
      if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315)
        pushAnimation(e);
      else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135))
        pushAnimation(f);
      else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225))
        pushAnimation(g);
      else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315))
        pushAnimation(h);
    } else if((phi >= -315 && phi < -225) || (phi >= 45 && phi < 135)) {
      if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315)
        pushAnimation(i);
      else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135))
        pushAnimation(j);
      else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225))
        pushAnimation(k);
      else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315))
        pushAnimation(l);
    } else {
      if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) 
        pushAnimation(m);
      else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) 
        pushAnimation(n);
      else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) 
        pushAnimation(o);
      else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) 
        pushAnimation(p);
    }
  } else 
      console.log("Queue Full");
}

// Defines Transformation relative to the Green face
function Ltransform() {
  decipherMove("L","F","R","B","L","F","R","B","L","F","R","B","L","F","R","B");
}
function Rtransform() {
  decipherMove("R","B","L","F","R","B","L","F","R","B","L","F","R","B","L","F");
}
function Utransform() {
  decipherMove("D","D","D","D","B","L","F","R","U","U","U","U","F","R","B","L");
}
function Dtransform() {
  decipherMove("U","U","U","U","F","R","B","L","D","D","D","D","B","L","F","R");
}
function Ftransform() {
  decipherMove("B","L","F","R","U","U","U","U","F","R","B","L","D","D","D","D");
}
function Btransform() {
  decipherMove("F","R","B","L","D","D","D","D","B","L","F","R","U","U","U","U");
}
function Mtransform() {
  decipherMove("M","S","m","s","M","S","m","s","M","S","m","s","M","S","m","s");
}
function Etransform() {
  decipherMove("e","e","e","e","S","m","s","M","E","E","E","E","s","M","S","m");
}
function Stransform() {
  decipherMove("s","M","S","m","e","e","e","e","S","m","s","M","E","E","E","E");
}
function Litransform() {
  decipherMove("l","f","r","b","l","f","r","b","l","f","r","b","l","f","r","b");
}
function Ritransform() {
  decipherMove("r","b","l","f","r","b","l","f","r","b","l","f","r","b","l","f");
}
function Uitransform() {
  decipherMove("d","d","d","d","b","l","f","r","u","u","u","u","f","r","b","l");
}
function Ditransform() {
  decipherMove("u","u","u","u","f","r","b","l","d","d","d","d","b","l","f","r");
}
function Fitransform() {
  decipherMove("b","l","f","r","u","u","u","u","f","r","b","l","d","d","d","d");
}
function Bitransform() {
  decipherMove("f","r","b","l","d","d","d","d","b","l","f","r","u","u","u","u");
}
function Mitransform() {
  decipherMove("m","s","M","S","m","s","M","S","m","s","M","S","m","s","M","S");
}
function Eitransform() {
  decipherMove("E","E","E","E","s","M","S","m","e","e","e","e","S","m","s","M");
}
function Sitransform() {
  decipherMove("S","m","s","M","E","E","E","E","s","M","S","m","e","e","e","e");
}


window.onload = function init() {
  if (window.File && window.FileReader && window.FileList && window.Blob) 
    console.log("Everything works!");
  else 
    console.log("Not all the file APIs are supported!");
  canvas = document.getElementById("gl-canvas");

  document.onkeydown = function(event) {
    if (event.key === "1")
      Ltransform();
    else if (event.key === "2")
      Rtransform();
    else if (event.key === "3")
      Utransform();
    else if (event.key === "4")
      Dtransform();
    else if (event.key === "5")
      Ftransform();
    else if (event.key === "6")
      Btransform();
    else if (event.key === "7")
      Mtransform();
    else if (event.key === "8")
      Etransform();
    else if (event.key === "9")
      Stransform();
    else if (event.key === "!")
      Litransform();
    else if (event.key === "@")
      Ritransform();
    else if (event.key === "#")
      Uitransform();
    else if (event.key === "$")
      Ditransform();
    else if (event.key === "%")
      Fitransform();
    else if (event.key === "^")
      Bitransform();
    else if (event.key === "&")
      Mitransform();
    else if (event.key === "*")
      Eitransform();
    else if (event.key === "(")
      Sitransform();
    else if(event.key === "ArrowLeft") // left arrow
      THETA += 0.2;
    else if(event.key === "ArrowUp") // up arrow
      PHI += 0.1;
    else if(event.key === "ArrowRight") // right arrow
      THETA -= 0.2;
    else if(event.key === "ArrowDown") // down arrow
      PHI -= 0.1;
    else if(event.key === "Escape") // ESC
      animationQueue = [];
  };
  var drag = false;
  var oldPosX, oldPosY;
  var isHeld = false;
  var mouseDown = function(e) {
    drag = true;
    oldPosX = e.pageX;
    oldPosY = e.pageY;
    e.preventDefault();
    return false;
  };
  var mouseUp = function(e) {drag = false;};
  var mouseMove = function(e) {
    if (!drag) {return false;}
    var dX = e.pageX - oldPosX;
    var dY = e.pageY - oldPosY;
    var magPhi = Math.abs(degrees(PHI)%360);
    
    // Allow for rotation past the theta and phi limit by resetting
    if (magPhi > 180.0 && magPhi < 270.0 || PHI < 0.0) {
      if (degrees(PHI)%360 < -180.0) {
        up = vec3(0.0, 1.0, 0.0);
        THETA += -dX*2*Math.PI/canvas.width;
      } else {
        up = vec3(0.0, -1.0, 0.0);
        THETA += dX*2*Math.PI/canvas.width;
      }
    } else {
      if (magPhi > 270.0) {
        up = vec3(0.0, -1.0, 0.0);
        THETA += dX*2*Math.PI/canvas.width;
      } else {
        up = vec3(0.0, 1.0, 0.0);
        THETA += -dX*2*Math.PI/canvas.width;
      }
    }
    PHI += -dY*2*Math.PI/canvas.height;
    
    oldPosX = e.pageX;
    oldPosY = e.pageY;
    e.preventDefault();
  };

  // Handles zoom in and out
  var mouseWheel = function(e) {
    if (cameraRadius - e.wheelDelta/75 < cameraRadiusMinimum)
      cameraRadius = cameraRadiusMinimum;
    else if (cameraRadius - e.wheelDelta/75 > cameraRadiusMaximum)
      cameraRadius = cameraRadiusMaximum;
    else
      cameraRadius -= e.wheelDelta/75;
  };
  // Event listneers for primary actions
  canvas.addEventListener("mousewheel", mouseWheel, false);
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  document.getElementById( "LButton" ).onclick = Ltransform;
  document.getElementById( "RButton" ).onclick = Rtransform;
  document.getElementById( "UButton" ).onclick = Utransform;
  document.getElementById( "DButton" ).onclick = Dtransform;
  document.getElementById( "FButton" ).onclick = Ftransform;
  document.getElementById( "BButton" ).onclick = Btransform;
  document.getElementById( "MButton" ).onclick = Mtransform;
  document.getElementById( "EButton" ).onclick = Etransform;
  document.getElementById( "SButton" ).onclick = Stransform;
  document.getElementById( "LiButton" ).onclick = Litransform;
  document.getElementById( "RiButton" ).onclick = Ritransform;
  document.getElementById( "UiButton" ).onclick = Uitransform;
  document.getElementById( "DiButton" ).onclick = Ditransform;
  document.getElementById( "FiButton" ).onclick = Fitransform;
  document.getElementById( "BiButton" ).onclick = Bitransform;
  document.getElementById( "MiButton" ).onclick = Mitransform;
  document.getElementById( "EiButton" ).onclick = Eitransform;
  document.getElementById( "SiButton" ).onclick = Sitransform;
  document.getElementById( "randomTurnCount").onkeypress = function(e) {
    if (!e)
      e = window.event;
    if (e.key === "Enter") {
      makeRandomTurns();
      return false;
    }
  };
  document.getElementById( "RandomButton" ).onclick = makeRandomTurns;
  function makeRandomTurns() {
    var input = document.getElementById("randomTurnCount").value;
    if(isNaN(input) || !input)
      alert("Error: Invalid Input");
    else if (input > 9999 || input < 0)
      alert("Error: Value entered is outside the range");
    else if (animationQueue.length !== 0)
      alert("Queue is not ready for more moves");
    else {
      var randTurn, previousTurn;
      for (i = 0; i < input; i++) {
        randTurn = Math.round(Math.random()*1000)%16;
        if ((randTurn%2 === 0 && previousTurn === moves[randTurn+1])||(randTurn%2 === 1 && previousTurn === moves[randTurn-1])){
          pushAnimation(moves[randTurn+6]);
          previousTurn = moves[randTurn+6];
        } else {
          pushAnimation(moves[randTurn]);
          previousTurn = moves[randTurn];
        }
      }
    }
  }

  document.getElementById( "LoadButton" ).onclick = function () {
    if (!fileLoaded)
      alert("Error: Did not enter proper save state");
    else
      cubeState = fileContent.slice();
  };

  // handles saving of the cube state
  document.getElementById( "SaveButton" ).onclick = function () {
    var link = document.getElementById("downloadlink");
    link.href = maketextFile(JSON.stringify(cubeState));
    link.innerHTML = "Press to Download Save State";
  };
  
  // Set up WebGL and all aspects like described in the textbooks example projects
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) 
    alert("WebGL not available");
  
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.5);
  
  gl.enable(gl.DEPTH_TEST);
  
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  
  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(index), gl.STATIC_DRAW);
  
  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
  
  vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
  gl.enableVertexAttribArray(vColor);
  
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  
  var _vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(_vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(_vPosition);
  
  _projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
  _modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
  
  fillcubeStates();
  render();
};

var pColor = vec4(0.0, 0.0, 0.0, 0.85);
function reColor(x,y,z) {
  for (i = 0; i < vertexColors.length; i++) {
    vertexColors[i] = startVertexColors[i];
  }
  function darken(index) {
    for (i = index; i < index + 4; i++)
      vertexColors[i] = pColor;
  }
  if (x !== -1) 
    darken(8);
  if (x !== 1) 
    darken(12);
  if (y !== -1) 
    darken(16);
  if (y !== 1) 
    darken(20);
  if (z !== -1) 
    darken(0);
  if (z !== 1) 
    darken(4);
  

}
// Loops through all cube states to determine if the cube is in a finished state
function checkSolved() {
  var orientation;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      orientation = cubeState[0][0][0][3];
      for (x = -1; x < 2; x++) {
        for (y = -1; y < 2; y++) {
          for (z = -1; z < 2; z++) {
            if (cubeState[x+1][y+1][z+1][3][i][j] !== orientation[i][j]) {
              if (x === 0 && z === 0) {
                if (cubeState[x+1][y+1][z+1][3][1][j] !== orientation[1][j])
                  return false;
              } else if (x === 0 && y === 0) {
                if (cubeState[x+1][y+1][z+1][3][2][j] !== orientation[2][j])
                  return false;
              } else if (y === 0 && z === 0) {
                if (cubeState[x+1][y+1][z+1][3][0][j] !== orientation[0][j])
                  return false;
              } else
                return false;
            }
          }
        }
      }
    }
  }
  return true; // Only reached if all match
}

// Sets up Cube state variables
function fillcubeStates() {
  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      for (k = -1; k < 2; k++) {
        cubeState[i+1][j+1][k+1][0] = i; // x Position
        cubeState[i+1][j+1][k+1][1] = j; // y Position
        cubeState[i+1][j+1][k+1][2] = k; // z Position
        cubeState[i+1][j+1][k+1][3] = [vec3(-1,0,0),vec3(0,-1,0),vec3(0,0,-1)]; // Cube reference Axis
        cubeState[i+1][j+1][k+1][4] = mat4(); // Cube rotation matrix
      }
    }
  }
}

function negateVec(vec) {
  var temp = [];
  for (i=0; i < vec.length; i++)
    temp[i] = -vec[i];
  return temp;
}
// setter and getter functions
function getRotationAxes(x,y,z) {
  return cubeState[x+1][y+1][z+1][3];
}
function getRotationMatrix(x,y,z) {
  return cubeState[x+1][y+1][z+1][4];
}
function setRotationMatrix(x,y,z,m) {
  cubeState[x+1][y+1][z+1][4] = m;
}

var curAngle = 0;
var interval;
var isAnimating = false;
var animationQueue = [];

function pushAnimation(face) {
  animationQueue.push(face);
}

function animate(action) {
  interval = setInterval(function() {callRotation(action)}, animateTime);
}


function callRotation(face) {
  turnFace(face);
  curAngle += rotationAngle;
  if (curAngle === 90) { // Checks for finished rotation
    clearInterval(interval);
    isAnimating = false;
    curAngle = 0;
    turnFinished(face);
    if (checkSolved()) {
      window.alert("Cube Done");
    }
  }
}

function switchValues(val1, val2, neg) {
  var temp;
  if (neg === 1) {
    temp = val1;
    val1 = val2;
    val2 = -temp;
  }
  else if (neg === 2) {
    temp = val1;
    val1 = negateVec(val2);
    val2 = temp;
  }
}

// Adjusts cube state once move is finalized
function turnFinished(face) {
  var x, y, z, temp;
  for (x = -1; x < 2; x++) {
    for (y = -1; y < 2; y++) {
      for (z = -1; z < 2; z++) {
        switch (face) {
         case "L":
          if (cubeState[x+1][y+1][z+1][0] === -1) {
            // switchValues(cubeState[x+1][y+1][z+1][2], cubeState[x+1][y+1][z+1][1], 1);
            // switchValues(cubeState[x+1][y+1][z+1][3][1], cubeState[x+1][y+1][z+1][3][2], 2);
            temp = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = -temp;
            temp = cubeState[x+1][y+1][z+1][3][1];
            cubeState[x+1][y+1][z+1][3][1] = negateVec(cubeState[x+1][y+1][z+1][3][2]);
            cubeState[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "l":
          if (cubeState[x+1][y+1][z+1][0] === -1) {
            //switchValues(cubeState[x+1][y+1][z+1][1], cubeState[x+1][y+1][z+1][2], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][2], cubeState[x+1][y+1][z+1][3][1], 2);

            temp = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = -temp;
            temp = cubeState[x+1][y+1][z+1][3][2];
            cubeState[x+1][y+1][z+1][3][2] = negateVec(cubeState[x+1][y+1][z+1][3][1]);
            cubeState[x+1][y+1][z+1][3][1] = temp;

          }
          break;
         case "R":
          if (cubeState[x+1][y+1][z+1][0] === 1) {
            //switchValues(cubeState[x+1][y+1][z+1][1], cubeState[x+1][y+1][z+1][2], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][2], cubeState[x+1][y+1][z+1][3][1], 2);

            temp = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = -temp;
            temp = cubeState[x+1][y+1][z+1][3][2];
            cubeState[x+1][y+1][z+1][3][2] = negateVec(cubeState[x+1][y+1][z+1][3][1]);
            cubeState[x+1][y+1][z+1][3][1] = temp;

          }
          break;
         case "r":
          if (cubeState[x+1][y+1][z+1][0] === 1) {
            //switchValues(cubeState[x+1][y+1][z+1][2], cubeState[x+1][y+1][z+1][1], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][1], cubeState[x+1][y+1][z+1][3][2], 2);

            temp = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = -temp;
            temp = cubeState[x+1][y+1][z+1][3][1];
            cubeState[x+1][y+1][z+1][3][1] = negateVec(cubeState[x+1][y+1][z+1][3][2]);
            cubeState[x+1][y+1][z+1][3][2] = temp;

          }
          break;
         case "U":
          if (cubeState[x+1][y+1][z+1][1] === 1) {
            //switchValues(cubeState[x+1][y+1][z+1][2], cubeState[x+1][y+1][z+1][0], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][0], cubeState[x+1][y+1][z+1][3][2], 2);

            temp = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][0];
            cubeState[x+1][y+1][z+1][3][0] = negateVec(cubeState[x+1][y+1][z+1][3][2]);
            cubeState[x+1][y+1][z+1][3][2] = temp;

          }
          break;
         case "u":
          if (cubeState[x+1][y+1][z+1][1] === 1) {
            //switchValues(cubeState[x+1][y+1][z+1][0], cubeState[x+1][y+1][z+1][2], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][2], cubeState[x+1][y+1][z+1][3][0], 2);

            temp = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][2];
            cubeState[x+1][y+1][z+1][3][2] = negateVec(cubeState[x+1][y+1][z+1][3][0]);
            cubeState[x+1][y+1][z+1][3][0] = temp;

          }
          break;
         case "D":
          if (cubeState[x+1][y+1][z+1][1] === -1) {
            //switchValues(cubeState[x+1][y+1][z+1][0], cubeState[x+1][y+1][z+1][2], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][2], cubeState[x+1][y+1][z+1][3][0], 2);

            temp = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][2];
            cubeState[x+1][y+1][z+1][3][2] = negateVec(cubeState[x+1][y+1][z+1][3][0]);
            cubeState[x+1][y+1][z+1][3][0] = temp;

          }
          break;
         case "d":
          if (cubeState[x+1][y+1][z+1][1] === -1) {
            //switchValues(cubeState[x+1][y+1][z+1][2], cubeState[x+1][y+1][z+1][0], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][0], cubeState[x+1][y+1][z+1][3][2], 2)

            temp = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][0];
            cubeState[x+1][y+1][z+1][3][0] = negateVec(cubeState[x+1][y+1][z+1][3][2]);
            cubeState[x+1][y+1][z+1][3][2] = temp;

          }
          break;
         case "E":
          if (cubeState[x+1][y+1][z+1][1] === 0) {
            //switchValues(cubeState[x+1][y+1][z+1][0], cubeState[x+1][y+1][z+1][2], 1);
           // switchValues(cubeState[x+1][y+1][z+1][3][2], cubeState[x+1][y+1][z+1][3][0], 2);

            temp = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][2];
            cubeState[x+1][y+1][z+1][3][2] = negateVec(cubeState[x+1][y+1][z+1][3][0]);
            cubeState[x+1][y+1][z+1][3][0] = temp;

          }
          break;
         case "e":
          if (cubeState[x+1][y+1][z+1][1] === 0) {
            //switchValues(cubeState[x+1][y+1][z+1][2], cubeState[x+1][y+1][z+1][0], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][0], cubeState[x+1][y+1][z+1][3][2], 2);

            temp = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][0];
            cubeState[x+1][y+1][z+1][3][0] = negateVec(cubeState[x+1][y+1][z+1][3][2]);
            cubeState[x+1][y+1][z+1][3][2] = temp;

          }
          break;
         case "F":
          if (cubeState[x+1][y+1][z+1][2] === 1) {
            //switchValues(cubeState[x+1][y+1][z+1][0], cubeState[x+1][y+1][z+1][1], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][1], cubeState[x+1][y+1][z+1][3][0], 2);

            temp = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][1];
            cubeState[x+1][y+1][z+1][3][1] = negateVec(cubeState[x+1][y+1][z+1][3][0]);
            cubeState[x+1][y+1][z+1][3][0] = temp;

          }
          break;
         case "f":
          if (cubeState[x+1][y+1][z+1][2] === 1) {
            //switchValues(cubeState[x+1][y+1][z+1][1], cubeState[x+1][y+1][z+1][0], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][0], cubeState[x+1][y+1][z+1][3][1], 2);

            temp = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][0];
            cubeState[x+1][y+1][z+1][3][0] = negateVec(cubeState[x+1][y+1][z+1][3][1]);
            cubeState[x+1][y+1][z+1][3][1] = temp;

          }
          break;
         case "S":
          if (cubeState[x+1][y+1][z+1][2] === 0) {
            //switchValues(cubeState[x+1][y+1][z+1][0], cubeState[x+1][y+1][z+1][1], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][1], cubeState[x+1][y+1][z+1][3][0], 2);

            temp = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][1];
            cubeState[x+1][y+1][z+1][3][1] = negateVec(cubeState[x+1][y+1][z+1][3][0]);
            cubeState[x+1][y+1][z+1][3][0] = temp;

          }
          break;
         case "s":
          if (cubeState[x+1][y+1][z+1][2] === 0) {
            //switchValues(cubeState[x+1][y+1][z+1][1], cubeState[x+1][y+1][z+1][0], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][0], cubeState[x+1][y+1][z+1][3][1], 2);

            temp = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][0];
            cubeState[x+1][y+1][z+1][3][0] = negateVec(cubeState[x+1][y+1][z+1][3][1]);
            cubeState[x+1][y+1][z+1][3][1] = temp;

          }
          break;
         case "B":
          if (cubeState[x+1][y+1][z+1][2] === -1) {
            //switchValues(cubeState[x+1][y+1][z+1][1], cubeState[x+1][y+1][z+1][0], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][0], cubeState[x+1][y+1][z+1][3][1], 2);

            temp = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][0];
            cubeState[x+1][y+1][z+1][3][0] = negateVec(cubeState[x+1][y+1][z+1][3][1]);
            cubeState[x+1][y+1][z+1][3][1] = temp;

          }
          break;
         case "b":
          if (cubeState[x+1][y+1][z+1][2] === -1) {
            //switchValues(cubeState[x+1][y+1][z+1][0], cubeState[x+1][y+1][z+1][1], 1);
           // switchValues(cubeState[x+1][y+1][z+1][3][1], cubeState[x+1][y+1][z+1][3][0], 2);

            temp = cubeState[x+1][y+1][z+1][0];
            cubeState[x+1][y+1][z+1][0] = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][1];
            cubeState[x+1][y+1][z+1][3][1] = negateVec(cubeState[x+1][y+1][z+1][3][0]);
            cubeState[x+1][y+1][z+1][3][0] = temp;

          }
          break;
         case "M":
          if (cubeState[x+1][y+1][z+1][0] === 0) {
            //switchValues(cubeState[x+1][y+1][z+1][2], cubeState[x+1][y+1][z+1][1], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][1], cubeState[x+1][y+1][z+1][3][2], 2);

            temp = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][1];
            cubeState[x+1][y+1][z+1][3][1] = negateVec(cubeState[x+1][y+1][z+1][3][2]);
            cubeState[x+1][y+1][z+1][3][2] = temp;

          }
          break;
         case "m":
          if (cubeState[x+1][y+1][z+1][0] === 0) {
            //switchValues(cubeState[x+1][y+1][z+1][1], cubeState[x+1][y+1][z+1][2], 1);
            //switchValues(cubeState[x+1][y+1][z+1][3][2], cubeState[x+1][y+1][z+1][3][1], 2);

            temp = cubeState[x+1][y+1][z+1][1];
            cubeState[x+1][y+1][z+1][1] = cubeState[x+1][y+1][z+1][2];
            cubeState[x+1][y+1][z+1][2] = -temp;
            
            temp = cubeState[x+1][y+1][z+1][3][2];
            cubeState[x+1][y+1][z+1][3][2] = negateVec(cubeState[x+1][y+1][z+1][3][1]);
            cubeState[x+1][y+1][z+1][3][1] = temp;

          }
        }
      }
    }
  }
}

// turnFace() takes the rotation modifies each cubie's
// rotation matrix based on the turn that was applied
// the switch statement sets the values such that each face corresponds to a color:
// left:orange, red:right, up:yellow, down:white, front:blue, back:green.
function turnFace(face) {
  var x,y,z;
  var direction,value;
  var mainAxis;
  var oldMat;
  switch (face) {
     case "L":
      mainAxis = 0; value = -1; direction = "L";
      break;
     case "R":
      mainAxis = 0; value = 1; direction = 0;
      break;
    case "U":
      mainAxis = 1;value = 1;direction = 0;
      break;
    case "D":
      mainAxis = 1;value = -1;direction = "D";
      break;
    case "F":
      mainAxis = 2;value = 1;direction = 0;
      break;
    case "B":
      mainAxis = 2;value = -1;direction = "B";
      break;
    case "M":
      mainAxis = 0;value = 0; direction = "M";
      break;
    case "E":
      mainAxis = 1;value = 0;direction = "E";
      break;
    case "S":
      mainAxis = 2;value = 0;direction = 0;
      break;
    case "l":
      mainAxis = 0; value = -1; direction = 0;
      break;
    case "r":
      mainAxis = 0; value = 1; direction = "r";
      break;
    case "u":
      mainAxis = 1;value = 1;direction = "u";
      break;
    case "d":
      mainAxis = 1;value = -1;direction = 0;
      break;
    case "f":
      mainAxis = 2;value = 1;direction = "f";
      break;
    case "b":
      mainAxis = 2;value = -1;direction = 0;
      break;
     case "m":
      mainAxis = 0;value = 0;direction = 0;
      break;
     case "e":
      mainAxis = 1;value = 0;direction = 0;
      break;
     case "s":
      mainAxis = 2;value = 0;direction = "s";
      break;
  }
  for (x = -1; x < 2; x++) {
    for (y = -1; y < 2; y++) {
      for (z = -1; z < 2; z++) {
        if (cubeState[x+1][y+1][z+1][mainAxis] === value) {
          oldMat = getRotationMatrix(x,y,z);
          if (!direction) 
            oldMat = mult(oldMat,rotate(rotationAngle,getRotationAxes(x,y,z)[mainAxis]));
          else 
            oldMat = mult(oldMat,rotate(rotationAngle,negateVec(getRotationAxes(x,y,z)[mainAxis])));
          setRotationMatrix(x,y,z,oldMat);
        }
      }
    }
  }
}

// Used to display pixels and call animate until queue is empty
function render() {
  if (animationQueue.length != 0 && !isAnimating) {
    animate(animationQueue.shift());
    isAnimating = true;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  eye = vec3(cameraRadius*Math.sin(PHI)*Math.sin(THETA),
    cameraRadius*Math.cos(PHI),
    cameraRadius*Math.sin(PHI)*Math.cos(THETA));
  
  PROJMATRIX = perspective(fovy, aspect, near, far);
  
  MVMATRIX = lookAt(eye, at, up);
  var x, y, z;
  for (x = -1; x <= 1; x++) {
    for (y = -1; y <= 1; y++) {
      for (z = -1; z <= 1; z++) {
        if (x !=0 || y !=0 || z!=0) {
          var tempMVMATRIX = MVMATRIX;
          
          MVMATRIX = mult(MVMATRIX,getRotationMatrix(x,y,z));
          MVMATRIX = mult(MVMATRIX,translate(vec3(x*spacing,y*spacing,z*spacing)));
          reColor(x,y,z);
          
          cBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
          
          vColor = gl.getAttribLocation( program, "vColor" );
          gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
          gl.enableVertexAttribArray(vColor);
          
          gl.uniformMatrix4fv(_projectionMatrix, false, flatten(PROJMATRIX));
          gl.uniformMatrix4fv(_modelViewMatrix, false, flatten(MVMATRIX));
          gl.drawElements(gl.TRIANGLES, numOfVertices, gl.UNSIGNED_BYTE, 0);
          
          MVMATRIX = tempMVMATRIX;
        }  
      }
    }
  }
  requestAnimFrame(render);
}