function resetCars() {
    cars = [];
    var car, segment, offset, z, sprite, carSpeed;
    for (var n = 0 ; n < totalCars ; n++) {
      offset = random() * randomChoice([-0.8, 0.8]);
      z      = floor(random() * segments.length) * segmentLength;
      sprite = randomChoice(SPRITES.CARS);
      carSpeed  = trafficSpeed/4 + random() * trafficSpeed/(sprite == SPRITES.SEMI ? 4 : 2);
      car = { offset: offset, z: z, sprite: sprite, speed: carSpeed, percent: 0 };
      segment = findSegment(car.z);
      segment.cars.push(car);
      cars.push(car);
    }
}

function addCars(spawnSegment) {
  var car, segment, offset, z, sprite, carSpeed;
  for (var n = 0; n < 2; n++) {
    offset = random() * randomChoice([-0.8, 0.8]);
    z      = floor(random(spawnSegment/segments.length, 1) * segments.length) * segmentLength;
    sprite = randomChoice(SPRITES.CARS);
    carSpeed  = trafficSpeed/4 + random() * trafficSpeed/(sprite == SPRITES.SEMI ? 4 : 2);
    car = { offset: offset, z: z, sprite: sprite, speed: carSpeed, percent: 0 };
    segment = findSegment(car.z);
    segment.cars.push(car);
    cars.push(car);
  }
}

function updateCars(dt, playerSegment, playerW) {
    var car, oldSegment, newSegment;
    for (var n = 0 ; n < cars.length ; n++) {
      car         = cars[n];
      oldSegment  = findSegment(car.z);
      car.offset  = car.offset + updateCarOffset(car, oldSegment, playerSegment, playerW);
      car.z       = increase(car.z, dt * car.speed, trackLength);
      car.percent = percentRemaining(car.z, segmentLength); // useful for interpolation during rendering phase
      newSegment  = findSegment(car.z);
      if (oldSegment != newSegment) {
        index = oldSegment.cars.indexOf(car);
        oldSegment.cars.splice(index, 1);
        newSegment.cars.push(car);
      }
    }
  }
  
  function updateCarOffset(car, carSegment, playerSegment, playerW) {
  
    var dir, segment, otherCar, otherCarW, lookahead = 20, carW = car.sprite.w * SPRITES.SCALE;

    var overtakeSpeed = 0.5;
  
    // optimization, dont bother steering around other cars when 'out of sight' of the player
    if ((carSegment.index - playerSegment.index) > drawDistance)
      return 0;
    
    for(var i = 1 ; i < lookahead ; i++) {

      segment = segments[(carSegment.index + i) % segments.length];
  
      if ((segment === playerSegment) && (car.speed > spd) && (overlap(playerX, playerW, car.offset, carW, 1.2))) {
        if (playerX > 0.5)
          dir = -1;
        else if (playerX < -0.5)
          dir = 1;
        else
          dir = (car.offset > playerX) ? 1 : -1;
        return (dir * 1/i * (car.speed-spd)/trafficSpeed) * overtakeSpeed; // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
      }
  
      for (var j = 0 ; j < segment.cars.length ; j++) {
        otherCar  = segment.cars[j];
        otherCarW = otherCar.sprite.w * SPRITES.SCALE;
        if ((car.speed > otherCar.speed) && overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
          if (otherCar.offset > 0.5)
            dir = -1;
          else if (otherCar.offset < -0.5)
            dir = 1;
          else
            dir = (car.offset > otherCar.offset) ? 1 : -1;
          return (dir * 1/i * (car.speed-otherCar.speed)/trafficSpeed) * overtakeSpeed;
        }
      }
    }
  
    // if no cars ahead, but I have somehow ended up off road, then steer back on
    if (car.offset < -0.9)
      return 0.1;
    else if (car.offset > 0.9)
      return -0.1;
    else
      return 0;
  }

  function updateTrackIfNeeded() {
    const playerSegment = findSegment(pos);
  
    if (segments.length - playerSegment.index > drawDistance) {
      return;
    }

    var oldLength = segments.length;
  
    random(segmentAdders)(); //pick and automatically call segment adder
    trackLength = segments.length * segmentLength;

    if (populationInRadius > 0) addCars(oldLength);
  
    if (segments.length > 400) {
        
        //any cars who are on a segment behind this number need to be removed
        
        /*
        for (var i = cars.length - 1; i >= 0; i--) {
    
            var carSegment = findSegment(cars[i].z);
        
            if (carSegment.index < playerSegment.index - 200) {
                carSegment.cars = [];
                cars.splice(i, 1);
            }
        }
        */

        //print(cars);

        //segments.cleanBehind(playerSegment.index);
    }
  }

  function playerFreeState(dt, dx, speedPercent, playerSegment, playerW) {
    pos = increase(pos, dt * spd, trackLength);

  if (keyLeft) playerX = playerX - dx;
  else if (keyRight) playerX = playerX + dx;

  playerX = playerX - dx * speedPercent * playerSegment.curve * centrifugal;

  var playerOnCurve = (abs(dx * speedPercent * playerSegment.curve * centrifugal) > 0)
  
    if (playerOnCurve) {

        var driftThreshold = 0.95;

        var curveRight = (Math.sign(dx * speedPercent * playerSegment.curve * centrifugal) > 0);
        var curveLeft  = (Math.sign(dx * speedPercent * playerSegment.curve * centrifugal) < 0);

        if (curveRight && speedPercent > driftThreshold && keyRight && playerX < -0.5) drifting = true;
        else if (curveLeft && speedPercent > driftThreshold && keyLeft && playerX > 0.5) drifting = true;
        else drifting = false;
    } else {
        drifting = false;
    }

  if (keyFaster) spd = accelerate(spd, accel, dt);
  else if (keySlower) spd = accelerate(spd, braking, dt);
  else spd = accelerate(spd, decel, dt);

  if (spd >= maxSpeed) maxspeedTimer += dt;

  if (playerX < -1 || playerX > 1) {

    offroadTimer += dt;

    if (spd > offRoadLimit) {
      spd = accelerate(spd, offRoadDecel, dt);
    }

    var sprite, spriteW;

    for (var i = 0; i < playerSegment.sprites.length; i++) {

      sprite = playerSegment.sprites[i];
      spriteW = sprite.source.w * SPRITES.SCALE;

      var didOverlap = overlap(
        playerX,
        playerW,
        sprite.offset + (spriteW / 2) * (sprite.offset > 0 ? 1 : -1),
        spriteW
      );

      if (didOverlap) {
        spd = maxSpeed / 5;
        pos = increase(playerSegment.p1.world.z, -playerZ, trackLength); // stop in front of sprite (at front of segment)

        playerState = PLAYER_STATES.DEAD;

        break;
      }
    }
  }

  var car, carW;

  for (var n = 0 ; n < playerSegment.cars.length ; n++) {
    car  = playerSegment.cars[n];
    carW = car.sprite.w * SPRITES.SCALE;
    if (spd > car.speed) {
      if (overlap(playerX, playerW, car.offset, carW, 0.8)) {
        spd = car.speed * (car.speed/spd);
        pos = increase(car.z, -playerZ, trackLength);

        playerState = PLAYER_STATES.DEAD;

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