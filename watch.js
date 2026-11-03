/**
 * Luxury Mechanical Analog Wrist Watch Engine
 * Renders an ultra-high definition Swiss horological timepiece with:
 * - Brushed and fluted metallic bezel (Steel, Rose Gold, Obsidian, Bronze)
 * - Sunburst guilloché dial with applied faceted diamond-cut indices
 * - 24-Hour Sun & Moon celestial complication disc
 * - Magnified cyclops date aperture
 * - High-beat sweeping second hand (28,800 vph / smooth 60fps)
 * - High-speed mechanical gear winding animation when changing timezones
 * - Super-LumiNova phosphorescent night glow in dark hours
 * - Anti-reflective sapphire crystal specular light sheen
 */

// Canvas roundRect compatibility polyfill
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === "number") radii = [radii, radii, radii, radii];
    if (!Array.isArray(radii)) radii = [0, 0, 0, 0];
    const r1 = radii[0] || 0;
    const r2 = radii[1] || r1;
    const r3 = radii[2] || r1;
    const r4 = radii[3] || r2;
    this.beginPath();
    this.moveTo(x + r1, y);
    this.lineTo(x + w - r2, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r2);
    this.lineTo(x + w, y + h - r3);
    this.quadraticCurveTo(x + w, y + h, x + w - r3, y + h);
    this.lineTo(x + r4, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r4);
    this.lineTo(x, y + r1);
    this.quadraticCurveTo(x, y, x + r1, y);
    this.closePath();
    return this;
  };
}

export class WatchEngine {
  constructor(canvas, soundEngine, isDialTexture = true) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sound = soundEngine;
    this.isDialTexture = isDialTexture;

    // Theme finish: 'steel' | 'rose-gold' | 'obsidian' | 'bronze'
    this.finish = "steel";

    // Target Time (what the watch is currently displaying or tracking)
    this.currentTime = {
      hours: 10,
      minutes: 10,
      seconds: 30,
      milliseconds: 0,
      day: 1,
      month: "Nov",
      year: 2026,
      weekday: "Monday",
      timeOfDay: "day",
      decimalHour: 10.17
    };

    // Interpolated Hand Angles (in radians)
    this.handAngles = {
      hour: 0,
      minute: 0,
      second: 0,
      celestial: 0
    };

