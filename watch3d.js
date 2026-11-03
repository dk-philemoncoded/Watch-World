/**
 * 3D Wristwatch WebGL Engine - PHILL
 * Renders an ultra-luxurious, fully buckled 3D mechanical timepiece in real-time.
 * 
 * Features:
 * - Fully Buckled 3D Leather Strap: Continuous closed anatomical loop with thickness,
 *   edge stitching, adjustment pinholes, and strap tail
 * - 3D Clasp & Buckle Assembly: 3D polished buckle frame, crossbar, articulated prong pin,
 *   fixed keeper, and floating keeper loop
 * - Rolex 1908 Case Architecture: Outer coin-edge fluted bezel (72 facets), inner mirror-polished ring,
 *   sculpted case lugs, knurled crown at 3 o'clock, and brushed exhibition caseback
 * - Live Dial Projection: Active 2D Swiss dial texture projected onto the 3D dial face
 *   (hands spin, settle, and tick dead-beat in real-time 3D!)
 * - Dome Sapphire Crystal: Dynamic specular sheen and Fresnel lighting
 * - Interactive 3D Orbit Controls: Drag to inspect full 360-degree rotation (front, sides, back buckle), scroll to zoom
 * - Cinematic Spin & Settling Animation on location search
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

    // 3D Orientation & Camera (Initial elegant beauty angle showing face + 3D volume + buckle)
    this.rotation = { x: -0.16, y: 0.32, z: 0 };
    this.targetRotation = { x: -0.16, y: 0.32, z: 0 };
    this.cameraDistance = this.startDist;
        this.targetDistance = this.startDist;
    this.minDistance = 2.4;
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
    this.startDist = 4.1;
    this.endDist = 4.1;
    this.onSpinComplete = null;

    // Precious metal finish: 'gold' (default) | 'rose-gold' | 'white-gold' | 'platinum'
    this.finish = "gold";

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

      uniform int uMaterial; // 0=Dial, 1=Case/Lugs, 2=Bezel, 3=Strap, 4=Crystal, 5=Crown, 6=Buckle/Clasp, 7=CaseBack
      uniform sampler2D uDialTexture;
      uniform vec3 uBaseColor;
      uniform vec3 uSpecColor;
      uniform vec3 uCameraPos;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPos - vWorldPos);

        // Key Light (Top-right front)
        vec3 lightDir1 = normalize(vec3(0.55, 0.75, 0.95));
        // Fill Light (Bottom-left front)
        vec3 lightDir2 = normalize(vec3(-0.60, -0.40, 0.50));
        // Back/Rim Light (Illuminates buckle & caseback from behind)
        vec3 lightDir3 = normalize(vec3(0.0, 0.2, -1.0));

        float diff1 = max(dot(normal, lightDir1), 0.0);
        float diff2 = max(dot(normal, lightDir2), 0.0) * 0.45;
        float diff3 = max(dot(normal, lightDir3), 0.0) * 0.55;
        float diffuse = diff1 + diff2 + diff3;

        // Specular
        vec3 halfDir1 = normalize(lightDir1 + viewDir);
        vec3 halfDir3 = normalize(lightDir3 + viewDir);
        float spec1 = pow(max(dot(normal, halfDir1), 0.0), 36.0);
        float spec3 = pow(max(dot(normal, halfDir3), 0.0), 32.0);

        // 0. Live Dial Face Texture
        if (uMaterial == 0) {
          vec4 dialColor = texture2D(uDialTexture, vTexCoord);
          vec3 litDial = dialColor.rgb * (0.82 + diffuse * 0.28) + vec3(1.0) * spec1 * 0.12;
          gl_FragColor = vec4(litDial, dialColor.a);
          return;
        }

        // 1. Metal Case Body & Lugs (Polished luxury metal)
        if (uMaterial == 1) {
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.2);
          float specTotal = spec1 * 1.1 + spec3 * 0.8;
          vec3 metalCol = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * (specTotal + fresnel * 0.35);
          gl_FragColor = vec4(metalCol, 1.0);
          return;
        }

        // 2. Bezel (Fluted coin-edge with bright specular glints)
        if (uMaterial == 2) {
          float flutedSpec = pow(max(dot(normal, halfDir1), 0.0), 48.0) * 1.5;
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
          vec3 bezelCol = uBaseColor * (0.38 + diffuse * 0.62) + uSpecColor * (flutedSpec + fresnel * 0.4);
          gl_FragColor = vec4(bezelCol, 1.0);
          return;
        }

        // 3. Leather Straps & Keepers (Alligator grain, edge stitching, warm texture)
        if (uMaterial == 3) {
          vec3 strapCol = uBaseColor * (0.38 + diffuse * 0.62);
          // Tone-on-tone edge stitch line highlighting
          float edgeDist = abs(vTexCoord.x - 0.5);
          if (abs(edgeDist - 0.40) < 0.02) {
            strapCol += uBaseColor * 0.45;
          }
          // Subtle leather sheen
          float leatherSheen = pow(max(dot(normal, halfDir1), 0.0), 12.0) * 0.15;
          gl_FragColor = vec4(strapCol + uSpecColor * leatherSheen, 1.0);
          return;
        }

        // 4. Sapphire Crystal Dome Lens
        if (uMaterial == 4) {
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
          float flare = pow(max(dot(normal, halfDir1), 0.0), 64.0);
          vec3 glassCol = vec3(0.85, 0.95, 1.0) * (flare * 1.4 + fresnel * 0.55);
          float alpha = 0.08 + fresnel * 0.28 + flare * 0.45;
          gl_FragColor = vec4(glassCol, alpha);
          return;
        }

        // 5. Crown (Knurled grip facets)
        if (uMaterial == 5) {
          float crownSpec = pow(max(dot(normal, halfDir1), 0.0), 28.0) * 1.2;
          vec3 crownCol = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * crownSpec;
          gl_FragColor = vec4(crownCol, 1.0);
          return;
        }

        // 6. Buckle & Clasp Assembly (Mirror-polished gold/steel)
        if (uMaterial == 6) {
          float buckleSpec = (spec1 * 1.2 + spec3 * 1.4);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
          vec3 buckleCol = uBaseColor * (0.40 + diffuse * 0.60) + uSpecColor * (buckleSpec + fresnel * 0.45);
          gl_FragColor = vec4(buckleCol, 1.0);
          return;
        }

        // 7. Case Back (Brushed metal with circular radial sheen)
        if (uMaterial == 7) {
          float radialSheen = pow(max(dot(normal, halfDir3), 0.0), 24.0) * 0.8;
          vec3 backCol = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * radialSheen;
          gl_FragColor = vec4(backCol, 1.0);
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
      bezel: this.createFlutedBezelGeometry(1.0, 1.15, 0.08, 72),
      caseBody: this.createCylinderGeometry(1.15, 0.22, 48),
      caseBack: this.createCaseBackGeometry(1.10, 0.04, 48),
      lugs: this.createLugsGeometry(),
      crown: this.createCrownGeometry(0.12, 0.15, 24),
      // Buckled Straps
      strapTop: this.createTopBuckledStrap(),
      strapBottom: this.createBottomBuckledStrap(),
      strapTail: this.createStrapTail(),
      // 3D Buckle & Clasp Assembly
      buckleFrame: this.createBuckleFrameGeometry(),
      buckleBar: this.createCylinderAlongX(0.024, 0.74, 16),
      buckleProng: this.createBuckleProngGeometry(),
      keepers: this.createKeepersGeometry()
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

  // =========================================================================
  // 3D Procedural Horological Geometry Generators
  // =========================================================================

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

  createCaseBackGeometry(radius, depth, segments) {
    const vertices = [0, 0, -depth];
    const normals = [0, 0, -1];
    const texCoords = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      vertices.push(x, y, 0);
      normals.push(0, 0, -1);
      texCoords.push(0.5 + Math.cos(theta) * 0.5, 0.5 + Math.sin(theta) * 0.5);

      if (i > 0) {
        indices.push(0, i + 1, i);
      }
    }
    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createFlutedBezelGeometry(innerR, outerR, depth, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const u = i / segments;

      // Outer coin-edge flute facet angle
      const fluteRipple = Math.sin(theta * 36) * 0.03;
      const rOuter = outerR + fluteRipple;

      // Inner top
      vertices.push(cos * innerR, sin * innerR, depth);
      normals.push(cos * 0.4, sin * 0.4, 0.9);
      texCoords.push(u, 0);

      // Outer fluted top
      vertices.push(cos * rOuter, sin * rOuter, 0);
      normals.push(cos * 0.8 + Math.cos(theta * 36) * 0.2, sin * 0.8 + Math.sin(theta * 36) * 0.2, 0.4);
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

    // Cylinder along X-axis at 3 o'clock with knurled notches
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const notch = Math.sin(theta * 12) * 0.015;
      const r = radius + notch;

      const y = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
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

  createCylinderAlongX(radius, length, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const halfL = length / 2;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const y = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const u = i / segments;

      vertices.push(-halfL, y, z);
      normals.push(0, Math.cos(theta), Math.sin(theta));
      texCoords.push(u, 0);

      vertices.push(halfL, y, z);
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

  // =========================================================================
  // Fully Buckled Strap Architecture (Closed Anatomical Wrist Loop)
  // =========================================================================

  /**
   * Helper: Builds a 3D volumetric strap ribbon along a 2D spline in Y-Z plane.
   * Generates outer leather surface, inner lining, and beveled side edges.
   */
  buildVolumetricStrap(pathPoints, startWidth, endWidth, thickness = 0.055) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const numPoints = pathPoints.length;
    const halfThick = thickness / 2;

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const curr = pathPoints[i];

      // Tangent vector
      let ty, tz;
      if (i === 0) {
        ty = pathPoints[1].y - curr.y;
        tz = pathPoints[1].z - curr.z;
      } else if (i === numPoints - 1) {
        ty = curr.y - pathPoints[i - 1].y;
        tz = curr.z - pathPoints[i - 1].z;
      } else {
        ty = pathPoints[i + 1].y - pathPoints[i - 1].y;
        tz = pathPoints[i + 1].z - pathPoints[i - 1].z;
      }
      const tLen = Math.hypot(ty, tz) || 1;
      ty /= tLen;
      tz /= tLen;

      // Normal pointing outward from wrist loop (T x (1,0,0) = (0, -tz, ty))
      const ny = -tz;
      const nz = ty;

      const w = startWidth + (endWidth - startWidth) * t;
      const halfW = w / 2;

      // 4 Vertices per cross-section:
      // 0: Outer-Left, 1: Outer-Right, 2: Inner-Right, 3: Inner-Left
      const outY = curr.y + ny * halfThick;
      const outZ = curr.z + nz * halfThick;
      const inY = curr.y - ny * halfThick;
      const inZ = curr.z - nz * halfThick;

      // 0. Outer Left
      vertices.push(-halfW, outY, outZ);
      normals.push(0, ny, nz);
      texCoords.push(0, t);

      // 1. Outer Right
      vertices.push(halfW, outY, outZ);
      normals.push(0, ny, nz);
      texCoords.push(1, t);

      // 2. Inner Right
      vertices.push(halfW, inY, inZ);
      normals.push(0, -ny, -nz);
      texCoords.push(1, t);

      // 3. Inner Left
      vertices.push(-halfW, inY, inZ);
      normals.push(0, -ny, -nz);
      texCoords.push(0, t);
    }

    for (let i = 0; i < numPoints - 1; i++) {
      const b1 = i * 4;
      const b2 = (i + 1) * 4;

      // Top/Outer Face (0, 1)
      indices.push(b1 + 0, b1 + 1, b2 + 1);
      indices.push(b1 + 0, b2 + 1, b2 + 0);

      // Bottom/Inner Face (2, 3)
      indices.push(b1 + 2, b1 + 3, b2 + 3);
      indices.push(b1 + 2, b2 + 3, b2 + 2);

      // Right Edge (1, 2)
      indices.push(b1 + 1, b1 + 2, b2 + 2);
      indices.push(b1 + 1, b2 + 2, b2 + 1);

      // Left Edge (3, 0)
      indices.push(b1 + 3, b1 + 0, b2 + 0);
      indices.push(b1 + 3, b2 + 0, b2 + 3);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // 1. Top Strap: Curves from Top Lugs (Y=+1.18, Z=-0.05) to Buckle Crossbar (Y=+0.12, Z=-1.36)
  createTopBuckledStrap() {
    const points = [];
    const segments = 24;

    // Cubic Bezier control points
    const p0 = { y: 1.18, z: -0.05 };
    const p1 = { y: 1.82, z: -0.16 };
    const p2 = { y: 1.88, z: -1.34 };
    const p3 = { y: 0.12, z: -1.36 };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const it = 1 - t;

      const y = it * it * it * p0.y + 3 * it * it * t * p1.y + 3 * it * t * t * p2.y + t * t * t * p3.y;
      const z = it * it * it * p0.z + 3 * it * it * t * p1.z + 3 * it * t * t * p2.z + t * t * t * p3.z;
      points.push({ y, z });
    }

    return this.buildVolumetricStrap(points, 0.88, 0.78, 0.055);
  }

  // 2. Bottom Strap: Curves from Bottom Lugs (Y=-1.18, Z=-0.05) to Buckle Entrance (Y=-0.08, Z=-1.32)
  createBottomBuckledStrap() {
    const points = [];
    const segments = 24;

    // Cubic Bezier control points
    const p0 = { y: -1.18, z: -0.05 };
    const p1 = { y: -1.82, z: -0.16 };
    const p2 = { y: -1.88, z: -1.32 };
    const p3 = { y: -0.08, z: -1.32 };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const it = 1 - t;

      const y = it * it * it * p0.y + 3 * it * it * t * p1.y + 3 * it * t * t * p2.y + t * t * t * p3.y;
      const z = it * it * it * p0.z + 3 * it * it * t * p1.z + 3 * it * t * t * p2.z + t * t * t * p3.z;
      points.push({ y, z });
    }

    return this.buildVolumetricStrap(points, 0.88, 0.76, 0.055);
  }

  // 3. Strap Tail: Passes through buckle and slips through keepers (Y=-0.08 to Y=+0.52)
  createStrapTail() {
    const points = [];
    const segments = 12;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -0.08 + t * 0.60;
      const z = -1.32 - Math.pow(t, 2) * 0.04;
      points.push({ y, z });
    }

    return this.buildVolumetricStrap(points, 0.76, 0.70, 0.048);
  }

  // 4. 3D Buckle Frame (Beveled rectangular ring around the clasp)
  createBuckleFrameGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Outer & inner dimensions
    const xOuter = 0.44, xInner = 0.37;
    const yMin = 0.00, yMax = 0.26;
    const yInMin = 0.05, yInMax = 0.22;
    const zMin = -1.41, zMax = -1.33;

    // Build 4 rectangular bars forming the buckle ring
    const addBox = (minX, maxX, minY, maxY, minZ, maxZ) => {
      const bIdx = vertices.length / 3;
      // Front face (+Z)
      vertices.push(
        minX, minY, maxZ, maxX, minY, maxZ, maxX, maxY, maxZ, minX, maxY, maxZ,
        // Back face (-Z)
        minX, minY, minZ, minX, maxY, minZ, maxX, maxY, minZ, maxX, minY, minZ,
        // Top face (+Y)
        minX, maxY, minZ, minX, maxY, maxZ, maxX, maxY, maxZ, maxX, maxY, minZ,
        // Bottom face (-Y)
        minX, minY, minZ, maxX, minY, minZ, maxX, minY, maxZ, minX, minY, maxZ,
        // Right face (+X)
        maxX, minY, minZ, maxX, maxY, minZ, maxX, maxY, maxZ, maxX, minY, maxZ,
        // Left face (-X)
        minX, minY, minZ, minX, minY, maxZ, minX, maxY, maxZ, minX, maxY, minZ
      );

      normals.push(
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
      );

      for (let f = 0; f < 6; f++) {
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        const fIdx = bIdx + f * 4;
        indices.push(fIdx, fIdx + 1, fIdx + 2, fIdx, fIdx + 2, fIdx + 3);
      }
    };

    // Left Bar
    addBox(-xOuter, -xInner, yMin, yMax, zMin, zMax);
    // Right Bar
    addBox(xInner, xOuter, yMin, yMax, zMin, zMax);
    // Top Bar (with subtle center prong notch)
    addBox(-xInner, xInner, yInMax, yMax, zMin, zMax);
    // Bottom Bar
    addBox(-xInner, xInner, yMin, yInMin, zMin, zMax);

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // 5. 3D Buckle Prong / Tongue Pin
  createBuckleProngGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Slender needle pin anchored at crossbar (y=0.02, z=-1.36) resting on top notch (y=0.26, z=-1.33)
    const pinR = 0.016;
    const segments = 10;
    const steps = 6;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const y = 0.02 + t * 0.24;
      // Arch slightly over the strap
      const z = -1.36 + Math.sin(t * Math.PI) * 0.06;

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const px = Math.cos(theta) * pinR;
        const pz = z + Math.sin(theta) * pinR;

        vertices.push(px, y, pz);
        normals.push(Math.cos(theta), 0.2, Math.sin(theta));
        texCoords.push(i / segments, t);
      }
    }

    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < segments; i++) {
        const curr = s * (segments + 1) + i;
        const next = curr + (segments + 1);

        indices.push(curr, curr + 1, next + 1);
        indices.push(curr, next + 1, next);
      }
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // 6. Leather Keepers (Loops holding the strap tail)
  createKeepersGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Two loops: Loop 1 at Y = -0.02, Loop 2 at Y = +0.32
    const keeperYPositions = [-0.02, 0.32];
    const loopW = 0.82, loopH = 0.12, thick = 0.025;
    const lenY = 0.06;

    let baseIdx = 0;
    keeperYPositions.forEach(kY => {
      const minX = -loopW / 2, maxX = loopW / 2;
      const minZ = -1.40, maxZ = -1.27;

      // Outer Box minus inner hollow
      // For clean rendering, build a solid loop collar
      const addLoopBox = (x1, x2, y1, y2, z1, z2) => {
        const b = baseIdx;
        vertices.push(
          x1, y1, z2, x2, y1, z2, x2, y2, z2, x1, y2, z2,
          x1, y1, z1, x1, y2, z1, x2, y2, z1, x2, y1, z1,
          x1, y2, z1, x1, y2, z2, x2, y2, z2, x2, y2, z1,
          x1, y1, z1, x2, y1, z1, x2, y1, z2, x1, y1, z2,
          x2, y1, z1, x2, y2, z1, x2, y2, z2, x2, y1, z2,
          x1, y1, z1, x1, y1, z2, x1, y2, z2, x1, y2, z1
        );
        normals.push(
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
          0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
          0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
          -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        );
        for (let f = 0; f < 6; f++) {
          texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
          const fIdx = b + f * 4;
          indices.push(fIdx, fIdx + 1, fIdx + 2, fIdx, fIdx + 2, fIdx + 3);
        }
        baseIdx += 24;
      };

      // Top outer band
      addLoopBox(minX, maxX, kY - lenY / 2, kY + lenY / 2, maxZ - thick, maxZ);
      // Bottom inner band
      addLoopBox(minX, maxX, kY - lenY / 2, kY + lenY / 2, minZ, minZ + thick);
      // Left side
      addLoopBox(minX, minX + thick, kY - lenY / 2, kY + lenY / 2, minZ, maxZ);
      // Right side
      addLoopBox(maxX - thick, maxX, kY - lenY / 2, kY + lenY / 2, minZ, maxZ);
    });

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // =========================================================================
  // Interaction & Camera Controls
  // =========================================================================

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

      // Unconstrained yaw allows inspecting the buckled back completely in 360 degrees!
      this.targetRotation.y += dx * 0.009;
      this.targetRotation.x += dy * 0.009;

      // Constrain tilt to prevent disorientation
      this.targetRotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.targetRotation.x));
      this.lastMouse = { x, y };
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Return smoothly to beauty angle after 5 seconds of inactivity
      this.idleTimer = setTimeout(() => {
        if (!this.isSpinning) {
          this.targetRotation = { x: -0.16, y: 0.32, z: 0 };
          this.autoIdle = true;
        }
      }, 5000);
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

    if (this.canvas.width !== Math.round(width * dpr) || this.canvas.height !== Math.round(height * dpr)) {
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * 3D Wristwatch full-screen tumble & spin animation when a location is searched!
   */
  spinToLocation(timeInfo, onComplete) {
    this.isSpinning = true;
    this.autoIdle = false;
    this.spinStartTime = performance.now();
    this.spinDuration = 2200; // ms
    this.onSpinComplete = onComplete;

    this.startRot = { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z };
    // 3 full 360-degree spins along Y (yaw) plus dynamic roll along X/Z
    this.endRot = {
      x: -0.16,
      y: this.rotation.y + Math.PI * 6,
      z: 0
    };

    this.startDist = this.cameraDistance;
    this.endDist = this.cameraDistance; // Equal size throughout spinning and at completion

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
      this.rotation.x = this.startRot.x + (this.endRot.x - this.startRot.x) * ease + Math.sin(progress * Math.PI) * 0.35;
      this.rotation.z = Math.sin(progress * Math.PI * 2) * 0.12;

      this.cameraDistance = this.startDist + (this.endDist - this.startDist) * ease;

      if (progress >= 1.0) {
        this.isSpinning = false;
        this.rotation.x = -0.16;
        this.rotation.y = 0.32;
        this.rotation.z = 0;
        this.targetRotation = { x: -0.16, y: 0.32, z: 0 };
        this.cameraDistance = this.startDist;
        this.targetDistance = this.startDist;

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
      // Gentle idle wrist sway when untouched
      if (this.autoIdle && !this.isDragging) {
        const time = now * 0.0012;
        this.targetRotation.y = 0.32 + Math.sin(time) * 0.15;
        this.targetRotation.x = -0.16 + Math.cos(time * 0.8) * 0.06;
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

    gl.uniformMatrix4fv(this.locations.uProjection, false, projMatrix);
    gl.uniformMatrix4fv(this.locations.uView, false, viewMatrix);
    gl.uniform3f(this.locations.uCameraPos, 0, 0, this.cameraDistance);

    // Color definitions based on chosen finish
    const metalColors = {
      gold: { base: [0.94, 0.76, 0.38], spec: [1.0, 0.96, 0.75] },
      "rose-gold": { base: [0.90, 0.62, 0.48], spec: [1.0, 0.88, 0.78] },
      "white-gold": { base: [0.86, 0.88, 0.92], spec: [1.0, 1.0, 1.0] },
      platinum: { base: [0.90, 0.92, 0.96], spec: [1.0, 1.0, 1.0] }
    };
    const strapColors = {
      gold: [0.20, 0.11, 0.07],       // Rich chestnut alligator leather
      "rose-gold": [0.24, 0.13, 0.08], // Warm cognac alligator leather
      "white-gold": [0.07, 0.07, 0.08],// Midnight black alligator leather
      platinum: [0.09, 0.10, 0.13]     // Slate-navy alligator leather
    };

    const finishColor = metalColors[this.finish] || metalColors.gold;
    const strapCol = strapColors[this.finish] || strapColors.gold;

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

    // 1. Draw Buckled Leather Straps (Top arch, Bottom arch, and Buckled Tail)
    drawPart(this.parts.strapTop, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);
    drawPart(this.parts.strapBottom, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);
    drawPart(this.parts.strapTail, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);
    drawPart(this.parts.keepers, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);

    // 2. Draw Buckle Clasp Assembly at the back (Frame, Crossbar, and Tongue Pin)
    drawPart(this.parts.buckleFrame, modelMatrix, 6);
    const barMatrix = new Float32Array(modelMatrix);
    this.translate(barMatrix, 0, 0.02, -1.36);
    drawPart(this.parts.buckleBar, barMatrix, 6);
    drawPart(this.parts.buckleProng, modelMatrix, 6);

    // 3. Draw Lugs (4 sculpted horns)
    drawPart(this.parts.lugs, modelMatrix, 1);

    // 4. Draw Main Case Body
    drawPart(this.parts.caseBody, modelMatrix, 1);

    // 5. Draw Brushed Case Back
    const backMatrix = new Float32Array(modelMatrix);
    this.translate(backMatrix, 0, 0, -0.11);
    drawPart(this.parts.caseBack, backMatrix, 7);

    // 6. Draw Winding Crown at 3 o'clock
    const crownMatrix = new Float32Array(modelMatrix);
    this.translate(crownMatrix, 1.15, 0, 0);
    drawPart(this.parts.crown, crownMatrix, 5);

    // 7. Draw Fluted Coin-Edge Bezel
    const bezelMatrix = new Float32Array(modelMatrix);
    this.translate(bezelMatrix, 0, 0, 0.11);
    drawPart(this.parts.bezel, bezelMatrix, 2);

    // 8. Draw Live Watch Dial Face
    const dialMatrix = new Float32Array(modelMatrix);
    this.translate(dialMatrix, 0, 0, 0.12);
    drawPart(this.parts.dial, dialMatrix, 0);

    // 9. Draw Dome Sapphire Crystal with specular sheen
    const crystalMatrix = new Float32Array(modelMatrix);
    this.translate(crystalMatrix, 0, 0, 0.14);
    drawPart(this.parts.crystal, crystalMatrix, 4);
  }

  // =========================================================================
  // 4x4 Matrix Utilities
  // =========================================================================

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
    const lenY = 1 / Math.hypot(yx, yy, yz);

    return new Float32Array([
      xx, yx * lenY, zx, 0,
      xy, yy * lenY, zy, 0,
      xz, yz * lenY, zz, 0,
      -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
      -(yx * lenY * eye[0] + yy * lenY * eye[1] + yz * lenY * eye[2]),
      -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
      1
    ]);
  }

  rotateX(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m1 = m[4], m2 = m[5], m3 = m[6], m4 = m[7];
    const m5 = m[8], m6 = m[9], m7 = m[10], m8 = m[11];
    m[4] = m1 * c + m5 * s;
    m[5] = m2 * c + m6 * s;
    m[6] = m3 * c + m7 * s;
    m[7] = m4 * c + m8 * s;
    m[8] = m5 * c - m1 * s;
    m[9] = m6 * c - m2 * s;
    m[10] = m7 * c - m3 * s;
    m[11] = m8 * c - m4 * s;
  }

  rotateY(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
    const m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11];
    m[0] = m0 * c - m8 * s;
    m[1] = m1 * c - m9 * s;
    m[2] = m2 * c - m10 * s;
    m[3] = m3 * c - m11 * s;
    m[8] = m0 * s + m8 * c;
    m[9] = m1 * s + m9 * c;
    m[10] = m2 * s + m10 * c;
    m[11] = m3 * s + m11 * c;
  }

  rotateZ(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
    const m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7];
    m[0] = m0 * c + m4 * s;
    m[1] = m1 * c + m5 * s;
    m[2] = m2 * c + m6 * s;
    m[3] = m3 * c + m7 * s;
    m[4] = m4 * c - m0 * s;
    m[5] = m5 * c - m1 * s;
    m[6] = m6 * c - m2 * s;
    m[7] = m7 * c - m3 * s;
  }

  translate(m, x, y, z) {
    m[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    m[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    m[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    m[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  }

  createNormalMatrix(m) {
    // 3x3 normal matrix from top-left 3x3 of 4x4 matrix
    const a00 = m[0], a01 = m[1], a02 = m[2];
    const a10 = m[4], a11 = m[5], a12 = m[6];
    const a20 = m[8], a21 = m[9], a22 = m[10];

    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    const det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    const invDet = 1.0 / det;
    return new Float32Array([
      b01 * invDet,
      (-a22 * a01 + a02 * a21) * invDet,
      (a12 * a01 - a02 * a11) * invDet,
      b11 * invDet,
      (a22 * a00 - a02 * a20) * invDet,
      (-a12 * a00 + a02 * a10) * invDet,
      b21 * invDet,
      (-a21 * a00 + a01 * a20) * invDet,
      (a11 * a00 - a01 * a10) * invDet
    ]);
  }
}
