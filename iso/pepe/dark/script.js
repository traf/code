var w = window.innerWidth;
var h = window.innerHeight;

function getContext(w, h, append) {
  var canvas = document.createElement("canvas");
  if (Boolean(append) === true) document.body.appendChild(canvas);
  canvas.width = w || window.innerWidth;
  canvas.height = h || window.innerHeight;
  return canvas.getContext("2d");
}
var ctx = getContext(w, h, true);

var seed = 2;
function reset() {
  PRNG.setSeed(seed++);

  w = window.innerWidth;
  h = window.innerHeight;
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  var c = new Point();
  c.radius = h / 1.5;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#444";
  ctx.globalAlpha = 0.25;

  var quads = [];
  var q = new Q(c.x - c.radius, c.y - c.radius, c.radius * 2, c.radius * 2);
  var qs = q.split();
  qs.forEach(function(q) {
    var qs = q.split();
    qs[1].glow = true;
    qs.forEach(function(q) {
      var glow = q.glow != null;
      var qs = q.split();
      qs.forEach(function(q) {
        var qs = q.split();
        qs.forEach(function(q) {
          q.glow = Boolean(glow);
          quads.push(q);
        });
      });
    });
  });

  var s = 1 + PRNG.random() * 2;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(1 * s, 0.62 * s);
  ctx.rotate(Math.PI / 4);

  var landuse = [];

  ctx.beginPath();
  quads.forEach(function(q, i) {
    var cq = new Point(q.x + q.w / 2, q.y + q.h / 2);

    if (!circleContainsPoint(cq, c)) return;

    if (PRNG.random() > (1 - distance(cq, c) / c.radius) * 2) return;

    var offset = 4;
    var ps = offsetPolygon(q.points.concat(), offset);
    q.points = ps;
    landuse.push(q);

    ctx.moveTo(ps[0].x, ps[0].y);
    ctx.lineTo(ps[1].x, ps[1].y);
    ctx.lineTo(ps[2].x, ps[2].y);
    ctx.lineTo(ps[3].x, ps[3].y);
    ctx.lineTo(ps[0].x, ps[0].y);
  });
  ctx.closePath();
  ctx.stroke();

  ctx.save();
  ctx.clip();
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#000";
  ctx.fillRect(-w, -h, w * 2, h * 2);
  ctx.restore();

  landuse.forEach(function(q, id) {
    var i;
    var inc = 10;
    var tot = 10;
    
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#000";

    inc = 2 + Math.sqrt(Math.sqrt(q.area));
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#444";
    ctx.save();

    ctx.globalAlpha = 1;
    ctx.translate(-inc, -inc);
    q.draw(ctx);
    ctx.fill();

    if (PRNG.random() < 0.7) {
      var s = Math.min(20, Math.min(q.w, q.h) / 2);
      var ps = offsetPolygon(q.points, s);

      ctx.globalAlpha = 1;
      drawPath(ctx, ps);

      ctx.strokeStyle = "#000";
      var colorOptions = ["#F65558", "#18BB6F", "#1E7FF7", "#FFFFFF"];  // Added white
      var colorIndex = Math.floor(PRNG.random() * colorOptions.length);  // Random color selection
      ctx.fillStyle = ctx.shadowColor = colorOptions[colorIndex];

      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 2;
      ctx.fill();
    }

    ctx.restore();
  });

  // Add new geometric patterns
  addGeometricPatterns(ctx, w, h);

  var imgData = ctx.getImageData(0, 0, w, h);
  imgData.data = noise(32, imgData.data, w, h);
  ctx.putImageData(imgData, 0, 0);

  landuse.forEach(function(q, id) {
    if (!Boolean(q.glow)) return;
    if (id % 3 == 0) {
      ctx.save();
      q.draw(ctx);
      ctx.clip();

      for (var i = 0; i < 10; i += 1) {
        ctx.translate(10, 10);
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.globalCompositeOperation = "lighten";
        ctx.shadowColor = ctx.strokeStyle = ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.8 - i / 10;
        q.draw(ctx);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
}

function drawPath(ctx, pts) {
  ctx.beginPath();
  pts.forEach(function(p) {
    ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
}

//////////////////////////////////////////////////////////////

var Q = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.points = [
    new Point(this.x, this.y),
    new Point(this.x + this.w, this.y),
    new Point(this.x + this.w, this.y + this.h),
    new Point(this.x, this.y + this.h)
  ];
  this.area = this.w * this.h;
};

Q.prototype = {
  draw: function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.w, this.y);
    ctx.lineTo(this.x + this.w, this.y + this.h);
    ctx.lineTo(this.x, this.y + this.h);
    ctx.closePath();
  },
  split: function() {
    if (this.w * this.h < 100) return [];
    var ratio = Math.max(this.w, this.h) / Math.min(this.w, this.h);
    if (ratio < 0.25 || ratio > 5) return [];

    var x = this.x;
    var y = this.y;

    var t0 = 0.5 + (PRNG.random() - 0.5) * 0.5;
    var t1 = 0.5 + (PRNG.random() - 0.5) * 0.5;

    var w = this.w * t0;
    var h = this.h * t1;
    var w2 = this.w * (1 - t0);
    var h2 = this.h * (1 - t1);

    return [
      new Q(x, y, w, h),
      new Q(x + w, y, w2, h),
      new Q(x, y + h, w, h2),
      new Q(x + w, y + h, w2, h2)
    ];
  }
};

//////////////////////////////////////////////////////////////

var Point = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  return this;
};
Point.prototype = {
  add: function(p) {
    this.x += p.x;
    this.y += p.y;
    return this;
  },
  sub: function(p) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  },
  clone: function() {
    return new Point(this.x, this.y);
  },
  copy: function(p) {
    this.x = p.x;
    this.y = p.y;
    return this;
  },
  set: function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
  length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  normalize: function(value) {
    var l = this.length();
    this.x /= l;
    this.y /= l;
    if (value != null) this.multiplyScalar(value);
    return this;
  },
  multiplyScalar: function(value) {
    this.x *= value;
    this.y *= value;
    return this;
  },
  direction: function(other) {
    return other.clone().sub(this).normalize();
  },
  negate: function() {
    this.x *= -1;
    this.y *= -1;
    return this;
  },
  dot: function(p) {
    return this.x * p.x + this.y * p.y;
  },
  equals: function(other) {
    return this.x == other.x && this.y == other.y;
  },
  midpoint: function(other) {
    return new Point((this.x + other.x) / 2, (this.y + other.y) / 2);
  }
};

//////////////////////////////////////////////////////////////

function noise(amount, data, w, h) {
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var id = (y * w + x) * 4;
      var noise = ~~((PRNG.random() - 0.5) * amount);
      data[id] += noise;
      data[id + 1] += noise;
      data[id + 2] += noise;
    }
  }
  return data;
}
function squareDistance(x0, y0, x1, y1) {
  return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
}
function distance(p0, p1) {
  return Math.sqrt(squareDistance(p0.x, p0.y, p1.x, p1.y));
}
function circleContainsPoint(p, circle) {
  return distance(circle, p) < circle.radius;
}
function offsetPolygon(points, offset) {
  var tmp = [];
  var count = points.length;
  for (var j = 0; j < count; j++) {
    // finds the previous, current and next point
    var i = j - 1;
    if (i < 0) i += count;
    var k = (j + 1) % count;

    var pre = points[i];
    var cur = points[j];
    var nex = points[k];

    //create 2 lines, parallel to both edges at a given distance 'offset'

    //computes a normal vector to the direction of the: prev -> current edge of length offset
    var l1 = distance(cur, pre);
    var n1 = new Point(
      -((cur.y - pre.y) / l1) * offset,
      (cur.x - pre.x) / l1 * offset
    );

    //does the same for the : current -> next edge
    var l2 = distance(cur, nex);
    var n2 = new Point(
      -((nex.y - cur.y) / l2) * offset,
      (nex.x - cur.x) / l2 * offset
    );

    //and create 2 points at both ends of the edge to obtain a parallel line
    var p1 = new Point(pre.x + n1.x, pre.y + n1.y);
    var p2 = new Point(cur.x + n1.x, cur.y + n1.y);
    var p3 = new Point(cur.x + n2.x, cur.y + n2.y);
    var p4 = new Point(nex.x + n2.x, nex.y + n2.y);

    var ip = lineIntersectLine(p1, p2, p3, p4);
    if (ip != null) {
      tmp.push(ip);
    }

  }
  return tmp;
}
function lineIntersectLine(A, B, E, F, ABasSeg, EFasSeg) {
  var a1, a2, b1, b2, c1, c2;

  a1 = B.y - A.y;
  b1 = A.x - B.x;
  a2 = F.y - E.y;
  b2 = E.x - F.x;

  var denom = a1 * b2 - a2 * b1;
  if (denom == 0) {
    return null;
  }

  c1 = B.x * A.y - A.x * B.y;
  c2 = F.x * E.y - E.x * F.y;

  ip = new Point();
  ip.x = (b1 * c2 - b2 * c1) / denom;
  ip.y = (a2 * c1 - a1 * c2) / denom;

  if (A.x == B.x) ip.x = A.x;
  else if (E.x == F.x) ip.x = E.x;
  if (A.y == B.y) ip.y = A.y;
  else if (E.y == F.y) ip.y = E.y;

  if (ABasSeg) {
    if (A.x < B.x ? ip.x < A.x || ip.x > B.x : ip.x > A.x || ip.x < B.x)
      return null;
    if (A.y < B.y ? ip.y < A.y || ip.y > B.y : ip.y > A.y || ip.y < B.y)
      return null;
  }
  if (EFasSeg) {
    if (E.x < F.x ? ip.x < E.x || ip.x > F.x : ip.x > E.x || ip.x < F.x)
      return null;
    if (E.y < F.y ? ip.y < E.y || ip.y > F.y : ip.y > E.y || ip.y < F.y)
      return null;
  }
  return ip;
}
function lerp(t, a, b) {
  return a * (1 - t) + b * t;
}
var PRNG = {
  a: 16807 /* multiplier */,
  m: 0x7fffffff /* 2**31 - 1 */,
  randomnum: 1,
  div: 1 / 0x7fffffff,
  nextlongrand: function(seed) {
    var lo, hi;
    lo = this.a * (seed & 0xffff);
    hi = this.a * (seed >> 16);
    lo += (hi & 0x7fff) << 16;
    if (lo > this.m) {
      lo &= this.m;
      ++lo;
    }
    lo += hi >> 15;
    if (lo > this.m) {
      lo &= this.m;
      ++lo;
    }
    return lo;
  },
  random: function() /* return next random number */ {
    this.randomnum = this.nextlongrand(this.randomnum);
    return this.randomnum * this.div;
  },
  setSeed: function(value) {
    this.randomnum = value <= 0 ? 1 : value;
  }
};

