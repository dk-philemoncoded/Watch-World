/**
 * 2D Vector Animated Horizon & Human Activity Scenery — PHILL
 * Depicts the sky, horizon, and animated 2D vector characters engaging in
 * real human activities corresponding to the searched location's local time:
 *
 * 🌅 DAWN (05:00 - 08:59):
 *    - Morning joggers with dynamic stride and high knee lifts
 *    - Dog walkers with trotting puppy and wagging tail
 *    - Morning commuters with steaming coffee cups
 *    - Cyclists pedaling through the sunrise mist
 *    - Sunrise horizon with morning birds gliding across the sky
 *
 * ☀️ BROAD DAYLIGHT (09:00 - 16:59):
 *    - People strolling, conversing, and walking briskly
 *    - Park bench readers reading books / turning pages
 *    - Skateboarders / commuters coasting by
 *    - Flocks of birds and soft drifting cumulus clouds
 *    - High daylight sun over a lush park promenade & city skyline
 *
 * 🌇 SUNSET / GOLDEN HOUR (17:00 - 19:29):
 *    - Couples walking arm in arm bathed in golden sunset light
 *    - Evening runners finishing workouts
 *    - Sunset watchers leaning on the promenade railing
 *    - Warm golden orb resting on the horizon
 *    - Streetlamps beginning to glow as twilight approaches
 *
 * 🌆 DUSK / TWILIGHT (19:30 - 21:59):
 *    - Cozy evening pedestrians in coats heading to cafes/diners
 *    - Street musician / acoustic guitarist strumming on a park bench
 *    - Illuminated Victorian streetlamps casting warm pools of light on pavement
 *    - Distant city apartments with glowing warm golden windows
 *
 * 🌙 MIDNIGHT / NIGHT (22:00 - 04:59):
 *    - Stargazer looking through a standing brass telescope at the moon
 *    - Solitary nocturnal walker strolling under the glowing streetlamps
 *    - Night runner with glowing reflective armband
 *    - Luminous crescent moon, starlit sky, and occasional shooting stars
 */

export class HorizonScenery {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Timeframe state: 'dawn' | 'day' | 'sunset' | 'dusk' | 'night'
    this.timeOfDay = "day";
    this.targetTimeOfDay = "day";
    this.decimalHour = 12.0;

    // Transition blend (0 = current, 1 = target)
    this.transitionProgress = 1.0;

    // Viewport dimensions
    this.w = 0;
    this.h = 0;
    this.groundY = 0;

    // Scenery entities
    this.clouds = [];
    this.birds = [];
    this.shootingStars = [];
    this.characters = [];
    this.streetlamps = [];
    this.benches = [];
    this.trees = [];
    this.skylineBuildings = [];

    this.lastTime = performance.now();

    this.resize();
    this.initWorld();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth || document.documentElement.clientWidth || 1200;
    const height = window.innerHeight || document.documentElement.clientHeight || 800;

