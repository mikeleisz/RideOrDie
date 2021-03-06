function renderBackground(bg, w, h, layer, rotation, offset) {

    rotation = rotation || 0;
    offset   = offset   || 0;

    var imageW = layer.w/2;
    var imageH = layer.h;

    var sourceX = layer.x + floor(layer.w * rotation);
    var sourceY = layer.y
    var sourceW = min(imageW, layer.x + layer.w - sourceX);
    var sourceH = imageH;
    
    var destX = 0;
    var destY = offset;
    var destW = floor(w * (sourceW/imageW));
    var destH = h;

    graphicsBuffer.image(bg, destX, destY, destW, destH, sourceX, sourceY, sourceW, sourceH);
  
    if (sourceW < imageW)
      graphicsBuffer.image(bg, destW - 1, destY, w-destW, destH, layer.x, sourceY, imageW - sourceW, sourceH);
}

function renderSprite(w, h, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY, flip=false) {

    //  scale for projection AND relative to roadWidth (for tweakUI)
    var destW  = (sprite.w * scale * w/2) * (SPRITES.SCALE * roadWidth);
    var destH  = (sprite.h * scale * w/2) * (SPRITES.SCALE * roadWidth);

    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));

    var clipH = clipY ? max(0, destY + destH - clipY) : 0;
    if (clipH < destH) {
      graphicsBuffer.push();

      if (flip) {
        graphicsBuffer.scale(-1, 1);
        graphicsBuffer.image(sprites, -destX - destW, destY, destW, destH - clipH, sprite.x, sprite.y, sprite.w, sprite.h - (sprite.h*clipH/destH));
      } else {
        graphicsBuffer.image(sprites, destX, destY, destW, destH - clipH, sprite.x, sprite.y, sprite.w, sprite.h - (sprite.h*clipH/destH));
      }
      
      graphicsBuffer.pop();
    }
      
}

function renderExplosion(w, h, resolution, roadWidth, currentFrame, sprite, scale, destX, destY, offsetX, offsetY, clipY) {

  //  scale for projection AND relative to roadWidth (for tweakUI)
  var destW  = (sprite.w * scale * w/2) * (SPRITES.SCALE * roadWidth);
  var destH  = (sprite.h * scale * w/2) * (SPRITES.SCALE * roadWidth);

  destX = destX + (destW * (offsetX || 0));
  destY = destY + (destH * (offsetY || 0));

  var clipH = clipY ? max(0, destY + destH - clipY) : 0;
  if (clipH < destH)
    graphicsBuffer.image(currentFrame, destX, destY, destW, destH - clipH, sprite.x, sprite.y, sprite.w, sprite.h - (sprite.h*clipH/destH));
}

function renderPlayer(w, h, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown) {

    var bounce = (1.5 * random() * speedPercent * resolution) * randomChoice([-1, 1]);
    var sprite;
  
    if (steer < 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_LEFT : SPRITES.PLAYER_LEFT;
    else if (steer > 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_RIGHT : SPRITES.PLAYER_RIGHT;
    else
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_STRAIGHT : SPRITES.PLAYER_STRAIGHT;

    renderSprite(w, h, resolution, roadWidth, sprites, sprite, scale, destX, destY + bounce, -0.5, -1);
}

function renderPlayerNew(w, h, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown) {
  var bounce = (1.5 * random() * speedPercent * resolution) * randomChoice([-1,1]);
  var sprite;

  if (steer < 0)
    sprite = (updown > 0) ? CAR_SPRITES.UP_LEFT : CAR_SPRITES.LEFT;
  else if (steer > 0)
    sprite = (updown > 0) ? CAR_SPRITES.UP_RIGHT : CAR_SPRITES.RIGHT;
  else
    sprite = (updown > 0) ? CAR_SPRITES.UP : CAR_SPRITES.STRAIGHT;

  renderSprite(w, h, resolution, roadWidth, sprite.sprite, sprite, scale * 2.0, destX, destY + bounce, -0.5, -1);
}

function renderSegment(segWidth, lanes, x1, y1, w1, x2, y2, w2, f, col) {
    var r1 = rumbleWidth(w1, lanes);
    var r2 = rumbleWidth(w2, lanes);
    var l1 = laneMarkerWidth(w1, lanes);
    var l2 = laneMarkerWidth(w2, lanes);

    var lanew1, lanew2, lanex1, lanex2, lane;

    graphicsBuffer.push();
    graphicsBuffer.fill(col.grass);
    graphicsBuffer.rect(0, y2, segWidth, y1 - y2);
    graphicsBuffer.pop();

    polygon(x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, col.rumble);
    polygon(x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, col.rumble);
    polygon(x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, col.road);

    if (col.lane) {
        lanew1 = w1*2/lanes;
        lanew2 = w2*2/lanes;
        lanex1 = x1 - w1 + lanew1;
        lanex2 = x2 - w2 + lanew2;
        
        for (lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++) {
            polygon(lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, col.lane);
        }
    }

    fog(0, y1, y2 - y1, f);
}

function polygon(x1, y1, x2, y2, x3, y3, x4, y4, col) {
  
  graphicsBuffer.push();
  graphicsBuffer.fill(col);
  
  graphicsBuffer.beginShape();
  
  graphicsBuffer.vertex(x1, y1);
  graphicsBuffer.vertex(x2, y2);
  graphicsBuffer.vertex(x3, y3);
  graphicsBuffer.vertex(x4, y4);
  
  graphicsBuffer.endShape(CLOSE);
  
  graphicsBuffer.pop();
}

function exponentialFog(distance, density) {
  return 1 / pow(Math.E, (distance * distance * density));
}

function fog(x, y, w, h, f) {
  if (f < 1) {
    graphicsBuffer.push();
    graphicsBuffer.fill(0, 255, 0, 255 - (255*f));
    graphicsBuffer.rect(x, y, w, h);
    graphicsBuffer.pop();
  }
}

function project(p, cameraX, cameraY, cameraZ, cameraDepth, w, h, roadWidth) {
    p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth/p.camera.z;
    p.screen.x = round((w/2) + (p.screen.scale * p.camera.x * w/2));
    p.screen.y = round((h/2) - (p.screen.scale * p.camera.y * h/2));
    p.screen.w = round((p.screen.scale * roadWidth * w/2));
}

function renderHUD() {
  graphicsBuffer.push();

  graphicsBuffer.fill(0);

  graphicsBuffer.textSize(12);
  graphicsBuffer.textFont(sysFont);
  graphicsBuffer.textAlign(LEFT, BASELINE);
  graphicsBuffer.text("Lives in danger: " + populationInRadius, 5, 16);
  graphicsBuffer.text("Speed: " + floor(spd/100), 5, 32);

  if (timeLeft < 10) graphicsBuffer.fill(255, 0, 0);

  graphicsBuffer.text("Time: " + floor(timeLeft), 5, 48);
  graphicsBuffer.pop();
}