//////////////////////////////////////////////////////////////

function addGeometricPatterns(ctx, w, h) {
  var patternCount = PRNG.random() * 5 + 5; // 5 to 10 patterns
  for (var i = 0; i < patternCount; i++) {
    var x = PRNG.random() * w;
    var y = PRNG.random() * h;
    var size = PRNG.random() * 100 + 50;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(PRNG.random() * Math.PI * 2);

    if (PRNG.random() < 0.5) {
      addLinePattern(ctx, size);
    } else {
      addDotPattern(ctx, size);
    }

    ctx.restore();
  }
}

function addLinePattern(ctx, size) {
  ctx.strokeStyle = getRandomColor();
  ctx.lineWidth = 1;

  var lineCount = Math.floor(PRNG.random() * 10) + 5; // 5 to 15 lines
  var spacing = size / lineCount;

  ctx.beginPath();
  for (var i = -size / 2; i <= size / 2; i += spacing) {
    ctx.moveTo(i, -size / 2);
    ctx.lineTo(i, size / 2);
  }
  ctx.stroke();
}

function addDotPattern(ctx, size) {
  ctx.fillStyle = getRandomColor();

  var dotSize = 1;
  var spacing = PRNG.random() * 5 + 5; // 5 to 10 pixel spacing

  for (var x = -size / 2; x < size / 2; x += spacing) {
    for (var y = -size / 2; y < size / 2; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function getRandomColor() {
  var colors = ["#F65558", "#18BB6F", "#1E7FF7", "#FFFFFF"];
  return colors[Math.floor(PRNG.random() * colors.length)];
}

//////////////////////////////////////////////////////////////

window.addEventListener("mousedown", reset);
window.addEventListener("touchstart", reset);
reset();