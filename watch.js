/**
 * Luxury 2D Mechanical Wrist Watch Engine - PHILL
 * Faithfully re-creates the Swiss luxury dress watch (Rolex 1908 aesthetic):
 * - Double Bezel: Outer fine coin-edge fluted bezel & inner mirror-polished ring
 * - Pure porcelain white/ivory dial with delicate railroad minute track
 * - Applied faceted gold numerals (12, 3, 9) and faceted dagger hour markers
 * - Small seconds subdial at 6 o'clock with concentric circular snailing (azurage)
 * - Arched "SUPERLATIVE CHRONOMETER" inscription above the subdial
 * - Signature Observatory/Breguet-ring hour hand & double-edged sword minute hand
 * - Beautiful alligator-grain stitched leather strap and sculpted case lugs
 * - High-speed hand spin animation with mechanical deceleration to target time
 * - Monotonic dead-beat seconds ticking (crisp 75ms step, 925ms solid hold)
 */

export class WatchEngine {
  constructor(canvas, soundEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sound = soundEngine;

    // Finish palette: 'gold' (18ct Yellow Gold, default) | 'rose-gold' | 'white-gold' | 'platinum'
    this.finish = "gold";

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
      decimalHour: 10.17,
      offsetMinutes: 0
    };

    // Current hand angles (in radians)
    this.handAngles = {
      hour: 0,
      minute: 0,
      second: 0
    };

    // Transition Animation State (rapid hand spin with gradual deceleration)
    this.isTransitioning = false;
    this.transitionStart = 0;
    this.transitionDuration = 2200; // ms: fast spin that smoothly slows down
    this.startAngles = { hour: 0, minute: 0, second: 0 };
    this.targetAngles = { hour: 0, minute: 0, second: 0 };
    this.onTransitionComplete = null;

    this.lastTickSecond = -1;

