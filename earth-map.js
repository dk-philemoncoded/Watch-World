/**
 * Earth Vector Cartography & Texture Generator
 * Procedurally generates a high-definition equirectangular Earth texture
 * containing accurate continental landmasses, biomes, coastlines, oceans,
 * mountain shading, and city night lights.
 * 100% offline, zero external image downloads required.
 */

// Key continental polygon coordinates in [lng, lat] degrees (-180 to 180, -90 to 90)
export const CONTINENT_POLYGONS = [
  // North America & Central America
  [
    [-168, 65], [-160, 71], [-140, 70], [-130, 70], [-120, 76], [-95, 78], [-80, 74],
    [-70, 62], [-64, 47], [-60, 47], [-65, 43], [-70, 42], [-75, 35], [-80, 25],
    [-81, 25], [-85, 30], [-97, 26], [-97, 20], [-90, 16], [-83, 9], [-77, 8],
    [-82, 9], [-87, 13], [-105, 20], [-110, 30], [-117, 32], [-124, 40], [-125, 49],
    [-135, 57], [-145, 60], [-165, 60], [-168, 65]
  ],
  // Greenland
  [
    [-45, 60], [-35, 65], [-20, 70], [-20, 78], [-30, 83], [-50, 83], [-60, 82],
    [-55, 75], [-50, 68], [-45, 60]
  ],
  // South America
  [
    [-77, 8], [-72, 11], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-38, -13],
    [-42, -22], [-48, -28], [-53, -33], [-58, -38], [-65, -43], [-66, -55], [-74, -53],
    [-74, -45], [-72, -35], [-71, -25], [-76, -14], [-81, -5], [-80, 2], [-77, 8]
  ],
  // Europe
  [
    [-9, 36], [-9, 43], [0, 44], [-2, 48], [-5, 48], [2, 51], [8, 54],
    [10, 58], [5, 62], [15, 68], [28, 71], [35, 68], [30, 60], [25, 55],
    [20, 45], [26, 40], [23, 38], [15, 40], [14, 45], [10, 44], [3, 42],
    [-3, 36], [-9, 36]
  ],
  // Great Britain & Ireland
  [
    [-5, 50], [1, 51], [0, 53], [-2, 57], [-5, 58], [-6, 55], [-5, 50]
  ],
  [
    [-10, 51], [-6, 52], [-6, 55], [-10, 54], [-10, 51]
  ],
  // Scandinavia
  [
    [5, 58], [12, 57], [18, 59], [22, 65], [28, 70], [20, 69], [12, 63], [5, 58]
  ],
  // Africa
  [
    [-5, 36], [10, 37], [25, 32], [32, 31], [34, 27], [43, 13], [51, 12],
    [45, 5], [40, -3], [40, -10], [35, -20], [32, -27], [28, -33], [19, -34],
    [18, -30], [12, -18], [12, -5], [9, 4], [3, 6], [-10, 5], [-15, 12],
    [-17, 15], [-17, 21], [-13, 28], [-5, 36]
  ],
  // Madagascar
  [
    [44, -12], [50, -13], [50, -20], [47, -25], [44, -25], [43, -16], [44, -12]
  ],
  // Asia (Eurasia mainland)
  [
    [30, 70], [60, 70], [80, 73], [105, 77], [140, 73], [170, 69], [180, 65],
    [170, 60], [160, 56], [150, 59], [143, 50], [132, 43], [129, 35], [122, 30],
    [118, 22], [108, 16], [105, 10], [100, 4], [104, 1], [98, 8], [90, 22],
    [80, 13], [77, 8], [73, 16], [68, 24], [62, 25], [57, 26], [50, 27],
    [45, 13], [35, 15], [35, 30], [28, 41], [30, 46], [38, 47], [40, 55],
    [32, 60], [30, 70]
  ],
  // India Subcontinent
  [
    [68, 24], [72, 21], [73, 16], [76, 9], [80, 13], [82, 17], [88, 22],
    [90, 22], [80, 26], [70, 26], [68, 24]
  ],
  // Japan
  [
    [130, 32], [132, 34], [136, 35], [141, 38], [141, 43], [145, 44],
    [142, 45], [139, 41], [135, 35], [130, 32]
  ],
  // Indonesia / Philippines
  [
    [96, 5], [105, -6], [115, -8], [125, -8], [130, -3], [125, 1], [115, 0], [104, 2], [96, 5]
  ],
  [
    [120, 15], [125, 13], [126, 7], [122, 7], [120, 15]
  ],
  // Australia
  [
    [114, -22], [122, -18], [130, -12], [136, -12], [142, -11], [145, -15],
    [153, -28], [150, -36], [147, -38], [138, -35], [135, -34], [125, -33],
    [115, -34], [113, -26], [114, -22]
  ],
  // New Zealand
  [
    [167, -46], [174, -41], [178, -38], [174, -36], [172, -41], [168, -44], [167, -46]
  ],
  // Antarctica (polar coastal line)
  [
    [-180, -78], [-120, -74], [-70, -65], [-50, -65], [-20, -70], [20, -69],
    [60, -67], [100, -66], [140, -66], [170, -71], [180, -78], [180, -90],
    [-180, -90], [-180, -78]
  ]
];

