var fps = 60.0;
var step = 1.0 / fps;
var gameWidth = 256;
var gameHeight = 240;
var centrifugal = 0.3;
var offRoadDecel = 0.99;
var skySpeed = 0.001;
var hillSpeed = 0.002;
var treeSpeed = 0.003;
var skyOffset = 0;
var hillOffset = 0;
var treeOffset = 0;
var backgroundImage = null;
var sprites = null;
var resolution = null;
var segments = [];
var roadWidth = 2000;
var segmentLength = 200;
var rumbleLength = 3;
var trackLength = null;
var lanes = 3;
var fieldOfView = 100;
var cameraHeight = 1000;
var cameraDepth = null;
var drawDistance = 300;
var playerX = 0;
var playerZ = null;
var fogDensity = 30;

var pos = 0;
var spd = 0;
var maxSpeed = (segmentLength / step);
var accel = maxSpeed / 5;
var braking = -maxSpeed;
var decel = -maxSpeed / 5;
var offRoadDecel = -maxSpeed / 2;
var offRoadLimit = maxSpeed / 2;

var lowSpeed = maxSpeed*0.5;
var lowAccel = maxSpeed / 10;

var cars = [];
var totalCars = 10;
var segmentOffset = 0;
var trafficSpeed = maxSpeed/2;

var distanceTraveled = 0;
var playerOffsetY = -50;

var keyLeft = false;
var keyRight = false;
var keyFaster = false;
var keySlower = false;
var keyGear = false;

var COLORS = {
  SKY: "#004C66",
  TREE: "#005108",
  FOG: "#005108",
  LIGHT: {
    road: "#434343",
    grass: "#264f17",
    rumble: "#555555",
    lane: "#FFEF1C",
  },
  DARK: { road: "#303030", grass: "#19350f", rumble: "#BBBBBB" },
  START: { road: "white", grass: "white", rumble: "white" },
  FINISH: { road: "black", grass: "black", rumble: "black" },
};

var CITY = {
  SKY: "#7ABAF2",
  TREE: "#005108",
  FOG: "#005108",
  LIGHT: {
    road: "#434343",
    grass: "#2d2c2e",
    rumble: "#555555",
    lane: "#FFEF1C",
  },
  DARK: { road: "#303030", grass: "#1e1e1e", rumble: "#BBBBBB" },
  START: { road: "white", grass: "white", rumble: "white" },
  FINISH: { road: "black", grass: "black", rumble: "black" },
}

var SUBURBS = {
  SKY: "#004C66",
  TREE: "#005108",
  FOG: "#005108",
  LIGHT: {
    road: "#434343",
    grass: "#264f17",
    rumble: "#555555",
    lane: "#FFEF1C",
  },
  DARK: { road: "#303030", grass: "#19350f", rumble: "#BBBBBB" },
  START: { road: "white", grass: "white", rumble: "white" },
  FINISH: { road: "black", grass: "black", rumble: "black" },
}

var DESERT = {
  SKY: "#ff9797",
  TREE: "#005108",
  FOG: "#005108",
  LIGHT: {
    road: "#434343",
    grass: "#bf8e00",
    rumble: "#555555",
    lane: "#FFEF1C",
  },
  DARK: { road: "#303030", grass: "#805f00", rumble: "#BBBBBB" },
  START: { road: "white", grass: "white", rumble: "white" },
  FINISH: { road: "black", grass: "black", rumble: "black" },
}

var ROAD = {
  LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100 },
  HILL: { NONE: 0, LOW: 20, MEDIUM: 40, HIGH: 60 },
  CURVE: { NONE: 0, EASY: 2, MEDIUM: 4, HARD: 6 },
};