    // Transition Animation State (rapid hand winding)
    this.isTransitioning = false;
    this.transitionStart = 0;
    this.transitionDuration = 1800; // ms
    this.startAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };
    this.targetAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };

    this.lastTickSecond = -1;
    this.lumeAmount = 0; // 0 = day reflection, 1 = full night glow

    this.resize();
    this.initAngles();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 480, rect.height || 480);

    if (this.canvas.width !== size * dpr || this.canvas.height !== size * dpr) {
      this.canvas.width = size * dpr;
      this.canvas.height = size * dpr;
    }
    this.size = size * dpr;
    this.radius = this.size / 2;
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
  }

  setFinish(finish) {
    this.finish = finish;
  }

  initAngles() {
    const { hours, minutes, seconds } = this.currentTime;
    const secAngle = (seconds / 60) * Math.PI * 2;
    const minAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2;
    const hrAngle = (((hours % 12) + minutes / 60 + seconds / 3600) / 12) * Math.PI * 2;
    const celAngle = ((hours + minutes / 60) / 24) * Math.PI * 2;

    this.handAngles = {
      hour: hrAngle,
      minute: minAngle,
      second: secAngle,
      celestial: celAngle
    };
  }

  /**
   * Sets the watch to a new location's time.
   * If animate is true, triggers high-speed mechanical gear winding animation!
   */
  setTime(timeInfo, animate = true) {
    const prevTime = { ...this.currentTime };
    this.currentTime = { ...timeInfo };

    const targetHr = (((timeInfo.hours % 12) + timeInfo.minutes / 60 + timeInfo.seconds / 3600) / 12) * Math.PI * 2;
    const targetMin = ((timeInfo.minutes + timeInfo.seconds / 60) / 60) * Math.PI * 2;
    const targetSec = (timeInfo.seconds / 60) * Math.PI * 2;
    const targetCel = ((timeInfo.hours + timeInfo.minutes / 60) / 24) * Math.PI * 2;

    if (!animate) {
      this.handAngles.hour = targetHr;
      this.handAngles.minute = targetMin;
      this.handAngles.second = targetSec;
      this.handAngles.celestial = targetCel;
      this.isTransitioning = false;
      return;
    }

    // Begin rapid mechanical winding transition
    this.isTransitioning = true;
    this.transitionStart = performance.now();
    this.transitionDuration = 1600;

    // Play winding audio whirl
    if (this.sound) {
      this.sound.playWindingEffect(1.4);
    }

    this.startAngles = { ...this.handAngles };

    // Calculate forward spin: spin minute hand at least 1-2 extra full revolutions
    let minDelta = targetMin - (this.startAngles.minute % (Math.PI * 2));
    if (minDelta < 0) minDelta += Math.PI * 2;
    minDelta += Math.PI * 4; // 2 extra full spins

    let hrDelta = targetHr - (this.startAngles.hour % (Math.PI * 2));
    if (hrDelta < 0) hrDelta += Math.PI * 2;
    hrDelta += (minDelta / 12); // Proportional hour movement

    let secDelta = targetSec - (this.startAngles.second % (Math.PI * 2));
    if (secDelta < 0) secDelta += Math.PI * 2;
    secDelta += Math.PI * 12; // 6 fast revolutions

    let celDelta = targetCel - (this.startAngles.celestial % (Math.PI * 2));
    if (celDelta < 0) celDelta += Math.PI * 2;

    this.targetAngles = {
      hour: this.startAngles.hour + hrDelta,
      minute: this.startAngles.minute + minDelta,
      second: this.startAngles.second + secDelta,
      celestial: this.startAngles.celestial + celDelta
    };
  }

  startLoop() {
    const loop = (timestamp) => {
      this.update(timestamp);
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(timestamp) {
    if (this.isTransitioning) {
      const elapsed = timestamp - this.transitionStart;
      const progress = Math.min(1.0, elapsed / this.transitionDuration);

      // Mechanical spring overshoot easing (quintic out with slight elasticity)
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 4);

      this.handAngles.hour = this.startAngles.hour + (this.targetAngles.hour - this.startAngles.hour) * ease;
      this.handAngles.minute = this.startAngles.minute + (this.targetAngles.minute - this.startAngles.minute) * ease;
      this.handAngles.second = this.startAngles.second + (this.targetAngles.second - this.startAngles.second) * ease;
      this.handAngles.celestial = this.startAngles.celestial + (this.targetAngles.celestial - this.startAngles.celestial) * ease;

      if (progress >= 1.0) {
        this.isTransitioning = false;
        // Normalize angles to prevent overflow
        this.handAngles.hour = this.targetAngles.hour % (Math.PI * 2);
        this.handAngles.minute = this.targetAngles.minute % (Math.PI * 2);
        this.handAngles.second = this.targetAngles.second % (Math.PI * 2);
        this.handAngles.celestial = this.targetAngles.celestial % (Math.PI * 2);

        if (this.sound) {
          this.sound.playArrivalChime();
        }
      }
    } else {
      // Normal clock ticking operation
      // Derive local time from continuous monotonic timestamp + timezone offset
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetOffsetMinutes = (this.currentTime.offsetMinutes !== undefined) ? this.currentTime.offsetMinutes : 0;
      const targetTimeMs = utcMs + targetOffsetMinutes * 60000;
      const localDate = new Date(targetTimeMs);

      const sec = localDate.getSeconds();
      const ms = localDate.getMilliseconds();
      const min = localDate.getMinutes();
      const hr = localDate.getHours();

      // Normal Clock Tick:
      // In the first 75ms of each second, the second hand snaps forward with a crisp mechanical step.
      // For the rest of the second (75ms to 999ms), it stays solidly on the second tick mark!
      // This is strictly forward-only: it can NEVER reverse or jitter.
      const stepDuration = 75; // ms for the crisp snap
      const snapProgress = Math.min(1.0, ms / stepDuration);
      const snapEase = 1 - Math.pow(1 - snapProgress, 3);

      const prevSec = (sec + 59) % 60;
      const visualSecond = prevSec + snapEase;

      // Escapement ticking sound (1 crisp tick per second on step)
      if (sec !== this.lastTickSecond) {
        this.lastTickSecond = sec;
        if (this.sound) {
          this.sound.playTick(sec % 2 === 0);
        }
      }

      this.handAngles.second = (visualSecond / 60) * Math.PI * 2;
      this.handAngles.minute = ((min + sec / 60) / 60) * Math.PI * 2;
      this.handAngles.hour = (((hr % 12) + min / 60 + sec / 3600) / 12) * Math.PI * 2;
      this.handAngles.celestial = ((hr + min / 60) / 24) * Math.PI * 2;
    }

    // Smoothly adjust lume amount based on timeOfDay
    const targetLume = (this.currentTime.timeOfDay === "night" || this.currentTime.timeOfDay === "dusk") ? 1.0 : 0.0;
    this.lumeAmount += (targetLume - this.lumeAmount) * 0.05;
  }

  draw() {
    const ctx = this.ctx;
    const r = this.radius;

    ctx.clearRect(0, 0, this.size, this.size);

    ctx.save();
    ctx.translate(r, r);

    if (this.isDialTexture) {
      // Scale dial so it covers the circular face for 3D model mapping
      const dialScale = 1.34;
      ctx.scale(dialScale, dialScale);
      this.drawDial(ctx, r);
      this.drawCelestialSubdial(ctx, r);
      this.drawDateAperture(ctx, r);
      this.drawIndices(ctx, r);
      this.drawHands(ctx, r);
    } else {
      this.drawStraps(ctx, r);
      this.drawCase(ctx, r);
      this.drawBezel(ctx, r);
      this.drawDial(ctx, r);
      this.drawCelestialSubdial(ctx, r);
      this.drawDateAperture(ctx, r);
      this.drawIndices(ctx, r);
      this.drawHands(ctx, r);
      this.drawSapphireReflection(ctx, r);
    }

    ctx.restore();
  }

  drawStraps(ctx, r) {
    const strapW = r * 0.58;
    const strapH = r * 1.05;

    ctx.save();

    // Top & Bottom Straps
    [-1, 1].forEach(dir => {
      ctx.save();
      ctx.scale(1, dir);

      // Strap background gradient (alligator grain leather)
      const grad = ctx.createLinearGradient(-strapW / 2, r * 0.72, strapW / 2, r * 0.72);
      if (this.finish === "rose-gold") {
        grad.addColorStop(0, "#1c1410");
        grad.addColorStop(0.5, "#30221a");
        grad.addColorStop(1, "#1c1410");
      } else if (this.finish === "obsidian") {
        grad.addColorStop(0, "#08090b");
        grad.addColorStop(0.5, "#15171c");
        grad.addColorStop(1, "#08090b");
      } else {
        // Classic rich saddle espresso leather
        grad.addColorStop(0, "#181412");
        grad.addColorStop(0.2, "#2e241f");
        grad.addColorStop(0.5, "#3e312a");
        grad.addColorStop(0.8, "#2e241f");
        grad.addColorStop(1, "#181412");
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(-strapW / 2, r * 0.7, strapW, strapH, [0, 0, 16, 16]);
      ctx.fill();

      // Strap edge stitching
      ctx.strokeStyle = "rgba(220, 190, 150, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);

      // Left stitch line
      ctx.beginPath();
      ctx.moveTo(-strapW / 2 + 8, r * 0.72);
      ctx.lineTo(-strapW / 2 + 8, r * 0.7 + strapH);
      ctx.stroke();

      // Right stitch line
      ctx.beginPath();
      ctx.moveTo(strapW / 2 - 8, r * 0.72);
      ctx.lineTo(strapW / 2 - 8, r * 0.7 + strapH);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.restore();
    });

    ctx.restore();
  }

  drawCase(ctx, r) {
    const caseR = r * 0.88;

    ctx.save();

    // Drop Shadow under watch case
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 16;

    // Metallic outer finish gradient
    const grad = ctx.createLinearGradient(-caseR, -caseR, caseR, caseR);
    if (this.finish === "rose-gold") {
      grad.addColorStop(0, "#f3c7a5");
      grad.addColorStop(0.25, "#d9976b");
      grad.addColorStop(0.5, "#7b4831");
      grad.addColorStop(0.75, "#e5ad85");
      grad.addColorStop(1, "#9e6145");
    } else if (this.finish === "obsidian") {
      grad.addColorStop(0, "#3e424c");
      grad.addColorStop(0.3, "#1a1d24");
      grad.addColorStop(0.6, "#282d38");
      grad.addColorStop(1, "#121318");
    } else if (this.finish === "bronze") {
      grad.addColorStop(0, "#d8ad69");
      grad.addColorStop(0.35, "#8a6635");
      grad.addColorStop(0.7, "#c19554");
      grad.addColorStop(1, "#543e21");
    } else {
      // Classic 904L Brushed Stainless Steel
      grad.addColorStop(0, "#f6f8fa");
      grad.addColorStop(0.2, "#cfd5dc");
      grad.addColorStop(0.45, "#8b94a0");
      grad.addColorStop(0.7, "#e4e8ec");
      grad.addColorStop(0.9, "#a2abb6");
      grad.addColorStop(1, "#ffffff");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, caseR, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";

    // Winding Crown at 3 o'clock
    ctx.save();
    const crownX = caseR - 2;
    const crownW = r * 0.08;
    const crownH = r * 0.16;

    const crownGrad = ctx.createLinearGradient(crownX, -crownH / 2, crownX + crownW, crownH / 2);
    crownGrad.addColorStop(0, "#999");
    crownGrad.addColorStop(0.5, "#fff");
    crownGrad.addColorStop(1, "#444");

    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    ctx.roundRect(crownX, -crownH / 2, crownW, crownH, [4, 6, 6, 4]);
    ctx.fill();

    // Crown ridges
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    for (let y = -crownH / 2 + 3; y < crownH / 2 - 2; y += 4) {
      ctx.fillRect(crownX + 2, y, crownW - 4, 1.5);
    }
    ctx.restore();

    ctx.restore();
  }

  drawBezel(ctx, r) {
    const bezelOuter = r * 0.85;
    const bezelInner = r * 0.74;

    ctx.save();

    // Circular brushed metallic bezel
    const bezelGrad = ctx.createRadialGradient(0, 0, bezelInner, 0, 0, bezelOuter);
    if (this.finish === "rose-gold") {
      bezelGrad.addColorStop(0, "#73422c");
      bezelGrad.addColorStop(0.5, "#d6986e");
      bezelGrad.addColorStop(1, "#8e5239");
    } else if (this.finish === "obsidian") {
      bezelGrad.addColorStop(0, "#151820");
      bezelGrad.addColorStop(0.5, "#252b37");
      bezelGrad.addColorStop(1, "#0d0f14");
    } else {
      bezelGrad.addColorStop(0, "#7f8894");
      bezelGrad.addColorStop(0.3, "#e2e6eb");
      bezelGrad.addColorStop(0.7, "#9da5b0");
      bezelGrad.addColorStop(1, "#545b66");
    }

    ctx.fillStyle = bezelGrad;
    ctx.beginPath();
    ctx.arc(0, 0, bezelOuter, 0, Math.PI * 2);
    ctx.arc(0, 0, bezelInner, 0, Math.PI * 2, true);
    ctx.fill();

    // Tachymeter / Bezel Ring Indexes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isMajor = i % 5 === 0;
      const startR = isMajor ? bezelInner + 3 : bezelInner + 6;
      const endR = bezelOuter - 4;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cos * startR, sin * startR);
      ctx.lineTo(cos * endR, sin * endR);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawDial(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    // Inner dial bevel shadow
    const dialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dialR);
    if (this.finish === "rose-gold") {
      dialGrad.addColorStop(0, "#1f1816");
      dialGrad.addColorStop(0.7, "#140e0c");
      dialGrad.addColorStop(1, "#080605");
    } else if (this.finish === "obsidian") {
      dialGrad.addColorStop(0, "#161b24");
      dialGrad.addColorStop(0.7, "#0c0e14");
      dialGrad.addColorStop(1, "#040508");
    } else {
      // Midnight Cobalt Sunburst
      dialGrad.addColorStop(0, "#132338");
      dialGrad.addColorStop(0.65, "#0b1524");
      dialGrad.addColorStop(0.95, "#060b13");
      dialGrad.addColorStop(1, "#020407");
    }

    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.fill();

    // Sunburst ray reflections
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 90) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * dialR, Math.sin(a) * dialR);
      ctx.stroke();
    }
    ctx.restore();

    // Chronometer Brand & Precision Engraving
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Brand Emblem: PHILL
    ctx.fillStyle = this.finish === "rose-gold" ? "#e5b18a" : "#cdd5e0";
    ctx.font = `700 ${r * 0.056}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
    ctx.letterSpacing = "6px";
    ctx.fillText("PHILL", 0, -dialR * 0.38);

    ctx.font = `400 ${r * 0.024}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "rgba(200, 215, 235, 0.55)";
    ctx.letterSpacing = "2px";
    ctx.fillText("GENÈVE", 0, -dialR * 0.28);
    ctx.fillText("CHRONOMETER", 0, -dialR * 0.21);

    // Swiss Made at bottom 6 o'clock
    ctx.font = `500 ${r * 0.02}px sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("SWISS   MADE", 0, dialR * 0.88);

    ctx.restore();
  }

  drawCelestialSubdial(ctx, r) {
    // 24-Hour Sun & Moon Complication at 6 o'clock
    const dialR = r * 0.74;
    const subX = 0;
    const subY = dialR * 0.38;
    const subR = dialR * 0.27;

    ctx.save();
    ctx.translate(subX, subY);

    // Subdial circular frame
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, subR, 0, Math.PI * 2);
    ctx.stroke();

    // Clip to aperture window
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, subR - 2, 0, Math.PI * 2);
    ctx.clip();

    // Rotating celestial sky disc
    ctx.save();
    ctx.rotate(this.handAngles.celestial);

    // Top half: daytime golden azure sky with sun
    // Bottom half: nighttime deep space navy with moon & stars
    const skyGrad = ctx.createLinearGradient(0, -subR, 0, subR);
    skyGrad.addColorStop(0, "#1d5894");  // Noon sky
    skyGrad.addColorStop(0.4, "#d8853b"); // Sunset/Sunrise horizon
    skyGrad.addColorStop(0.6, "#15172d"); // Twilight
    skyGrad.addColorStop(1, "#04060f");   // Midnight space
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-subR, -subR, subR * 2, subR * 2);

    // Radiant Golden Sun (at top noon position)
    const sunY = -subR * 0.55;
    const sunR = subR * 0.28;
    const sunGrad = ctx.createRadialGradient(0, sunY, 1, 0, sunY, sunR);
    sunGrad.addColorStop(0, "#fff5d0");
    sunGrad.addColorStop(0.4, "#ffc640");
    sunGrad.addColorStop(1, "rgba(255, 160, 20, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(0, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();

    // Golden Crescent Moon (at bottom midnight position)
    const moonY = subR * 0.55;
    const moonR = subR * 0.22;
    ctx.fillStyle = "#e8efff";
    ctx.beginPath();
    ctx.arc(0, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    // Moon shadow to form crescent
    ctx.fillStyle = "#0c0e18";
    ctx.beginPath();
    ctx.arc(moonR * 0.45, moonY - moonR * 0.1, moonR * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Tiny stars around moon
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    [[-subR * 0.4, moonY - 6], [subR * 0.4, moonY + 4], [-subR * 0.25, moonY + 10], [subR * 0.3, moonY - 10]].forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 1.5, 1.5);
    });

    ctx.restore(); // end rotating disc
    ctx.restore(); // end clip

    // Subdial 24-hr Roman/Numeric markers (24, 6, 12, 18)
    ctx.font = `600 ${r * 0.024}px sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("24", 0, -subR + 9);
    ctx.fillText("12", 0, subR - 8);
    ctx.fillText("6", subR - 9, 0);
    ctx.fillText("18", -subR + 9, 0);

    ctx.restore();
  }

  drawDateAperture(ctx, r) {
    // 3 o'clock Date Window with Cyclops Lens effect
    const dialR = r * 0.74;
    const dateX = dialR * 0.64;
    const dateY = 0;
    const dateW = r * 0.15;
    const dateH = r * 0.12;

    ctx.save();
    ctx.translate(dateX, dateY);

    // Beveled frame
    ctx.fillStyle = this.finish === "rose-gold" ? "#d4976c" : "#bdc5cf";
    ctx.beginPath();
    ctx.roundRect(-dateW / 2 - 2, -dateH / 2 - 2, dateW + 4, dateH + 4, 3);
    ctx.fill();

    // Inner window
    ctx.fillStyle = "#f6f8fb";
    ctx.beginPath();
    ctx.roundRect(-dateW / 2, -dateH / 2, dateW, dateH, 2);
    ctx.fill();

    // Date Numeral
    ctx.fillStyle = "#111822";
    ctx.font = `700 ${r * 0.068}px "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.currentTime.day || 1), 0, 1);

    ctx.restore();
  }

  drawIndices(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isHour = i % 5 === 0;

      ctx.save();
      ctx.rotate(angle);

      if (isHour) {
        const markerW = r * 0.024;
        const markerH = (i === 0 || i === 30 || i === 45) ? r * 0.13 : r * 0.095;
        const markerY = -dialR + 10;

        // Skip 3 o'clock marker partially for date window
        if (i === 15) {
          ctx.restore();
          continue;
        }

        // Diamond-cut faceted metallic applied marker
        ctx.fillStyle = this.finish === "rose-gold" ? "#e4a97f" : "#dce2ec";
        ctx.beginPath();
        ctx.roundRect(-markerW / 2, markerY, markerW, markerH, 2);
        ctx.fill();

        // Marker luminous center stripe (Super-LumiNova)
        const lumeColor = this.lumeAmount > 0.05
          ? `rgba(50, 255, 180, ${0.4 + this.lumeAmount * 0.6})`
          : "rgba(240, 248, 255, 0.85)";

        if (this.lumeAmount > 0.1) {
          ctx.shadowColor = "#39ffb4";
          ctx.shadowBlur = 12 * this.lumeAmount;
        }

        ctx.fillStyle = lumeColor;
        ctx.fillRect(-markerW / 4, markerY + 3, markerW / 2, markerH - 6);
      } else {
        // Subtle minute railroad tick
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -dialR + 4);
        ctx.lineTo(0, -dialR + 12);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawHands(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    // Night Super-LumiNova glow setup
    const lumeColor = this.lumeAmount > 0.05
      ? `rgba(60, 255, 190, ${0.5 + this.lumeAmount * 0.5})`
      : "rgba(255, 255, 255, 0.9)";

    const metalColor = this.finish === "rose-gold" ? "#e6ad85" : "#e4eaef";
    const darkMetalColor = this.finish === "rose-gold" ? "#885139" : "#69727d";

    // 1. Hour Hand (Dauphine Faceted)
    ctx.save();
    ctx.rotate(this.handAngles.hour);

    // Drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    const hrLen = dialR * 0.55;
    const hrW = r * 0.038;

    // Left Facet (Light)
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(-hrW, 0);
    ctx.lineTo(0, -hrLen);
    ctx.closePath();
    ctx.fill();

    // Right Facet (Darker bevel)
    ctx.fillStyle = darkMetalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(hrW, 0);
    ctx.lineTo(0, -hrLen);
    ctx.closePath();
    ctx.fill();

    // Luminous inner slit
    if (this.lumeAmount > 0.1) {
      ctx.shadowColor = "#39ffb4";
      ctx.shadowBlur = 14 * this.lumeAmount;
    }
    ctx.fillStyle = lumeColor;
    ctx.fillRect(-hrW * 0.35, -hrLen * 0.8, hrW * 0.7, hrLen * 0.55);

    ctx.restore();

    // 2. Minute Hand (Longer Faceted Sword)
    ctx.save();
    ctx.rotate(this.handAngles.minute);

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    const minLen = dialR * 0.82;
    const minW = r * 0.032;

    // Left Facet
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(-minW, 0);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Right Facet
    ctx.fillStyle = darkMetalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(minW, 0);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Luminous inner slit
    if (this.lumeAmount > 0.1) {
      ctx.shadowColor = "#39ffb4";
      ctx.shadowBlur = 14 * this.lumeAmount;
    }
    ctx.fillStyle = lumeColor;
    ctx.fillRect(-minW * 0.35, -minLen * 0.85, minW * 0.7, minLen * 0.65);

    ctx.restore();

    // 3. Second Hand (Needle sweep with counterbalance and crimson tip)
    ctx.save();
    ctx.rotate(this.handAngles.second);

    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 8;

    const secLen = dialR * 0.92;
    const secTail = dialR * 0.28;

    // Needle body
    ctx.strokeStyle = "#e63946"; // Vibrant horological red
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, secTail);
    ctx.lineTo(0, -secLen);
    ctx.stroke();

    // Counterbalance circle
    ctx.fillStyle = "#e63946";
    ctx.beginPath();
    ctx.arc(0, secTail * 0.5, r * 0.024, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 4. Center Hand Boss Pin (Polished metallic cap)
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.035, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e2229";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.012, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawSapphireReflection(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    // Anti-Reflective curved sapphire glass diagonal flare
    const flareGrad = ctx.createLinearGradient(-dialR, -dialR, dialR, dialR);
    flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    flareGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.04)");
    flareGrad.addColorStop(0.48, "rgba(255, 255, 255, 0)");
    flareGrad.addColorStop(0.52, "rgba(100, 180, 255, 0.06)"); // AR violet/blue coating reflection
    flareGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.03)");
    flareGrad.addColorStop(1, "rgba(255, 255, 255, 0.12)");

    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(0, 0, dialR - 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