/**
 * Creates high resolution procedural Earth day and night textures on HTML5 canvases.
 */
export function createEarthTextures(width = 2048, height = 1024) {
  const dayCanvas = document.createElement("canvas");
  dayCanvas.width = width;
  dayCanvas.height = height;
  const dayCtx = dayCanvas.getContext("2d");

  // Coordinate converter: lng [-180..180] -> x [0..width], lat [-90..90] -> y [height..0]
  function toX(lng) {
    return ((lng + 180) / 360) * width;
  }
  function toY(lat) {
    return ((90 - lat) / 180) * height;
  }

  // 1. Draw Deep Ocean with subtle gradient and bathymetry
  const oceanGrad = dayCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, "#102c4c");    // Arctic ocean
  oceanGrad.addColorStop(0.2, "#0b203a");  // Northern ocean
  oceanGrad.addColorStop(0.5, "#071b33");  // Tropical deep blue
  oceanGrad.addColorStop(0.8, "#092442");  // Southern ocean
  oceanGrad.addColorStop(1, "#173b5c");    // Antarctic ocean
  dayCtx.fillStyle = oceanGrad;
  dayCtx.fillRect(0, 0, width, height);

  // Ocean ambient texture & latitude lines
  dayCtx.strokeStyle = "rgba(45, 110, 180, 0.08)";
  dayCtx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = toY(lat);
    dayCtx.beginPath();
    dayCtx.moveTo(0, y);
    dayCtx.lineTo(width, y);
    dayCtx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = toX(lng);
    dayCtx.beginPath();
    dayCtx.moveTo(x, 0);
    dayCtx.lineTo(x, height);
    dayCtx.stroke();
  }

  // 2. Draw Shallow Coastal Shelves (lighter teal-cyan glow around coasts)
  dayCtx.shadowColor = "#1a668c";
  dayCtx.shadowBlur = 18;
  dayCtx.fillStyle = "#12425d";
  drawPolygons(dayCtx, CONTINENT_POLYGONS, toX, toY);
  dayCtx.shadowBlur = 0; // reset

  // 3. Draw Continental Landmasses with Biome Colors
  CONTINENT_POLYGONS.forEach(poly => {
    // Determine average latitude for biome coloring (green vegetation vs desert vs snow)
    let avgLat = 0;
    poly.forEach(pt => { avgLat += pt[1]; });
    avgLat /= poly.length;

    let landGrad;
    if (Math.abs(avgLat) > 62) {
      // Polar / Tundra / Ice (Greenland, Antarctica, Siberia)
      landGrad = dayCtx.createLinearGradient(0, 0, 0, height);
      landGrad.addColorStop(0, "#eef5f8");
      landGrad.addColorStop(1, "#c8dce4");
    } else if (avgLat >= 12 && avgLat <= 32) {
      // Sahara / Arabia / Gobi Desert / Savanna
      landGrad = dayCtx.createLinearGradient(0, 0, 0, height);
      landGrad.addColorStop(0, "#8a9456");
      landGrad.addColorStop(0.5, "#a88e4f");
      landGrad.addColorStop(1, "#5b753c");
    } else {
      // Lush Temperate & Tropical Forest (Europe, Americas, East Asia, SE Asia)
      landGrad = dayCtx.createLinearGradient(0, 0, 0, height);
      landGrad.addColorStop(0, "#2c5438");
      landGrad.addColorStop(0.5, "#3b6c45");
      landGrad.addColorStop(1, "#27482f");
    }

    dayCtx.fillStyle = landGrad;
    dayCtx.strokeStyle = "#4d8058";
    dayCtx.lineWidth = 1.5;

    dayCtx.beginPath();
    for (let i = 0; i < poly.length; i++) {
      const [lng, lat] = poly[i];
      const x = toX(lng);
      const y = toY(lat);
      if (i === 0) dayCtx.moveTo(x, y);
      else dayCtx.lineTo(x, y);
    }
    dayCtx.closePath();
    dayCtx.fill();
    dayCtx.stroke();
  });

  // 4. Draw Mountain Relief and Topographic Shading
  dayCtx.fillStyle = "rgba(180, 160, 130, 0.25)";
  drawMountainRanges(dayCtx, toX, toY);

  // 5. Generate City Night Lights Canvas
  const nightCanvas = document.createElement("canvas");
  nightCanvas.width = width;
  nightCanvas.height = height;
  const nightCtx = nightCanvas.getContext("2d");

  // Pure dark midnight background for unlit areas
  nightCtx.fillStyle = "#020409";
  nightCtx.fillRect(0, 0, width, height);

  // Glowing golden city clusters & metropolitan networks
  drawCityLights(nightCtx, toX, toY);

  return { dayCanvas, nightCanvas };
}