    this.w = width;
    this.h = height;

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);

    // Keep ground line placed along the lower section of the screen
    // so it frames beneath the center watch
    this.groundY = Math.round(this.h * 0.84);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initWorld();
    });
  }

  /**
   * Sets the scenery to match the destination's local time.
   */
  setTime(timeOfDay, decimalHour = 12.0) {
    if (this.timeOfDay !== timeOfDay) {
      this.targetTimeOfDay = timeOfDay;
      this.decimalHour = decimalHour;
      this.transitionProgress = 0.0;
    } else {
      this.decimalHour = decimalHour;
    }
  }

  initWorld() {
    const w = this.w;
    const groundY = this.groundY;

    // 1. Streetlamps positioned along the promenade
    this.streetlamps = [
      { x: w * 0.12, y: groundY, height: 110 },
      { x: w * 0.38, y: groundY, height: 110 },
      { x: w * 0.64, y: groundY, height: 110 },
      { x: w * 0.88, y: groundY, height: 110 }
    ];

    // 2. Park Benches positioned between lamps
    this.benches = [
      { x: w * 0.25, y: groundY, width: 44, height: 20 },
      { x: w * 0.76, y: groundY, width: 44, height: 20 }
    ];

    // 3. Park Trees (Silhouettes)
    this.trees = [
      { x: w * 0.05, y: groundY, radius: 55, trunkH: 60, type: "deciduous" },
      { x: w * 0.30, y: groundY, radius: 45, trunkH: 50, type: "pine" },
      { x: w * 0.70, y: groundY, radius: 48, trunkH: 55, type: "deciduous" },
      { x: w * 0.95, y: groundY, radius: 60, trunkH: 65, type: "elm" }
    ];

    // 4. Distant City Skyline Towers
    this.skylineBuildings = [];
    const count = Math.ceil(w / 45);
    for (let i = 0; i < count; i++) {
      const bW = 28 + (i % 4) * 12;
      const bH = 50 + ((i * 37) % 90);
      const isTower = (i % 7 === 2);
      this.skylineBuildings.push({
        x: i * 42,
        y: groundY,
        width: bW,
        height: isTower ? bH + 45 : bH,
        hasSpire: isTower,
        windows: (i % 2 === 0)
      });
    }

    // 5. Drifting Clouds
    this.clouds = [
      { x: w * 0.15, y: this.h * 0.22, scale: 0.9, speed: 6 },
      { x: w * 0.55, y: this.h * 0.16, scale: 1.2, speed: 4.5 },
      { x: w * 0.85, y: this.h * 0.28, scale: 0.75, speed: 7 }
    ];

    // 6. Flying Birds
    this.birds = [
      { x: w * 0.2, y: this.h * 0.32, speed: 38, wingPhase: 0, scale: 0.9 },
      { x: w * 0.24, y: this.h * 0.30, speed: 38, wingPhase: 0.4, scale: 0.85 },
      { x: w * 0.28, y: this.h * 0.34, speed: 38, wingPhase: 0.8, scale: 0.8 },
      { x: w * 0.65, y: this.h * 0.25, speed: 44, wingPhase: 1.2, scale: 1.0 },
      { x: w * 0.70, y: this.h * 0.28, speed: 44, wingPhase: 1.6, scale: 0.9 }
    ];

    // 7. Dynamic Human Characters Spawned for Time of Day
    this.spawnCharacters();
  }

  spawnCharacters() {
    const w = this.w;
    const groundY = this.groundY;
    const time = this.targetTimeOfDay;

    this.characters = [];

    if (time === "dawn") {
      // 🌅 DAWN: Morning Jogger, Dog Walker, Cyclist, Steaming Coffee Commuter
      this.characters.push({
        type: "jogger",
        x: w * 0.18,
        y: groundY,
        vx: 85, // fast jogging pace
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "dog_walker",
        x: w * 0.55,
        y: groundY,
        vx: 38,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "cyclist",
        x: w * 0.82,
        y: groundY,
        vx: -95, // cycling from right to left
        scale: 0.88,
        facing: -1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.35,
        y: groundY,
        vx: 32,
        hasCoffee: true,
        scale: 0.9,
        facing: 1
      });
    } else if (time === "day") {
      // ☀️ DAY: Strollers, Bench Reader, Cyclist, Friends chatting
      this.characters.push({
        type: "bench_reader",
        x: this.benches[0].x + 22,
        y: groundY,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.15,
        y: groundY,
        vx: 42,
        hasBag: true,
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "couple",
        x: w * 0.45,
        y: groundY,
        vx: 35,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "cyclist",
        x: w * 0.88,
        y: groundY,
        vx: -80,
        scale: 0.88,
        facing: -1
      });
    } else if (time === "sunset") {
      // 🌇 SUNSET: Romantic Couple strolling, Sunset watcher on railing, Evening Runner
      this.characters.push({
        type: "couple",
        x: w * 0.32,
        y: groundY,
        vx: 28, // gentle sunset stroll
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "bench_watcher",
        x: this.benches[1].x + 22,
        y: groundY,
        scale: 0.9,
        facing: -1
      });
      this.characters.push({
        type: "jogger",
        x: w * 0.75,
        y: groundY,
        vx: 80,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "dog_walker",
        x: w * 0.12,
        y: groundY,
        vx: 34,
        scale: 0.88,
        facing: 1
      });
    } else if (time === "dusk") {
      // 🌆 DUSK: Acoustic Guitarist on Bench, Evening Pedestrians under Streetlamps
      this.characters.push({
        type: "bench_guitarist",
        x: this.benches[0].x + 22,
        y: groundY,
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.48,
        y: groundY,
        vx: 36,
        hasCoat: true,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "dog_walker",
        x: w * 0.80,
        y: groundY,
        vx: -35,
        scale: 0.88,
        facing: -1
      });
    } else {
      // 🌙 NIGHT: Stargazer with Telescope, Solitary Night Walker under Streetlamp, Late Runner
      this.characters.push({
        type: "stargazer",
        x: w * 0.28,
        y: groundY,
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.58,
        y: groundY,
        vx: 30, // slow reflective night walk
        hasCoat: true,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "jogger",
        x: w * 0.85,
        y: groundY,
        vx: -75,
        hasReflector: true,
        scale: 0.88,
        facing: -1
      });
    }
  }

  startLoop() {
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      this.update(dt, now * 0.001);
      this.draw(now * 0.001);

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(dt, timeSec) {
    const w = this.w;

    // Smooth transition to target timeframe
    if (this.transitionProgress < 1.0) {
      this.transitionProgress = Math.min(1.0, this.transitionProgress + dt * 1.5);
      if (this.transitionProgress >= 1.0) {
        this.timeOfDay = this.targetTimeOfDay;
        this.spawnCharacters();
      }
    }

    // Update Drifting Clouds
    this.clouds.forEach(c => {
      c.x += c.speed * dt;
      if (c.x > w + 120) {
        c.x = -120;
      }
    });

    // Update Birds
    this.birds.forEach(b => {
      b.x += b.speed * dt;
      b.wingPhase += dt * 9;
      if (b.x > w + 60) {
        b.x = -60;
      }
    });

    // Periodically spawn shooting star during night
    if (this.timeOfDay === "night" && Math.random() < 0.004 && this.shootingStars.length === 0) {
      this.shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * this.h * 0.35,
        vx: 240 + Math.random() * 120,
        vy: 110 + Math.random() * 60,
        life: 0.8,
        maxLife: 0.8
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += star.vx * dt;
      star.y += star.vy * dt;
      star.life -= dt;
      if (star.life <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }

    // Update Animated Characters
    this.characters.forEach(char => {
      if (char.vx) {
        char.x += char.vx * dt;
        // Wrap around screen boundaries
        if (char.vx > 0 && char.x > w + 80) {
          char.x = -80;
        } else if (char.vx < 0 && char.x < -80) {
          char.x = w + 80;
        }
      }
    });
  }

  // --- Rendering ---

  draw(timeSec) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const groundY = this.groundY;

    ctx.clearRect(0, 0, w, h);

    const colors = this.getThemeColors();

    // 1. Celestial Orb in Sky (Sun / Moon on Horizon)
    this.drawCelestialBody(ctx, colors);

    // 2. Drifting Soft Clouds
    this.drawClouds(ctx, colors);

    // 3. Flocks of Flying Birds
    this.drawBirds(ctx, colors, timeSec);

    // 4. Shooting Stars (Night)
    if (this.shootingStars.length > 0) {
      this.drawShootingStars(ctx);
    }

    // 5. Distant City Skyline & Rolling Hills
    this.drawSkyline(ctx, colors);

    // 6. Promenade Ground Line & Waterfront Railing
    this.drawGround(ctx, colors);

    // 7. Park Trees
    this.drawTrees(ctx, colors, timeSec);

    // 8. Park Benches
    this.drawBenches(ctx, colors);

    // 9. Streetlamps & Light Beams
    this.drawStreetlamps(ctx, colors, timeSec);

    // 10. Animated 2D Vector Characters (Human Activities)
    this.drawCharacters(ctx, colors, timeSec);
  }

  getThemeColors() {
    const t = this.timeOfDay;
    switch (t) {
      case "dawn":
        return {
          skyGlow: "rgba(255, 175, 120, 0.4)",
          sunColor: "#ffbe88",
          sunGlow: "rgba(255, 160, 100, 0.5)",
          sunGlowMid: "rgba(255, 160, 100, 0.15)",
          isSun: true,
          sunYRatio: 0.68,
          skyline: "#37243c",
          hills: "#28192e",
          ground: "#1b1122",
          pavement: "#25172d",
          tree: "#221326",
          silhouette: "#26152a",
          rimLight: "rgba(255, 195, 150, 0.65)",
          lampLight: "rgba(255, 215, 140, 0)",
          lampLightMid: "rgba(255, 215, 140, 0)",
          lampGlow: 0
        };
      case "day":
        return {
          skyGlow: "rgba(255, 255, 255, 0.3)",
          sunColor: "#fff7dc",
          sunGlow: "rgba(255, 235, 160, 0.45)",
          sunGlowMid: "rgba(255, 235, 160, 0.12)",
          isSun: true,
          sunYRatio: 0.28,
          skyline: "#2b405d",
          hills: "#1d3049",
          ground: "#111f32",
          pavement: "#17273e",
          tree: "#152438",
          silhouette: "#182333",
          rimLight: "rgba(255, 255, 255, 0.45)",
          lampLight: "rgba(255, 220, 140, 0)",
          lampLightMid: "rgba(255, 220, 140, 0)",
          lampGlow: 0
        };
      case "sunset":
        return {
          skyGlow: "rgba(255, 110, 40, 0.5)",
          sunColor: "#ff7638",
          sunGlow: "rgba(255, 90, 40, 0.65)",
          sunGlowMid: "rgba(255, 90, 40, 0.18)",
          isSun: true,
          sunYRatio: 0.72,
          skyline: "#381830",
          hills: "#280f24",
          ground: "#190817",
          pavement: "#240d22",
          tree: "#20091d",
          silhouette: "#20091c",
          rimLight: "rgba(255, 160, 70, 0.75)",
          lampLight: "rgba(255, 195, 90, 0.35)",
          lampLightMid: "rgba(255, 195, 90, 0.12)",
          lampGlow: 0.4
        };
      case "dusk":
        return {
          skyGlow: "rgba(160, 90, 220, 0.35)",
          sunColor: "#eedeff",
          sunGlow: "rgba(180, 110, 240, 0.4)",
          sunGlowMid: "rgba(180, 110, 240, 0.12)",
          isSun: false, // Crescent moon
          sunYRatio: 0.35,
          skyline: "#221334",
          hills: "#170c24",
          ground: "#0d0615",
          pavement: "#150b21",
          tree: "#11071a",
          silhouette: "#12081d",
          rimLight: "rgba(200, 150, 255, 0.45)",
          lampLight: "rgba(255, 215, 120, 0.75)",
          lampLightMid: "rgba(255, 215, 120, 0.18)",
          lampGlow: 0.85
        };
      case "night":
      default:
        return {
          skyGlow: "rgba(60, 100, 180, 0.25)",
          sunColor: "#f0f5ff",
          sunGlow: "rgba(180, 215, 255, 0.35)",
          sunGlowMid: "rgba(180, 215, 255, 0.12)",
          isSun: false, // Glowing crescent moon
          sunYRatio: 0.30,
          skyline: "#121926",
          hills: "#0b1019",
          ground: "#05070d",
          pavement: "#0a0e16",
          tree: "#070a10",
          silhouette: "#090d16",
          rimLight: "rgba(180, 210, 255, 0.35)",
          lampLight: "rgba(255, 225, 140, 0.85)",
          lampLightMid: "rgba(255, 225, 140, 0.22)",
          lampGlow: 1.0
        };
    }
  }

  // --- 1. Celestial Orb (Sun or Crescent Moon) ---

  drawCelestialBody(ctx, colors) {
    const w = this.w;
    const orbX = w * 0.78;
    const orbY = this.h * colors.sunYRatio;

    ctx.save();

    if (colors.isSun) {
      // Radiant Sun Orb
      const sunR = 36;
      const glowGrad = ctx.createRadialGradient(orbX, orbY, 1, orbX, orbY, sunR * 3);
      glowGrad.addColorStop(0, colors.sunGlow);
      glowGrad.addColorStop(0.5, colors.sunGlowMid);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Solid Sun Disc
      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Luminous Crescent Moon
      const moonR = 26;
      const moonGlow = ctx.createRadialGradient(orbX, orbY, 1, orbX, orbY, moonR * 3);
      moonGlow.addColorStop(0, colors.sunGlow);
      moonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Crescent Moon Shape
      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Subtractive mask for crescent
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(orbX + moonR * 0.55, orbY - moonR * 0.2, moonR * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.restore();
  }

  // --- 2. Drifting Clouds ---

  drawClouds(ctx, colors) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.fillStyle = (this.timeOfDay === "sunset" || this.timeOfDay === "dawn")
      ? "rgba(255, 200, 180, 0.12)"
      : "rgba(255, 255, 255, 0.16)";

    this.clouds.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.arc(28, -8, 24, 0, Math.PI * 2);
      ctx.arc(52, 0, 26, 0, Math.PI * 2);
      ctx.arc(26, 12, 22, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 3. Flying Birds ---

  drawBirds(ctx, colors, timeSec) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    this.birds.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);

      // Flapping wing motion
      const wing = Math.sin(b.wingPhase) * 6;

      ctx.beginPath();
      ctx.moveTo(-10, wing);
      ctx.quadraticCurveTo(-5, -wing, 0, 0);
      ctx.quadraticCurveTo(5, -wing, 10, wing);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 4. Shooting Stars (Night) ---

  drawShootingStars(ctx) {
    ctx.save();
    this.shootingStars.forEach(s => {
      const alpha = Math.max(0, s.life / s.maxLife);
      const tailX = s.x - (s.vx * 0.08);
      const tailY = s.y - (s.vy * 0.08);

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  // --- 5. Distant City Skyline & Rolling Hills ---

  drawSkyline(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // A. Distant architectural skyline
    ctx.fillStyle = colors.skyline;
    this.skylineBuildings.forEach(b => {
      ctx.fillRect(b.x, groundY - b.height, b.width, b.height);

      if (b.hasSpire) {
        ctx.beginPath();
        ctx.moveTo(b.x, groundY - b.height);
        ctx.lineTo(b.x + b.width / 2, groundY - b.height - 24);
        ctx.lineTo(b.x + b.width, groundY - b.height);
        ctx.fill();
      }

      // Cozy illuminated square windows (Dusk & Night)
      if (b.windows && (this.timeOfDay === "dusk" || this.timeOfDay === "night")) {
        ctx.fillStyle = "rgba(255, 220, 130, 0.4)";
        for (let wy = groundY - b.height + 12; wy < groundY - 14; wy += 14) {
          ctx.fillRect(b.x + 6, wy, 4, 4);
          if (b.width > 34) {
            ctx.fillRect(b.x + 18, wy, 4, 4);
          }
        }
        ctx.fillStyle = colors.skyline;
      }
    });

    // B. Mid-ground rolling hill silhouetted line
    ctx.fillStyle = colors.hills;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.quadraticCurveTo(w * 0.25, groundY - 32, w * 0.55, groundY - 18);
    ctx.quadraticCurveTo(w * 0.82, groundY - 42, w, groundY - 20);
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- 6. Promenade Ground Line & Railing ---

  drawGround(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // Pavement base
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, groundY, w, this.h - groundY);

    // Stone promenade edge strip
    ctx.fillStyle = colors.pavement;
    ctx.fillRect(0, groundY, w, 8);

    // Promenade Balustrade / Railing line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, groundY - 14);
    ctx.lineTo(w, groundY - 14);
    ctx.stroke();

    // Small railing baluster uprights
    for (let x = 8; x < w; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, groundY - 14);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- 7. Park Trees ---

  drawTrees(ctx, colors, timeSec) {
    ctx.save();
    ctx.fillStyle = colors.tree;

    this.trees.forEach((t, idx) => {
      // Subtle gentle breeze sway
      const sway = Math.sin(timeSec * 1.2 + idx) * 2.5;

      ctx.save();
      ctx.translate(t.x, t.y);

      // Trunk
      ctx.fillRect(-3, -t.trunkH, 6, t.trunkH);

      // Canopy
      ctx.beginPath();
      ctx.arc(sway, -t.trunkH - t.radius * 0.7, t.radius, 0, Math.PI * 2);
      ctx.arc(sway - t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
      ctx.arc(sway + t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 8. Park Benches ---

  drawBenches(ctx, colors) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;

    this.benches.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Bench seat
      ctx.fillRect(-b.width / 2, -b.height, b.width, 3);
      // Bench backrest
      ctx.fillRect(-b.width / 2, -b.height - 12, b.width, 3);
      ctx.fillRect(-b.width / 2, -b.height - 6, b.width, 3);
      // Backrest supports
      ctx.fillRect(-b.width / 2 + 3, -b.height - 12, 3, 12);
      ctx.fillRect(b.width / 2 - 6, -b.height - 12, 3, 12);
      // Legs
      ctx.fillRect(-b.width / 2 + 4, -b.height, 3, b.height);
      ctx.fillRect(b.width / 2 - 7, -b.height, 3, b.height);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 9. Streetlamps & Volumetric Light Cones ---

  drawStreetlamps(ctx, colors, timeSec) {
    ctx.save();

    this.streetlamps.forEach(lamp => {
      ctx.save();
      ctx.translate(lamp.x, lamp.y);

      const lampH = lamp.height;

      // Volumetric Light Cone on Ground (Dusk & Night)
      if (colors.lampGlow > 0.05) {
        ctx.save();
        const beamGrad = ctx.createRadialGradient(0, -lampH + 10, 5, 0, 0, 110);
        beamGrad.addColorStop(0, colors.lampLight);
        beamGrad.addColorStop(0.6, colors.lampLightMid);
        beamGrad.addColorStop(1, "rgba(255, 230, 140, 0)");

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -lampH + 8);
        ctx.lineTo(-90, 0);
        ctx.lineTo(90, 0);
        ctx.lineTo(12, -lampH + 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Victorian Cast-Iron Lamp Post Silhouette
      ctx.fillStyle = colors.silhouette;

      // Base
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-4, -14);
      ctx.lineTo(4, -14);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();

      // Slender Post
      ctx.fillRect(-2, -lampH + 16, 4, lampH - 30);

      // Ornate bracket & lantern housing
      ctx.beginPath();
      ctx.arc(0, -lampH + 16, 5, 0, Math.PI * 2);
      ctx.fill();

      // Lantern frame
      ctx.strokeRect(-7, -lampH, 14, 16);

      // Glowing Lantern Glass
      if (colors.lampGlow > 0.05) {
        ctx.fillStyle = `rgba(255, 235, 160, ${0.4 + colors.lampGlow * 0.6})`;
        ctx.fillRect(-6, -lampH + 1, 12, 14);

        // Filament glare dot
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -lampH + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top cap & finial
      ctx.fillStyle = colors.silhouette;
      ctx.beginPath();
      ctx.moveTo(-9, -lampH);
      ctx.lineTo(0, -lampH - 8);
      ctx.lineTo(9, -lampH);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 10. Animated 2D Vector Characters (Human Activities) ---

  drawCharacters(ctx, colors, timeSec) {
    this.characters.forEach(char => {
      ctx.save();
      ctx.translate(char.x, char.y);
      ctx.scale(char.scale * char.facing, char.scale);

      switch (char.type) {
        case "jogger":
          this.renderJogger(ctx, colors, timeSec, char);
          break;
        case "dog_walker":
          this.renderDogWalker(ctx, colors, timeSec, char);
          break;
        case "cyclist":
          this.renderCyclist(ctx, colors, timeSec, char);
          break;
        case "walker":
          this.renderWalker(ctx, colors, timeSec, char);
          break;
        case "couple":
          this.renderCouple(ctx, colors, timeSec, char);
          break;
        case "bench_reader":
          this.renderBenchReader(ctx, colors, timeSec, char);
          break;
        case "bench_guitarist":
          this.renderBenchGuitarist(ctx, colors, timeSec, char);
          break;
        case "bench_watcher":
          this.renderBenchWatcher(ctx, colors, timeSec, char);
          break;
        case "stargazer":
          this.renderStargazer(ctx, colors, timeSec, char);
          break;
        default:
          this.renderWalker(ctx, colors, timeSec, char);
          break;
      }

      ctx.restore();
    });
  }

  // --- Character Archetype Renderers ---

  // A. Jogger / Runner
  renderJogger(ctx, colors, timeSec, char) {
    const pace = timeSec * 11;
    const bounce = Math.abs(Math.sin(pace)) * 4.5;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";

    // Head with visor/hair
    ctx.beginPath();
    ctx.arc(6, baseY - 58, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning forward 14 degrees)
    ctx.save();
    ctx.translate(0, baseY);
    ctx.rotate(14 * Math.PI / 180);
    ctx.fillRect(-4, -52, 9, 24);
    ctx.restore();

    // Legs (High knee lift jog cycle)
    const leg1Angle = Math.sin(pace) * 0.85;
    const leg2Angle = Math.sin(pace + Math.PI) * 0.85;

    // Leg 1
    ctx.beginPath();
    ctx.moveTo(-2, baseY - 28);
    const knee1X = -2 + Math.sin(leg1Angle) * 16;
    const knee1Y = baseY - 28 + Math.cos(leg1Angle) * 16;
    ctx.lineTo(knee1X, knee1Y);
    ctx.lineTo(knee1X + Math.sin(leg1Angle + 0.6) * 16, knee1Y + Math.cos(leg1Angle + 0.6) * 14);
    ctx.stroke();

    // Leg 2
    ctx.beginPath();
    ctx.moveTo(3, baseY - 28);
    const knee2X = 3 + Math.sin(leg2Angle) * 16;
    const knee2Y = baseY - 28 + Math.cos(leg2Angle) * 16;
    ctx.lineTo(knee2X, knee2Y);
    ctx.lineTo(knee2X + Math.sin(leg2Angle + 0.6) * 16, knee2Y + Math.cos(leg2Angle + 0.6) * 14);
    ctx.stroke();

    // Arms (Bent 90 degrees, pumping)
    const arm1Angle = -Math.sin(pace) * 0.9;
    const arm2Angle = -Math.sin(pace + Math.PI) * 0.9;

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const elbow1X = 2 + Math.sin(arm1Angle) * 12;
    const elbow1Y = baseY - 48 + Math.cos(arm1Angle) * 12;
    ctx.lineTo(elbow1X, elbow1Y);
    ctx.lineTo(elbow1X + 8, elbow1Y - 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const elbow2X = 2 + Math.sin(arm2Angle) * 12;
    const elbow2Y = baseY - 48 + Math.cos(arm2Angle) * 12;
    ctx.lineTo(elbow2X, elbow2Y);
    ctx.lineTo(elbow2X + 8, elbow2Y - 4);
    ctx.stroke();

    // Glowing Reflector Armband (Night runner)
    if (char.hasReflector) {
      ctx.fillStyle = "#39ffb4";
      ctx.fillRect(elbow1X - 2, elbow1Y - 4, 4, 3);
    }
  }

  // B. Dog Walker & Playful Trotting Dog
  renderDogWalker(ctx, colors, timeSec, char) {
    const pace = timeSec * 5;
    const bounce = Math.abs(Math.sin(pace)) * 2;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Human Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso / Jacket
    ctx.fillRect(-5, baseY - 50, 10, 24);

    // Legs (Smooth walking cycle)
    const leg1 = Math.sin(pace) * 0.55;
    const leg2 = Math.sin(pace + Math.PI) * 0.55;

    ctx.beginPath();
    ctx.moveTo(-3, baseY - 26);
    ctx.lineTo(-3 + Math.sin(leg1) * 14, baseY - 12);
    ctx.lineTo(-3 + Math.sin(leg1) * 14 + Math.sin(leg1 + 0.3) * 14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(3, baseY - 26);
    ctx.lineTo(3 + Math.sin(leg2) * 14, baseY - 12);
    ctx.lineTo(3 + Math.sin(leg2) * 14 + Math.sin(leg2 + 0.3) * 14, 0);
    ctx.stroke();

    // Left Arm swinging naturally
    ctx.beginPath();
    ctx.moveTo(-4, baseY - 46);
    ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
    ctx.stroke();

    // Right Arm holding leash (extended forward)
    const handX = 14;
    const handY = baseY - 32;
    ctx.beginPath();
    ctx.moveTo(4, baseY - 46);
    ctx.lineTo(10, baseY - 38);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Dog trotting ahead
    const dogX = 36;
    const dogPace = timeSec * 10;
    const dogBounce = Math.abs(Math.sin(dogPace)) * 1.8;
    const dogY = -dogBounce;

    // Leash (Curved flexible line from hand to dog's collar)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(dogX - 10, handY + 12, dogX, dogY - 14);
    ctx.stroke();
    ctx.restore();

    // Dog Body
    ctx.save();
    ctx.translate(dogX, dogY);

    ctx.fillStyle = colors.silhouette;
    ctx.beginPath();
    // Torso
    ctx.ellipse(0, -12, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dog Head & Snout
    ctx.beginPath();
    ctx.arc(10, -17, 5, 0, Math.PI * 2);
    ctx.lineTo(17, -15);
    ctx.lineTo(14, -12);
    ctx.fill();

    // Perky Ear
    ctx.beginPath();
    ctx.moveTo(8, -21);
    ctx.lineTo(12, -23);
    ctx.lineTo(11, -17);
    ctx.fill();

    // 4 Trotting Legs
    ctx.lineWidth = 2.0;
    const dLeg1 = Math.sin(dogPace) * 0.6;
    const dLeg2 = Math.sin(dogPace + Math.PI) * 0.6;

    // Front legs
    ctx.beginPath();
    ctx.moveTo(7, -8);
    ctx.lineTo(7 + Math.sin(dLeg1) * 8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(9, -8);
    ctx.lineTo(9 + Math.sin(dLeg2) * 8, 0);
    ctx.stroke();

    // Back legs
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(-7 + Math.sin(dLeg2) * 8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-5 + Math.sin(dLeg1) * 8, 0);
    ctx.stroke();

    // Wagging Tail
    const tailWag = Math.sin(timeSec * 16) * 4;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.quadraticCurveTo(-16, -20 + tailWag, -14, -24 + tailWag);
    ctx.stroke();

    ctx.restore();
  }

  // C. Cyclist
  renderCyclist(ctx, colors, timeSec, char) {
    const wheelAngle = timeSec * 14;
    const pedalAngle = timeSec * 6;

    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;

    // Bicycle Wheels (Front & Rear)
    const rearX = -26;
    const frontX = 26;
    const wheelR = 15;
    const axleY = -wheelR;

    ctx.lineWidth = 1.8;
    // Rear Wheel
    ctx.beginPath();
    ctx.arc(rearX, axleY, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    // Front Wheel
    ctx.beginPath();
    ctx.arc(frontX, axleY, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    // Wheel Spokes (Turning)
    [-rearX, frontX].forEach(wx => {
      ctx.save();
      ctx.translate(wx, axleY);
      ctx.rotate(wheelAngle);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-wheelR, 0);
      ctx.lineTo(wheelR, 0);
      ctx.moveTo(0, -wheelR);
      ctx.lineTo(0, wheelR);
      ctx.stroke();
      ctx.restore();
    });

    // Bicycle Diamond Frame
    ctx.lineWidth = 2.2;
    const bottomBracketX = 0;
    const bottomBracketY = axleY + 3;
    const seatPostX = -8;
    const seatPostY = -34;
    const headTubeX = 18;
    const headTubeY = -36;

    ctx.beginPath();
    // Rear triangle
    ctx.moveTo(rearX, axleY);
    ctx.lineTo(seatPostX, seatPostY);
    ctx.lineTo(bottomBracketX, bottomBracketY);
    ctx.closePath();
    ctx.stroke();

    // Main diamond
    ctx.beginPath();
    ctx.moveTo(bottomBracketX, bottomBracketY);
    ctx.lineTo(headTubeX, headTubeY);
    ctx.lineTo(seatPostX, seatPostY);
    ctx.stroke();

    // Fork to front wheel
    ctx.beginPath();
    ctx.moveTo(headTubeX, headTubeY);
    ctx.lineTo(frontX, axleY);
    ctx.stroke();

    // Handlebars
    ctx.beginPath();
    ctx.moveTo(headTubeX, headTubeY);
    ctx.lineTo(headTubeX + 4, headTubeY - 6);
    ctx.lineTo(headTubeX + 8, headTubeY - 4);
    ctx.stroke();

    // Saddle
    ctx.fillRect(seatPostX - 5, seatPostY - 2, 12, 3);

    // Cyclist Body
    // Head with helmet
    ctx.beginPath();
    ctx.arc(8, -58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    // Helmet visor
    ctx.fillRect(11, -61, 5, 3);

    // Torso (leaning forward)
    ctx.save();
    ctx.translate(seatPostX + 4, seatPostY - 4);
    ctx.rotate(35 * Math.PI / 180);
    ctx.fillRect(-3, -24, 7, 24);
    ctx.restore();

    // Arms to handlebars
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(4, -50);
    ctx.lineTo(12, -42);
    ctx.lineTo(headTubeX + 6, headTubeY - 5);
    ctx.stroke();

    // Legs (Rotating around pedals)
    const pedalR = 6;
    const pX = bottomBracketX + Math.cos(pedalAngle) * pedalR;
    const pY = bottomBracketY + Math.sin(pedalAngle) * pedalR;

    ctx.beginPath();
    ctx.moveTo(seatPostX + 2, seatPostY);
    // Knee articulates with pedal rotation
    const kneeX = 2 + Math.cos(pedalAngle) * 5;
    const kneeY = -22 + Math.sin(pedalAngle) * 3;
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(pX, pY);
    ctx.stroke();

    ctx.restore();
  }

  // D. Stroller / Pedestrian (with Coffee or Bag)
  renderWalker(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.5;
    const bounce = Math.abs(Math.sin(pace)) * 2;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-5, baseY - 50, 10, char.hasCoat ? 28 : 24);

    // Legs
    const leg1 = Math.sin(pace) * 0.52;
    const leg2 = Math.sin(pace + Math.PI) * 0.52;

    ctx.beginPath();
    ctx.moveTo(-3, baseY - 26);
    ctx.lineTo(-3 + Math.sin(leg1) * 14, baseY - 12);
    ctx.lineTo(-3 + Math.sin(leg1) * 14 + Math.sin(leg1 + 0.3) * 14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(3, baseY - 26);
    ctx.lineTo(3 + Math.sin(leg2) * 14, baseY - 12);
    ctx.lineTo(3 + Math.sin(leg2) * 14 + Math.sin(leg2 + 0.3) * 14, 0);
    ctx.stroke();

    // Arms
    if (char.hasCoffee) {
      // Steaming coffee cup in hand!
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(9, baseY - 36);
      ctx.lineTo(12, baseY - 34);
      ctx.stroke();

      // Coffee Cup
      ctx.fillRect(11, baseY - 36, 5, 7);

      // Steam wisps rising
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      const steamY = baseY - 38 - ((timeSec * 16) % 18);
      ctx.beginPath();
      ctx.moveTo(13, baseY - 38);
      ctx.quadraticCurveTo(15, steamY + 4, 13, steamY);
      ctx.stroke();
      ctx.restore();
    } else {
      // Normal swing or holding bag
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(4 + Math.sin(pace) * 10, baseY - 28);
      ctx.stroke();

      if (char.hasBag) {
        ctx.fillRect(6 + Math.sin(pace) * 10, baseY - 26, 7, 10);
      }
    }
  }

  // E. Romantic Couple Strolling Together
  renderCouple(ctx, colors, timeSec, char) {
    const pace = timeSec * 4;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Person 1 (Taller)
    ctx.beginPath();
    ctx.arc(-8, baseY - 58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-12, baseY - 52, 9, 26);

    // Person 2 (Slightly shorter)
    ctx.beginPath();
    ctx.arc(8, baseY - 54, 6.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(4, baseY - 48, 8, 24);

    // Joined Hands in the middle
    ctx.beginPath();
    ctx.moveTo(-6, baseY - 46);
    ctx.lineTo(0, baseY - 32);
    ctx.lineTo(6, baseY - 42);
    ctx.stroke();

    // Outer walking legs
    const leg1 = Math.sin(pace) * 0.48;
    const leg2 = Math.sin(pace + Math.PI) * 0.48;

    ctx.beginPath();
    ctx.moveTo(-10, baseY - 26);
    ctx.lineTo(-10 + Math.sin(leg1) * 14, baseY - 12);
    ctx.lineTo(-10 + Math.sin(leg1) * 14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, baseY - 24);
    ctx.lineTo(8 + Math.sin(leg2) * 14, baseY - 11);
    ctx.lineTo(8 + Math.sin(leg2) * 14, 0);
    ctx.stroke();
  }

  // F. Bench Reader (Day)
  renderBenchReader(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Seated Figure
    // Head looking down at book
    ctx.beginPath();
    ctx.arc(2, -32, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning slightly forward)
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(-4, -12);
    ctx.lineTo(6, -12);
    ctx.lineTo(6, -24);
    ctx.closePath();
    ctx.fill();

    // Bent legs at bench height
    ctx.beginPath();
    ctx.moveTo(6, -12);
    ctx.lineTo(14, -12);
    ctx.lineTo(14, 0);
    ctx.stroke();

    // Arms holding open book
    ctx.beginPath();
    ctx.moveTo(2, -22);
    ctx.lineTo(10, -18);
    ctx.stroke();

    // Open Book
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(8, -20);
    ctx.lineTo(14, -22);
    ctx.lineTo(16, -16);
    ctx.lineTo(10, -15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // G. Bench Guitarist (Dusk)
  renderBenchGuitarist(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;

    // Seated Musician
    // Head tilted listening to music
    ctx.beginPath();
    ctx.arc(-2, -33, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-6, -26, 10, 16);

    // Legs
    ctx.beginPath();
    ctx.moveTo(2, -12);
    ctx.lineTo(12, -12);
    ctx.lineTo(12, 0);
    ctx.stroke();

    // Acoustic Guitar Body in lap
    ctx.fillStyle = "#d28242";
    ctx.beginPath();
    ctx.ellipse(4, -16, 9, 6, 25 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Guitar Neck
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(4, -16);
    ctx.lineTo(-10, -26);
    ctx.stroke();

    // Strumming arm
    const strum = Math.sin(timeSec * 7) * 2;
    ctx.beginPath();
    ctx.moveTo(2, -24);
    ctx.lineTo(6, -16 + strum);
    ctx.stroke();

    ctx.restore();
  }

  // H. Bench Sunset Watcher (Sunset)
  renderBenchWatcher(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;

    // Head looking out at sunset
    ctx.beginPath();
    ctx.arc(-4, -32, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso relaxed against backrest
    ctx.fillRect(-7, -26, 9, 16);

    // Legs crossed relaxed
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(12, -12);
    ctx.lineTo(10, 0);
    ctx.stroke();

    // Arm resting along bench back
    ctx.beginPath();
    ctx.moveTo(-5, -24);
    ctx.lineTo(-12, -22);
    ctx.stroke();

    ctx.restore();
  }

  // I. Stargazer with Telescope (Night)
  renderStargazer(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;

    // Brass Telescope on Tripod
    const tripodX = 14;
    const tripodTopY = -34;

    ctx.lineWidth = 1.8;
    // Tripod Legs
    ctx.beginPath();
    ctx.moveTo(tripodX, tripodTopY);
    ctx.lineTo(tripodX - 12, 0);
    ctx.moveTo(tripodX, tripodTopY);
    ctx.lineTo(tripodX, 0);
    ctx.moveTo(tripodX, tripodTopY);
    ctx.lineTo(tripodX + 12, 0);
    ctx.stroke();

    // Telescope Tube angled at 40 degrees toward moon
    ctx.save();
    ctx.translate(tripodX, tripodTopY);
    ctx.rotate(-42 * Math.PI / 180);
    ctx.fillStyle = "#c59b27"; // polished brass sheen
    ctx.fillRect(-10, -3, 28, 6);
    ctx.restore();

    // Stargazer Figure standing, bent slightly looking into eyepiece
    ctx.fillStyle = colors.silhouette;
    // Head at eyepiece
    ctx.beginPath();
    ctx.arc(6, -37, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.save();
    ctx.translate(2, -34);
    ctx.rotate(18 * Math.PI / 180);
    ctx.fillRect(-4, 0, 8, 20);
    ctx.restore();

    // Legs
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(-4, 0);
    ctx.moveTo(4, -14);
    ctx.lineTo(6, 0);
    ctx.stroke();

    // Hands steadying the mount
    ctx.beginPath();
    ctx.moveTo(6, -30);
    ctx.lineTo(12, -34);
    ctx.stroke();

    ctx.restore();
  }
}
