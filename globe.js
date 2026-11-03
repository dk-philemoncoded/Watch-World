/**
 * WebGL 3D Interactive Earth Engine
 * Features:
 * - High-precision 3D sphere geometry with UV mapping
 * - Day/Night dynamic lighting with procedural Earth textures
 * - Ocean specular reflections & luminous city night lights
 * - Atmospheric Fresnel rim glow
 * - 3D Beacon with pulsating radar wave and destination pin
 * - Smooth cinematic camera fly-to and slerp rotation
 * - Raycasted mouse/touch click detection to select ANY location on Earth
 */

import { createEarthTextures } from "./earth-map.js";

export class GlobeEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl", { antialias: true, alpha: true }) ||
              canvas.getContext("experimental-webgl", { antialias: true, alpha: true });

    if (!this.gl) {
      console.error("WebGL not supported on this browser.");
      return;
    }

    // Camera & Rotation State (Full globe framing with atmosphere)
    this.targetRotation = { x: 0.35, y: -0.8 }; // Pitch (lat), Yaw (lng)
    this.currentRotation = { x: 0.35, y: -0.8 };
    this.cameraDistance = 3.2;
    this.targetDistance = 3.2;
    this.minDistance = 1.35; // Close zoom for city inspection
    this.maxDistance = 4.5;

    // Pin & Marker
    this.activePin = null; // { lat, lng, name, country }
    this.radarPulse = 0;

    // Interaction State
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.angularVelocity = { x: 0, y: 0.0015 }; // Idle auto-spin
    this.idleSpin = true;

    // Animation / Cinematic State
    this.isAnimating = false;
    this.animStartTime = 0;
    this.animDuration = 2200; // ms
    this.startRot = { x: 0, y: 0 };
    this.endRot = { x: 0, y: 0 };
    this.startDist = 2.8;
    this.endDist = 1.5;
    this.onArrivalCallback = null;

    // Callback for when user clicks somewhere on the globe
    this.onLocationSelected = null;

    this.initWebGL();
    this.bindEvents();
    this.resize();
    this.render();
  }

  initWebGL() {
    const gl = this.gl;

    // Shaders
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

      uniform sampler2D uDayTexture;
      uniform sampler2D uNightTexture;
      uniform vec3 uSunDirection;
      uniform vec3 uCameraPos;

      // Pin overlay
      uniform vec3 uPinWorldPos;
      uniform float uPinActive;
      uniform float uPulseTime;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);
        vec3 viewDir = normalize(uCameraPos - vWorldPos);

        // Diffuse light from sun
        float nDotL = dot(normal, sunDir);
        float dayFactor = smoothstep(-0.15, 0.25, nDotL);

        // Textures
        vec4 dayColor = texture2D(uDayTexture, vTexCoord);
        vec4 nightColor = texture2D(uNightTexture, vTexCoord);

        // Night lights glow intensely on the night side
        vec4 surfaceColor = mix(nightColor * 1.5, dayColor, dayFactor);

        // Ocean specular sun glint
        vec3 halfDir = normalize(sunDir + viewDir);
        float specFactor = pow(max(dot(normal, halfDir), 0.0), 32.0);
        // Only glint over darker ocean pixels
        if (dayColor.b > dayColor.g * 1.15 && dayFactor > 0.1) {
          surfaceColor.rgb += vec3(0.9, 0.95, 1.0) * specFactor * 0.7 * dayFactor;
        }

        // Atmospheric Fresnel Rim Glow (Ethereal sapphire halo)
        float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
        fresnel = pow(fresnel, 3.2);
        vec3 atmosphereColor = vec3(0.25, 0.65, 1.0) * fresnel * 1.4;

        vec3 finalColor = surfaceColor.rgb + atmosphereColor;

        // Pin Radar Ping on globe surface
        if (uPinActive > 0.5) {
          float distToPin = length(vWorldPos - uPinWorldPos);
          
          // Core pin light
          if (distToPin < 0.045) {
            float coreGlow = 1.0 - distToPin / 0.045;
            finalColor += vec3(1.0, 0.35, 0.2) * coreGlow * 2.5;
          }

          // Expanding radar waves
          float wave1 = fract(uPulseTime * 1.2);
          float ringDist1 = wave1 * 0.22;
          float ringWidth = 0.015;
          if (abs(distToPin - ringDist1) < ringWidth) {
            float ringAlpha = (1.0 - wave1) * 1.2;
            finalColor += vec3(0.2, 0.85, 1.0) * ringAlpha;
          }

          float wave2 = fract(uPulseTime * 1.2 + 0.5);
          float ringDist2 = wave2 * 0.22;
          if (abs(distToPin - ringDist2) < ringWidth) {
            float ringAlpha2 = (1.0 - wave2) * 0.8;
            finalColor += vec3(0.3, 0.7, 1.0) * ringAlpha2;
          }
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.program = this.createShaderProgram(gl, vsSource, fsSource);

    // Uniform and Attribute locations
    this.locations = {
      aPosition: gl.getAttribLocation(this.program, "aPosition"),
      aNormal: gl.getAttribLocation(this.program, "aNormal"),
      aTexCoord: gl.getAttribLocation(this.program, "aTexCoord"),
      uModel: gl.getUniformLocation(this.program, "uModel"),
      uView: gl.getUniformLocation(this.program, "uView"),
      uProjection: gl.getUniformLocation(this.program, "uProjection"),
      uNormalMatrix: gl.getUniformLocation(this.program, "uNormalMatrix"),
      uDayTexture: gl.getUniformLocation(this.program, "uDayTexture"),
      uNightTexture: gl.getUniformLocation(this.program, "uNightTexture"),
      uSunDirection: gl.getUniformLocation(this.program, "uSunDirection"),
      uCameraPos: gl.getUniformLocation(this.program, "uCameraPos"),
      uPinWorldPos: gl.getUniformLocation(this.program, "uPinWorldPos"),
      uPinActive: gl.getUniformLocation(this.program, "uPinActive"),
      uPulseTime: gl.getUniformLocation(this.program, "uPulseTime")
    };

    // Generate 3D Sphere geometry (Radius 1.0)
    const { vertices, normals, texCoords, indices } = this.createSphere(1.0, 54, 54);

    this.buffers = {
      vertex: this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertices)),
      normal: this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(normals)),
      texCoord: this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(texCoords)),
      index: this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
      indexCount: indices.length
    };

    // Generate Earth textures
    const { dayCanvas, nightCanvas } = createEarthTextures(2048, 1024);
    this.dayTexture = this.createTexture(gl, dayCanvas);
    this.nightTexture = this.createTexture(gl, nightCanvas);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  createShaderProgram(gl, vsSource, fsSource) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("VS compile error:", gl.getShaderInfoLog(vs));
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("FS compile error:", gl.getShaderInfoLog(fs));
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Shader link error:", gl.getProgramInfoLog(prog));
    }
    return prog;
  }

  createBuffer(gl, type, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(type, buf);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buf;
  }

  createTexture(gl, source) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  createSphere(radius, latSegments, lngSegments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    for (let i = 0; i <= latSegments; i++) {
      const v = i / latSegments;
      const lat = 90 - v * 180; // +90 to -90
      const latRad = lat * (Math.PI / 180);
      const cosLat = Math.cos(latRad);
      const sinLat = Math.sin(latRad);

      for (let j = 0; j <= lngSegments; j++) {
        const u = j / lngSegments;
        const lng = -180 + u * 360; // -180 to +180
        const lngRad = lng * (Math.PI / 180);
        const cosLng = Math.cos(lngRad);
        const sinLng = Math.sin(lngRad);

        const nx = cosLat * sinLng;
        const ny = sinLat;
        const nz = cosLat * cosLng;

        vertices.push(radius * nx, radius * ny, radius * nz);
        normals.push(nx, ny, nz);
        texCoords.push(u, v);
      }
    }

    for (let i = 0; i < latSegments; i++) {
      for (let j = 0; j < lngSegments; j++) {
        const first = i * (lngSegments + 1) + j;
        const second = first + lngSegments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return { vertices, normals, texCoords, indices };
  }

  bindEvents() {
    const canvas = this.canvas;

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.idleSpin = false;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      this.lastMouse = { x, y };
      this.dragDistance = 0;
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);

      const dx = x - this.lastMouse.x;
      const dy = y - this.lastMouse.y;
      this.dragDistance += Math.abs(dx) + Math.abs(dy);

      // Sensitivity scaled by distance
      const factor = (this.cameraDistance / 2.8) * 0.0055;
      this.targetRotation.y += dx * factor;
      this.targetRotation.x += dy * factor;

      // Constrain pitch to avoid flipping over poles
      this.targetRotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.targetRotation.x));

      this.angularVelocity = { x: dy * factor * 0.5, y: dx * factor * 0.5 };
      this.lastMouse = { x, y };
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // If it was a quick tap/click without dragging, pick location on globe!
      if (this.dragDistance < 6) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        this.handleClickLocation(clientX - rect.left, clientY - rect.top, rect.width, rect.height);
      } else {
        // Resume gentle inertia
        setTimeout(() => {
          if (!this.isDragging && !this.isAnimating) {
            this.idleSpin = true;
          }
        }, 3000);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      this.idleSpin = false;
      const delta = e.deltaY * 0.0018;
      this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance + delta));
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
   * Converts mouse click into (lat, lng) on the 3D globe surface via ray-sphere intersection.
   */
  handleClickLocation(x, y, width, height) {
    // Normalized device coordinates (-1 to 1)
    const ndcX = (x / width) * 2 - 1;
    const ndcY = -(y / height) * 2 + 1;

    // Camera ray
    const aspect = width / height;
    const fov = 45 * Math.PI / 180;
    const tanFov = Math.tan(fov / 2);

    const rayDirCam = [ndcX * aspect * tanFov, ndcY * tanFov, -1];
    // Normalize ray
    const len = Math.hypot(...rayDirCam);
    const rdx = rayDirCam[0] / len;
    const rdy = rayDirCam[1] / len;
    const rdz = rayDirCam[2] / len;

    // Camera origin in view space is (0, 0, distance)
    const ox = 0, oy = 0, oz = this.cameraDistance;

    // Ray-Sphere intersection with unit sphere at origin (R = 1.0)
    const b = 2 * (ox * rdx + oy * rdy + oz * rdz);
    const c = (ox * ox + oy * oy + oz * oz) - 1.0;
    const discriminant = b * b - 4 * c;

    if (discriminant >= 0) {
      // Hit the globe!
      const t = (-b - Math.sqrt(discriminant)) / 2;
      const hitX = ox + t * rdx;
      const hitY = oy + t * rdy;
      const hitZ = oz + t * rdz;

      // Un-rotate the hit point by inverse of current globe rotation
      // Current rotation: rotateX(currentRotation.x), rotateY(currentRotation.y)
      // Reverse: rotateY(-currentRotation.y) then rotateX(-currentRotation.x)
      const cosX = Math.cos(-this.currentRotation.x);
      const sinX = Math.sin(-this.currentRotation.x);
      const y1 = hitY * cosX - hitZ * sinX;
      const z1 = hitY * sinX + hitZ * cosX;
      const x1 = hitX;

      const cosY = Math.cos(-this.currentRotation.y);
      const sinY = Math.sin(-this.currentRotation.y);
      const xSphere = x1 * cosY + z1 * sinY;
      const ySphere = y1;
      const zSphere = -x1 * sinY + z1 * cosY;

      // Convert unit sphere coordinates to latitude & longitude
      const lat = Math.asin(Math.max(-1, Math.min(1, ySphere))) * 180 / Math.PI;
      const lng = Math.atan2(xSphere, zSphere) * 180 / Math.PI;

      if (this.onLocationSelected) {
        this.onLocationSelected(lat, lng);
      }
    }
  }

  /**
   * Sets target coordinates and animates the camera/globe smoothly.
   */
  flyTo(lat, lng, options = {}) {
    const {
      duration = 2600,
      zoomIn = true,
      onArrival = null
    } = options;

    this.idleSpin = false;
    this.isAnimating = true;
    this.animStartTime = performance.now();
    this.animDuration = duration;
    this.onArrivalCallback = onArrival;

    // Target pitch & yaw to bring (lat, lng) directly in front of camera
    const targetPitch = lat * (Math.PI / 180);
    let targetYaw = -lng * (Math.PI / 180);

    // Shortest angular delta
    const diff = (targetYaw - this.currentRotation.y) % (Math.PI * 2);
    let shortestDiff = diff;
    if (diff > Math.PI) shortestDiff -= Math.PI * 2;
    if (diff < -Math.PI) shortestDiff += Math.PI * 2;

    this.startRot = { x: this.currentRotation.x, y: this.currentRotation.y };
    // Two full dramatic planetary spins while rotating to location
    const extraSpin = -Math.PI * 4;
    this.endRot = { x: targetPitch, y: this.currentRotation.y + shortestDiff + extraSpin };

    this.startDist = this.cameraDistance;
    this.endDist = zoomIn ? 1.35 : 3.0;

    // Set pin coordinates
    this.setPin(lat, lng);
  }

  setPin(lat, lng) {
    const latRad = lat * (Math.PI / 180);
    const lngRad = lng * (Math.PI / 180);

    const x = Math.cos(latRad) * Math.sin(lngRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.cos(lngRad);

    this.activePin = { lat, lng, x, y, z };
  }

  clearPin() {
    this.activePin = null;
  }

  render() {
    const now = performance.now();
    this.radarPulse = (now / 1000) % 100;

    // Update animations or damping
    if (this.isAnimating) {
      const elapsed = now - this.animStartTime;
      const progress = Math.min(1.0, elapsed / this.animDuration);

      // Rotation easing (Quintic across duration)
      const t = progress;
      const rotEase = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

      this.currentRotation.x = this.startRot.x + (this.endRot.x - this.startRot.x) * rotEase;
      this.currentRotation.y = this.startRot.y + (this.endRot.y - this.startRot.y) * rotEase;

      // Two-phase camera distance:
      // Holds orbit view while spinning (0.0 to 0.35), then zooms in deep (0.35 to 1.0)
      let zoomEase = 0;
      if (progress < 0.35) {
        zoomEase = 0;
      } else {
        const zoomP = (progress - 0.35) / 0.65;
        zoomEase = zoomP < 0.5 ? 4 * zoomP * zoomP * zoomP : 1 - Math.pow(-2 * zoomP + 2, 3) / 2;
      }
      this.cameraDistance = this.startDist + (this.endDist - this.startDist) * zoomEase;

      if (progress >= 1.0) {
        this.isAnimating = false;
        this.targetRotation.x = this.endRot.x;
        this.targetRotation.y = this.endRot.y;
        this.targetDistance = this.endDist;
        if (this.onArrivalCallback) {
          const cb = this.onArrivalCallback;
          this.onArrivalCallback = null;
          cb();
        }
      }
    } else {
      // Idle auto rotation or damping
      if (this.idleSpin && !this.isDragging) {
        this.targetRotation.y += 0.0018;
      }

      // Smooth damping toward targets
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.12;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.12;
      this.cameraDistance += (this.targetDistance - this.cameraDistance) * 0.1;
    }

    // Render WebGL frame
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0); // Transparent background so sky gradient shines through
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Build Matrices
    const aspect = this.canvas.width / this.canvas.height;
    const projMatrix = this.createPerspective(45 * Math.PI / 180, aspect, 0.1, 100.0);
    const viewMatrix = this.createLookAt([0, 0, this.cameraDistance], [0, 0, 0], [0, 1, 0]);

    // Model matrix: Rotation around X then Y
    const modelMatrix = this.createIdentity();
    this.rotateX(modelMatrix, this.currentRotation.x);
    this.rotateY(modelMatrix, this.currentRotation.y);

    // Normal matrix
    const normalMatrix = this.createNormalMatrix(modelMatrix);

    // Pass matrices
    gl.uniformMatrix4fv(this.locations.uProjection, false, projMatrix);
    gl.uniformMatrix4fv(this.locations.uView, false, viewMatrix);
    gl.uniformMatrix4fv(this.locations.uModel, false, modelMatrix);
    gl.uniformMatrix3fv(this.locations.uNormalMatrix, false, normalMatrix);

    // Pass lighting & camera uniforms
    gl.uniform3f(this.locations.uSunDirection, 0.85, 0.35, 0.7);
    gl.uniform3f(this.locations.uCameraPos, 0, 0, this.cameraDistance);

    // Pass pin uniforms
    if (this.activePin) {
      // Transform pin coordinate by model matrix to world space
      const px = this.activePin.x;
      const py = this.activePin.y;
      const pz = this.activePin.z;
      const wp = this.multiplyVec4(modelMatrix, [px, py, pz, 1.0]);
      gl.uniform3f(this.locations.uPinWorldPos, wp[0], wp[1], wp[2]);
      gl.uniform1f(this.locations.uPinActive, 1.0);
    } else {
      gl.uniform1f(this.locations.uPinActive, 0.0);
    }
    gl.uniform1f(this.locations.uPulseTime, this.radarPulse);

    // Bind Textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.dayTexture);
    gl.uniform1i(this.locations.uDayTexture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.nightTexture);
    gl.uniform1i(this.locations.uNightTexture, 1);

    // Bind Vertex Attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex);
    gl.enableVertexAttribArray(this.locations.aPosition);
    gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
    gl.enableVertexAttribArray(this.locations.aNormal);
    gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texCoord);
    gl.enableVertexAttribArray(this.locations.aTexCoord);
    gl.vertexAttribPointer(this.locations.aTexCoord, 2, gl.FLOAT, false, 0, 0);

    // Draw Elements
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
    gl.drawElements(gl.TRIANGLES, this.buffers.indexCount, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(() => this.render());
  }

  // --- 4x4 Matrix Utilities ---
  createIdentity() {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
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

  createNormalMatrix(m) {
    // 3x3 upper left
    return new Float32Array([
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10]
    ]);
  }

  multiplyVec4(m, v) {
    return [
      m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
      m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
      m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
      m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
    ];
  }
}
