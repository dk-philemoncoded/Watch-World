# Lightweight Local Web Server for Watch World
param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
} catch {
    Write-Host "Port $Port is busy, trying $(Port + 1)..."
    $Port = $Port + 1
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
}

Write-Host "=========================================================="
Write-Host " Watch World Server running at: http://localhost:$Port/"
Write-Host " Press Ctrl+C to stop the server."
Write-Host "=========================================================="

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = Get-Location }

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

# Open browser
$url = "http://localhost:$Port/"
if (Test-Path "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe") {
    Start-Process "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" $url
} elseif (Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") {
    Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" $url
} else {
    Start-Process $url
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) {
            $relPath = "index.html"
        }

        $filePath = Join-Path $baseDir $relPath
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }
            $response.ContentType = $mime

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