var SPRITES = {
  POLE: {x: 592, y: 899, w: 267, h: 440},
  TRASH: {x: 1241, y: 1195, w: 80, h: 105},
  MAILBOX: {x: 841, y: 641, w: 81, h: 106},
  CACTUS: {x: 1018, y: 1126, w: 79, h: 122},
  PALM_TREE: { x: 5, y: 5, w: 215, h: 540 },
  BILLBOARD08: { x: 230, y: 5, w: 385, h: 265 },
  TREE1: { x: 625, y: 5, w: 360, h: 360 },
  DEAD_TREE1: { x: 5, y: 555, w: 135, h: 332 },
  BILLBOARD09: { x: 150, y: 555, w: 328, h: 282 },
  BOULDER3: { x: 230, y: 280, w: 320, h: 220 },
  COLUMN: { x: 995, y: 5, w: 200, h: 315 },
  BILLBOARD01: { x: 625, y: 375, w: 300, h: 170 },
  BILLBOARD06: { x: 488, y: 555, w: 298, h: 190 },
  BILLBOARD05: { x: 5, y: 897, w: 298, h: 190 },
  BILLBOARD07: { x: 313, y: 897, w: 298, h: 190 },
  BOULDER2: { x: 621, y: 897, w: 298, h: 140 },
  TREE2: { x: 1205, y: 5, w: 282, h: 295 },
  BILLBOARD04: { x: 1205, y: 310, w: 268, h: 170 },
  DEAD_TREE2: { x: 1205, y: 490, w: 150, h: 260 },
  BOULDER1: { x: 1205, y: 760, w: 168, h: 248 },
  BUSH1: { x: 5, y: 1097, w: 240, h: 155 },
  CACTUS2: { x: 929, y: 897, w: 235, h: 118 },
  BUSH2: { x: 255, y: 1097, w: 232, h: 152 },
  BILLBOARD03: { x: 5, y: 1262, w: 230, h: 220 },
  BILLBOARD02: { x: 245, y: 1262, w: 215, h: 220 },
  STUMP: { x: 995, y: 330, w: 195, h: 140 },
  SEMI: { x: 1365, y: 490, w: 122, h: 144 },
  TRUCK: { x: 1365, y: 644, w: 100, h: 78 },
  CAR03: { x: 1383, y: 760, w: 88, h: 55 },
  CAR02: { x: 1383, y: 825, w: 80, h: 59 },
  CAR04: { x: 1383, y: 894, w: 80, h: 57 },
  CAR01: { x: 1205, y: 1018, w: 80, h: 56 },
  PLAYER_UPHILL_LEFT: { x: 1383, y: 961, w: 80, h: 45 },
  PLAYER_UPHILL_STRAIGHT: { x: 1295, y: 1018, w: 80, h: 45 },
  PLAYER_UPHILL_RIGHT: { x: 1385, y: 1018, w: 80, h: 45 },
  PLAYER_LEFT: { x: 995, y: 480, w: 80, h: 41 },
  PLAYER_STRAIGHT: { x: 1085, y: 480, w: 80, h: 41 },
  PLAYER_RIGHT: { x: 995, y: 531, w: 80, h: 41 },
};

SPRITES.SCALE = 0.3 * (1 / SPRITES.PLAYER_STRAIGHT.w); // the reference sprite width should be 1/3rd the (half-)roadWidth

SPRITES.BILLBOARDS = [
  SPRITES.BILLBOARD01,
  SPRITES.BILLBOARD02,
  SPRITES.BILLBOARD03,
  SPRITES.BILLBOARD04,
  SPRITES.BILLBOARD05,
  SPRITES.BILLBOARD06,
  SPRITES.BILLBOARD07,
  SPRITES.BILLBOARD08,
  SPRITES.BILLBOARD09,
];

SPRITES.PLANTS = [
  SPRITES.TREE1,
  SPRITES.TREE2,
  SPRITES.DEAD_TREE1,
  SPRITES.DEAD_TREE2,
  SPRITES.PALM_TREE,
  SPRITES.BUSH1,
  SPRITES.BUSH2,
  SPRITES.CACTUS,
  SPRITES.STUMP,
  SPRITES.BOULDER1,
  SPRITES.BOULDER2,
  SPRITES.BOULDER3,
];

