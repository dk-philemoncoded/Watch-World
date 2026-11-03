/**
 * Antigravity "Watch World" Application Controller
 * Orchestrates the search, cinematic watch zoom, 3D globe flight,
 * watch transition, and dynamic background time theme.
 */

import { WORLD_CITIES, WORLD_COUNTRIES, searchCities, resolveAnyLocation, findNearestCity, getTimeInfoForZone } from "./world-cities.js";
import { soundEngine } from "./sound.js";
import { GlobeEngine } from "./globe.js";
import { WatchEngine } from "./watch.js";

class WatchWorldApp {
  constructor() {
    // DOM Elements
    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.suggestionsDropdown = document.getElementById("suggestions-dropdown");
    this.popularChips = document.querySelectorAll(".city-chip");
    
    this.heroStage = document.getElementById("hero-stage");
    this.watchWrapper = document.getElementById("watch-wrapper");
    this.globeWrapper = document.getElementById("globe-wrapper");
    this.watchCanvas = document.getElementById("watch-canvas");
    this.globeCanvas = document.getElementById("globe-canvas");
    this.globeTelemetryEl = document.getElementById("globe-telemetry");

    // Info Display Elements
    this.locationBadge = document.getElementById("location-badge");
    this.locationNameEl = document.getElementById("location-name");
    this.locationCountryEl = document.getElementById("location-country");
    this.digitalTimeEl = document.getElementById("digital-time");
    this.timePeriodEl = document.getElementById("time-period");
    this.timezoneBadgeEl = document.getElementById("timezone-badge");
    this.relativeTimeEl = document.getElementById("relative-time");
    this.solarStatusEl = document.getElementById("solar-status");
    this.coordsBadgeEl = document.getElementById("coords-badge");

    // Controls
    this.soundToggleBtn = document.getElementById("sound-toggle-btn");
    this.finishButtons = document.querySelectorAll(".finish-btn");
    this.viewModeButtons = document.querySelectorAll(".view-mode-btn");

    // Background Container
    this.body = document.body;
    this.skyBackground = document.getElementById("sky-background");
    this.starsLayer = document.getElementById("stars-layer");
    this.sunMoonGlow = document.getElementById("sun-moon-glow");

    // State
    this.selectedCity = null;
    this.userHomeTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    this.currentViewMode = "cinema"; // 'cinema' | 'split'
    this.isTransitioning = false;
    this.liveClockTimer = null;

    this.initEngines();
    this.generateStarfield();
    this.bindEvents();
    this.initDefaultLocation();
  }

  initEngines() {
    this.watch = new WatchEngine(this.watchCanvas, soundEngine);
    this.globe = new GlobeEngine(this.globeCanvas);

    // When user clicks anywhere directly on the 3D globe:
    this.globe.onLocationSelected = (lat, lng) => {
      soundEngine.init();
      const { city } = findNearestCity(lat, lng);
      if (city) {
        this.selectLocation(city, true);
      }
    };
  }

