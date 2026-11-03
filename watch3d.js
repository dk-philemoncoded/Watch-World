/**
 * 3D Wristwatch WebGL Engine — PHILL
 * Renders an ultra-luxurious, fully interactive 3D mechanical timepiece in real-time.
 * Features:
 * - Full 3D metallic case, beveled bezel, sculpted lugs, and knurled crown
 * - Curved 3D leather straps with realistic stitching and wrist curvature
 * - Live dynamic dial texture projected from the 2D watch canvas (hands tick in 3D!)
 * - Dome sapphire crystal with dynamic Fresnel specular light sweeps
 * - Drag-to-inspect 3D orbit controls
 * - High-speed cinematic 3D tumble/spin animation when searching locations
 */

export class Watch3DEngine {
  constructor(canvas, watch2D, soundEngine) {
    this.canvas = canvas;
    this.watch2D = watch2D;
    this.sound = soundEngine;

    this.gl = canvas.getContext("webgl", { antialias: true, alpha: true }) ||
              canvas.getContext("experimental-webgl", { antialias: true, alpha: true });

    if (!this.gl) {
      console.error("WebGL not available for 3D Wristwatch.");
      return;
    }

    // 3D Orientation & Camera
    this.rotation = { x: 0, y: 0, z: 0 };
    this.targetRotation = { x: 0, y: 0, z: 0 };
    this.cameraDistance = 4.2;
    this.targetDistance = 4.2;
    this.minDistance = 2.6;
    this.maxDistance = 6.5;

    // Interaction
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.idleTimer = null;
    this.autoIdle = true;

    // Cinematic Spin Animation
    this.isSpinning = false;
    this.spinStartTime = 0;
    this.spinDuration = 2200; // ms
    this.startRot = { x: 0, y: 0, z: 0 };
    this.endRot = { x: 0, y: 0, z: 0 };
    this.startDist = 4.2;
    this.endDist = 4.2;
    this.onSpinComplete = null;

    this.finish = "steel"; // 'steel' | 'rose-gold' | 'obsidian' | 'bronze'

    this.initWebGL();
    this.bindEvents();
    this.resize();
    this.startRenderLoop();
  }

  setFinish(finish) {
    this.finish = finish;
  }