SPRITES.CARS = [
  // SPRITES.CAR01,
  SPRITES.CAR02,
  // SPRITES.CAR03,
  SPRITES.CAR04,
  SPRITES.SEMI,
  SPRITES.TRUCK,
];

var PLAYER_STATES = {
  FREE: {},
  BUMP: {},
  DEAD: {}
};

var GAME_STATES = {
  START: {},
  GAME: {},
  GAMEOVER: {},
};

var playerState = PLAYER_STATES.FREE;
var gameState = GAME_STATES.START;

var BACKGROUND = {
  HILLS: { x: 5, y: 5, w: 1280, h: 480 },
  SKY: { x: 0, y: 0, w: 4900, h: 100 },
  TREES: { x: 5, y: 985, w: 1280, h: 480 },
};

var CAR_SPRITES = {
  STRAIGHT: { path: 'assets/car/playerCarStraight.png', w: 40, h: 23, x: 0, y: 0},
  LEFT: { path: 'assets/car/playerCarLeft.png', w: 45, h: 23, x: 0, y: 0},
  RIGHT: { path: 'assets/car/playerCarRight.png', w: 45, h: 23, x: 0, y: 0},
  UP: { path: 'assets/car/playerUpStraight.png', w: 40, h: 24, x: 0, y: 0},
  UP_LEFT: { path: 'assets/car/playerUpLeft.png', w: 44, h: 24, x: 0, y: 0},
  UP_RIGHT: { path: 'assets/car/playerUpRight.png', w: 44, h: 24, x: 0, y: 0},
};

var EXPLOSION_SPRITE = {
  sequenceLength: 10,
  sequence : [],
  path: 'assets/Nuclear_explosion/Nuclear_explosion',
  x: 0,
  y: 0,
  w: 256,
  h: 256
}

var safeZoneDistance = 5000;

var ENVIRONMENTS = {
  city: {start: 0, end: Math.floor(safeZoneDistance*0.3), colors: CITY, obstacles: [SPRITES.POLE, SPRITES.TRASH] },
  suburbs: {start: Math.floor(safeZoneDistance*0.3), end: Math.floor(safeZoneDistance*0.6), colors: SUBURBS, obstacles: [SPRITES.TREE1, SPRITES.MAILBOX] },
  desert: {start: Math.floor(safeZoneDistance*0.6), end: safeZoneDistance, colors: DESERT, obstacles: [SPRITES.BOULDER1, SPRITES.CACTUS] },
};

var currentEnvironment = ENVIRONMENTS.city;
var nextEnvironment = ENVIRONMENTS.suburbs;

var playerExplosion;

var graphicsBuffer;

var timeLimit = 90;
var currentTime = 0;
var startTime = 0;
var timeLeft = timeLimit;

var offroadTimer = 0;
var maxspeedTimer = 0;
var bonusTimer = 0;

var sysFont;

var startPopulation = 100000;
var populationInRadius = startPopulation;

var musicTrack;
var engineSFX, turningSFX, offroadSFX, explosionSFX;

var newPlayer = true;

var drifting = false;

function createSpriteAnimation() {
  var spriteAnimation = {
    localFrame: 0,
    totalFrames: EXPLOSION_SPRITE.sequence.length,
    currentImage: EXPLOSION_SPRITE.sequence[0],
    doAnimation: function() {
      this.localFrame += 15.0/60.0;
      if (this.localFrame > this.totalFrames - 1) this.localFrame = this.totalFrames - 1;
      this.currentImage = EXPLOSION_SPRITE.sequence[floor(this.localFrame)];
    }
  }

  return spriteAnimation;
}

