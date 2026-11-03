# PHILL — World Watch & 3D Timepiece ⏱️✨

An interactive, luxury analog 3D wristwatch experience by **PHILL** that displays the accurate local time of any country, city, or town on Earth with real-time 3D spinning animations and dynamic atmospheric lighting.

## ✨ Features

- **Hero 3D Mechanical Wrist Watch by PHILL**:
  - Full procedural **WebGL 3D horological model**: sculpted metallic case, fluted bezel, beveled horns/lugs, knurled winding crown at 3 o'clock, curved stitched leather straps, and a domed sapphire crystal with dynamic Fresnel specular sweeps.
  - Interactive **3D orbit controls**: drag with mouse or touch in any direction to inspect the timepiece from all angles in full 3D space, with smooth auto-settle damping.
  - High-beat **dead-beat mechanical clock tick**: strictly forward monotonic escapement step (75ms snap, 925ms solid hold, zero jitter, zero reverse on second rollover).
  - 24-hour celestial **Sun & Moon complication disc** that tracks the target location's solar hour.
  - Magnified **Cyclops date aperture** displaying the target location's current calendar day.
  - Applied faceted diamond-cut hour markers with **Super-LumiNova luminescence** that illuminates automatically in night and dusk themes.
  - Case Finishes: **Stainless Steel**, **Royal Rose Gold**, **Obsidian DLC Black**, and **Vintage Bronze** (customizes both 3D watch metals and straps in real time).

- **Universal Search (Countries, Cities, & Towns)**:
  - Type any **Country** (e.g. *Nigeria*, *Japan*, *Spain*, *France*, *Brazil*, *Canada*, *Australia*), **City**, or **Town** (e.g. *Oxford*, *Ibadan*, *Kyoto*, *Cannes*, *Honolulu*).
  - Instant autocomplete suggestions with flags and country tags.
  - Click **Find Time** or press **Enter**: resolves the exact location, timezone, and coordinates.

- **Cinematic 3D Wrist Watch Spinning Animation**:
  - When a location is searched or a popular chip is selected:
    1. A golden HUD telemetry banner activates: `✦ TARGETING [FLAG] [LOCATION] • SPINNING TIMEPIECE...`.
    2. The 3D wristwatch performs a high-speed **multi-axis cinematic tumble and 3D spin** with mechanical gear winding sound effects.
    3. The watch smoothly decelerates with mechanical spring physics, settling back to front-facing view upon arrival with a crystal chime.
    4. The horological hands rapidly sweep to the destination's exact local time.
    5. The website's background atmosphere seamlessly morphs to match the time of day.

- **Dynamic Time-of-Day Background Theme**:
  - The website's atmosphere dynamically reflects the local time of the searched location:
    - 🌅 **Dawn / Sunrise (05:00 - 06:59)**: Soft peach, blush rose, lavender, and sunrise glow.
    - ☀️ **Broad Daylight (07:00 - 16:59)**: Bright cerulean sky with sunbeam flare.
    - 🌇 **Golden Hour Sunset (17:00 - 19:29)**: Deep amber, burning crimson, and violet horizon.
    - 🌆 **Twilight / Dusk (19:30 - 21:29)**: Deep cobalt, electric indigo, magenta edge with early stars.
    - 🌙 **Midnight Starlit Night (21:30 - 04:59)**: Deep obsidian night with shimmering celestial starfield.

- **Web Audio API Escapement Sound Engine**:
  - Pure procedural acoustic synthesis (zero external audio files).
  - Crisp mechanical escapement ticking on each second step.
  - High-speed winding whirl during timezone change.
  - Crystal arrival lock chime.
  - Mute / unmute audio toggle.

## 🚀 How to Run

- **Option A (Direct File)**: Double-click `index.html` in Windows File Explorer or open it in Brave, Edge, or Chrome (`file:///...` supported out of the box via unified bundle).
- **Option B (Local Web Server)**: Run the PowerShell server script:
  ```powershell
  cd "c:\Users\Dream\Documents\Antigravity\Watch World"
  powershell -ExecutionPolicy Bypass -File server.ps1
  ```
  Then open [http://localhost:8080/](http://localhost:8080/) in your browser.