  generateStarfield() {
    if (!this.starsLayer) return;
    this.starsLayer.innerHTML = "";
    const count = 180;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 2.2 + 0.8;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = (Math.random() * 0.7 + 0.3).toString();
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      fragment.appendChild(star);
    }
    this.starsLayer.appendChild(fragment);
  }

  bindEvents() {
    // Search input typing & autocomplete
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      this.handleSearchInput(query);
    });

    this.searchInput.addEventListener("focus", () => {
      if (this.searchInput.value.trim()) {
        this.handleSearchInput(this.searchInput.value.trim());
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.searchForm.contains(e.target)) {
        this.suggestionsDropdown.classList.add("hidden");
      }
    });

    // Form submit with async universal geocoder (Supports Countries, Cities, Towns)
    this.searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      soundEngine.init();
      const query = this.searchInput.value.trim();
      if (!query) return;

      this.showSearchFeedback(`Locating "${query}" on globe...`);
      const resolved = await resolveAnyLocation(query);
      if (resolved) {
        this.suggestionsDropdown.classList.add("hidden");
        this.searchInput.value = resolved.name;
        this.selectLocation(resolved, true);
      } else {
        this.showSearchFeedback(`Could not locate "${query}". Try another country, city, or town.`);
      }
      this.searchInput.blur();
    });

    // Quick Popular City/Country Chips
    this.popularChips.forEach(chip => {
      chip.addEventListener("click", async () => {
        soundEngine.init();
        const query = chip.dataset.city;
        this.searchInput.value = query;
        const resolved = await resolveAnyLocation(query);
        if (resolved) {
          this.selectLocation(resolved, true);
        }
      });
    });

    // Sound Toggle
    this.soundToggleBtn.addEventListener("click", () => {
      const isSoundOn = soundEngine.toggleSound();
      this.soundToggleBtn.classList.toggle("muted", !isSoundOn);
      this.soundToggleBtn.setAttribute("aria-label", isSoundOn ? "Mute audio" : "Unmute audio");
      const icon = this.soundToggleBtn.querySelector(".sound-icon");
      if (icon) {
        icon.textContent = isSoundOn ? "🔊" : "🔇";
      }
    });

    // Watch Finish Selection (Steel, Rose Gold, Obsidian, Bronze)
    this.finishButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        soundEngine.init();
        this.finishButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const finish = btn.dataset.finish;
        this.watch.setFinish(finish);
      });
    });

    // View Mode Toggle (Cinema vs Split View)
    this.viewModeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.viewModeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.setViewMode(btn.dataset.mode);
      });
    });

    // Enable audio on first user touch anywhere
    const resumeAudio = () => {
      soundEngine.init();
      window.removeEventListener("pointerdown", resumeAudio);
      window.removeEventListener("keydown", resumeAudio);
    };
    window.addEventListener("pointerdown", resumeAudio);
    window.addEventListener("keydown", resumeAudio);
  }

  handleSearchInput(query) {
    if (!query) {
      this.suggestionsDropdown.classList.add("hidden");
      return;
    }

    const matches = searchCities(query);
    if (matches.length === 0) {
      this.suggestionsDropdown.innerHTML = `
        <div class="suggestion-item no-match">
          <span>Press <strong>Enter</strong> or click <strong>Find Time</strong> to search any location on Earth</span>
        </div>
      `;
      this.suggestionsDropdown.classList.remove("hidden");
      return;
    }

    this.suggestionsDropdown.innerHTML = matches.map((item, idx) => `
      <div class="suggestion-item" data-index="${idx}">
        <span class="city-flag">${item.flag}</span>
        <div class="city-details">
          <span class="city-title">${item.name}</span>
          <span class="city-country">${item.isCountry ? (item.capital ? `Capital: ${item.capital}` : "Country") : item.country}</span>
        </div>
        <span class="city-tz">${item.tz ? item.tz.split("/")[1] || item.tz : ""}</span>
      </div>
    `).join("");

    this.suggestionsDropdown.classList.remove("hidden");

    // Click on suggestion
    this.suggestionsDropdown.querySelectorAll(".suggestion-item").forEach(item => {
      item.addEventListener("click", () => {
        soundEngine.init();
        const idx = parseInt(item.dataset.index, 10);
        const loc = matches[idx];
        if (loc) {
          this.searchInput.value = loc.name;
          this.selectLocation(loc, true);
        }
        this.suggestionsDropdown.classList.add("hidden");
      });
    });
  }

  initDefaultLocation() {
    // Find closest city to user's local timezone
    const matchedCity = WORLD_CITIES.find(c => c.tz === this.userHomeTimezone) ||
                        WORLD_CITIES.find(c => c.name === "London");

    this.selectLocation(matchedCity, false);
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    this.heroStage.classList.toggle("split-view", mode === "split");
    this.heroStage.classList.toggle("cinema-view", mode === "cinema");

    if (mode === "split") {
      this.watchWrapper.style.transform = "";
      this.watchWrapper.style.opacity = "1";
      this.globeWrapper.style.transform = "";
      this.globeWrapper.style.opacity = "1";
    }
  }

  /**
   * The Climax Sequence:
   * 1. Wrist watch zooms in dramatically
   * 2. 3D Globe spins to destination coordinates with atmospheric flight
   * 3. Globe zooms in deep onto the target location pin
   * 4. Right at maximum zoom, watch face transitions back
   * 5. Watch hands rapidly sweep to the local time
   * 6. Background theme seamlessly morphs to reflect time of day
   */
  selectLocation(city, isUserTriggered = true) {
    this.selectedCity = city;

    // Get time information for the target city or country
    const timeInfo = getTimeInfoForZone(city.tz);

    // Update digital readout and meta cards
    this.updateInfoCards(city, timeInfo);

    if (!isUserTriggered || this.currentViewMode === "split") {
      // Direct set without cinematic zoom
      this.watch.setTime(timeInfo, true);
      this.globe.setPin(city.lat, city.lng);
      this.globe.flyTo(city.lat, city.lng, { duration: 1500, zoomIn: false });
      this.applyBackgroundTheme(timeInfo);
      this.startLiveClock();
      return;
    }

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // --- STEP 1: Wrist Watch Zooms In ---
    this.heroStage.classList.add("state-watch-zooming");
    soundEngine.playWindingEffect(1.6);

    setTimeout(() => {
      // --- STEP 2: Globe Emerges in FULL SCREEN & Spins to Destination ---
      this.heroStage.classList.remove("state-watch-zooming");
      this.heroStage.classList.add("state-globe-flying");

      // Update Telemetry HUD
      if (this.globeTelemetryEl) {
        const latStr = `${Math.abs(city.lat).toFixed(1)}°${city.lat >= 0 ? "N" : "S"}`;
        const lngStr = `${Math.abs(city.lng).toFixed(1)}°${city.lng >= 0 ? "E" : "W"}`;
        this.globeTelemetryEl.innerHTML = `✦ TARGETING <strong>${city.flag} ${city.name.toUpperCase()}</strong> (${latStr}, ${lngStr}) • ROTATING GLOBE...`;
      }

      // Resize globe canvas to fill the full viewport
      this.globe.resize();

      // Fly camera and spin globe to target coordinates
      this.globe.flyTo(city.lat, city.lng, {
        duration: 2600,
        zoomIn: true,
        onArrival: () => {
          // --- STEP 3: Just when the place is fully zoomed in! ---
          if (this.globeTelemetryEl) {
            this.globeTelemetryEl.innerHTML = `✦ <strong>${city.flag} ${city.name.toUpperCase()}</strong> REACHED • TRANSITIONING TIME...`;
          }

          // Transition watch face back to tell the time of the place
          this.heroStage.classList.remove("state-globe-flying");
          this.heroStage.classList.add("state-watch-reveal");

          // Watch hands spin rapidly to the new time!
          this.watch.setTime(timeInfo, true);

          // Background theme updates to reflect the destination's time
          this.applyBackgroundTheme(timeInfo);

          setTimeout(() => {
            this.heroStage.classList.remove("state-watch-reveal");
            this.globe.resize();
            this.isTransitioning = false;
            this.startLiveClock();
          }, 1400);
        }
      });
    }, 450);
  }

  updateInfoCards(city, timeInfo) {
    if (this.locationNameEl) this.locationNameEl.textContent = `${city.flag} ${city.name}`;
    if (this.locationCountryEl) this.locationCountryEl.textContent = city.country;

    // Format digital clock
    const hr12 = timeInfo.hours % 12 || 12;
    const ampm = timeInfo.hours >= 12 ? "PM" : "AM";
    const minStr = String(timeInfo.minutes).padStart(2, "0");
    const secStr = String(timeInfo.seconds).padStart(2, "0");

    if (this.digitalTimeEl) {
      this.digitalTimeEl.innerHTML = `
        <span class="digit">${String(hr12).padStart(2, "0")}</span>
        <span class="colon">:</span>
        <span class="digit">${minStr}</span>
        <span class="colon">:</span>
        <span class="digit sec">${secStr}</span>
      `;
    }
    if (this.timePeriodEl) this.timePeriodEl.textContent = ampm;

    if (this.timezoneBadgeEl) this.timezoneBadgeEl.textContent = `${timeInfo.offsetStr} • ${city.tz.split("/")[1] || city.tz}`;

    // Relative difference vs user's home timezone
    const homeNow = new Date();
    const targetDate = new Date(homeNow.toLocaleString("en-US", { timeZone: city.tz }));
    const homeDate = new Date(homeNow.toLocaleString("en-US", { timeZone: this.userHomeTimezone }));
    const diffHours = Math.round((targetDate - homeDate) / (1000 * 60 * 60));

    if (this.relativeTimeEl) {
      if (diffHours === 0) {
        this.relativeTimeEl.textContent = "Same time as your location";
      } else if (diffHours > 0) {
        this.relativeTimeEl.textContent = `${diffHours} hour${Math.abs(diffHours) === 1 ? "" : "s"} ahead of you`;
      } else {
        this.relativeTimeEl.textContent = `${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? "" : "s"} behind you`;
      }
    }

    // Solar Status Badge
    if (this.solarStatusEl) {
      const solarIcons = {
        dawn: "🌅 Dawn / Sunrise",
        day: "☀️ Broad Daylight",
        sunset: "🌇 Golden Hour Sunset",
        dusk: "🌆 Twilight / Dusk",
        night: "🌙 Starlit Night"
      };
      this.solarStatusEl.textContent = solarIcons[timeInfo.timeOfDay] || "☀️ Day";
    }

    if (this.coordsBadgeEl) {
      const latStr = `${Math.abs(city.lat).toFixed(2)}° ${city.lat >= 0 ? "N" : "S"}`;
      const lngStr = `${Math.abs(city.lng).toFixed(2)}° ${city.lng >= 0 ? "E" : "W"}`;
      this.coordsBadgeEl.textContent = `${latStr}, ${lngStr}`;
    }
  }

  /**
   * Smoothly changes the background theme to reflect the local time of the searched location.
   */
  applyBackgroundTheme(timeInfo) {
    const theme = timeInfo.timeOfDay; // 'dawn' | 'day' | 'sunset' | 'dusk' | 'night'

    // Remove existing theme classes
    this.body.classList.remove("theme-dawn", "theme-day", "theme-sunset", "theme-dusk", "theme-night");
    this.body.classList.add(`theme-${theme}`);

    // Update Celestial Glow position & color in the sky
    if (this.sunMoonGlow) {
      // Calculate celestial angle: Noon = 50% top, Midnight = below horizon
      const hour = timeInfo.decimalHour;
      let glowX = ((hour / 24) * 100);
      let glowY = 30 + Math.sin(((hour - 6) / 12) * Math.PI) * -20;

      this.sunMoonGlow.style.left = `${glowX}%`;
      this.sunMoonGlow.style.top = `${glowY}%`;
    }
  }

  startLiveClock() {
    if (this.liveClockTimer) clearInterval(this.liveClockTimer);

    this.liveClockTimer = setInterval(() => {
      if (!this.selectedCity || this.isTransitioning) return;
      const updatedInfo = getTimeInfoForZone(this.selectedCity.tz);
      this.updateInfoCards(this.selectedCity, updatedInfo);
      this.watch.currentTime = { ...updatedInfo };
    }, 1000);
  }

  showSearchFeedback(msg) {
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.innerHTML = `<div class="suggestion-item no-match"><span>${msg}</span></div>`;
      this.suggestionsDropdown.classList.remove("hidden");
    }
  }
}

// Bootstrap on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WatchWorldApp();
});