function preload() {
  sprites = loadImage("assets/sprites_altered_5.png");
  backgroundImage = sprites;

  CAR_SPRITES.STRAIGHT.sprite = loadImage(CAR_SPRITES.STRAIGHT.path);
  CAR_SPRITES.LEFT.sprite = loadImage(CAR_SPRITES.LEFT.path);
  CAR_SPRITES.RIGHT.sprite = loadImage(CAR_SPRITES.RIGHT.path);
  CAR_SPRITES.UP.sprite = loadImage(CAR_SPRITES.UP.path);
  CAR_SPRITES.UP_LEFT.sprite = loadImage(CAR_SPRITES.UP_LEFT.path);
  CAR_SPRITES.UP_RIGHT.sprite = loadImage(CAR_SPRITES.UP_RIGHT.path);

  for (var i = 0; i < EXPLOSION_SPRITE.sequenceLength; i++) {
    EXPLOSION_SPRITE.sequence[i] = loadImage(EXPLOSION_SPRITE.path + (i+1) + '.png');
  }

  soundFormats('mp3','wav');
  musicTrack = loadSound('assets/E02.mp3');
  engineSFX = loadSound('assets/engineLoop.wav');
  turningSFX = loadSound('assets/skrrtLoop.wav');
  offroadSFX = loadSound('assets/offroadLoop.wav');
  explosionSFX = loadSound('assets/explosion.mp3');

  sysFont = loadFont('sysfont.woff');
}

function setup() {
  var cvs = createCanvas(512, 480);
  cvs.mouseClicked(function() {
    userStartAudio();

    if (gameState == GAME_STATES.START) {
      resetTimer();

      gameState = GAME_STATES.GAME;
      newPlayer = false;
    }
  });

  noSmooth();

  graphicsBuffer = createGraphics(256, 240);

  graphicsBuffer.noStroke();
  graphicsBuffer.noSmooth();

  resolution = gameHeight / 240;

  resetGame(); 
}

function mousePressed() {
  //userStartAudio();
}

function resetTimer() {
  currentTime = millis();
  startTime = millis();

  offroadTimer = 0;
  maxspeedTimer = 0;
  bonusTimer = 0;
}

function resetGame() {
  playerState = PLAYER_STATES.FREE;
  if (newPlayer) {  
    gameState = GAME_STATES.START;
  } else {
    gameState = GAME_STATES.GAME;
  }
  

  distanceTraveled = 0;
  currentEnvironment = ENVIRONMENTS.city;
  nextEnvironment = ENVIRONMENTS.suburbs;

  pos = 0;
  spd = 0;
  playerX = 0;

  resetTimer();

  populationInRadius = startPopulation;

  cameraDepth = 1.0 / tan(((fieldOfView / 2) * PI) / 180.0);
  playerZ = cameraHeight * cameraDepth;

  drifting = false;

  playerExplosion = createSpriteAnimation(EXPLOSION_SPRITE);

  resetRoad();
}

function keyPressed() {
  if (key == 'r') resetGame();
}

function draw() {
  switch (gameState) {
    case GAME_STATES.START:
      startScreen();
      break;
    case GAME_STATES.GAME:
      updateGame();
      renderGame();
      renderHUD();
      break;
    case GAME_STATES.GAMEOVER:
      gameOverScreen();
      break;
    default:
      break;
  }

  image(graphicsBuffer, 0, 0, width, height);
}

