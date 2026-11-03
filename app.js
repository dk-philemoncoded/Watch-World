/**
 * Antigravity "PHILL" World Time Application Controller
 * Orchestrates global search (countries, cities, towns),
 * high-speed horological hand spinning & mechanical deceleration,
 * and dynamic atmospheric background themes.
 */

import { WORLD_CITIES, WORLD_COUNTRIES, searchCities, resolveAnyLocation, getTimeInfoForZone } from "./world-cities.js";
import { soundEngine } from "./sound.js";
import { WatchEngine } from "./watch.js";
import { Watch3DEngine } from "./watch3d.js";
import { HorizonScenery } from "./scenery.js";

class WatchWorldApp {
  constructor() {
    // DOM Elements
    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.suggestionsDropdown = document.getElementById("suggestions-dropdown");
    this.popularChips = document.querySelectorAll(".city-chip");

    this.heroStage = document.getElementById("hero-stage");
    this.watchWrapper = document.getElementById("watch-wrapper");
    this.watch3DCanvas = document.getElementById("watch-3d-canvas");
    this.watchCanvas = document.getElementById("watch-canvas");
    this.horizonCanvas = document.getElementById("horizon-canvas");
    this.watchTelemetryEl = document.getElementById("watch-telemetry");

    // Info Display Elements
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

    // Background Container
    this.body = document.body;
    this.skyBackground = document.getElementById("sky-background");
    this.starsLayer = document.getElementById("stars-layer");
    this.sunMoonGlow = document.getElementById("sun-moon-glow");

    // State
    this.selectedCity = null;
    this.userHomeTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    this.isTransitioning = false;
    this.liveClockTimer = null;
    this.telemetryTimer = null;

    this.initEngines();
    this.generateStarfield();
    this.bindEvents();
    this.initDefaultLocation();
  }

