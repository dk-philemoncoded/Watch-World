/**
 * 2D Vector Animated Horizon & Living Human Activity Scenery - PHILL
 * Depicts a vibrant, authentic sky & living horizon that unmistakably reflects the
 * exact time of day (Dawn, Broad Daylight, Golden Hour Sunset, Twilight Dusk, Midnight).
 * Populates the promenade with animated 2D vector humans engaging in rich, authentic activities
 * with anatomically correct forward walk cycles (no moonwalking or backward limbs):
 *
 * - Joggers & Runners with high knee lift & rhythmic arm pump
 * - Dog Walkers with trotting 4-legged puppies & wagging tails
 * - Cyclists with spinning wheels & pedal-articulating knees
 * - Skateboarders pushing with rear foot & cruising
 * - Parents pushing modern baby strollers
 * - Commuters with steaming takeaway coffee cups
 * - Smartphone text walkers with glowing screens
 * - Tourists/Photographers pausing to take photos with camera flashes
 * - Park bench figures: book readers, acoustic guitarists, laptop workers, coffee drinkers
 * - Stargazers observing the moon through standing brass telescopes
 * - Flying birds, drifting clouds, glowing sun with lens rays, crescent moon, and shooting stars
 */

export class HorizonScenery {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Time frame state: 'dawn' | 'day' | 'sunset' | 'dusk' | 'night'
    this.timeOfDay = "day";
    this.targetTimeOfDay = "day";
    this.decimalHour = 12.0;

    // Viewport dimensions
    this.w = 0;
    this.h = 0;
    this.groundY = 0;

    // Entities
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