function drawPolygons(ctx, polygons, toX, toY) {
  ctx.beginPath();
  polygons.forEach(poly => {
    for (let i = 0; i < poly.length; i++) {
      const [lng, lat] = poly[i];
      const x = toX(lng);
      const y = toY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  });
  ctx.fill();
}

function drawMountainRanges(ctx, toX, toY) {
  // Andes, Rockies, Himalayas, Alps
  const ranges = [
    // Andes
    [[-70, 8], [-74, -5], [-72, -18], [-68, -25], [-70, -35], [-72, -50]],
    // Rockies
    [[-150, 65], [-130, 60], [-120, 52], [-112, 45], [-106, 38], [-102, 30]],
    // Himalayas & Tibetan Plateau
    [[72, 35], [77, 34], [85, 30], [92, 28], [98, 29]],
    // Alps
    [[5, 45], [8, 46], [12, 47], [15, 46]]
  ];

  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(220, 205, 180, 0.4)";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ranges.forEach(range => {
    ctx.beginPath();
    for (let i = 0; i < range.length; i++) {
      const [lng, lat] = range[i];
      const x = toX(lng);
      const y = toY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
}

function drawCityLights(ctx, toX, toY) {
  // Major illuminated urban clusters
  const majorCities = [
    [-74, 40.7, 16],   // NYC
    [-118, 34, 14],    // LA
    [-87, 41.8, 12],   // Chicago
    [-0.1, 51.5, 18],  // London
    [2.3, 48.8, 16],   // Paris
    [13.4, 52.5, 14],  // Berlin
    [139.7, 35.7, 22], // Tokyo
    [126.9, 37.5, 16], // Seoul
    [121.5, 31.2, 18], // Shanghai
    [116.4, 39.9, 17], // Beijing
    [77.2, 28.6, 18],  // Delhi
    [72.8, 19.1, 16],  // Mumbai
    [55.3, 25.2, 15],  // Dubai
    [31.2, 30.0, 14],  // Cairo
    [-46.6, -23.5, 16],// Sao Paulo
    [-58.4, -34.6, 14],// Buenos Aires
    [151.2, -33.8, 14],// Sydney
    [100.5, 13.7, 13], // Bangkok
    [103.8, 1.3, 14],  // Singapore
    [106.8, -6.2, 14], // Jakarta
    [37.6, 55.7, 16],  // Moscow
    [28.9, 41.0, 14],  // Istanbul
    [-99.1, 19.4, 15]  // Mexico City
  ];

  // Draw intense glowing core and soft ambient halo for each city
  majorCities.forEach(([lng, lat, radius]) => {
    const x = toX(lng);
    const y = toY(lat);

    const grad = ctx.createRadialGradient(x, y, 1, x, y, radius * 2.5);
    grad.addColorStop(0, "rgba(255, 240, 180, 0.95)");
    grad.addColorStop(0.2, "rgba(255, 195, 90, 0.7)");
    grad.addColorStop(0.6, "rgba(230, 140, 40, 0.25)");
    grad.addColorStop(1, "rgba(200, 100, 20, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Highway corridors and dense regional lighting (Eastern US, Western Europe, Japan/East China, India)
  ctx.fillStyle = "rgba(255, 210, 120, 0.4)";
  for (let i = 0; i < 400; i++) {
    // Generate scattered points along populated bands
    const region = Math.random();
    let lng, lat;
    if (region < 0.3) {
      // Europe
      lng = Math.random() * 30 - 5;
      lat = Math.random() * 20 + 40;
    } else if (region < 0.6) {
      // East Asia
      lng = Math.random() * 35 + 105;
      lat = Math.random() * 25 + 20;
    } else if (region < 0.85) {
      // North America East
      lng = Math.random() * 35 - 100;
      lat = Math.random() * 20 + 28;
    } else {
      // India
      lng = Math.random() * 20 + 70;
      lat = Math.random() * 18 + 12;
    }

    const x = toX(lng);
    const y = toY(lat);
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 2 + 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}