function updateGame() {
  if (frameRate()) fps = frameRate();
  var dt = 1.0 / fps;

  if (keyIsDown(LEFT_ARROW)) keyLeft = true;
  else keyLeft = false;

  if (keyIsDown(RIGHT_ARROW)) keyRight = true;
  else keyRight = false;

  if (keyIsDown(UP_ARROW)) keyFaster = true;
  else keyFaster = false;

  if (keyIsDown(DOWN_ARROW)) keySlower = true;
  else keySlower = false;

  var playerSegment = findSegment(pos + playerZ);
  var playerW = SPRITES.PLAYER_STRAIGHT.w * SPRITES.SCALE;

  var speedPercent = spd / maxSpeed;
  var dx = dt * 3 * speedPercent;

  distanceTraveled = floor(pos/segmentLength);
  var distanceToNextEnvironment = nextEnvironment.start - distanceTraveled;

  if (distanceToNextEnvironment <= 0) {
    switch (currentEnvironment) {
      case ENVIRONMENTS.city:
        currentEnvironment = ENVIRONMENTS.suburbs;
        nextEnvironment = ENVIRONMENTS.desert;
        break;
      case ENVIRONMENTS.suburbs:
        currentEnvironment = ENVIRONMENTS.desert;
        nextEnvironment = ENVIRONMENTS.desert;
        break;
      default:
        break;
    }
  }

  populationInRadius = floor(((safeZoneDistance - distanceTraveled)/safeZoneDistance) * startPopulation);
  if (populationInRadius < 0) populationInRadius = 0;

  if (populationInRadius <= 0) {
    bonusTimer += dt;
  }

  currentTime = (millis() - startTime)/1000.0;
  timeLeft = timeLimit - currentTime;

  updateCars(dt, playerSegment, playerW);

  switch (playerState) {
    case PLAYER_STATES.FREE:
      playerFreeState(dt, dx, speedPercent, playerSegment, playerW);
      updateGameAudio();

      if (playerState == PLAYER_STATES.DEAD || timeLeft <= 0) {

        musicTrack.stop();
        engineSFX.stop();
        offroadSFX.stop();
        turningSFX.stop();

        explosionSFX.play();

        gameState = GAME_STATES.GAMEOVER;
      }
      break;
    case PLAYER_STATES.DEAD:
      break;
  }

  skyOffset = increase(
    skyOffset,
    skySpeed * playerSegment.curve * speedPercent,
    1
  );

  hillOffset = increase(
    hillOffset,
    hillSpeed * playerSegment.curve * speedPercent,
    1
  );

  treeOffset = increase(
    treeOffset,
    treeSpeed * playerSegment.curve * speedPercent,
    1
  );

  updateTrackIfNeeded();
}

function updateGameAudio() {

  if (!musicTrack.isPlaying()) {
    musicTrack.play();
    musicTrack.setVolume(0.25);
  }

  if (!engineSFX.isLooping()) {
    engineSFX.loop();
  }

  if (drifting && !turningSFX.isLooping()) {
    turningSFX.loop();
    turningSFX.setVolume(0.75);
  } else if (!drifting) {
    turningSFX.stop();
  }

  var engineRate = (spd/maxSpeed) * 1.5 + 0.5;
  engineSFX.rate(engineRate);

  if (playerX < -1 || playerX > 1) {
    if (!offroadSFX.isLooping()) {
      offroadSFX.loop();
      offroadSFX.setVolume(2.0);
    }
  } else {
    offroadSFX.stop();
  }
}