    // Ground line placed across lower area (frames beautifully beneath hero watch)
    this.groundY = Math.round(this.h * 0.83);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initWorld();
    });
  }

  setTime(timeOfDay, decimalHour = 12.0) {
    this.decimalHour = decimalHour;
    if (this.timeOfDay !== timeOfDay) {
      this.timeOfDay = timeOfDay;
      this.targetTimeOfDay = timeOfDay;
      this.spawnCharacters();
    }
  }

  initWorld() {
    const w = this.w;
    const groundY = this.groundY;

    // Twinkling stars for dusk and night sky
    this.stars = [];
    for (let i = 0; i < 75; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * (groundY * 0.72),
        radius: 0.5 + Math.random() * 1.5,
        twinkleSpeed: 1.2 + Math.random() * 2.8,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    // 1. Streetlamps along the promenade
    this.streetlamps = [
      { x: w * 0.10, y: groundY, height: 115 },
      { x: w * 0.35, y: groundY, height: 115 },
      { x: w * 0.65, y: groundY, height: 115 },
      { x: w * 0.90, y: groundY, height: 115 }
    ];

    // 2. Park Benches
    this.benches = [
      { x: w * 0.22, y: groundY, width: 48, height: 22 },
      { x: w * 0.52, y: groundY, width: 48, height: 22 },
      { x: w * 0.78, y: groundY, width: 48, height: 22 }
    ];

    // 3. Park Trees (Silhouettes & Foliage)
    this.trees = [
      { x: w * 0.04, y: groundY, radius: 52, trunkH: 60, type: "deciduous" },
      { x: w * 0.18, y: groundY, radius: 42, trunkH: 50, type: "pine" },
      { x: w * 0.44, y: groundY, radius: 46, trunkH: 55, type: "elm" },
      { x: w * 0.72, y: groundY, radius: 48, trunkH: 52, type: "deciduous" },
      { x: w * 0.96, y: groundY, radius: 58, trunkH: 64, type: "elm" }
    ];

    // 4. Distant City Skyline Towers
    this.skylineBuildings = [];
    const count = Math.ceil(w / 42);
    for (let i = 0; i < count; i++) {
      const bW = 28 + (i % 4) * 12;
      const bH = 55 + ((i * 37) % 95);
      const isTower = (i % 6 === 2);
      this.skylineBuildings.push({
        x: i * 40,
        y: groundY,
        width: bW,
        height: isTower ? bH + 48 : bH,
        hasSpire: isTower,
        windows: (i % 2 === 0)
      });
    }

    // 5. Drifting Clouds
    this.clouds = [
      { x: w * 0.12, y: this.h * 0.20, scale: 1.0, speed: 7 },
      { x: w * 0.48, y: this.h * 0.14, scale: 1.3, speed: 5 },
      { x: w * 0.82, y: this.h * 0.24, scale: 0.85, speed: 8 }
    ];

    // 6. Flying Birds
    this.birds = [
      { x: w * 0.18, y: this.h * 0.28, speed: 42, wingPhase: 0, scale: 0.9 },
      { x: w * 0.22, y: this.h * 0.26, speed: 42, wingPhase: 0.4, scale: 0.85 },
      { x: w * 0.26, y: this.h * 0.30, speed: 42, wingPhase: 0.8, scale: 0.8 },
      { x: w * 0.62, y: this.h * 0.22, speed: 48, wingPhase: 1.2, scale: 1.0 },
      { x: w * 0.66, y: this.h * 0.25, speed: 48, wingPhase: 1.6, scale: 0.9 }
    ];

    this.spawnCharacters();
  }

  spawnCharacters() {
    const w = this.w;
    const groundY = this.groundY;
    const time = this.timeOfDay;

    this.characters = [];

    if (time === "dawn") {
      // DAWN: Morning Jogger, Dog Walker, Commuter with Coffee, Sunrise Cyclist, Stretcher, Early Walker
      this.characters.push(
        { type: "jogger", x: w * 0.12, y: groundY, vx: 75, scale: 0.92, facing: 1 },
        { type: "dog_walker", x: w * 0.38, y: groundY, vx: 34, scale: 0.90, facing: 1 },
        { type: "cyclist", x: w * 0.85, y: groundY, vx: -82, scale: 0.88, facing: -1 },
        { type: "walker_coffee", x: w * 0.28, y: groundY, vx: 32, scale: 0.90, facing: 1 },
        { type: "bench_coffee", x: this.benches[0].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "jogger", x: w * 0.68, y: groundY, vx: -72, scale: 0.88, facing: -1 },
        { type: "stretcher", x: w * 0.60, y: groundY, scale: 0.90, facing: 1 }
      );
    } else if (time === "day") {
      // BROAD DAYLIGHT: Bustling park promenade with readers, skaters, strollers, cyclists, tourists
      this.characters.push(
        { type: "bench_reader", x: this.benches[0].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "bench_laptop", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "skateboarder", x: w * 0.18, y: groundY, vx: 74, scale: 0.90, facing: 1 },
        { type: "stroller_parent", x: w * 0.32, y: groundY, vx: 34, scale: 0.90, facing: 1 },
        { type: "couple", x: w * 0.46, y: groundY, vx: 28, scale: 0.90, facing: 1 },
        { type: "cyclist", x: w * 0.88, y: groundY, vx: -80, scale: 0.88, facing: -1 },
        { type: "dog_walker", x: w * 0.64, y: groundY, vx: -34, scale: 0.88, facing: -1 },
        { type: "photographer", x: w * 0.74, y: groundY, vx: 24, scale: 0.90, facing: 1 },
        { type: "walker_phone", x: w * 0.05, y: groundY, vx: 30, scale: 0.90, facing: 1 }
      );
    } else if (time === "sunset") {
      // SUNSET / GOLDEN HOUR: Romantic couple, Sunset watcher, Evening jogger, Dog walker, Cyclist, Railing photographer
      this.characters.push(
        { type: "couple", x: w * 0.28, y: groundY, vx: 26, scale: 0.92, facing: 1 },
        { type: "bench_watcher", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "bench_guitarist", x: this.benches[0].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "jogger", x: w * 0.74, y: groundY, vx: 72, scale: 0.90, facing: 1 },
        { type: "dog_walker", x: w * 0.12, y: groundY, vx: 32, scale: 0.88, facing: 1 },
        { type: "cyclist", x: w * 0.90, y: groundY, vx: -78, scale: 0.88, facing: -1 },
        { type: "photographer", x: w * 0.50, y: groundY, vx: 0, scale: 0.90, facing: 1 }
      );
    } else if (time === "dusk") {
      // DUSK: Acoustic guitarist on bench, evening stroll in coats, phone texter under streetlamp, couple
      this.characters.push(
        { type: "bench_guitarist", x: this.benches[0].x, y: groundY, scale: 0.92, facing: 1 },
        { type: "bench_watcher", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "walker_coat", x: w * 0.40, y: groundY, vx: 32, scale: 0.90, facing: 1 },
        { type: "dog_walker", x: w * 0.76, y: groundY, vx: -32, scale: 0.88, facing: -1 },
        { type: "walker_phone", x: w * 0.60, y: groundY, vx: 28, scale: 0.90, facing: 1 },
        { type: "couple", x: w * 0.18, y: groundY, vx: 26, scale: 0.90, facing: 1 },
        { type: "jogger", x: w * 0.88, y: groundY, vx: -70, scale: 0.88, facing: -1 }
      );
    } else {
      // NIGHT: Stargazer at telescope, solitary nocturnal walker, late night runner, bench thinker
      this.characters.push(
        { type: "stargazer", x: w * 0.26, y: groundY, scale: 0.92, facing: 1 },
        { type: "walker_coat", x: w * 0.54, y: groundY, vx: 28, scale: 0.90, facing: 1 },
        { type: "bench_watcher", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "jogger_night", x: w * 0.86, y: groundY, vx: -68, scale: 0.88, facing: -1 },
        { type: "walker_phone", x: w * 0.70, y: groundY, vx: -26, scale: 0.88, facing: -1 }
      );
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

    // Clouds
    this.clouds.forEach(c => {
      c.x += c.speed * dt;
      if (c.x > w + 140) c.x = -140;
    });

    // Birds
    this.birds.forEach(b => {
      b.x += b.speed * dt;
      b.wingPhase += dt * 9;
      if (b.x > w + 60) b.x = -60;
    });

    // Shooting Stars (Night)
    if (this.timeOfDay === "night" && Math.random() < 0.005 && this.shootingStars.length === 0) {
      this.shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * this.h * 0.35,
        vx: 260 + Math.random() * 140,
        vy: 120 + Math.random() * 60,
        life: 0.8,
        maxLife: 0.8
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += star.vx * dt;
      star.y += star.vy * dt;
      star.life -= dt;
      if (star.life <= 0) this.shootingStars.splice(i, 1);
    }

    // Characters movement & boundary wrap
    this.characters.forEach(char => {
      if (char.vx) {
        let isPaused = false;
        if (char.type === "photographer") {
          const cycle = (timeSec * 0.25) % 1.0;
          if (cycle > 0.55 && cycle < 0.85) isPaused = true;
        }
        if (!isPaused) {
          char.x += char.vx * dt;
        }
        // Direction must always match vx sign so character faces where they walk!
        char.facing = char.vx >= 0 ? 1 : -1;

        if (char.vx > 0 && char.x > w + 90) {
          char.x = -90;
        } else if (char.vx < 0 && char.x < -90) {
          char.x = w + 90;
        }
      }
    });
  }

  // --- Rendering Architecture ---

  draw(timeSec) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;

    ctx.clearRect(0, 0, w, h);

    const colors = this.getThemeColors();

    // 1. Vivid Full-Canvas Sky Gradient (unmistakably conveys time of day!)
    this.drawSky(ctx, colors);

    // 1b. Celestial Twinkling Stars (Night & Dusk)
    if (this.timeOfDay === "night" || this.timeOfDay === "dusk") {
      this.drawStars(ctx, timeSec);
    }

    // 2. Celestial Orb: Brilliant Sun / Luminous Crescent Moon
    this.drawCelestialBody(ctx, colors);

    // 3. Clouds & Sunbeams
    this.drawClouds(ctx, colors);

    // 4. Flying Birds
    this.drawBirds(ctx, colors);

    // 5. Shooting Stars (Night)
    if (this.shootingStars.length > 0) {
      this.drawShootingStars(ctx);
    }

    // 6. Distant City Skyline & Rolling Hills
    this.drawSkyline(ctx, colors);

    // 7. Ground Line, Promenade Path & Railing
    this.drawGround(ctx, colors);

    // 8. Park Trees
    this.drawTrees(ctx, colors, timeSec);

    // 9. Park Benches
    this.drawBenches(ctx, colors);

    // 10. Streetlamps & Glowing Volumetric Light Cones
    this.drawStreetlamps(ctx, colors);

    // 11. Animated 2D Vector Characters (Real Human Activities)
    this.drawCharacters(ctx, colors, timeSec);
  }

  getThemeColors() {
    const t = this.timeOfDay;
    switch (t) {
      case "dawn":
        return {
          skyTop: "#1c1936",
          skyMid: "#6a345e",
          skyBottom: "#ff9253",
          skyHorizon: "#ffd68a",
          sunColor: "#ffbe88",
          sunGlow: "rgba(255, 170, 100, 0.6)",
          sunGlowMid: "rgba(255, 170, 100, 0.15)",
          isSun: true,
          sunYRatio: 0.68,
          hillsBack: "#462947",
          hillsFront: "#331c34",
          skyline: "#422340",
          ground: "#352238",
          pavement: "#462e4a",
          railing: "rgba(255, 200, 160, 0.50)",
          tree: "#27162b",
          silhouette: "#140816",
          benchColor: "#2a182c",
          lampPostColor: "#1c0f1f",
          charAccent: "#ffbe88",
          shadowColor: "rgba(20, 8, 20, 0.55)",
          lampLight: "rgba(255, 215, 140, 0)",
          lampLightMid: "rgba(255, 215, 140, 0)",
          lampGlow: 0,
          isDaylight: false
        };
      case "day":
        return {
          skyTop: "#1976d2",
          skyMid: "#42a5f5",
          skyBottom: "#90caf9",
          skyHorizon: "#e3f2fd",
          sunColor: "#fff8e1",
          sunGlow: "rgba(255, 245, 180, 0.75)",
          sunGlowMid: "rgba(255, 245, 180, 0.20)",
          isSun: true,
          sunYRatio: 0.24,
          hillsBack: "#5c9470",
          hillsFront: "#3f7a55",
          skyline: "#547596",
          ground: "#475569",
          pavement: "#64748b",
          railing: "rgba(255, 255, 255, 0.65)",
          tree: "#265437",
          silhouette: "#1e293b",
          benchColor: "#334155",
          lampPostColor: "#1e293b",
          charAccent: "#38bdf8",
          shadowColor: "rgba(15, 23, 42, 0.35)",
          lampLight: "rgba(255, 220, 140, 0)",
          lampLightMid: "rgba(255, 220, 140, 0)",
          lampGlow: 0,
          isDaylight: true
        };
      case "sunset":
        return {
          skyTop: "#180a2b",
          skyMid: "#641544",
          skyBottom: "#cb3728",
          skyHorizon: "#ff982b",
          sunColor: "#ff6324",
          sunGlow: "rgba(255, 100, 40, 0.75)",
          sunGlowMid: "rgba(255, 100, 40, 0.22)",
          isSun: true,
          sunYRatio: 0.72,
          hillsBack: "#421832",
          hillsFront: "#2b0d20",
          skyline: "#3e122e",
          ground: "#351e2c",
          pavement: "#48283c",
          railing: "rgba(255, 175, 110, 0.65)",
          tree: "#231120",
          silhouette: "#100410",
          benchColor: "#281423",
          lampPostColor: "#1d0e1b",
          charAccent: "#fb923c",
          shadowColor: "rgba(10, 2, 10, 0.65)",
          lampLight: "rgba(255, 195, 90, 0.45)",
          lampLightMid: "rgba(255, 195, 90, 0.15)",
          lampGlow: 0.5,
          isDaylight: false
        };
      case "dusk":
        return {
          skyTop: "#090918",
          skyMid: "#1e1840",
          skyBottom: "#451f5c",
          skyHorizon: "#782d6b",
          sunColor: "#f3e8ff",
          sunGlow: "rgba(190, 120, 255, 0.45)",
          sunGlowMid: "rgba(190, 120, 255, 0.12)",
          isSun: false, // Crescent moon
          sunYRatio: 0.32,
          hillsBack: "#211433",
          hillsFront: "#150b23",
          skyline: "#201131",
          ground: "#231f38",
          pavement: "#322d4f",
          railing: "rgba(200, 160, 255, 0.50)",
          tree: "#161124",
          silhouette: "#0a0614",
          benchColor: "#19152b",
          lampPostColor: "#120d20",
          charAccent: "#c084fc",
          shadowColor: "rgba(6, 4, 12, 0.70)",
          lampLight: "rgba(255, 215, 120, 0.80)",
          lampLightMid: "rgba(255, 215, 120, 0.22)",
          lampGlow: 0.85,
          isDaylight: false
        };
      case "night":
      default:
        return {
          skyTop: "#020409",
          skyMid: "#060c18",
          skyBottom: "#0b152a",
          skyHorizon: "#0e1b36",
          sunColor: "#f0f5ff",
          sunGlow: "rgba(180, 220, 255, 0.40)",
          sunGlowMid: "rgba(180, 220, 255, 0.12)",
          isSun: false, // Glowing crescent moon
          sunYRatio: 0.28,
          hillsBack: "#121a28",
          hillsFront: "#0a101b",
          skyline: "#111824",
          ground: "#161d2e",
          pavement: "#20293d",
          railing: "rgba(255, 255, 255, 0.30)",
          tree: "#0e131d",
          silhouette: "#05070d",
          benchColor: "#111726",
          lampPostColor: "#0a0f1a",
          charAccent: "#38bdf8",
          shadowColor: "rgba(2, 4, 8, 0.75)",
          lampLight: "rgba(255, 225, 140, 0.90)",
          lampLightMid: "rgba(255, 225, 140, 0.26)",
          lampGlow: 1.0,
          isDaylight: false
        };
    }
  }

  getOrbX(w, colors) {
    if (this.decimalHour !== undefined && !isNaN(this.decimalHour)) {
      if (colors.isSun) {
        // Daytime: 5:00 to 19:45
        const progress = Math.max(0, Math.min(1, (this.decimalHour - 5) / 14.75));
        return w * (0.15 + 0.70 * progress);
      } else {
        // Nighttime: 19:46 to 5:00
        const nightHour = this.decimalHour >= 19.75 ? this.decimalHour - 19.75 : this.decimalHour + 4.25;
        const progress = Math.max(0, Math.min(1, nightHour / 9.25));
        return w * (0.15 + 0.70 * progress);
      }
    }
    return w * 0.75;
  }

  // --- 1. Full-Canvas Sky Gradient ---

  drawSky(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0.0, colors.skyTop);
    skyGrad.addColorStop(0.35, colors.skyMid);
    skyGrad.addColorStop(0.75, colors.skyBottom);
    skyGrad.addColorStop(1.0, colors.skyHorizon);

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, groundY);

    // Radiant Sunbeams / Horizon Haze in Daylight
    if (colors.isDaylight) {
      const sunX = this.getOrbX(w, colors);
      const sunY = this.h * colors.sunYRatio;
      const rayGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, w * 0.6);
      rayGrad.addColorStop(0, "rgba(255, 255, 220, 0.35)");
      rayGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.10)");
      rayGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, w, groundY);
    }
    ctx.restore();
  }

  // --- 1b. Celestial Twinkling Stars (Night & Dusk) ---

  drawStars(ctx, timeSec) {
    if (!this.stars || this.stars.length === 0) return;
    const baseAlpha = this.timeOfDay === "night" ? 0.95 : 0.40;
    ctx.save();
    this.stars.forEach(st => {
      const alpha = baseAlpha * (0.3 + 0.7 * Math.sin(timeSec * st.twinkleSpeed + st.twinkleOffset));
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // --- 2. Celestial Body (Sun or Crescent Moon) ---

  drawCelestialBody(ctx, colors) {
    const w = this.w;
    const orbX = this.getOrbX(w, colors);
    const orbY = this.h * colors.sunYRatio;

    ctx.save();

    if (colors.isSun) {
      const sunR = colors.isDaylight ? 38 : 46;

      // Outer Corona Glow
      const glowGrad = ctx.createRadialGradient(orbX, orbY, sunR * 0.5, orbX, orbY, sunR * 3.5);
      glowGrad.addColorStop(0, colors.sunGlow);
      glowGrad.addColorStop(0.5, colors.sunGlowMid);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Solid Sun Disc
      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Crescent Moon
      const moonR = 26;

      const moonGlow = ctx.createRadialGradient(orbX, orbY, 5, orbX, orbY, moonR * 3.2);
      moonGlow.addColorStop(0, colors.sunGlow);
      moonGlow.addColorStop(0.5, colors.sunGlowMid);
      moonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Mask out to create crescent
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(orbX + moonR * 0.55, orbY - moonR * 0.15, moonR * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.restore();
  }

  // --- 3. Clouds ---

  drawClouds(ctx, colors) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.fillStyle = colors.isDaylight
      ? "rgba(255, 255, 255, 0.45)"
      : (this.timeOfDay === "sunset" ? "rgba(255, 180, 140, 0.35)" : "rgba(255, 210, 190, 0.25)");

    this.clouds.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);

      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.arc(26, -10, 24, 0, Math.PI * 2);
      ctx.arc(54, 0, 28, 0, Math.PI * 2);
      ctx.arc(26, 12, 22, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 4. Birds ---

  drawBirds(ctx, colors) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.strokeStyle = colors.isDaylight ? "#334155" : colors.silhouette;
    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";

    this.birds.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);

      const wing = Math.sin(b.wingPhase) * 6.5;

      ctx.beginPath();
      ctx.moveTo(-10, wing);
      ctx.quadraticCurveTo(-5, -wing, 0, 0);
      ctx.quadraticCurveTo(5, -wing, 10, wing);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 5. Shooting Stars (Night) ---

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
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  // --- 6. Skyline & Rolling Hills ---

  drawSkyline(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // A. Architectural city towers
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

      // Windows (Dusk & Night)
      if (b.windows && (this.timeOfDay === "dusk" || this.timeOfDay === "night")) {
        ctx.fillStyle = "rgba(255, 220, 130, 0.45)";
        for (let wy = groundY - b.height + 12; wy < groundY - 14; wy += 14) {
          ctx.fillRect(b.x + 6, wy, 4, 4);
          if (b.width > 34) ctx.fillRect(b.x + 18, wy, 4, 4);
        }
        ctx.fillStyle = colors.skyline;
      }
    });

    // B. Distant rolling hill layer
    ctx.fillStyle = colors.hillsBack;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.quadraticCurveTo(w * 0.3, groundY - 45, w * 0.6, groundY - 25);
    ctx.quadraticCurveTo(w * 0.85, groundY - 55, w, groundY - 25);
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();

    // C. Near rolling hill layer
    ctx.fillStyle = colors.hillsFront;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.quadraticCurveTo(w * 0.22, groundY - 30, w * 0.5, groundY - 16);
    ctx.quadraticCurveTo(w * 0.78, groundY - 35, w, groundY - 18);
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- 7. Ground Line, Promenade Path & Railing ---

  drawGround(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // Promenade Pavement
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, groundY, w, this.h - groundY);

    // Stone curbing strip
    ctx.fillStyle = colors.pavement;
    ctx.fillRect(0, groundY, w, 10);

    // Stone balustrade railing
    ctx.strokeStyle = colors.railing;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, groundY - 16);
    ctx.lineTo(w, groundY - 16);
    ctx.stroke();

    for (let x = 6; x < w; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, groundY - 16);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- 8. Trees ---

  drawTrees(ctx, colors, timeSec) {
    ctx.save();
    ctx.fillStyle = colors.tree;

    this.trees.forEach((t, idx) => {
      const sway = Math.sin(timeSec * 1.2 + idx) * 2.5;

      ctx.save();
      ctx.translate(t.x, t.y);

      // Trunk
      ctx.fillStyle = colors.isDaylight ? "#332418" : colors.tree;
      ctx.fillRect(-3, -t.trunkH, 6, t.trunkH);

      // Foliage
      ctx.fillStyle = colors.tree;
      if (t.type === "pine") {
        // Conical Evergreen Pine
        const topY = -t.trunkH - t.radius * 1.35;
        // Tier 1 (top)
        ctx.beginPath();
        ctx.moveTo(sway * 0.7, topY);
        ctx.lineTo(-t.radius * 0.45, topY + t.radius * 0.55);
        ctx.lineTo(t.radius * 0.45, topY + t.radius * 0.55);
        ctx.closePath();
        ctx.fill();

        // Tier 2 (mid)
        ctx.beginPath();
        ctx.moveTo(sway * 0.5, topY + t.radius * 0.35);
        ctx.lineTo(-t.radius * 0.7, topY + t.radius * 0.95);
        ctx.lineTo(t.radius * 0.7, topY + t.radius * 0.95);
        ctx.closePath();
        ctx.fill();

        // Tier 3 (base)
        ctx.beginPath();
        ctx.moveTo(sway * 0.3, topY + t.radius * 0.75);
        ctx.lineTo(-t.radius * 0.95, -t.trunkH);
        ctx.lineTo(t.radius * 0.95, -t.trunkH);
        ctx.closePath();
        ctx.fill();
      } else {
        // Deciduous / Elm rounded canopy
        ctx.beginPath();
        ctx.arc(sway, -t.trunkH - t.radius * 0.7, t.radius, 0, Math.PI * 2);
        ctx.arc(sway - t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
        ctx.arc(sway + t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 9. Benches ---

  drawBenches(ctx, colors) {
    ctx.save();
    ctx.fillStyle = colors.benchColor || (colors.isDaylight ? "#475569" : "#1a162b");

    this.benches.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Bench seat
      ctx.fillRect(-b.width / 2, -b.height, b.width, 3);
      // Backrest
      ctx.fillRect(-b.width / 2, -b.height - 12, b.width, 3);
      ctx.fillRect(-b.width / 2, -b.height - 6, b.width, 3);
      // Supports
      ctx.fillRect(-b.width / 2 + 4, -b.height - 12, 3, 12);
      ctx.fillRect(b.width / 2 - 7, -b.height - 12, 3, 12);
      // Legs
      ctx.fillRect(-b.width / 2 + 4, -b.height, 3, b.height);
      ctx.fillRect(b.width / 2 - 7, -b.height, 3, b.height);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 10. Streetlamps & Volumetric Light Cones ---

  drawStreetlamps(ctx, colors) {
    ctx.save();

    this.streetlamps.forEach(lamp => {
      ctx.save();
      ctx.translate(lamp.x, lamp.y);

      const lampH = lamp.height;

      // Volumetric Light Cone on Ground (Sunset, Dusk, Night)
      if (colors.lampGlow > 0.05) {
        ctx.save();
        const beamGrad = ctx.createRadialGradient(0, -lampH + 10, 5, 0, 0, 115);
        beamGrad.addColorStop(0, colors.lampLight);
        beamGrad.addColorStop(0.6, colors.lampLightMid);
        beamGrad.addColorStop(1, "rgba(255, 230, 140, 0)");

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -lampH + 8);
        ctx.lineTo(-95, 0);
        ctx.lineTo(95, 0);
        ctx.lineTo(12, -lampH + 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Lamp Post
      ctx.fillStyle = colors.lampPostColor || (colors.isDaylight ? "#1e293b" : "#120e1e");

      // Base
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-4, -14);
      ctx.lineTo(4, -14);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();

      // Post
      ctx.fillRect(-2, -lampH + 16, 4, lampH - 30);

      // Bracket
      ctx.beginPath();
      ctx.arc(0, -lampH + 16, 5, 0, Math.PI * 2);
      ctx.fill();

      // Lantern frame
      ctx.strokeRect(-7, -lampH, 14, 16);

      // Lantern Glass
      if (colors.lampGlow > 0.05) {
        ctx.fillStyle = `rgba(255, 235, 160, ${0.4 + colors.lampGlow * 0.6})`;
        ctx.fillRect(-6, -lampH + 1, 12, 14);

        // Core glare
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -lampH + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Finial
      ctx.fillStyle = colors.lampPostColor || (colors.isDaylight ? "#1e293b" : "#120e1e");
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

  // --- 11. Animated 2D Vector Characters (Real Human Activities) ---

  drawCharacters(ctx, colors, timeSec) {
    this.characters.forEach(char => {
      ctx.save();
      // Translate to character ground position
      ctx.translate(char.x, char.y);

      // Soft contact drop shadows scaled to entity geometry
      ctx.save();
      ctx.fillStyle = colors.shadowColor;
      ctx.beginPath();
      if (char.type === "cyclist") {
        const f = char.facing || 1;
        ctx.ellipse(-26 * f * char.scale, 0, 8 * char.scale, 2.5 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(26 * f * char.scale, 0, 8 * char.scale, 2.5 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "dog_walker") {
        const f = char.facing || 1;
        ctx.ellipse(0, 0, 11 * char.scale, 3.2 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(36 * f * char.scale, 0, 8 * char.scale, 2.4 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "couple") {
        const f = char.facing || 1;
        ctx.ellipse(-8 * f * char.scale, 0, 9 * char.scale, 3.0 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(8 * f * char.scale, 0, 9 * char.scale, 3.0 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "stroller_parent") {
        const f = char.facing || 1;
        ctx.ellipse(0, 0, 11 * char.scale, 3.2 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(32 * f * char.scale, 0, 14 * char.scale, 2.8 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type.startsWith("bench_")) {
        const f = char.facing || 1;
        ctx.ellipse(10 * f * char.scale, 0, 8 * char.scale, 2.8 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "stargazer") {
        const f = char.facing || 1;
        ctx.ellipse(0, 0, 9 * char.scale, 3.0 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(14 * f * char.scale, 0, 12 * char.scale, 2.6 * char.scale, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(0, 0, 12 * char.scale, 3.5 * char.scale, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();

      // Scale and apply facing direction (+1 = right, -1 = left)
      const facing = char.facing || 1;
      ctx.scale(char.scale * facing, char.scale);

      switch (char.type) {
        case "jogger":
        case "jogger_night":
          this.renderJogger(ctx, colors, timeSec, char);
          break;
        case "dog_walker":
          this.renderDogWalker(ctx, colors, timeSec, char);
          break;
        case "cyclist":
          this.renderCyclist(ctx, colors, timeSec, char);
          break;
        case "skateboarder":
          this.renderSkateboarder(ctx, colors, timeSec, char);
          break;
        case "stroller_parent":
          this.renderStrollerParent(ctx, colors, timeSec, char);
          break;
        case "walker_coffee":
          this.renderWalker(ctx, colors, timeSec, char, { hasCoffee: true });
          break;
        case "walker_phone":
          this.renderWalker(ctx, colors, timeSec, char, { hasPhone: true });
          break;
        case "walker_coat":
          this.renderWalker(ctx, colors, timeSec, char, { hasCoat: true });
          break;
        case "photographer":
          this.renderPhotographer(ctx, colors, timeSec, char);
          break;
        case "couple":
          this.renderCouple(ctx, colors, timeSec, char);
          break;
        case "bench_reader":
          this.renderBenchReader(ctx, colors, timeSec, char);
          break;
        case "bench_laptop":
          this.renderBenchLaptop(ctx, colors, timeSec, char);
          break;
        case "bench_coffee":
          this.renderBenchCoffee(ctx, colors, timeSec, char);
          break;
        case "bench_guitarist":
          this.renderBenchGuitarist(ctx, colors, timeSec, char);
          break;
        case "bench_watcher":
          this.renderBenchWatcher(ctx, colors, timeSec, char);
          break;
        case "stretcher":
          this.renderStretcher(ctx, colors, timeSec, char);
          break;
        case "stargazer":
          this.renderStargazer(ctx, colors, timeSec, char);
          break;
        default:
          this.renderWalker(ctx, colors, timeSec, char, {});
          break;
      }

      ctx.restore();
    });
  }

  // =========================================================================
  // ANATOMICALLY SOUND FORWARD INVERSE KINEMATICS (Zero Backward Leg Bending)
  // =========================================================================

  /**
   * Calculates human walking leg angles where knees strictly bend backward.
   * Swing phase (cos > 0) lifts the foot by flexing the knee backward.
   * Stance phase (cos <= 0) keeps the leg solid and straight on the pavement.
   * phase: 0..2PI
   */
  calcWalkLeg(phase) {
    const swing = Math.sin(phase) * 0.42; // Thigh swing (-back, +front)
    // Knee flexes backward ONLY during forward swing recovery (when cos > 0)
    const kneeFlex = Math.max(0, Math.cos(phase)) * 0.72;
    return {
      thighAngle: swing,
      calfAngle: swing - kneeFlex // Minus sign guarantees backward bend!
    };
  }

  drawArticulatedLeg(ctx, hipX, hipY, thighAngle, calfAngle, thighLen = 13, calfLen = 13) {
    const kX = hipX + Math.sin(thighAngle) * thighLen;
    const kY = hipY + Math.cos(thighAngle) * thighLen;
    const aX = kX + Math.sin(calfAngle) * calfLen;
    const aY = kY + Math.cos(calfAngle) * calfLen;

    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kX, kY);
    ctx.lineTo(aX, aY);
    // Foot shoe pointing forward (+X)
    ctx.lineTo(aX + 5, aY);
    ctx.stroke();
  }

  drawSeatedLegs(ctx, hipX = -1, seatY = -22) {
    // Far leg (slightly deeper X, drawn first)
    ctx.beginPath();
    ctx.moveTo(hipX + 3, seatY);
    ctx.lineTo(hipX + 13, seatY);
    ctx.lineTo(hipX + 13, 0);
    ctx.lineTo(hipX + 17, 0);
    ctx.stroke();

    // Near leg (resting on seat, calf dropping to ground)
    ctx.beginPath();
    ctx.moveTo(hipX - 2, seatY);
    ctx.lineTo(hipX + 9, seatY);
    ctx.lineTo(hipX + 9, 0);
    ctx.lineTo(hipX + 13, 0);
    ctx.stroke();
  }

  // --- Character Archetypes ---

  // A. Jogger (Athletic forward lean, high knees, rhythmic arms)
  renderJogger(ctx, colors, timeSec, char) {
    const pace = timeSec * 11;
    const bounce = Math.abs(Math.sin(pace)) * 3.5;
    const baseY = -bounce;

    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(6, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning forward 14 degrees)
    ctx.save();
    ctx.translate(0, baseY);
    ctx.rotate(14 * Math.PI / 180);
    ctx.fillRect(-4, -50, 9, 24);
    ctx.restore();

    // Legs (Running gait: high knee lift on forward swing, straight push on stance)
    const leg1 = Math.sin(pace) * 0.85;
    const leg2 = Math.sin(pace + Math.PI) * 0.85;
    const kneeFlex1 = Math.max(0, Math.cos(pace)) * 1.30;
    const kneeFlex2 = Math.max(0, Math.cos(pace + Math.PI)) * 1.30;

    this.drawArticulatedLeg(ctx, -2, baseY - 26, leg1, leg1 - kneeFlex1, 14, 13);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, leg2, leg2 - kneeFlex2, 14, 13);

    // Pumping Arms
    const arm1 = -Math.sin(pace) * 0.85;
    const arm2 = -Math.sin(pace + Math.PI) * 0.85;

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const e1X = 2 + Math.sin(arm1) * 12;
    const e1Y = baseY - 48 + Math.cos(arm1) * 12;
    ctx.lineTo(e1X, e1Y);
    ctx.lineTo(e1X + 8, e1Y - 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const e2X = 2 + Math.sin(arm2) * 12;
    const e2Y = baseY - 48 + Math.cos(arm2) * 12;
    ctx.lineTo(e2X, e2Y);
    ctx.lineTo(e2X + 8, e2Y - 4);
    ctx.stroke();

    if (char.type === "jogger_night") {
      // Glowing green night armband
      ctx.fillStyle = "#34d399";
      ctx.fillRect(e1X - 2, e1Y - 4, 4, 3);
    }
  }

  // B. Dog Walker & Playful Trotting Dog
  renderDogWalker(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.8;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso / Jacket
    ctx.fillRect(-5, baseY - 50, 10, 24);

    // Anatomical Walking Legs
    const l1 = this.calcWalkLeg(pace);
    const l2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle);

    // Left Arm swinging back
    ctx.beginPath();
    ctx.moveTo(-4, baseY - 46);
    ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
    ctx.stroke();

    // Right Arm holding leash
    const handX = 14;
    const handY = baseY - 32;
    ctx.beginPath();
    ctx.moveTo(4, baseY - 46);
    ctx.lineTo(10, baseY - 38);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Dog trotting in front
    const dogX = 36;
    const dogPace = timeSec * 10;
    const dogBounce = Math.abs(Math.sin(dogPace)) * 1.8;
    const dogY = -dogBounce;

    // Leash
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(dogX - 10, handY + 12, dogX, dogY - 14);
    ctx.stroke();
    ctx.restore();

    // Dog Body
    ctx.save();
    ctx.translate(dogX, dogY);
    ctx.fillStyle = colors.isDaylight ? "#78350f" : colors.silhouette;
    ctx.beginPath();
    ctx.ellipse(0, -12, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head & Snout
    ctx.beginPath();
    ctx.arc(10, -17, 5, 0, Math.PI * 2);
    ctx.lineTo(17, -15);
    ctx.lineTo(14, -12);
    ctx.fill();

    // Ear
    ctx.beginPath();
    ctx.moveTo(8, -21);
    ctx.lineTo(12, -23);
    ctx.lineTo(11, -17);
    ctx.fill();

    // 4 Trotting Legs with canine hock & stifle articulation
    ctx.strokeStyle = colors.isDaylight ? "#78350f" : colors.silhouette;
    ctx.lineWidth = 2.0;
    const d1 = Math.sin(dogPace) * 0.55;
    const d2 = Math.sin(dogPace + Math.PI) * 0.55;

    // Forelegs
    const fKnee1 = Math.sin(d1) * 3;
    const fPaw1 = Math.sin(d1) * 6;
    ctx.beginPath();
    ctx.moveTo(7, -8);
    ctx.lineTo(7 + fKnee1, -4);
    ctx.lineTo(7 + fPaw1, dogBounce);
    ctx.stroke();

    const fKnee2 = Math.sin(d2) * 3;
    const fPaw2 = Math.sin(d2) * 6;
    ctx.beginPath();
    ctx.moveTo(9, -8);
    ctx.lineTo(9 + fKnee2, -4);
    ctx.lineTo(9 + fPaw2, dogBounce);
    ctx.stroke();

    // Hindlegs with natural hock flexion
    const hHock1 = -Math.sin(d2) * 3;
    const hPaw1 = Math.sin(d2) * 6;
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(-9 + hHock1, -4);
    ctx.lineTo(-7 + hPaw1, dogBounce);
    ctx.stroke();

    const hHock2 = -Math.sin(d1) * 3;
    const hPaw2 = Math.sin(d1) * 6;
    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-7 + hHock2, -4);
    ctx.lineTo(-5 + hPaw2, dogBounce);
    ctx.stroke();

    // Wagging tail
    const wag = Math.sin(timeSec * 16) * 4;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.quadraticCurveTo(-16, -20 + wag, -14, -24 + wag);
    ctx.stroke();

    ctx.restore();
  }

  // C. Cyclist
  renderCyclist(ctx, colors, timeSec, char) {
    const wheelAngle = timeSec * 14;
    const pedalAngle = timeSec * 6;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;

    const rearX = -26;
    const frontX = 26;
    const wheelR = 15;
    const axleY = -wheelR;

    // Wheels
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(rearX, axleY, wheelR, 0, Math.PI * 2);
    ctx.arc(frontX, axleY, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Spokes (8 radial wire spokes per wheel)
    [rearX, frontX].forEach(wx => {
      ctx.save();
      ctx.translate(wx, axleY);
      ctx.rotate(wheelAngle);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-wheelR, 0); ctx.lineTo(wheelR, 0);
      ctx.moveTo(0, -wheelR); ctx.lineTo(0, wheelR);
      const diag = wheelR * 0.707;
      ctx.moveTo(-diag, -diag); ctx.lineTo(diag, diag);
      ctx.moveTo(-diag, diag); ctx.lineTo(diag, -diag);
      ctx.stroke();
      ctx.restore();
    });

    // Frame
    ctx.lineWidth = 2.2;
    const bbX = 0, bbY = axleY + 3;
    const spX = -8, spY = -34;
    const htX = 18, htY = -36;

    ctx.beginPath();
    ctx.moveTo(rearX, axleY); ctx.lineTo(spX, spY); ctx.lineTo(bbX, bbY); ctx.closePath();
    ctx.moveTo(bbX, bbY); ctx.lineTo(htX, htY); ctx.lineTo(spX, spY);
    ctx.moveTo(htX, htY); ctx.lineTo(frontX, axleY);
    ctx.moveTo(htX, htY); ctx.lineTo(htX + 6, htY - 6);
    ctx.stroke();

    // Saddle
    ctx.fillRect(spX - 5, spY - 2, 12, 3);

    // Far Leg (180 deg out of phase with near leg)
    const pedalR = 6;
    const p2X = bbX + Math.cos(pedalAngle + Math.PI) * pedalR;
    const p2Y = bbY + Math.sin(pedalAngle + Math.PI) * pedalR;
    const knee2X = -1 + Math.cos(pedalAngle + Math.PI) * 5;
    const knee2Y = -22 + Math.sin(pedalAngle + Math.PI) * 3;

    ctx.save();
    ctx.strokeStyle = colors.isDaylight ? "#334155" : colors.silhouette;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(bbX, bbY); ctx.lineTo(p2X, p2Y); // crank
    ctx.moveTo(spX + 1, spY);
    ctx.lineTo(knee2X, knee2Y);
    ctx.lineTo(p2X, p2Y);
    ctx.lineTo(p2X + 4, p2Y);
    ctx.stroke();
    ctx.restore();

    // Cyclist Body & Head
    ctx.beginPath();
    ctx.arc(8, -58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(11, -61, 5, 3); // visor

    ctx.save();
    ctx.translate(spX + 4, spY - 4);
    ctx.rotate(35 * Math.PI / 180);
    ctx.fillRect(-3, -24, 7, 24);
    ctx.restore();

    // Arms
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(4, -50);
    ctx.lineTo(htX + 5, htY - 5);
    ctx.stroke();

    // Near Leg (Pedaling)
    const p1X = bbX + Math.cos(pedalAngle) * pedalR;
    const p1Y = bbY + Math.sin(pedalAngle) * pedalR;
    const knee1X = 2 + Math.cos(pedalAngle) * 5;
    const knee1Y = -22 + Math.sin(pedalAngle) * 3;

    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(bbX, bbY); ctx.lineTo(p1X, p1Y); // crank
    ctx.moveTo(spX + 3, spY);
    ctx.lineTo(knee1X, knee1Y);
    ctx.lineTo(p1X, p1Y);
    ctx.lineTo(p1X + 4, p1Y);
    ctx.stroke();

    ctx.restore();
  }

  // D. Skateboarder (Pushes with back foot, then cruises)
  renderSkateboarder(ctx, colors, timeSec, char) {
    const cycle = (timeSec * 2.5) % 3; // 0..3 cycle: 0..1 push, 1..3 cruise
    const isPushing = cycle < 1.0;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;

    // Skateboard Deck & Wheels
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(-12, -4);
    ctx.lineTo(12, -4);
    ctx.lineTo(16, -6);
    ctx.stroke();

    // Wheels
    ctx.beginPath();
    ctx.arc(-10, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(10, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Skater Body
    ctx.lineWidth = 3.0;
    // Head with beanie
    ctx.beginPath();
    ctx.arc(0, -56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-5, -50, 10, 24);

    // Front Leg (Planted on board)
    ctx.beginPath();
    ctx.moveTo(3, -26);
    ctx.lineTo(6, -14);
    ctx.lineTo(6, -4);
    ctx.stroke();

    // Rear Leg (Pushing or Riding)
    if (isPushing) {
      const pushPhase = cycle / 1.0;
      const footX = -6 - Math.sin(pushPhase * Math.PI) * 12;
      const footY = -4 + Math.sin(pushPhase * Math.PI) * 4;

      ctx.beginPath();
      ctx.moveTo(-3, -26);
      ctx.lineTo(footX + 4, -14);
      ctx.lineTo(footX, footY);
      ctx.stroke();
    } else {
      // Cruising on back of board
      ctx.beginPath();
      ctx.moveTo(-3, -26);
      ctx.lineTo(-6, -14);
      ctx.lineTo(-8, -4);
      ctx.stroke();
    }

    // Arms balancing
    ctx.beginPath();
    ctx.moveTo(-4, -46);
    ctx.lineTo(-14, -36);
    ctx.moveTo(4, -46);
    ctx.lineTo(14, -38);
    ctx.stroke();

    ctx.restore();
  }

  // E. Parent Pushing Modern Baby Stroller
  renderStrollerParent(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.6;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Parent Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Parent Torso
    ctx.fillRect(-5, baseY - 50, 10, 24);

    // Legs
    const l1 = this.calcWalkLeg(pace);
    const l2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle);

    // Arms extending to stroller handle
    const handleX = 22;
    const handleY = -34;
    ctx.beginPath();
    ctx.moveTo(3, baseY - 46);
    ctx.lineTo(12, -38);
    ctx.lineTo(handleX, handleY);
    ctx.stroke();

    // Stroller / Pram
    const sX = 32;
    ctx.lineWidth = 2.0;

    // Chassis & Bassinet
    ctx.beginPath();
    ctx.moveTo(handleX, handleY);
    ctx.lineTo(sX - 10, -5);
    ctx.moveTo(handleX + 2, handleY);
    ctx.lineTo(sX + 12, -5);
    ctx.stroke();

    // Bassinet body
    ctx.beginPath();
    ctx.moveTo(sX - 12, -18);
    ctx.lineTo(sX + 16, -18);
    ctx.lineTo(sX + 12, -8);
    ctx.lineTo(sX - 10, -8);
    ctx.closePath();
    ctx.fill();

    // Baby bonnet peeking out
    ctx.beginPath();
    ctx.arc(sX - 2, -21, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Canopy
    ctx.beginPath();
    ctx.arc(sX - 2, -18, 10, Math.PI, Math.PI * 1.7, false);
    ctx.stroke();

    // Wheels with rotating spokes
    const pramWheelAngle = timeSec * 12;
    [sX - 10, sX + 12].forEach(wx => {
      ctx.beginPath();
      ctx.arc(wx, -5, 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(wx, -5);
      ctx.rotate(pramWheelAngle);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
      ctx.moveTo(0, -5); ctx.lineTo(0, 5);
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  }

  // F. Walker with Coffee, Phone, or Coat
  renderWalker(ctx, colors, timeSec, char, opts) {
    const pace = timeSec * 4.6;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Head (tilted forward if looking at phone)
    ctx.beginPath();
    if (opts.hasPhone) {
      ctx.arc(2, baseY - 54, 6.5, 0, Math.PI * 2);
    } else {
      ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    }
    ctx.fill();

    // Torso / Overcoat
    if (opts.hasCoat) {
      // Warm knee-length winter/evening coat with subtle hem flare
      const flare = Math.sin(pace) * 2;
      ctx.beginPath();
      ctx.moveTo(-5, baseY - 50);
      ctx.lineTo(5, baseY - 50);
      ctx.lineTo(7 + flare, baseY - 22);
      ctx.lineTo(-7 + flare, baseY - 22);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(-5, baseY - 50, 10, 24);
    }

    // Anatomical Walking Legs
    const l1 = this.calcWalkLeg(pace);
    const l2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle, 13, 13);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle, 13, 13);

    if (opts.hasCoat) {
      // Hands tucked in coat pockets
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-7, baseY - 36);
      ctx.lineTo(-3, baseY - 32);
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(7, baseY - 36);
      ctx.lineTo(3, baseY - 32);
      ctx.stroke();
    } else if (opts.hasCoffee) {
      // Steaming coffee cup
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(9, baseY - 36);
      ctx.lineTo(12, baseY - 34);
      ctx.stroke();

      ctx.fillRect(11, baseY - 36, 5, 7);

      // Steam
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      const sY = baseY - 38 - ((timeSec * 16) % 18);
      ctx.beginPath();
      ctx.moveTo(13, baseY - 38);
      ctx.quadraticCurveTo(15, sY + 4, 13, sY);
      ctx.stroke();
      ctx.restore();
    } else if (opts.hasPhone) {
      // Looking down at smartphone
      ctx.beginPath();
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(8, baseY - 36);
      ctx.lineTo(10, baseY - 38);
      ctx.stroke();

      // Phone
      ctx.fillRect(9, baseY - 41, 3, 6);

      // Screen glow at dusk/night
      if (this.timeOfDay === "dusk" || this.timeOfDay === "night") {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(10, baseY - 39, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.stroke();
    } else {
      // Standard natural arm swing
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(4 + Math.sin(pace) * 10, baseY - 28);
      ctx.stroke();
    }

    ctx.restore();
  }

  // G. Photographer / Tourist
  renderPhotographer(ctx, colors, timeSec, char) {
    const hasVx = char.vx && Math.abs(char.vx) > 0.1;
    const walkPauseCycle = (timeSec * 0.25) % 1.0;
    const isWalkPaused = hasVx && (walkPauseCycle > 0.55 && walkPauseCycle < 0.85);
    const isStationary = !hasVx || isWalkPaused;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    if (isStationary) {
      // Standing stationary taking pictures of scenery
      const cycle = hasVx ? ((walkPauseCycle - 0.55) / 0.30) : ((timeSec * 0.35) % 1.0);
      const isShooting = hasVx ? (cycle > 0.15 && cycle < 0.85) : (cycle > 0.35 && cycle < 0.80);
      const isFlashing = hasVx ? (cycle > 0.50 && cycle < 0.60) : (cycle > 0.60 && cycle < 0.65);

      // Head
      ctx.beginPath();
      ctx.arc(0, -56, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.fillRect(-5, -50, 10, 24);

      // Standing Legs planted firmly on the ground
      ctx.beginPath();
      ctx.moveTo(-3, -26); ctx.lineTo(-5, 0); ctx.lineTo(-1, 0);
      ctx.moveTo(3, -26); ctx.lineTo(5, 0); ctx.lineTo(9, 0);
      ctx.stroke();

      if (isShooting) {
        // Arms raised holding camera up to eye
        ctx.beginPath();
        ctx.moveTo(-4, -46); ctx.lineTo(4, -54);
        ctx.moveTo(4, -46); ctx.lineTo(4, -54);
        ctx.stroke();

        // Camera
        ctx.fillRect(4, -57, 7, 5);

        // Flash
        if (isFlashing) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(14, -55, 14, 0, Math.PI * 2);
          ctx.fill();

          // Flash rays
          ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(14, -72); ctx.lineTo(14, -38);
          ctx.moveTo(-3, -55); ctx.lineTo(31, -55);
          ctx.stroke();
        }
      } else {
        // Holding camera at chest level, looking at scenery or reviewing photo
        ctx.beginPath();
        ctx.moveTo(-4, -46); ctx.lineTo(2, -38);
        ctx.moveTo(4, -46); ctx.lineTo(4, -38);
        ctx.stroke();

        ctx.fillRect(2, -41, 6, 5);

        // LCD preview glow
        if (cycle > 0.80 && (this.timeOfDay === "sunset" || this.timeOfDay === "dusk" || this.timeOfDay === "night")) {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(4, -39, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Walking with camera hanging on chest
      const pace = timeSec * 4.2;
      const bounce = Math.abs(Math.sin(pace)) * 1.8;
      const baseY = bounce;
      const l1 = this.calcWalkLeg(pace);
      const l2 = this.calcWalkLeg(pace + Math.PI);

      // Head
      ctx.beginPath();
      ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.fillRect(-5, baseY - 50, 10, 24);

      // Walking Legs
      this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle, 13, 13);
      this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle, 13, 13);

      // Arms swinging
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46); ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.moveTo(4, baseY - 46); ctx.lineTo(4 + Math.sin(pace) * 8, baseY - 28);
      ctx.stroke();

      // Camera on chest
      ctx.fillRect(1, baseY - 42, 6, 5);
    }

    ctx.restore();
  }

  // H. Couple Strolling
  renderCouple(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.2;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Person 1 (Taller)
    ctx.beginPath();
    ctx.arc(-8, baseY - 58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-13, baseY - 52, 10, 26);

    // Person 1 Two Walking Legs
    const p1L1 = this.calcWalkLeg(pace);
    const p1L2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -12, baseY - 26, p1L1.thighAngle, p1L1.calfAngle, 13, 13);
    this.drawArticulatedLeg(ctx, -5, baseY - 26, p1L2.thighAngle, p1L2.calfAngle, 13, 13);

    // Person 1 outer swinging arm
    ctx.beginPath();
    ctx.moveTo(-13, baseY - 46);
    ctx.lineTo(-13 - Math.sin(pace) * 8, baseY - 28);
    ctx.stroke();

    // Person 2 (Slightly shorter)
    ctx.beginPath();
    ctx.arc(8, baseY - 54, 6.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(4, baseY - 48, 9, 24);

    // Person 2 Two Walking Legs
    const p2L1 = this.calcWalkLeg(pace + 0.35);
    const p2L2 = this.calcWalkLeg(pace + 0.35 + Math.PI);
    this.drawArticulatedLeg(ctx, 4, baseY - 24, p2L1.thighAngle, p2L1.calfAngle, 12, 12);
    this.drawArticulatedLeg(ctx, 11, baseY - 24, p2L2.thighAngle, p2L2.calfAngle, 12, 12);

    // Person 2 outer swinging arm
    ctx.beginPath();
    ctx.moveTo(12, baseY - 42);
    ctx.lineTo(12 + Math.sin(pace + 0.35) * 8, baseY - 26);
    ctx.stroke();

    // Joined Hands in the center
    ctx.beginPath();
    ctx.moveTo(-5, baseY - 46);
    ctx.lineTo(0, baseY - 31);
    ctx.lineTo(5, baseY - 42);
    ctx.stroke();

    ctx.restore();
  }

  // I. Bench Reader (Day)
  renderBenchReader(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head tilted down reading
    ctx.beginPath();
    ctx.arc(2, -48, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso sitting on bench
    ctx.fillRect(-4, -43, 9, 21);

    // Seated legs
    this.drawSeatedLegs(ctx, -1, -22);

    // Arms holding book above lap
    ctx.beginPath();
    ctx.moveTo(2, -38); ctx.lineTo(9, -27);
    ctx.stroke();

    // Open Book
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(6, -30); ctx.lineTo(13, -32); ctx.lineTo(15, -25); ctx.lineTo(8, -24);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // J. Bench Laptop Worker (Day)
  renderBenchLaptop(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head looking at laptop screen
    ctx.beginPath();
    ctx.arc(2, -48, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-4, -43, 9, 21);

    // Seated legs
    this.drawSeatedLegs(ctx, -1, -22);

    // Laptop on lap
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(6, -24); ctx.lineTo(16, -24); // base
    ctx.lineTo(13, -34); // open screen
    ctx.stroke();

    // Hands typing on keyboard
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(1, -37); ctx.lineTo(8, -26);
    ctx.stroke();

    ctx.restore();
  }

  // K. Bench Coffee Drinker
  renderBenchCoffee(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(-2, -49, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-5, -43, 9, 21);

    // Seated legs
    this.drawSeatedLegs(ctx, -2, -22);

    // Arm holding warm coffee cup
    ctx.beginPath();
    ctx.moveTo(2, -38); ctx.lineTo(8, -32); ctx.lineTo(11, -34);
    ctx.stroke();

    // Coffee cup
    ctx.fillRect(10, -36, 5, 7);

    // Rising steam
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    const sY = -38 - ((timeSec * 14) % 16);
    ctx.beginPath();
    ctx.moveTo(12, -38);
    ctx.quadraticCurveTo(14, sY + 4, 12, sY);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // L. Bench Guitarist (Sunset & Dusk)
  renderBenchGuitarist(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head tilted forward towards the fretboard
    ctx.beginPath();
    ctx.arc(0, -49, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso sitting on bench seat (-22)
    ctx.fillRect(-5, -43, 9, 21);

    // Anatomical Seated Legs resting on bench (-22) and reaching ground (0)
    this.drawSeatedLegs(ctx, -1, -22);

    // Acoustic Guitar body resting on lap facing right (+X)
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.ellipse(1, -26, 9, 6, -18 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Soundhole
    ctx.fillStyle = colors.silhouette;
    ctx.beginPath();
    ctx.arc(1, -26, 2, 0, Math.PI * 2);
    ctx.fill();

    // Guitar neck & headstock pointing FORWARD and UP (+X, +Y upward)
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(4, -28); ctx.lineTo(16, -38);
    ctx.stroke();

    // Headstock
    ctx.fillRect(15, -41, 4, 3);

    // Fretting left arm/hand reaching forward along neck
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(1, -38); ctx.lineTo(9, -36); ctx.lineTo(13, -37);
    ctx.stroke();

    // Strumming right hand over guitar strings
    const strum = Math.sin(timeSec * 7) * 2;
    ctx.beginPath();
    ctx.moveTo(-3, -38); ctx.lineTo(-1, -31); ctx.lineTo(2, -26 + strum);
    ctx.stroke();

    ctx.restore();
  }

  // M. Bench Sunset Watcher
  renderBenchWatcher(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head looking towards horizon
    ctx.beginPath();
    ctx.arc(-2, -49, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso relaxed against backrest
    ctx.fillRect(-6, -43, 9, 21);

    // Seated Legs
    this.drawSeatedLegs(ctx, -2, -22);

    // Arm resting along backrest
    ctx.beginPath();
    ctx.moveTo(-4, -39); ctx.lineTo(-15, -34); ctx.lineTo(-15, -28);
    ctx.stroke();

    // Other arm resting on lap
    ctx.beginPath();
    ctx.moveTo(2, -39); ctx.lineTo(6, -25);
    ctx.stroke();

    ctx.restore();
  }

  // N. Stargazer with Telescope (Night)
  renderStargazer(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;

    const tripodX = 14;
    const tripodTopY = -34;

    // Tripod
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tripodX, tripodTopY); ctx.lineTo(tripodX - 12, 0);
    ctx.moveTo(tripodX, tripodTopY); ctx.lineTo(tripodX, 0);
    ctx.moveTo(tripodX, tripodTopY); ctx.lineTo(tripodX + 12, 0);
    ctx.stroke();

    // Telescope
    ctx.save();
    ctx.translate(tripodX, tripodTopY);
    ctx.rotate(-42 * Math.PI / 180);
    ctx.fillStyle = "#c59b27";
    ctx.fillRect(-10, -3, 28, 6);
    ctx.restore();

    // Stargazer Figure
    ctx.fillStyle = colors.silhouette;
    ctx.beginPath();
    ctx.arc(6, -37, 6.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(2, -34);
    ctx.rotate(18 * Math.PI / 180);
    ctx.fillRect(-4, 0, 8, 20);
    ctx.restore();

    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(-4, 0);
    ctx.moveTo(4, -14); ctx.lineTo(6, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(6, -30); ctx.lineTo(12, -34);
    ctx.stroke();

    ctx.restore();
  }

  // O. Morning Stretcher / Yoga on Lawn
  renderStretcher(ctx, colors, timeSec, char) {
    const yogaCycle = Math.sin(timeSec * 1.5);

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head tilting up towards morning sky
    ctx.beginPath();
    ctx.arc(0, -52 - yogaCycle * 2.5, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso stretching upward from anchored hips (-22)
    const torsoTop = -46 - yogaCycle * 2;
    ctx.fillRect(-4, torsoTop, 8, -22 - torsoTop);

    // Legs in wide warrior/triangle stretch stance with feet planted
    ctx.beginPath();
    ctx.moveTo(-3, -22); ctx.lineTo(-8, -11); ctx.lineTo(-13, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(3, -22); ctx.lineTo(8, -11); ctx.lineTo(13, 0); ctx.lineTo(18, 0);
    ctx.stroke();

    // Arms reaching gracefully up to greet the morning sun
    ctx.beginPath();
    ctx.moveTo(-3, torsoTop + 2); ctx.lineTo(-11, -58 - yogaCycle * 3.5);
    ctx.moveTo(3, torsoTop + 2); ctx.lineTo(11, -58 - yogaCycle * 3.5);
    ctx.stroke();

    ctx.restore();
  }
}