  initEngines() {
    // 2D Swiss luxury dress watch engine (renders live dial texture)
    this.watch = new WatchEngine(this.watchCanvas, soundEngine);
    // 3D Buckled Wristwatch WebGL engine
    this.watch3D = new Watch3DEngine(this.watch3DCanvas, this.watch, soundEngine);
    // Animated Horizon & 2D Vector Human Activity Scenery
    this.scenery = new HorizonScenery(this.horizonCanvas);
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

      this.showSearchFeedback(`Locating "${query}"...`);
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
        icon.textContent = isSoundOn ? "ON" : "OFF";
      }
    });

    // Watch Finish Selection (Yellow Gold, Rose Gold, White Gold, Platinum)
    this.finishButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        soundEngine.init();
        this.finishButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const finish = btn.dataset.finish;
        this.watch.setFinish(finish);
        if (this.watch3D) {
          this.watch3D.setFinish(finish);
        }
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
        <span class="city-badge">${item.code || "LOC"}</span>
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
                        WORLD_CITIES.find(c => c.name === "London") ||
                        WORLD_COUNTRIES.find(c => c.name === "United Kingdom");

    this.selectLocation(matchedCity || {
      name: "London",
      country: "United Kingdom",
      code: "GB",
      lat: 51.5074,
      lng: -0.1278,
      tz: "Europe/London"
    }, false);
  }

  /**
   * The Central Climax Sequence:
   * 1. Telemetry HUD activates with destination name.
   * 2. The watch hands spin rapidly forward with mechanical gear whirl.
   * 3. Hands gradually decelerate and smoothly lock onto the destination time with crystal chime.
   * 4. Background sky atmosphere seamlessly morphs to match the local solar time.
   */
  selectLocation(city, isUserTriggered = true) {
    this.selectedCity = city;

    // Get time information for the target city or country
    const timeInfo = getTimeInfoForZone(city.tz);

    // Update digital readout and meta cards
    this.updateInfoCards(city, timeInfo);

    if (!isUserTriggered) {
      // Direct set without fast spin animation
      this.watch.setTime(timeInfo, false);
      if (this.watch3D) {
        this.watch3D.setFinish(this.watch.finish);
      }
      this.applyBackgroundTheme(timeInfo);
      this.setTelemetry(`${city.name.toUpperCase()} - SYNCHRONIZED`, false);
      this.startLiveClock();
      return;
    }

    this.isTransitioning = true;

    // --- Fast Hand Spin & Deceleration Animation ---
    this.setTelemetry(`TARGETING ${city.name.toUpperCase()} - SPINNING HANDS...`, true);

    // Background theme starts morphing as the hands spin
    this.applyBackgroundTheme(timeInfo);

    if (this.watch3D) {
      this.watch3D.spinToLocation(timeInfo);
    }

    this.watch.setTime(timeInfo, true, () => {
      // When hands finish spinning and lock onto time
      this.setTelemetry(`${city.name.toUpperCase()} - SYNCHRONIZED`, false);
      this.isTransitioning = false;
      this.startLiveClock();
    });
  }

  setTelemetry(msg, isPulsing = false) {
    if (!this.watchTelemetryEl) return;
    this.watchTelemetryEl.innerHTML = msg;
    this.watchTelemetryEl.classList.add("visible");
    this.watchTelemetryEl.classList.toggle("pulse", isPulsing);

    clearTimeout(this.telemetryTimer);
    if (!isPulsing) {
      this.telemetryTimer = setTimeout(() => {
        if (this.watchTelemetryEl) {
          this.watchTelemetryEl.classList.remove("visible", "pulse");
        }
      }, 4000);
    }
  }

  updateInfoCards(city, timeInfo) {
    if (!city) return;

    // Defensively sanitize city and country to ensure no "undefined" or null appears
    const rawName = city.name || "";
    const rawCountry = city.country || "";

    const cleanName = String(rawName)
      .replace(/^undefined\s*/i, "")
      .replace(/^null\s*/i, "")
      .trim() || (rawCountry ? String(rawCountry).trim() : "Location");

    let cleanCountry = String(rawCountry)
      .replace(/^undefined\s*/i, "")
      .replace(/^null\s*/i, "")
      .trim();
    if (cleanCountry.toLowerCase() === "undefined" || cleanCountry.toLowerCase() === "null") {
      cleanCountry = "";
    }

    if (this.locationNameEl) this.locationNameEl.textContent = cleanName;
    if (this.locationCountryEl) this.locationCountryEl.textContent = cleanCountry;

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

    const tzRegion = (city.tz && city.tz.includes("/")) ? city.tz.split("/")[1].replace(/_/g, " ") : (city.tz || "UTC");
    if (this.timezoneBadgeEl) this.timezoneBadgeEl.textContent = `${timeInfo.offsetStr || "UTC"} | ${tzRegion}`;

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
      const solarStatusNames = {
        dawn: "Dawn / Sunrise",
        day: "Broad Daylight",
        sunset: "Golden Hour Sunset",
        dusk: "Twilight / Dusk",
        night: "Starlit Night"
      };
      this.solarStatusEl.textContent = solarStatusNames[timeInfo.timeOfDay] || "Daytime";
    }

    if (this.coordsBadgeEl) {
      const latStr = `${Math.abs(city.lat).toFixed(2)} ${city.lat >= 0 ? "N" : "S"}`;
      const lngStr = `${Math.abs(city.lng).toFixed(2)} ${city.lng >= 0 ? "E" : "W"}`;
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
      const hour = timeInfo.decimalHour;
      let glowX = ((hour / 24) * 100);
      let glowY = 30 + Math.sin(((hour - 6) / 12) * Math.PI) * -20;

      this.sunMoonGlow.style.left = `${glowX}%`;
      this.sunMoonGlow.style.top = `${glowY}%`;
    }

    // Update Animated Horizon & 2D Vector Human Activity Scenery
    if (this.scenery) {
      this.scenery.setTime(theme, timeInfo.decimalHour);
    }
  }

  startLiveClock() {
    if (this.liveClockTimer) clearInterval(this.liveClockTimer);

    this.liveClockTimer = setInterval(() => {
      if (!this.selectedCity || this.isTransitioning) return;
      const updatedInfo = getTimeInfoForZone(this.selectedCity.tz);
      this.updateInfoCards(this.selectedCity, updatedInfo);
      this.watch.currentTime = { ...updatedInfo };
      if (this.currentTheme !== updatedInfo.timeOfDay) {
        this.currentTheme = updatedInfo.timeOfDay;
        this.applyBackgroundTheme(updatedInfo);
      }
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
