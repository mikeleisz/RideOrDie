function resetRoad() {
  segments = [];

  addStraight(ROAD.LENGTH.SHORT / 2);
  // addHill(ROAD.LENGTH.SHORT, ROAD.HILL.LOW);
  // addHill(ROAD.LENGTH.SHORT, ROAD.HILL.MEDIUM);
  // addHill(ROAD.LENGTH.SHORT, ROAD.HILL.HIGH);
  // addLowRollingHills();
  // addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
  // addLowRollingHills();
  // addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
  // addStraight();
  // addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
  // addHill(ROAD.LENGTH.LONG, ROAD.HILL.HIGH);
  // addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
  // addHill(ROAD.LENGTH.LONG, -ROAD.HILL.MEDIUM);
  // addStraight();
  // addDownhillToEnd();

  // segments[findSegment(playerZ).index + 2].color = COLORS.START;
  // segments[findSegment(playerZ).index + 3].color = COLORS.START;
  //
  // for(var i = 0 ; i < rumbleLength ; i++)
  //   segments[segments.length-1-i].color = COLORS.FINISH;

  trackLength = segments.length * segmentLength;
}

function addSegment(curve, y) {
  var n = segments.length;
  segments.push({
    index: n,
    p1: { world: { y: lastY(), z: n * segmentLength }, camera: {}, screen: {} },
    p2: { world: { y: y, z: (n + 1) * segmentLength }, camera: {}, screen: {} },
    curve: curve,
    color: floor(n / rumbleLength) % 2 ? COLORS.DARK : COLORS.LIGHT,
  });
}

function addStraight(num) {
  num = num || ROAD.LENGTH.MEDIUM;
  addRoad(num, num, num, 0, 0);
}

function addHill(num, height) {
  num = num || ROAD.LENGTH.MEDIUM;
  height = height || ROAD.HILL.MEDIUM;
  addRoad(num, num, num, 0, height);
}

function addCurve(num, curve, height) {
  num = num || ROAD.LENGTH.MEDIUM;
  curve = curve || ROAD.CURVE.MEDIUM;
  height = height || ROAD.HILL.NONE;
  addRoad(num, num, num, curve, height);
}

function addLowRollingHills(num, height) {
  num = num || ROAD.LENGTH.SHORT;
  height = height || ROAD.HILL.LOW;
  addRoad(num, num, num, 0, height / 2);
  addRoad(num, num, num, 0, -height);
  addRoad(num, num, num, 0, height);
  addRoad(num, num, num, 0, 0);
  addRoad(num, num, num, 0, height / 2);
  addRoad(num, num, num, 0, 0);
}

function addSCurves() {
  addRoad(
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    -ROAD.CURVE.EASY,
    ROAD.HILL.NONE
  );
  addRoad(
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.CURVE.MEDIUM,
    ROAD.HILL.MEDIUM
  );
  addRoad(
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.CURVE.EASY,
    -ROAD.HILL.LOW
  );
  addRoad(
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    -ROAD.CURVE.EASY,
    ROAD.HILL.MEDIUM
  );
  addRoad(
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    ROAD.LENGTH.MEDIUM,
    -ROAD.CURVE.MEDIUM,
    -ROAD.HILL.MEDIUM
  );
}

function addDownhillToEnd(num) {
  num = num || 200;
  addRoad(num, num, num, -ROAD.CURVE.EASY, -lastY() / segmentLength);
}

function addRoad(enter, hold, leave, curve, y) {
  var startY = lastY();
  var endY = startY + y * segmentLength;

  var total = enter + hold + leave;

  var n;
  for (n = 0; n < enter; n++)
    addSegment(easeIn(0, curve, n / enter), easeInOut(startY, endY, n / total));
  for (n = 0; n < hold; n++)
    addSegment(curve, easeInOut(startY, endY, (enter + n) / total));
  for (n = 0; n < leave; n++)
    addSegment(
      easeInOut(curve, 0, n / leave),
      easeInOut(startY, endY, (enter + hold + n) / total)
    );
}

function findSegment(z) {
  return segments[floor(z / segmentLength) % segments.length];
}

function lastY() {
  return segments.length == 0 ? 0 : segments[segments.length - 1].p2.world.y;
}

function rumbleWidth(projectedRoadWidth, lanes) {
  return projectedRoadWidth / max(6, 2 * lanes);
}

function laneMarkerWidth(projectedRoadWidth, lanes) {
  return projectedRoadWidth / max(32, 8 * lanes);
}

const SEGMENT_BUFFER = 100;

const segmentAdders = [
  () => {
    addStraight(ROAD.LENGTH.SHORT / 2);
  },
  () => {
    addCurve(ROAD.LENGTH.SHORT, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
  },
  () => {
    addHill(ROAD.LENGTH.SHORT, ROAD.HILL.HIGH);
  },
];

const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

function updateTrackIfNeeded() {
  const playerSegment = findSegment(pos);

  if (segments.length - playerSegment.index > drawDistance) {
    return;
  }

  choose(segmentAdders)();
  trackLength = segments.length * segmentLength;
}