function renderGame() {
  var baseSegment = findSegment(pos);
  var basePercent = percentRemaining(pos, segmentLength);

  var playerSegment = findSegment(pos + playerZ);
  var playerPercent = percentRemaining(pos + playerZ, segmentLength);

  var playerY = interpolate(
    playerSegment.p1.world.y,
    playerSegment.p2.world.y,
    playerPercent
  );

  playerY += playerOffsetY;

  var maxY = gameHeight;

  var dx = -(baseSegment.curve * basePercent);
  var x = 0;

  var segment, car, sprite, spriteScale, spriteX, spriteY;

  var distanceToNextEnvironment = nextEnvironment.start - distanceTraveled;
  var skyColor = currentEnvironment.colors.SKY;

  if (distanceToNextEnvironment < 100) {
    var percent = 1.0 - distanceToNextEnvironment/100;
    skyColor = lerpColor(color(currentEnvironment.colors.SKY), color(nextEnvironment.colors.SKY), percent);
  }

  graphicsBuffer.background(skyColor);

  //renderBackground(backgroundImage, gameWidth, gameHeight, BACKGROUND.SKY,   skyOffset,  resolution * skySpeed  * playerY);
  //renderBackground(backgroundImage, gameWidth, gameHeight, BACKGROUND.HILLS, hillOffset, resolution * hillSpeed * playerY);
  //renderBackground(backgroundImage, gameWidth, gameHeight, BACKGROUND.TREES, treeOffset, resolution * treeSpeed * playerY);

  for (var i = 0; i < drawDistance; i++) {

    segment = segments[(baseSegment.index + i) % segments.length];

    segment.looped = segment.index < baseSegment.index;
    segment.fog = exponentialFog(i / drawDistance, fogDensity);
    segment.clip = maxY;

    project(
      segment.p1,
      playerX * roadWidth - x,
      playerY + cameraHeight,
      pos - (segment.looped ? trackLength : 0),
      cameraDepth,
      gameWidth,
      gameHeight,
      roadWidth
    );

    project(
      segment.p2,
      playerX * roadWidth - x - dx,
      playerY + cameraHeight,
      pos - (segment.looped ? trackLength : 0),
      cameraDepth,
      gameWidth,
      gameHeight,
      roadWidth
    );

    x = x + dx;
    dx = dx + segment.curve;

    if (
      segment.p1.z <= cameraDepth ||
      segment.p2.screen.y >= segment.p1.screen.y ||
      segment.p2.screen.y >= maxY
    ) {
      continue;
    }

    renderSegment(
      gameWidth,
      lanes,
      segment.p1.screen.x,
      segment.p1.screen.y,
      segment.p1.screen.w,
      segment.p2.screen.x,
      segment.p2.screen.y,
      segment.p2.screen.w,
      segment.fog,
      segment.color
    );

    maxY = segment.p2.screen.y;
  }

  for (var i = drawDistance - 1; i > 0; i--) {

    segment = segments[(baseSegment.index + i) % segments.length];

    // render roadside sprites
    for (var j = 0; j < segment.sprites.length; j++) {

      sprite = segment.sprites[j];
      spriteScale = segment.p1.screen.scale;

      spriteX = segment.p1.screen.x + (spriteScale * sprite.offset * roadWidth * gameWidth) / 2;
      spriteY = segment.p1.screen.y;

      renderSprite(
        gameWidth,
        gameHeight,
        resolution,
        roadWidth,
        sprites,
        sprite.source,
        spriteScale,
        spriteX,
        spriteY,
        sprite.offset < 0 ? -1 : 0,
        -1,
        segment.clip,
        (sprite.offset >= 1)
      );
    }

    // render other cars
    for (var j = 0 ; j < segment.cars.length ; j++) {
      var car     = segment.cars[j];
      sprite      = car.sprite;
      spriteScale = interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
      spriteX     = interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (spriteScale * car.offset * roadWidth * gameWidth/2);
      spriteY     = interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
      renderSprite(gameWidth, gameHeight, resolution, roadWidth, sprites, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip, (car.offset > playerX));
    }

    if (segment == playerSegment) {

      //function renderPlayerNew(w, h, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown) {
        //renderSprite(w, h, resolution, roadWidth, sprite.sprite, sprite, scale * 2.0, destX, destY + bounce, -0.5, -1);

        renderPlayerNew(gameWidth, gameHeight, resolution, roadWidth, sprites, spd / maxSpeed, cameraDepth / playerZ, gameWidth / 2, 
          gameHeight / 2 - ((cameraDepth / playerZ) * interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * gameHeight) /2,
          spd * (keyLeft ? -1 : keyRight ? 1 : 0), playerSegment.p2.world.y - playerSegment.p1.world.y
        );
    }
  }
}