    this.resize();
    this.initAngles();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 680, rect.height || 680);

    if (this.canvas.width !== Math.round(size * dpr) || this.canvas.height !== Math.round(size * dpr)) {
      this.canvas.width = Math.round(size * dpr);
      this.canvas.height = Math.round(size * dpr);
    }
    this.size = this.canvas.width;
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

    this.handAngles = {
      hour: hrAngle,
      minute: minAngle,
      second: secAngle
    };
  }

  /**
   * Sets the watch to a new location's time.
   * If animate is true, triggers high-speed hand spinning that smoothly decelerates to the new time!
   */
  setTime(timeInfo, animate = true, onComplete = null) {
    this.currentTime = { ...timeInfo };

    const targetHr = (((timeInfo.hours % 12) + timeInfo.minutes / 60 + timeInfo.seconds / 3600) / 12) * Math.PI * 2;
    const targetMin = ((timeInfo.minutes + timeInfo.seconds / 60) / 60) * Math.PI * 2;
    const targetSec = (timeInfo.seconds / 60) * Math.PI * 2;

    if (!animate) {
      this.handAngles.hour = targetHr;
      this.handAngles.minute = targetMin;
      this.handAngles.second = targetSec;
      this.isTransitioning = false;
      if (onComplete) onComplete();
      return;
    }

    // Begin rapid hand spinning animation with smooth mechanical deceleration
    this.isTransitioning = true;
    this.transitionStart = performance.now();
    this.transitionDuration = 2200; // ms
    this.onTransitionComplete = onComplete;

    if (this.sound) {
      this.sound.playWindingEffect(1.9);
    }

    this.startAngles = { ...this.handAngles };

    // Calculate forward deltas:
    // Minute hand spins 5 to 6 fast revolutions + forward delta
    let minDelta = targetMin - (this.startAngles.minute % (Math.PI * 2));
    if (minDelta <= 0) minDelta += Math.PI * 2;
    minDelta += Math.PI * 10; // 5 full extra revolutions

    // Hour hand spins forward proportionally + 1 full revolution
    let hrDelta = targetHr - (this.startAngles.hour % (Math.PI * 2));
    if (hrDelta <= 0) hrDelta += Math.PI * 2;
    hrDelta += Math.PI * 2; // 1 full extra revolution

    // Small second hand spins fast in its subdial (12 full revolutions)
    let secDelta = targetSec - (this.startAngles.second % (Math.PI * 2));
    if (secDelta <= 0) secDelta += Math.PI * 2;
    secDelta += Math.PI * 24; // 12 extra revolutions

    this.targetAngles = {
      hour: this.startAngles.hour + hrDelta,
      minute: this.startAngles.minute + minDelta,
      second: this.startAngles.second + secDelta
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

      // Fast initial spin, followed by smooth mechanical gear deceleration (quintic ease-out)
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 4);

      this.handAngles.hour = this.startAngles.hour + (this.targetAngles.hour - this.startAngles.hour) * ease;
      this.handAngles.minute = this.startAngles.minute + (this.targetAngles.minute - this.startAngles.minute) * ease;
      this.handAngles.second = this.startAngles.second + (this.targetAngles.second - this.startAngles.second) * ease;

      if (progress >= 1.0) {
        this.isTransitioning = false;
        // Normalize angles to 0..2PI
        this.handAngles.hour = this.targetAngles.hour % (Math.PI * 2);
        this.handAngles.minute = this.targetAngles.minute % (Math.PI * 2);
        this.handAngles.second = this.targetAngles.second % (Math.PI * 2);

        if (this.sound) {
          this.sound.playArrivalChime();
        }

        if (this.onTransitionComplete) {
          const cb = this.onTransitionComplete;
          this.onTransitionComplete = null;
          cb();
        }
      }
    } else {
      // Normal continuous clock operation
      // Synchronize with target timezone offset
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetOffsetMinutes = (this.currentTime.offsetMinutes !== undefined) ? this.currentTime.offsetMinutes : 0;
      const targetTimeMs = utcMs + targetOffsetMinutes * 60000;
      const localDate = new Date(targetTimeMs);

      const sec = localDate.getSeconds();
      const ms = localDate.getMilliseconds();
      const min = localDate.getMinutes();
      const hr = localDate.getHours();

      // Dead-Beat Seconds Escapement Tick:
      // First 75ms: crisp mechanical jump forward
      // 75ms to 999ms: solidly rests on the tick mark. Strictly monotonic, zero reverse.
      const stepDuration = 75; // ms
      const snapProgress = Math.min(1.0, ms / stepDuration);
      const snapEase = 1 - Math.pow(1 - snapProgress, 3);

      const prevSec = (sec + 59) % 60;
      const visualSecond = prevSec + snapEase;

      // Escapement ticking sound (1 crisp tick on every step)
      if (sec !== this.lastTickSecond) {
        this.lastTickSecond = sec;
        if (this.sound) {
          this.sound.playTick(sec % 2 === 0);
        }
      }

      this.handAngles.second = (visualSecond / 60) * Math.PI * 2;
      this.handAngles.minute = ((min + sec / 60) / 60) * Math.PI * 2;
      this.handAngles.hour = (((hr % 12) + min / 60 + sec / 3600) / 12) * Math.PI * 2;
    }
  }

  // --- Rendering Architecture ---

  draw() {
    const ctx = this.ctx;
    const r = this.radius;

    ctx.clearRect(0, 0, this.size, this.size);

    ctx.save();
    ctx.translate(r, r);

    // 1. Alligator-Grain Leather Straps (Top & Bottom)
    this.drawStraps(ctx, r);

    // 2. Sculpted Metallic Lugs (4 horns)
    this.drawLugs(ctx, r);

    // 3. Main Case Body & Fluted Winding Crown
    this.drawCase(ctx, r);

    // 4. Double Bezel: Outer Coin-Edge Fluted Bezel & Inner Polished Mirror Ring
    this.drawBezel(ctx, r);

    // 5. Intense White / Ivory Lacquer Dial
    this.drawDial(ctx, r);

    // 6. Railroad Minute Track (Chemin-de-fer)
    this.drawRailroadTrack(ctx, r);

    // 7. Applied Faceted Gold Numerals (12, 3, 9) and Dagger Markers
    this.drawHourMarkers(ctx, r);

    // 8. Brand Emblem (Crown, "PHILL", "GENEVE")
    this.drawBrand(ctx, r);

    // 9. Small Seconds Subdial at 6 o'clock (Azurage, Track, "SUPERLATIVE CHRONOMETER")
    this.drawSmallSecondsSubdial(ctx, r);

    // 10. Horological Hands: Breguet-ring Hour Hand & Sword Minute Hand
    this.drawHands(ctx, r);

    // 11. Sapphire Crystal Fresnel Light Sheen
    this.drawCrystal(ctx, r);

    ctx.restore();
  }

  // --- Theme Color Definitions ---

  getPalette() {
    switch (this.finish) {
      case "rose-gold":
        return {
          strapBase: "#2b1812",
          strapMid: "#42261d",
          strapEdge: "#1e100c",
          stitch: "rgba(225, 175, 140, 0.45)",
          metalLight: "#fae2d2",
          metalBright: "#f5c3a4",
          metalMid: "#d6936d",
          metalDark: "#854728",
          metalShadow: "#4a2412",
          dialBgCenter: "#fdfbf9",
          dialBgEdge: "#f3ede6",
          goldMarkerLight: "#fde2d2",
          goldMarkerMid: "#dca07d",
          goldMarkerDark: "#945330"
        };
      case "white-gold":
      case "steel":
        return {
          strapBase: "#0e1014",
          strapMid: "#1a1d24",
          strapEdge: "#07080a",
          stitch: "rgba(210, 220, 235, 0.4)",
          metalLight: "#ffffff",
          metalBright: "#eef2f7",
          metalMid: "#c6d0dc",
          metalDark: "#788596",
          metalShadow: "#373e48",
          dialBgCenter: "#ffffff",
          dialBgEdge: "#f0f2f5",
          goldMarkerLight: "#ffffff",
          goldMarkerMid: "#cbd5e1",
          goldMarkerDark: "#64748b"
        };
      case "platinum":
        return {
          strapBase: "#0a0c10",
          strapMid: "#161b24",
          strapEdge: "#050608",
          stitch: "rgba(180, 210, 240, 0.45)",
          metalLight: "#f4f8ff",
          metalBright: "#dbe5f2",
          metalMid: "#b2c4dc",
          metalDark: "#667a94",
          metalShadow: "#2e3b4a",
          dialBgCenter: "#fbfdff",
          dialBgEdge: "#e8eff7",
          goldMarkerLight: "#f0f6ff",
          goldMarkerMid: "#b8cce6",
          goldMarkerDark: "#526c8a"
        };
      case "gold":
      default:
        // 18ct Yellow Gold (Exact Rolex 1908 Reference)
        return {
          strapBase: "#1f140e",
          strapMid: "#332117",
          strapEdge: "#150d09",
          stitch: "rgba(205, 165, 120, 0.5)",
          metalLight: "#fff4d0",
          metalBright: "#fae19c",
          metalMid: "#d4af37",
          metalDark: "#856218",
          metalShadow: "#473308",
          dialBgCenter: "#fdfdfb",
          dialBgEdge: "#f5f3ec",
          goldMarkerLight: "#fff0cb",
          goldMarkerMid: "#dcba52",
          goldMarkerDark: "#8a6619"
        };
    }
  }

  // --- 1. Straps (Brown Alligator Leather) ---

  drawStraps(ctx, r) {
    const pal = this.getPalette();
    const strapW = r * 0.52;
    const strapH = r * 1.05;

    ctx.save();

    [-1, 1].forEach((dir) => {
      ctx.save();
      ctx.scale(1, dir);

      // Strap background gradient
      const strapGrad = ctx.createLinearGradient(-strapW / 2, r * 0.65, strapW / 2, r * 0.65);
      strapGrad.addColorStop(0, pal.strapEdge);
      strapGrad.addColorStop(0.15, pal.strapBase);
      strapGrad.addColorStop(0.5, pal.strapMid);
      strapGrad.addColorStop(0.85, pal.strapBase);
      strapGrad.addColorStop(1, pal.strapEdge);

      ctx.fillStyle = strapGrad;
      ctx.beginPath();
      // Curved lug entry
      ctx.moveTo(-strapW / 2, r * 0.65);
      ctx.quadraticCurveTo(0, r * 0.68, strapW / 2, r * 0.65);
      ctx.lineTo(strapW / 2, r * 0.65 + strapH);
      ctx.lineTo(-strapW / 2, r * 0.65 + strapH);
      ctx.closePath();
      ctx.fill();

      // Alligator Scale Pattern (Horizontal segmental plates)
      ctx.save();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 2.5;

      const scaleHeights = [r * 0.16, r * 0.22, r * 0.26, r * 0.24, r * 0.20];
      let currentY = r * 0.72;

      for (let s = 0; s < scaleHeights.length; s++) {
        const sh = scaleHeights[s];
        ctx.beginPath();
        ctx.moveTo(-strapW / 2 + 6, currentY);
        ctx.quadraticCurveTo(0, currentY + 3, strapW / 2 - 6, currentY);
        ctx.stroke();

        // Subtle vertical segment subdivisions
        const divX = ((s % 2 === 0) ? -strapW * 0.12 : strapW * 0.12);
        ctx.beginPath();
        ctx.moveTo(divX, currentY);
        ctx.lineTo(divX + (s % 2 === 0 ? 5 : -5), currentY + sh);
        ctx.stroke();

        currentY += sh;
      }
      ctx.restore();

      // Tone-on-tone Saddle Stitching
      ctx.strokeStyle = pal.stitch;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 6]);

      // Left Stitch
      ctx.beginPath();
      ctx.moveTo(-strapW / 2 + 7, r * 0.68);
      ctx.lineTo(-strapW / 2 + 7, r * 0.65 + strapH);
      ctx.stroke();

      // Right Stitch
      ctx.beginPath();
      ctx.moveTo(strapW / 2 - 7, r * 0.68);
      ctx.lineTo(strapW / 2 - 7, r * 0.65 + strapH);
      ctx.stroke();

      ctx.setLineDash([]);

      // Drop shadow from case onto strap
      const shadowGrad = ctx.createLinearGradient(0, r * 0.62, 0, r * 0.76);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(-strapW / 2, r * 0.62, strapW, r * 0.14);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 2. Lugs (4 Sculpted Metallic Horns) ---

  drawLugs(ctx, r) {
    const pal = this.getPalette();
    const lugW = r * 0.11;
    const caseR = r * 0.85;

    ctx.save();

    // Drop shadow under lugs
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    [
      { x: -caseR * 0.55, y: -caseR * 0.82, signX: -1, signY: -1 },
      { x: caseR * 0.55, y: -caseR * 0.82, signX: 1, signY: -1 },
      { x: -caseR * 0.55, y: caseR * 0.82, signX: -1, signY: 1 },
      { x: caseR * 0.55, y: caseR * 0.82, signX: 1, signY: 1 }
    ].forEach((lug) => {
      ctx.save();
      ctx.translate(lug.x, lug.y);

      const lugGrad = ctx.createLinearGradient(-lugW, -lugW, lugW, lugW);
      lugGrad.addColorStop(0, pal.metalLight);
      lugGrad.addColorStop(0.3, pal.metalBright);
      lugGrad.addColorStop(0.7, pal.metalMid);
      lugGrad.addColorStop(1, pal.metalDark);

      ctx.fillStyle = lugGrad;
      ctx.beginPath();
      ctx.moveTo(lug.signX * -lugW * 0.2, lug.signY * -lugW * 0.5);
      ctx.quadraticCurveTo(lug.signX * lugW * 0.9, lug.signY * lugW * 0.2, lug.signX * lugW * 0.6, lug.signY * lugW * 1.5);
      ctx.quadraticCurveTo(lug.signX * lugW * 0.1, lug.signY * lugW * 1.3, lug.signX * -lugW * 0.5, lug.signY * 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 3. Case Body & Crown ---

  drawCase(ctx, r) {
    const pal = this.getPalette();
    const caseR = r * 0.84;

    ctx.save();

    // Outer Case Drop Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;

    // Polished gold case body
    const caseGrad = ctx.createLinearGradient(-caseR, -caseR, caseR, caseR);
    caseGrad.addColorStop(0.0, pal.metalLight);
    caseGrad.addColorStop(0.18, pal.metalBright);
    caseGrad.addColorStop(0.45, pal.metalMid);
    caseGrad.addColorStop(0.72, pal.metalDark);
    caseGrad.addColorStop(0.88, pal.metalBright);
    caseGrad.addColorStop(1.0, pal.metalShadow);

    ctx.fillStyle = caseGrad;
    ctx.beginPath();
    ctx.arc(0, 0, caseR, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";

    // Winding Crown at 3 o'clock
    ctx.save();
    const crownX = caseR - 2;
    const crownW = r * 0.065;
    const crownH = r * 0.13;

    // Crown metallic body
    const crownGrad = ctx.createLinearGradient(crownX, -crownH / 2, crownX + crownW, crownH / 2);
    crownGrad.addColorStop(0, pal.metalLight);
    crownGrad.addColorStop(0.5, pal.metalMid);
    crownGrad.addColorStop(1, pal.metalDark);

    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    ctx.rect(crownX, -crownH / 2, crownW, crownH);
    ctx.fill();

    // Fluted crown ridges
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1.2;
    for (let y = -crownH / 2 + 3; y <= crownH / 2 - 3; y += 3) {
      ctx.beginPath();
      ctx.moveTo(crownX, y);
      ctx.lineTo(crownX + crownW, y);
      ctx.stroke();
    }

    // Crown rounded polished dome cap
    ctx.fillStyle = pal.metalLight;
    ctx.beginPath();
    ctx.arc(crownX + crownW, 0, crownH * 0.35, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // --- 4. Double Bezel: Outer Coin-Edge Fluting & Inner Polished Ring ---

  drawBezel(ctx, r) {
    const pal = this.getPalette();
    const flutedOuter = r * 0.835;
    const flutedInner = r * 0.765;
    const polishedInner = r * 0.735;

    ctx.save();

    // A. Outer Fluted Bezel (Coin-edge fluting)
    // 120 radial flutes with alternating light/shadow facets
    const fluteCount = 120;
    for (let i = 0; i < fluteCount; i++) {
      const angle = (i / fluteCount) * Math.PI * 2;
      const nextAngle = ((i + 1) / fluteCount) * Math.PI * 2;
      const isLight = i % 2 === 0;

      ctx.fillStyle = isLight ? pal.metalLight : pal.metalDark;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * flutedInner, Math.sin(angle) * flutedInner);
      ctx.lineTo(Math.cos(angle) * flutedOuter, Math.sin(angle) * flutedOuter);
      ctx.lineTo(Math.cos(nextAngle) * flutedOuter, Math.sin(nextAngle) * flutedOuter);
      ctx.lineTo(Math.cos(nextAngle) * flutedInner, Math.sin(nextAngle) * flutedInner);
      ctx.closePath();
      ctx.fill();
    }

    // Fluted edge highlight rings
    ctx.strokeStyle = pal.metalBright;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, flutedOuter, 0, Math.PI * 2);
    ctx.stroke();

    // B. Inner Polished Domed Bezel (smooth mirror ring)
    const innerGrad = ctx.createLinearGradient(-polishedInner, -polishedInner, polishedInner, polishedInner);
    innerGrad.addColorStop(0.0, pal.metalLight);
    innerGrad.addColorStop(0.25, pal.metalBright);
    innerGrad.addColorStop(0.65, pal.metalMid);
    innerGrad.addColorStop(0.85, pal.metalDark);
    innerGrad.addColorStop(1.0, pal.metalBright);

    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(0, 0, flutedInner, 0, Math.PI * 2);
    ctx.arc(0, 0, polishedInner, 0, Math.PI * 2, true);
    ctx.fill();

    // Inner rim shadow
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, polishedInner, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // --- 5. Dial Face (Pure Porcelain White / Ivory Lacquer) ---

  drawDial(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();

    // Multi-layer lacquer white dial with soft warmth
    const dialGrad = ctx.createRadialGradient(0, -dialR * 0.2, dialR * 0.1, 0, 0, dialR);
    dialGrad.addColorStop(0.0, pal.dialBgCenter);
    dialGrad.addColorStop(0.75, pal.dialBgCenter);
    dialGrad.addColorStop(0.95, pal.dialBgEdge);
    dialGrad.addColorStop(1.0, "#e8e5dc");

    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.fill();

    // Perimeter dial bevel shadow
    const edgeShadow = ctx.createRadialGradient(0, 0, dialR - 6, 0, 0, dialR);
    edgeShadow.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    edgeShadow.addColorStop(1.0, "rgba(0, 0, 0, 0.22)");
    ctx.fillStyle = edgeShadow;
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- 6. Railroad Minute Track (Chemin-de-fer) ---

  drawRailroadTrack(ctx, r) {
    const dialR = r * 0.735;
    const trackOuter = dialR * 0.94;
    const trackInner = dialR * 0.885;

    ctx.save();

    // Outer & Inner concentric hairline tracks
    ctx.strokeStyle = "rgba(20, 20, 20, 0.85)";
    ctx.lineWidth = 1.0;

    ctx.beginPath();
    ctx.arc(0, 0, trackOuter, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, trackInner, 0, Math.PI * 2);
    ctx.stroke();

    // 60 Radial Minute Ticks
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isFive = i % 5 === 0;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cos * trackInner, sin * trackInner);
      ctx.lineTo(cos * trackOuter, sin * trackOuter);

      if (isFive) {
        ctx.strokeStyle = "rgba(10, 10, 10, 0.95)";
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Small black dot outside track at each hour
        const dotR = trackOuter + 4.5;
        ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
        ctx.beginPath();
        ctx.arc(cos * dotR, sin * dotR, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(40, 40, 40, 0.65)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // --- 7. Applied Faceted Gold Numerals (12, 3, 9) & Dagger Markers ---

  drawHourMarkers(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();

    // A. Applied Faceted Gold Arabic Numerals: "12", "3", "9"
    const numerals = [
      { text: "12", x: 0, y: -dialR * 0.72 },
      { text: "3", x: dialR * 0.72, y: 0 },
      { text: "9", x: -dialR * 0.72, y: 0 }
    ];

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    numerals.forEach((num) => {
      ctx.save();
      ctx.translate(num.x, num.y);

      // 3D Drop shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1.5;

      ctx.font = `600 ${r * 0.088}px "Cinzel", "Playfair Display", "Times New Roman", serif`;

      // Gradient fill for applied gold relief
      const numGrad = ctx.createLinearGradient(0, -r * 0.04, 0, r * 0.04);
      numGrad.addColorStop(0.0, pal.goldMarkerLight);
      numGrad.addColorStop(0.5, pal.goldMarkerMid);
      numGrad.addColorStop(1.0, pal.goldMarkerDark);

      ctx.fillStyle = numGrad;
      ctx.fillText(num.text, 0, 0);

      // Fine highlight outline
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 0.5;
      ctx.strokeText(num.text, 0, 0);

      ctx.restore();
    });

    // B. Applied Faceted Gold Dagger Markers at hours 1, 2, 4, 5, 7, 8, 10, 11
    // (Hour 6 is omitted for small seconds subdial; 3, 9, 12 have Arabic numerals)
    const daggerHours = [1, 2, 4, 5, 7, 8, 10, 11];
    const markerInnerR = dialR * 0.62;
    const markerOuterR = dialR * 0.865;
    const markerWidth = r * 0.024;

    daggerHours.forEach((hour) => {
      const angle = (hour / 12) * Math.PI * 2;

      ctx.save();
      ctx.rotate(angle);

      // Drop shadow on dial
      ctx.shadowColor = "rgba(0, 0, 0, 0.26)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1.5;

      // Facet 1: Left / Light side
      ctx.fillStyle = pal.goldMarkerLight;
      ctx.beginPath();
      ctx.moveTo(0, -markerInnerR);
      ctx.lineTo(-markerWidth / 2, -markerOuterR);
      ctx.lineTo(0, -markerOuterR);
      ctx.closePath();
      ctx.fill();

      // Facet 2: Right / Dark side
      ctx.fillStyle = pal.goldMarkerDark;
      ctx.beginPath();
      ctx.moveTo(0, -markerInnerR);
      ctx.lineTo(0, -markerOuterR);
      ctx.lineTo(markerWidth / 2, -markerOuterR);
      ctx.closePath();
      ctx.fill();

      // Center ridge specular shine
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -markerInnerR);
      ctx.lineTo(0, -markerOuterR);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 8. Brand Emblem & Lettering ---

  drawBrand(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // A. Five-Point Coronet / Crown Emblem
    const crownY = -dialR * 0.44;
    ctx.save();
    ctx.translate(0, crownY);

    const cW = r * 0.045;
    const cH = r * 0.038;

    // Crown Gradient
    const crownGrad = ctx.createLinearGradient(-cW, -cH, cW, cH);
    crownGrad.addColorStop(0, pal.goldMarkerLight);
    crownGrad.addColorStop(0.5, pal.goldMarkerMid);
    crownGrad.addColorStop(1, pal.goldMarkerDark);

    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    // 5 peaks with valleys
    ctx.moveTo(-cW, -cH * 0.35);
    ctx.lineTo(-cW * 0.55, cH * 0.1);
    ctx.lineTo(-cW * 0.45, -cH * 0.7);
    ctx.lineTo(-cW * 0.15, cH * 0.15);
    ctx.lineTo(0, -cH); // Tallest center peak
    ctx.lineTo(cW * 0.15, cH * 0.15);
    ctx.lineTo(cW * 0.45, -cH * 0.7);
    ctx.lineTo(cW * 0.55, cH * 0.1);
    ctx.lineTo(cW, -cH * 0.35);
    ctx.lineTo(cW * 0.6, cH * 0.5);
    ctx.lineTo(-cW * 0.6, cH * 0.5);
    ctx.closePath();
    ctx.fill();

    // Small circular pearls on the 5 tips
    const tips = [
      [-cW, -cH * 0.35],
      [-cW * 0.45, -cH * 0.7],
      [0, -cH],
      [cW * 0.45, -cH * 0.7],
      [cW, -cH * 0.35]
    ];
    tips.forEach(([tx, ty]) => {
      ctx.beginPath();
      ctx.arc(tx, ty, r * 0.0055, 0, Math.PI * 2);
      ctx.fill();
    });

    // Crown base band
    ctx.fillRect(-cW * 0.6, cH * 0.6, cW * 1.2, r * 0.006);

    ctx.restore();

    // B. Brand Title: "PHILL"
    ctx.font = `700 ${r * 0.052}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
    ctx.fillStyle = "#11141a";
    ctx.letterSpacing = "5px";
    ctx.fillText("PHILL", 0, -dialR * 0.31);

    // C. Subtitle: "GENEVE"
    ctx.font = `500 ${r * 0.022}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#333945";
    ctx.letterSpacing = "3px";
    ctx.fillText("GENEVE", 0, -dialR * 0.22);

    ctx.restore();
  }

  // --- 9. Small Seconds Subdial (at 6 o'clock) ---

  drawSmallSecondsSubdial(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;
    const subX = 0;
    const subY = dialR * 0.46;
    const subR = dialR * 0.275;

    ctx.save();
    ctx.translate(subX, subY);

    // A. Recessed subdial aperture shadow
    ctx.save();
    const subInnerShadow = ctx.createRadialGradient(0, 0, subR - 5, 0, 0, subR);
    subInnerShadow.addColorStop(0, "rgba(0, 0, 0, 0)");
    subInnerShadow.addColorStop(1, "rgba(0, 0, 0, 0.25)");

    ctx.fillStyle = pal.dialBgCenter;
    ctx.beginPath();
    ctx.arc(0, 0, subR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = subInnerShadow;
    ctx.fill();
    ctx.restore();

    // B. Concentric Circular Snailing (Azurage)
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.045)";
    ctx.lineWidth = 1;
    for (let rad = subR * 0.2; rad < subR * 0.95; rad += 3.5) {
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // C. Subdial Outer Perimeter Hairline
    ctx.strokeStyle = "rgba(40, 40, 40, 0.6)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(0, 0, subR, 0, Math.PI * 2);
    ctx.stroke();

    // D. Subdial Seconds Railroad Track & Numbers: 60, 20, 40
    const trackR = subR * 0.86;
    const trackIn = subR * 0.78;

    ctx.strokeStyle = "rgba(30, 30, 30, 0.75)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, trackR, 0, Math.PI * 2);
    ctx.stroke();

    for (let s = 0; s < 60; s++) {
      const angle = (s / 60) * Math.PI * 2;
      const isFive = s % 5 === 0;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const r1 = isFive ? trackIn - 1 : trackIn + 2;
      ctx.beginPath();
      ctx.moveTo(cos * r1, sin * r1);
      ctx.lineTo(cos * trackR, sin * trackR);
      ctx.lineWidth = isFive ? 1.4 : 0.6;
      ctx.stroke();
    }

    // Numbers: 60 (at top), 20 (bottom-right), 40 (bottom-left)
    ctx.font = `600 ${r * 0.024}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#1a1e24";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const numDist = subR * 0.62;
    // 60 at top
    ctx.fillText("60", 0, -numDist);
    // 20 at 120 degrees (4 o'clock)
    ctx.fillText("20", Math.cos(Math.PI / 6) * numDist, Math.sin(Math.PI / 6) * numDist + 2);
    // 40 at 240 degrees (8 o'clock)
    ctx.fillText("40", -Math.cos(Math.PI / 6) * numDist, Math.sin(Math.PI / 6) * numDist + 2);

    // E. Small Seconds Hand (Centered in Subdial)
    ctx.save();
    ctx.rotate(this.handAngles.second);

    // Hand drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1.5;

    const secLen = subR * 0.84;
    const secTail = subR * 0.22;

    // Small seconds needle hand in gold
    ctx.strokeStyle = pal.goldMarkerLight;
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, secTail);
    ctx.lineTo(0, -secLen);
    ctx.stroke();

    // Small center hub
    ctx.fillStyle = pal.goldMarkerLight;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.012, 0, Math.PI * 2);
    ctx.fill();

    // Central jewel / pin
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.004, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // end subdial hand

    ctx.restore(); // end subdial translate

    // F. Inscription: "SUPERLATIVE CHRONOMETER" Arched Above Subdial
    ctx.save();
    ctx.font = `600 ${r * 0.018}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#333944";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const archRadius = subR + 8;
    const archCenterY = subY;
    const archText = "SUPERLATIVE CHRONOMETER";
    const startAngle = -Math.PI * 0.78;
    const endAngle = -Math.PI * 0.22;
    const angleStep = (endAngle - startAngle) / (archText.length - 1);

    for (let c = 0; c < archText.length; c++) {
      const char = archText[c];
      const charAngle = startAngle + c * angleStep;

      ctx.save();
      ctx.translate(Math.cos(charAngle) * archRadius, archCenterY + Math.sin(charAngle) * archRadius);
      ctx.rotate(charAngle + Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // G. "SWISS MADE" at 6 o'clock bottom of dial
    ctx.save();
    ctx.font = `600 ${r * 0.019}px sans-serif`;
    ctx.fillStyle = "rgba(40, 40, 40, 0.75)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SWISS   MADE", 0, dialR * 0.94);
    ctx.restore();
  }

  // --- 10. Horological Hands: Breguet Observatory Hour & Sword Minute Hand ---

  drawHands(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();

    // A. Hour Hand (Signature Breguet Observatory Open-Ring Hand)
    ctx.save();
    ctx.rotate(this.handAngles.hour);

    // Hand drop shadow onto porcelain dial
    ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    const hrLen = dialR * 0.58;
    const stemW = r * 0.024;
    const eyeCenterY = -hrLen * 0.72;
    const eyeRadiusOut = r * 0.038;
    const eyeRadiusIn = r * 0.020; // Open ring showing dial below!

    // Left Facet (Light Gold)
    ctx.fillStyle = pal.goldMarkerLight;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(-stemW / 2, 0);
    ctx.lineTo(-stemW * 0.35, eyeCenterY + eyeRadiusOut * 0.8);
    // Outer arc of ring (left side)
    ctx.arc(0, eyeCenterY, eyeRadiusOut, Math.PI * 0.65, Math.PI * 1.5, false);
    // Sharp needle tip
    ctx.lineTo(0, -hrLen);
    ctx.lineTo(0, eyeCenterY - eyeRadiusOut);
    // Inner hole cutout
    ctx.arc(0, eyeCenterY, eyeRadiusIn, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Right Facet (Darker Gold)
    ctx.fillStyle = pal.goldMarkerDark;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(stemW / 2, 0);
    ctx.lineTo(stemW * 0.35, eyeCenterY + eyeRadiusOut * 0.8);
    // Outer arc of ring (right side)
    ctx.arc(0, eyeCenterY, eyeRadiusOut, Math.PI * 0.35, -Math.PI / 2, true);
    // Sharp needle tip
    ctx.lineTo(0, -hrLen);
    ctx.lineTo(0, eyeCenterY - eyeRadiusOut);
    // Inner hole cutout
    ctx.arc(0, eyeCenterY, eyeRadiusIn, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Center ridge highlight
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.02);
    ctx.lineTo(0, eyeCenterY + eyeRadiusOut * 0.9);
    ctx.moveTo(0, eyeCenterY - eyeRadiusOut * 0.9);
    ctx.lineTo(0, -hrLen);
    ctx.stroke();

    ctx.restore(); // end hour hand

    // B. Minute Hand (Sleek Double-Edged Sword Hand)
    ctx.save();
    ctx.rotate(this.handAngles.minute);

    // Hand drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    const minLen = dialR * 0.89; // Extends right to the railroad track
    const minW = r * 0.026;

    // Left Facet (Light Gold)
    ctx.fillStyle = pal.goldMarkerLight;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.035);
    ctx.lineTo(-minW / 2, 0);
    ctx.lineTo(-minW * 0.25, -minLen * 0.75);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Right Facet (Dark Gold)
    ctx.fillStyle = pal.goldMarkerDark;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.035);
    ctx.lineTo(minW / 2, 0);
    ctx.lineTo(minW * 0.25, -minLen * 0.75);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Central Ridge Specular Sheen
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(0, -minLen);
    ctx.stroke();

    ctx.restore(); // end minute hand

    // C. Central Arbor (Polished Domed Gold Cap)
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    const capR = r * 0.032;
    const capGrad = ctx.createRadialGradient(-capR * 0.3, -capR * 0.3, 1, 0, 0, capR);
    capGrad.addColorStop(0, pal.metalLight);
    capGrad.addColorStop(0.5, pal.metalBright);
    capGrad.addColorStop(0.85, pal.metalMid);
    capGrad.addColorStop(1, pal.metalDark);

    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.arc(0, 0, capR, 0, Math.PI * 2);
    ctx.fill();

    // Center jewel / pin dot
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(0, 0, capR * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore();
  }

  // --- 11. Sapphire Crystal Reflection ---

  drawCrystal(ctx, r) {
    const dialR = r * 0.735;

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.clip();

    // Diagonal soft specular light sweep across top-left
    const flare = ctx.createLinearGradient(-dialR, -dialR, dialR * 0.5, dialR * 0.5);
    flare.addColorStop(0.0, "rgba(255, 255, 255, 0.14)");
    flare.addColorStop(0.35, "rgba(255, 255, 255, 0.05)");
    flare.addColorStop(0.6, "rgba(255, 255, 255, 0)");
    flare.addColorStop(1.0, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = flare;
    ctx.fillRect(-dialR, -dialR, dialR * 2, dialR * 2);

    // Subtle anti-reflective blue/violet glint at bottom edge
    const arGlint = ctx.createRadialGradient(0, dialR * 0.8, dialR * 0.1, 0, dialR * 0.8, dialR * 0.4);
    arGlint.addColorStop(0.0, "rgba(100, 160, 255, 0.05)");
    arGlint.addColorStop(1.0, "rgba(100, 160, 255, 0)");
    ctx.fillStyle = arGlint;
    ctx.fillRect(-dialR, dialR * 0.5, dialR * 2, dialR * 0.5);

    ctx.restore();
  }
}
