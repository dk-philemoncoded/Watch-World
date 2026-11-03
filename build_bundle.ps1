# Build bundle.js from individual modules
$header = @"
/**
 * PHILL - World Watch & Planetary Timepiece
 * Unified Production Bundle (Self-Contained, Zero External Dependencies)
 * 2D Swiss Dial Engine, 3D Buckled Timepiece WebGL Engine, Animated Horizon & Human Activity Scenery, World Time Resolver, & Web Audio
 */

(function() {
  "use strict";

"@

$footer = @"

})();
"@

function Clean-Module($content) {
    # Replace lines starting with "export default " with ""
    $content = $content -replace "(?m)^\s*export\s+default\s+", ""
    # Replace lines starting with "export " with ""
    $content = $content -replace "(?m)^\s*export\s+", ""
    # Remove lines starting with "import "
    $content = $content -replace "(?m)^\s*import\s+.*?;?\s*$", ""
    return $content
}

# 1. world-cities.js
$citiesContent = Clean-Module (Get-Content -Raw -Encoding utf8 -Path ".\world-cities.js")

# 2. sound.js
$soundContent = Clean-Module (Get-Content -Raw -Encoding utf8 -Path ".\sound.js")

# 3. watch.js
$watchContent = Clean-Module (Get-Content -Raw -Encoding utf8 -Path ".\watch.js")

# 4. watch3d.js
$watch3DContent = Clean-Module (Get-Content -Raw -Encoding utf8 -Path ".\watch3d.js")

# 5. scenery.js
$sceneryContent = Clean-Module (Get-Content -Raw -Encoding utf8 -Path ".\scenery.js")

# 6. app.js
$appContent = Clean-Module (Get-Content -Raw -Encoding utf8 -Path ".\app.js")

$bundleContent = $header + `
"`r`n  // =========================================================================`r`n  // 1. World Locations & Timezone Resolver`r`n  // =========================================================================`r`n" + $citiesContent + `
"`r`n  // =========================================================================`r`n  // 2. Sound Engine`r`n  // =========================================================================`r`n" + $soundContent + `
"`r`n  // =========================================================================`r`n  // 3. 2D Swiss Watch Dial Engine (PHILL)`r`n  // =========================================================================`r`n" + $watchContent + `
"`r`n  // =========================================================================`r`n  // 4. 3D Buckled Wristwatch WebGL Engine (PHILL)`r`n  // =========================================================================`r`n" + $watch3DContent + `
"`r`n  // =========================================================================`r`n  // 5. Horizon & Vector Character Scenery Engine`r`n  // =========================================================================`r`n" + $sceneryContent + `
"`r`n  // =========================================================================`r`n  // 6. Application Controller`r`n  // =========================================================================`r`n" + $appContent + $footer

[System.IO.File]::WriteAllText("c:\Users\Dream\Documents\Antigravity\Watch World\bundle.js", $bundleContent, [System.Text.Encoding]::UTF8)

Write-Host "bundle.js built successfully. Size: $( (Get-Item '.\bundle.js').Length ) bytes."