function startScreen() {
  graphicsBuffer.background(255, 0, 0);

  graphicsBuffer.push();

  graphicsBuffer.textSize(32);
  graphicsBuffer.textFont(sysFont);
  graphicsBuffer.textAlign(CENTER, CENTER);
  graphicsBuffer.text("RIDE OR DIE", gameWidth/2, gameHeight/4);

  graphicsBuffer.textSize(8);
  graphicsBuffer.textAlign(LEFT, BASELINE);

  var introText = "Your past has caught up to you. \n There is a bomb strapped to your car. \n It will go off in 90 seconds. \n The least you can do, \n before you leave this earth, \n is get out of everyone's way.";

  graphicsBuffer.text(introText, 32, gameHeight/2, gameWidth - 100);

  graphicsBuffer.textSize(12);

  graphicsBuffer.textAlign(CENTER, CENTER);
  graphicsBuffer.text("Click to start" , gameWidth/2, gameHeight - gameHeight/10);

  graphicsBuffer.pop();
}

function gameOverScreen() {
  graphicsBuffer.background(255, 0, 0);

  graphicsBuffer.push();

  graphicsBuffer.textSize(32);
  graphicsBuffer.textFont(sysFont);
  graphicsBuffer.textAlign(CENTER, CENTER);
  graphicsBuffer.text("GAME OVER", gameWidth/2, gameHeight/4);

  var score = 0;

  graphicsBuffer.textSize(8);

  graphicsBuffer.textAlign(LEFT, BASELINE);
  graphicsBuffer.text("Lives saved: ", 5, gameHeight/2 - 12);

  graphicsBuffer.textAlign(RIGHT, BASELINE);
  graphicsBuffer.text("" + (startPopulation - populationInRadius) + " +",gameWidth - 5, gameHeight/2 - 12);

  var populationScore = (((startPopulation - populationInRadius) / startPopulation)) * startPopulation;

  score += populationScore;

  graphicsBuffer.textAlign(LEFT, BASELINE);
  graphicsBuffer.text("Offroad Penalty: ", 5, gameHeight/2);

  graphicsBuffer.textAlign(RIGHT, BASELINE);
  graphicsBuffer.text("" + floor(offroadTimer * 100) + " -", gameWidth - 5, gameHeight/2);

  score -= floor(offroadTimer * 100);

  graphicsBuffer.textAlign(LEFT, BASELINE);
  graphicsBuffer.text("Max Speed Bonus: ", 5, gameHeight/2 + 12);

  graphicsBuffer.textAlign(RIGHT, BASELINE);
  graphicsBuffer.text("" + floor(maxspeedTimer) * 100 + " +", gameWidth - 5, gameHeight/2 + 12);

  score += floor(maxspeedTimer) * 100;

  graphicsBuffer.textAlign(LEFT, BASELINE);
  graphicsBuffer.text("Time Bonus: ", 5, gameHeight/2 + 24);

  graphicsBuffer.textAlign(RIGHT, BASELINE);
  graphicsBuffer.text("" + floor(bonusTimer) * 100 + " +", gameWidth - 5, gameHeight/2 + 24);

  score += floor(bonusTimer) * 100;

  score = max(score, 0);

  graphicsBuffer.textSize(16);

  graphicsBuffer.textAlign(LEFT, BASELINE);
  graphicsBuffer.text("SCORE: ", 5, gameHeight/2 + 64);

  graphicsBuffer.textAlign(RIGHT, BASELINE);
  graphicsBuffer.text("" + floor(score), gameWidth - 5, gameHeight/2 + 64);

  graphicsBuffer.textSize(12);

  graphicsBuffer.textAlign(CENTER, CENTER);
  graphicsBuffer.text("Press 'R' to retry" , gameWidth/2, gameHeight - gameHeight/10);

  graphicsBuffer.pop();

  playerExplosion.doAnimation();
  if (playerExplosion.localFrame >= playerExplosion.totalFrames - 1) return;

  renderExplosion(gameWidth, gameHeight, resolution, roadWidth, playerExplosion.currentImage, EXPLOSION_SPRITE, cameraDepth / playerZ, gameWidth/2, gameHeight/2 + EXPLOSION_SPRITE.h/2 - playerOffsetY/2, -0.5, -1);
}