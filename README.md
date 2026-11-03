# PHILL — World Watch & Planetary Timepiece ⏱️✨

An interactive, Swiss luxury dress watch experience by **PHILL** (inspired by the classic Rolex Perpetual 1908 aesthetic) that displays the accurate local time of any country, city, or town on Earth in high-definition 2D canvas with fast-spinning hands, smooth mechanical deceleration, and dynamic atmospheric sky lighting.

## ✨ Features

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

- **Dynamic Atmospheric Sky Themes**:
  - The website's background atmosphere dynamically morphs to reflect the local time of the searched location:
    - 🌅 **Dawn / Sunrise (05:00 - 06:59)**: Soft peach, blush rose, lavender, and sunrise glow.
    - ☀️ **Broad Daylight (07:00 - 16:59)**: Bright cerulean sky with sunbeam flare.
    - 🌇 **Golden Hour Sunset (17:00 - 19:29)**: Deep amber, burning crimson, and violet horizon.
    - 🌆 **Twilight / Dusk (19:30 - 21:29)**: Deep cobalt, electric indigo, magenta edge with early stars.
    - 🌙 **Midnight Starlit Night (21:30 - 04:59)**: Deep obsidian night with shimmering celestial starfield.

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
