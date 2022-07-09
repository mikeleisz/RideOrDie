var fps = 60.0;
var step = 1.0 / fps;
var gameWidth = 512;
var gameHeight = 480;
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
var segments = new Buffer();
var roadWidth = 2000;
var segmentLength = 200;
var rumbleLength = 4;
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
var spd = 10000;
var maxSpeed = segmentLength / step;
var accel = maxSpeed / 5;
var braking = -maxSpeed;
var decel = -maxSpeed / 5;
var offRoadDecel = -maxSpeed / 2;
var offRoadLimit = maxSpeed / 4;

var keyLeft = false;
var keyRight = false;
var keyFaster = false;
var keySlower = false;

var COLORS = {
  SKY: "#EE9C72",
  TREE: "#005108",
  FOG: "#005108",
  LIGHT: {
    road: "#434343",
    grass: "#EDD094",
    rumble: "#555555",
    lane: "#FFEF1C",
  },
  DARK: { road: "#303030", grass: "#DCAE6B", rumble: "#BBBBBB" },
  START: { road: "white", grass: "white", rumble: "white" },
  FINISH: { road: "black", grass: "black", rumble: "black" },
};

var ROAD = {
  LENGTH: { NONE: 0, SHORT: 25, MEDIUM: 50, LONG: 100 },
  HILL: { NONE: 0, LOW: 20, MEDIUM: 40, HIGH: 60 },
  CURVE: { NONE: 0, EASY: 2, MEDIUM: 4, HARD: 6 },
};

var SPRITES = {
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
  CACTUS: { x: 929, y: 897, w: 235, h: 118 },
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
  SPRITES.CAR01,
  SPRITES.CAR02,
  SPRITES.CAR03,
  SPRITES.CAR04,
  SPRITES.SEMI,
  SPRITES.TRUCK,
];

var BACKGROUND = {
  HILLS: { x: 5, y: 5, w: 1280, h: 480 },
  SKY: { x: 0, y: 0, w: 4900, h: 100 },
  TREES: { x: 5, y: 985, w: 1280, h: 480 },
};

function preload() {
  backgroundImage = loadImage("BeachTrackBackg.png");
  sprites = loadImage("sprites.png");
}

function setup() {
  createCanvas(512, 480);
  noStroke();

  cameraDepth = 1.0 / tan(((fieldOfView / 2) * PI) / 180.0);
  playerZ = cameraHeight * cameraDepth;

  resolution = gameHeight / 480;

  resetRoad();
}

function draw() {
  render();
  updateGame();
}

function updateGame() {
  var dt = 1.0 / 60.0;

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
  var dx = dt * 2 * speedPercent;

  pos = increase(pos, dt * spd, trackLength);

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

  if (keyLeft) playerX = playerX - dx;
  else if (keyRight) playerX = playerX + dx;

  playerX = playerX - dx * speedPercent * playerSegment.curve * centrifugal;

  if (keyFaster) spd = accelerate(spd, accel, dt);
  else if (keySlower) spd = accelerate(spd, braking, dt);
  else spd = accelerate(spd, decel, dt);

  if (playerX < -1 || playerX > 1) {
    if (spd > offRoadLimit) {
      spd = accelerate(spd, offRoadDecel, dt);
    }

    var sprite, spriteW;

    for (var i = 0; i < playerSegment.sprites.length; i++) {
      sprite = playerSegment.sprites[i];
      spriteW = sprite.source.w * SPRITES.SCALE;
      if (
        overlap(
          playerX,
          playerW,
          sprite.offset + (spriteW / 2) * (sprite.offset > 0 ? 1 : -1),
          spriteW
        )
      ) {
        speed = maxSpeed / 5;
        position = increase(playerSegment.p1.world.z, -playerZ, trackLength); // stop in front of sprite (at front of segment)
        break;
      }
    }
  }

  playerX = limitValue(playerX, -2, 2);
  spd = limitValue(spd, 0, maxSpeed);
}

function increase(start, increment, max) {
  var result = start + increment;
  while (result >= max) result -= max;
  while (result < 0) result += max;
  return result;
}

function accelerate(v, accel, dt) {
  return v + accel * dt;
}

function render() {
  var baseSegment = findSegment(pos);
  var basePercent = percentRemaining(pos, segmentLength);

  var playerSegment = findSegment(pos + playerZ);
  var playerPercent = percentRemaining(pos + playerZ, segmentLength);
  var playerY = interpolate(
    playerSegment.p1.world.y,
    playerSegment.p2.world.y,
    playerPercent
  );
  var maxY = gameHeight;

  var dx = -(baseSegment.curve * basePercent);
  var x = 0;

  background(COLORS.SKY);

  //renderBackground(backgroundImage, gameWidth, gameHeight, BACKGROUND.SKY,   skyOffset,  resolution * skySpeed  * playerY);
  //renderBackground(backgroundImage, gameWidth, gameHeight, BACKGROUND.HILLS, hillOffset, resolution * hillSpeed * playerY);
  //renderBackground(backgroundImage, gameWidth, gameHeight, BACKGROUND.TREES, treeOffset, resolution * treeSpeed * playerY);

  var segment;

  for (var i = 0; i < drawDistance; i++) {
    segment = segments.get(baseSegment.index + i);
    if (!segment) {
      continue;
    }
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
    segment = segments.get(baseSegment.index + i);

    if (!segment) {
      continue;
    }
    for (var j = 0; j < segment.sprites.length; j++) {
      sprite = segment.sprites[j];
      spriteScale = segment.p1.screen.scale;
      spriteX =
        segment.p1.screen.x +
        (spriteScale * sprite.offset * roadWidth * gameWidth) / 2;
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
        segment.clip
      );
    }

    if (segment == playerSegment) {
      renderPlayer(
        gameWidth,
        gameHeight,
        resolution,
        roadWidth,
        sprites,
        spd / maxSpeed,
        cameraDepth / playerZ,
        gameWidth / 2,
        gameHeight / 2 -
          ((cameraDepth / playerZ) *
            interpolate(
              playerSegment.p1.camera.y,
              playerSegment.p2.camera.y,
              playerPercent
            ) *
            gameHeight) /
            2,
        spd * (keyLeft ? -1 : keyRight ? 1 : 0),
        playerSegment.p2.world.y - playerSegment.p1.world.y
      );
    }
  }
  updateTrackIfNeeded();
}