  initWebGL() {
    const gl = this.gl;

    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;

      uniform mat4 uModel;
      uniform mat4 uView;
      uniform mat4 uProjection;
      uniform mat3 uNormalMatrix;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vTexCoord;

      void main() {
        vec4 worldPos = uModel * vec4(aPosition, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(uNormalMatrix * aNormal);
        vTexCoord = aTexCoord;
        gl_Position = uProjection * uView * worldPos;
      }
    `;

    const fsSource = `
      precision mediump float;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vTexCoord;

      uniform int uMaterial; // 0=Dial, 1=Metal Case, 2=Bezel, 3=Strap, 4=Sapphire Crystal, 5=Crown
      uniform sampler2D uDialTexture;
      uniform vec3 uBaseColor;
      uniform vec3 uSpecColor;
      uniform vec3 uCameraPos;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPos - vWorldPos);

        // Key light (Top right front)
        vec3 lightDir1 = normalize(vec3(0.6, 0.8, 1.0));
        // Fill light (Bottom left)
        vec3 lightDir2 = normalize(vec3(-0.6, -0.4, 0.5));

        float diff1 = max(dot(normal, lightDir1), 0.0);
        float diff2 = max(dot(normal, lightDir2), 0.0) * 0.4;
        float diffuse = diff1 + diff2;

        // Specular
        vec3 halfDir1 = normalize(lightDir1 + viewDir);
        float spec1 = pow(max(dot(normal, halfDir1), 0.0), 32.0);

        if (uMaterial == 0) {
          // Live Dial Texture
          vec4 dialColor = texture2D(uDialTexture, vTexCoord);
          vec3 litColor = dialColor.rgb * (0.8 + diffuse * 0.3) + vec3(1.0) * spec1 * 0.15;
          gl_FragColor = vec4(litColor, dialColor.a);
          return;
        }

        if (uMaterial == 1 || uMaterial == 2 || uMaterial == 5) {
          // Metallic Case, Bezel, and Crown
          float metallicSpec = pow(max(dot(normal, halfDir1), 0.0), 48.0);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
          vec3 metalColor = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * (metallicSpec * 1.2 + fresnel * 0.4);
          gl_FragColor = vec4(metalColor, 1.0);
          return;
        }

        if (uMaterial == 3) {
          // Leather Straps with subtle stitching edge
          vec3 strapCol = uBaseColor * (0.4 + diffuse * 0.6);
          // Stitch line highlighting
          float edgeDist = abs(vTexCoord.x - 0.5);
          if (abs(edgeDist - 0.42) < 0.02) {
            strapCol += vec3(0.3, 0.25, 0.2);
          }
          gl_FragColor = vec4(strapCol, 1.0);
          return;
        }

        if (uMaterial == 4) {
          // Sapphire Crystal Dome Lens
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
          // Sweeping diagonal flare
          float flare = pow(max(dot(normal, halfDir1), 0.0), 64.0);
          vec3 glassCol = vec3(0.8, 0.95, 1.0) * (flare * 1.5 + fresnel * 0.6);
          float alpha = 0.12 + fresnel * 0.35 + flare * 0.5;
          gl_FragColor = vec4(glassCol, alpha);
          return;
        }

        gl_FragColor = vec4(uBaseColor, 1.0);
      }
    `;

    this.program = this.createProgram(gl, vsSource, fsSource);

    this.locations = {
      aPosition: gl.getAttribLocation(this.program, "aPosition"),
      aNormal: gl.getAttribLocation(this.program, "aNormal"),
      aTexCoord: gl.getAttribLocation(this.program, "aTexCoord"),
      uModel: gl.getUniformLocation(this.program, "uModel"),
      uView: gl.getUniformLocation(this.program, "uView"),
      uProjection: gl.getUniformLocation(this.program, "uProjection"),
      uNormalMatrix: gl.getUniformLocation(this.program, "uNormalMatrix"),
      uMaterial: gl.getUniformLocation(this.program, "uMaterial"),
      uDialTexture: gl.getUniformLocation(this.program, "uDialTexture"),
      uBaseColor: gl.getUniformLocation(this.program, "uBaseColor"),
      uSpecColor: gl.getUniformLocation(this.program, "uSpecColor"),
      uCameraPos: gl.getUniformLocation(this.program, "uCameraPos")
    };

    // Build procedural 3D geometries
    this.parts = {
      dial: this.createDiscGeometry(1.0, 48, true),
      crystal: this.createDomeGeometry(1.02, 0.06, 48),
      bezel: this.createBezelGeometry(1.0, 1.14, 0.08, 48),
      caseBody: this.createCylinderGeometry(1.14, 0.22, 48),
      lugs: this.createLugsGeometry(),
      crown: this.createCrownGeometry(0.12, 0.14, 24),
      strapTop: this.createStrapGeometry(true),
      strapBottom: this.createStrapGeometry(false)
    };

    // Upload geometry buffers
    for (const key of Object.keys(this.parts)) {
      const part = this.parts[key];
      part.vBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(part.vertices));
      part.nBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(part.normals));
      part.tBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(part.texCoords));
      part.iBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(part.indices));
    }

    // Dynamic texture from the 2D watch canvas
    this.dialTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.dialTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  createProgram(gl, vs, fs) {
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vs);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fs);
    gl.compileShader(fShader);

    const prog = gl.createProgram();
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    return prog;
  }

  createBuffer(gl, type, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(type, buf);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buf;
  }

  // --- Procedural 3D Horological Geometry Generators ---

  createDiscGeometry(radius, segments, isDial = false) {
    const vertices = [0, 0, 0];
    const normals = [0, 0, 1];
    const texCoords = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      vertices.push(x, y, 0);
      normals.push(0, 0, 1);
      // Map UV so dial texture is oriented perfectly upright
      texCoords.push(0.5 + Math.cos(theta) * 0.5, 0.5 - Math.sin(theta) * 0.5);

      if (i > 0) {
        indices.push(0, i, i + 1);
      }
    }
    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createDomeGeometry(radius, height, segments) {
    const vertices = [0, 0, height];
    const normals = [0, 0, 1];
    const texCoords = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      vertices.push(x, y, 0);
      normals.push(x * 0.5, y * 0.5, 1.0);
      texCoords.push(0.5 + Math.cos(theta) * 0.5, 0.5 - Math.sin(theta) * 0.5);

      if (i > 0) {
        indices.push(0, i, i + 1);
      }
    }
    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createCylinderGeometry(radius, height, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const halfH = height / 2;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const u = i / segments;

      // Top rim
      vertices.push(x, y, halfH);
      normals.push(Math.cos(theta), Math.sin(theta), 0);
      texCoords.push(u, 0);

      // Bottom rim
      vertices.push(x, y, -halfH);
      normals.push(Math.cos(theta), Math.sin(theta), 0);
      texCoords.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const top1 = i * 2;
      const bot1 = top1 + 1;
      const top2 = (i + 1) * 2;
      const bot2 = top2 + 1;

      indices.push(top1, bot1, top2);
      indices.push(top2, bot1, bot2);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createBezelGeometry(innerR, outerR, depth, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const u = i / segments;

      // Inner top
      vertices.push(cos * innerR, sin * innerR, depth);
      normals.push(cos * 0.4, sin * 0.4, 0.9);
      texCoords.push(u, 0);

      // Outer top
      vertices.push(cos * outerR, sin * outerR, 0);
      normals.push(cos * 0.8, sin * 0.8, 0.4);
      texCoords.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const in1 = i * 2;
      const out1 = in1 + 1;
      const in2 = (i + 1) * 2;
      const out2 = in2 + 1;

      indices.push(in1, out1, in2);
      indices.push(in2, out1, out2);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createLugsGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // 4 Sculpted horns at top and bottom of watch case
    const lugPositions = [
      [-0.55, 0.95, -0.42, 1.45],  // Top Left
      [0.42, 1.45, 0.55, 0.95],    // Top Right
      [-0.55, -0.95, -0.42, -1.45],// Bottom Left
      [0.42, -1.45, 0.55, -0.95]   // Bottom Right
    ];

    let baseIdx = 0;
    lugPositions.forEach(([x1, y1, x2, y2]) => {
      const zTop = 0.08, zBot = -0.10;
      // Front facet
      vertices.push(x1, y1, zTop, x2, y2, zTop * 0.5, x2, y2, zBot, x1, y1, zBot);
      normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
      texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);

      indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
      indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
      baseIdx += 4;
    });

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createCrownGeometry(radius, length, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Cylinder along X-axis at 3 o'clock
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const y = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const u = i / segments;

      vertices.push(0, y, z);
      normals.push(0, Math.cos(theta), Math.sin(theta));
      texCoords.push(u, 0);

      vertices.push(length, y, z);
      normals.push(0, Math.cos(theta), Math.sin(theta));
      texCoords.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const p1 = i * 2;
      const p2 = p1 + 1;
      const p3 = (i + 1) * 2;
      const p4 = p3 + 1;

      indices.push(p1, p2, p3);
      indices.push(p3, p2, p4);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createStrapGeometry(isTop) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const dir = isTop ? 1 : -1;
    const width = 0.85;
    const segments = 16;
    const strapLength = 2.0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = (1.25 + t * strapLength) * dir;
      // Gentle backward curve following wrist curvature
      const z = -0.06 - Math.pow(t, 1.8) * 0.85;
      const nz = -Math.pow(t, 0.8) * 0.6;
      const ny = dir * 0.3;

      // Left edge
      vertices.push(-width / 2, y, z);
      normals.push(0, ny, 1 + nz);
      texCoords.push(0, t);

      // Right edge
      vertices.push(width / 2, y, z);
      normals.push(0, ny, 1 + nz);
      texCoords.push(1, t);
    }

    for (let i = 0; i < segments; i++) {
      const p1 = i * 2;
      const p2 = p1 + 1;
      const p3 = (i + 1) * 2;
      const p4 = p3 + 1;

      indices.push(p1, p2, p3);
      indices.push(p3, p2, p4);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  bindEvents() {
    const canvas = this.canvas;

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.autoIdle = false;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      this.lastMouse = { x, y };
      clearTimeout(this.idleTimer);
    };

    const onPointerMove = (e) => {
      if (!this.isDragging || this.isSpinning) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);

      const dx = x - this.lastMouse.x;
      const dy = y - this.lastMouse.y;

      this.targetRotation.y += dx * 0.008;
      this.targetRotation.x += dy * 0.008;

      // Constrain tilt to prevent upside-down flip
      this.targetRotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetRotation.x));
      this.lastMouse = { x, y };
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Reset to face after 4 seconds of inactivity
      this.idleTimer = setTimeout(() => {
        if (!this.isSpinning) {
          this.targetRotation = { x: 0, y: 0, z: 0 };
          this.autoIdle = true;
        }
      }, 4000);
    };

    const onWheel = (e) => {
      e.preventDefault();
      this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance + e.deltaY * 0.002));
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });

    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * The Climax Feature:
   * 3D Wristwatch full-screen tumble & spin animation when a location is searched!
   */
  spinToLocation(timeInfo, onComplete) {
    this.isSpinning = true;
    this.autoIdle = false;
    this.spinStartTime = performance.now();
    this.spinDuration = 2200; // ms
    this.onSpinComplete = onComplete;

    this.startRot = { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z };
    // 3 full 360-degree spins along Y (yaw) plus a dynamic roll along X/Z
    this.endRot = {
      x: 0,
      y: this.rotation.y + Math.PI * 6,
      z: 0
    };

    this.startDist = this.cameraDistance;
    this.endDist = 3.8; // Punch in slightly at destination

    if (this.sound) {
      this.sound.playWindingEffect(1.8);
    }
  }

  startRenderLoop() {
    const render = (now) => {
      this.update(now);
      this.draw();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  update(now) {
    if (this.isSpinning) {
      const elapsed = now - this.spinStartTime;
      const progress = Math.min(1.0, elapsed / this.spinDuration);

      // Quintic ease out for mechanical spinning deceleration
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 4);

      this.rotation.y = this.startRot.y + (this.endRot.y - this.startRot.y) * ease;
      // Banking tilt during spin
      this.rotation.x = Math.sin(progress * Math.PI) * 0.45;
      this.rotation.z = Math.sin(progress * Math.PI * 2) * 0.15;

      this.cameraDistance = this.startDist + (this.endDist - this.startDist) * ease;

      if (progress >= 1.0) {
        this.isSpinning = false;
        this.rotation.x = 0;
        this.rotation.y = 0;
        this.rotation.z = 0;
        this.targetRotation = { x: 0, y: 0, z: 0 };
        this.cameraDistance = 4.2;
        this.targetDistance = 4.2;

        if (this.sound) {
          this.sound.playArrivalChime();
        }

        if (this.onSpinComplete) {
          const cb = this.onSpinComplete;
          this.onSpinComplete = null;
          cb();
        }
      }
    } else {
      // Gentle idle sway when untouched
      if (this.autoIdle && !this.isDragging) {
        const time = now * 0.0012;
        this.targetRotation.y = Math.sin(time) * 0.18;
        this.targetRotation.x = Math.cos(time * 0.7) * 0.08;
      }

      this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.1;
      this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.1;
      this.rotation.z += (this.targetRotation.z - this.rotation.z) * 0.1;
      this.cameraDistance += (this.targetDistance - this.cameraDistance) * 0.1;
    }
  }

  draw() {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Update Dial Texture from 2D Watch Canvas in real-time
    if (this.watch2D && this.watch2D.canvas) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.dialTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.watch2D.canvas);
      gl.uniform1i(this.locations.uDialTexture, 0);
    }

    // Build Matrices
    const aspect = this.canvas.width / this.canvas.height;
    const projMatrix = this.createPerspective(42 * Math.PI / 180, aspect, 0.1, 100.0);
    const viewMatrix = this.createLookAt([0, 0, this.cameraDistance], [0, 0, 0], [0, 1, 0]);

    // Model matrix with rotation around X, Y, Z
    const modelMatrix = this.createIdentity();
    this.rotateX(modelMatrix, this.rotation.x);
    this.rotateY(modelMatrix, this.rotation.y);
    this.rotateZ(modelMatrix, this.rotation.z);

    const normalMatrix = this.createNormalMatrix(modelMatrix);

    gl.uniformMatrix4fv(this.locations.uProjection, false, projMatrix);
    gl.uniformMatrix4fv(this.locations.uView, false, viewMatrix);
    gl.uniform3f(this.locations.uCameraPos, 0, 0, this.cameraDistance);

    // Color definitions based on chosen finish
    const metalColors = {
      steel: { base: [0.78, 0.82, 0.88], spec: [1.0, 1.0, 1.0] },
      "rose-gold": { base: [0.86, 0.62, 0.48], spec: [1.0, 0.88, 0.75] },
      obsidian: { base: [0.18, 0.20, 0.24], spec: [0.45, 0.50, 0.58] },
      bronze: { base: [0.74, 0.55, 0.32], spec: [0.95, 0.78, 0.52] }
    };
    const strapColors = {
      steel: [0.12, 0.10, 0.09],      // Rich espresso leather
      "rose-gold": [0.15, 0.09, 0.07], // Saddle cognac leather
      obsidian: [0.06, 0.07, 0.08],    // Midnight stealth black leather
      bronze: [0.18, 0.12, 0.08]       // Vintage tobacco leather
    };

    const finishColor = metalColors[this.finish] || metalColors.steel;
    const strapCol = strapColors[this.finish] || strapColors.steel;

    // Helper to render a mesh part
    const drawPart = (part, mMatrix, materialType, baseCol, specCol) => {
      const nMat = this.createNormalMatrix(mMatrix);
      gl.uniformMatrix4fv(this.locations.uModel, false, mMatrix);
      gl.uniformMatrix3fv(this.locations.uNormalMatrix, false, nMat);
      gl.uniform1i(this.locations.uMaterial, materialType);
      gl.uniform3fv(this.locations.uBaseColor, baseCol || finishColor.base);
      gl.uniform3fv(this.locations.uSpecColor, specCol || finishColor.spec);

      gl.bindBuffer(gl.ARRAY_BUFFER, part.vBuffer);
      gl.enableVertexAttribArray(this.locations.aPosition);
      gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, part.nBuffer);
      gl.enableVertexAttribArray(this.locations.aNormal);
      gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, part.tBuffer);
      gl.enableVertexAttribArray(this.locations.aTexCoord);
      gl.vertexAttribPointer(this.locations.aTexCoord, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.iBuffer);
      gl.drawElements(gl.TRIANGLES, part.count, gl.UNSIGNED_SHORT, 0);
    };

    // 1. Draw Leather Straps (Top and Bottom)
    drawPart(this.parts.strapTop, modelMatrix, 3, strapCol, [0.3, 0.25, 0.2]);
    drawPart(this.parts.strapBottom, modelMatrix, 3, strapCol, [0.3, 0.25, 0.2]);

    // 2. Draw Lugs (4 horns)
    drawPart(this.parts.lugs, modelMatrix, 1);

    // 3. Draw Main Case Body
    drawPart(this.parts.caseBody, modelMatrix, 1);

    // 4. Draw Winding Crown at 3 o'clock
    const crownMatrix = new Float32Array(modelMatrix);
    this.translate(crownMatrix, 1.14, 0, 0);
    drawPart(this.parts.crown, crownMatrix, 5);

    // 5. Draw Bezel
    const bezelMatrix = new Float32Array(modelMatrix);
    this.translate(bezelMatrix, 0, 0, 0.11);
    drawPart(this.parts.bezel, bezelMatrix, 2);

    // 6. Draw Live Watch Dial Face
    const dialMatrix = new Float32Array(modelMatrix);
    this.translate(dialMatrix, 0, 0, 0.12);
    drawPart(this.parts.dial, dialMatrix, 0);

    // 7. Draw Dome Sapphire Crystal with specular sheen
    const crystalMatrix = new Float32Array(modelMatrix);
    this.translate(crystalMatrix, 0, 0, 0.14);
    drawPart(this.parts.crystal, crystalMatrix, 4);
  }

  // --- 4x4 Matrix Utilities ---
  createIdentity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  createPerspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }

  createLookAt(eye, center, up) {
    const z0 = eye[0] - center[0], z1 = eye[1] - center[1], z2 = eye[2] - center[2];
    const lenZ = 1 / Math.hypot(z0, z1, z2);
    const zx = z0 * lenZ, zy = z1 * lenZ, zz = z2 * lenZ;

    const x0 = up[1] * zz - up[2] * zy, x1 = up[2] * zx - up[0] * zz, x2 = up[0] * zy - up[1] * zx;
    const lenX = 1 / Math.hypot(x0, x1, x2);
    const xx = x0 * lenX, xy = x1 * lenX, xz = x2 * lenX;

    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;

    return new Float32Array([
      xx, yx, zx, 0,
      xy, yy, zy, 0,
      xz, yz, zz, 0,
      -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
      -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
      -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
      1
    ]);
  }

  createNormalMatrix(m) {
    return new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]);
  }

  translate(m, tx, ty, tz) {
    m[12] += m[0] * tx + m[4] * ty + m[8] * tz;
    m[13] += m[1] * tx + m[5] * ty + m[9] * tz;
    m[14] += m[2] * tx + m[6] * ty + m[10] * tz;
    m[15] += m[3] * tx + m[7] * ty + m[11] * tz;
  }

  rotateX(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m1 = m[1], m5 = m[5], m9 = m[9], m13 = m[13];
    const m2 = m[2], m6 = m[6], m10 = m[10], m14 = m[14];
    m[1] = m1 * c + m2 * s;
    m[5] = m5 * c + m6 * s;
    m[9] = m9 * c + m10 * s;
    m[13] = m13 * c + m14 * s;
    m[2] = m2 * c - m1 * s;
    m[6] = m6 * c - m5 * s;
    m[10] = m10 * c - m9 * s;
    m[14] = m14 * c - m13 * s;
  }

  rotateY(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m4 = m[4], m8 = m[8], m12 = m[12];
    const m2 = m[2], m6 = m[6], m10 = m[10], m14 = m[14];
    m[0] = m0 * c - m2 * s;
    m[4] = m4 * c - m6 * s;
    m[8] = m8 * c - m10 * s;
    m[12] = m12 * c - m14 * s;
    m[2] = m0 * s + m2 * c;
    m[6] = m4 * s + m6 * c;
    m[10] = m8 * s + m10 * c;
    m[14] = m12 * s + m14 * c;
  }

  rotateZ(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m4 = m[4], m8 = m[8], m12 = m[12];
    const m1 = m[1], m5 = m[5], m9 = m[9], m13 = m[13];
    m[0] = m0 * c + m1 * s;
    m[4] = m4 * c + m5 * s;
    m[8] = m8 * c + m9 * s;
    m[12] = m12 * c + m13 * s;
    m[1] = m1 * c - m0 * s;
    m[5] = m5 * c - m4 * s;
    m[9] = m9 * c - m8 * s;
    m[13] = m13 * c - m12 * s;
  }
}
