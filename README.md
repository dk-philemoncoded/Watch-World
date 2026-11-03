# PHILL — World Watch & Planetary Timepiece ⏱️✨

An interactive, Swiss luxury dress watch experience by **PHILL** (inspired by the classic Rolex Perpetual 1908 aesthetic) that displays the accurate local time of any country, city, or town on Earth in high-definition 2D canvas with fast-spinning hands, smooth mechanical deceleration, dynamic atmospheric sky lighting, and **animated 2D vector characters engaging in real human activities matching the time frame of the searched location**.

## ✨ Features

- **Animated 2D Vector Characters & Living Horizon**:
  - The background depicts the sky and horizon of the searched location's exact local time, brought to life with procedural 2D vector characters engaged in authentic human activities:
    - 🌅 **Dawn / Early Morning (05:00 - 08:59)**:
      - Morning joggers with high-knee strides and athletic gait.
      - Dog walkers with a trotting puppy, floppy ears, and wagging tail.
      - Commuters walking with steaming cups of takeaway coffee.
      - Cyclists pedaling through the sunrise mist with turning spoked wheels.
      - Golden-orange rising sun with morning birds soaring across the sky.
    - ☀️ **Broad Daylight / Afternoon (09:00 - 16:59)**:
      - People strolling along the promenade with backpacks and tote bags.
      - A relaxed reader sitting on a park bench reading a book.
      - Friends walking together and waving hello.
      - Cyclists gliding across the promenade path.
      - High radiant sun, drifting cumulus clouds, and birds in flight.
    - 🌇 **Sunset / Golden Hour (17:00 - 19:29)**:
      - Romantic couples strolling arm in arm bathed in golden-crimson twilight.
      - Evening runner finishing a workout.
      - Park bench sunset watcher taking in the golden view.
      - Glowing amber sun resting directly on the horizon line.
      - Victorian streetlamps beginning to warm up with golden filaments.
    - 🌆 **Twilight / Dusk (19:30 - 21:59)**:
      - Pedestrians in cozy jackets heading toward cafes and dinner spots.
      - Acoustic guitarist sitting on a park bench gently strumming.
      - Illuminated streetlamps casting warm pools of volumetric light onto the pavement.
      - Distant city apartment towers with glowing warm windows.
    - 🌙 **Midnight / Night (22:00 - 04:59)**:
      - Stargazer standing beside a brass telescope observing the moon and constellations.
      - Nocturnal walker strolling leisurely under the streetlamps with hands in coat pockets.
      - Night jogger with a glowing reflective armband.
      - Luminous crescent moon, deep starfield, and periodic shooting stars.

- **Hero 2D Mechanical Wrist Watch by PHILL**:
  - **Double Bezel**: Outer delicate coin-edge fluted bezel with microscopic golden notches, inner mirror-polished domed gold ring.
  - **Pure Porcelain White/Ivory Dial**: Refined lacquer finish with a delicate outer railroad minute track (*chemin-de-fer*) and minute dot pips.
  - **Applied Faceted Gold Numerals**: Hand-finished applied numerals at `12`, `3`, and `9` with 3D drop shadow and dual-tone faceted relief.
  - **Applied Faceted Dagger Markers**: Chamfered gold dagger batons at hours 1, 2, 4, 5, 7, 8, 10, 11, each split with bright and shadow facets.
  - **Small Seconds Subdial (at 6 o'clock)**:
    - Recessed aperture with authentic circular snailing (*azurage*).
    - Subdial railroad track with printed `60`, `20`, `40` markers.
    - Arched **SUPERLATIVE CHRONOMETER** inscription curved elegantly above the subdial.
    - Slender golden needle second hand ticking dead-beat in the subdial.
  - **Signature Horological Hands**:
    - **Hour Hand**: Distinctive open circular Observatory / Breguet eye near the tip, ending in a sharp faceted needle point.
    - **Minute Hand**: Sleek double-edged sword hand tapering all the way to the railroad track.
    - Center arbor in polished domed gold with a central jewel pin.
  - **Alligator-Grain Leather Straps & Sculpted Lugs**:
    - Deep chestnut brown alligator leather with segmental scale plates and tone-on-tone saddle stitching.
    - 4 sculpted, tapering lugs curving naturally from the polished case.
  - **Case & Metal Customizer**:
    - **18ct Yellow Gold** (default, matching the classic reference timepiece).
    - **18ct Everose Gold**.
    - **18ct White Gold**.
    - **950 Platinum**.

- **Fast-Spinning Hands & Mechanical Deceleration**:
  - When searching for any country, city, or town:
    - The watch face remains in crisp 2D.
    - **Only the hands spin fast**: the second hand makes 12+ rapid revolutions in the subdial, the minute hand makes 5+ rapid revolutions, and the hour hand sweeps forward.
    - The hands smoothly decelerate with a realistic quintic ease-out mechanical gear curve.
    - They lock into the exact local hour, minute, and second of the searched destination with a crystal arrival chime!
    - The second hand then resumes its normal, dead-beat escapement tick (crisp 75ms step, 925ms solid hold, zero jitter, zero reverse).

- **Universal Search (Countries, Cities, & Towns)**:
  - Search any **Country** (*Nigeria*, *Japan*, *Spain*, *France*, *Brazil*, *Canada*, *Australia*), **City**, or **Town** (*Oxford*, *Ibadan*, *Kyoto*, *Cannes*, *Honolulu*).
  - Autocomplete dropdown with flags and timezone indicators.
  - Press Enter or click **Find Time** to instantly locate and calculate the destination time.

- **Web Audio API Escapement Sound Engine**:
  - Crisp mechanical escapement ticking on each second step.
  - High-speed winding whirl during hand spin.
  - Crystal arrival lock chime.
  - Audio mute/unmute toggle.

## 🚀 How to Run

- **Option A (Direct File)**: Double-click `index.html` in Windows File Explorer or open it in Brave, Edge, or Chrome (`file:///...` supported out of the box via unified bundle).
- **Option B (Local Web Server)**: Run the PowerShell server script:
  ```powershell
  cd "c:\Users\Dream\Documents\Antigravity\Watch World"
  powershell -ExecutionPolicy Bypass -File server.ps1
  ```
  Then open [http://localhost:8080/](http://localhost:8080/) in your browser.
