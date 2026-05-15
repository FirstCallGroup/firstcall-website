# Re-encode hero videos at higher quality. The first compression pass for
# the Cloudflare Pages 25 MiB limit was too aggressive: it dropped the
# main hero from 2560x1440 / 8 Mbps down to 1280x720 / 0.6 Mbps, which
# made it look blurry on retina screens. This re-encode targets full HD
# at CRF 23 — visually sharp, ~5-8 MB per file, still well under the limit.
#
# Run from repo root in a fresh PowerShell window:
#   powershell -ExecutionPolicy Bypass -File .\scripts\reencode-hero-videos.ps1
#
# Source videos are in reference/ which is gitignored — they are the
# untouched originals, not the in-repo compressed versions.

$ErrorActionPreference = "Stop"

$jobs = @(
    # FCG + FCM landing hero (used by both group and mechanical landing pages)
    @{ Src = "reference\video_assets\production_flyover.mp4";  Dst = "shared\img\videos\production-flyover.mp4" }

    # FCM branch landings (used on /columbus, /dfw, /central-texas)
    @{ Src = "reference\columbus\videos\columbus_downtown.mp4"; Dst = "assets\columbus\videos\columbus_downtown.mp4" }
    @{ Src = "reference\video_assets\dfw.mp4";                  Dst = "assets\dfw\videos\dfw_hero.mp4" }
    @{ Src = "reference\video_assets\atx.mp4";                  Dst = "assets\central-texas\videos\austin_hero.mp4" }
)

foreach ($j in $jobs) {
    if (-not (Test-Path $j.Src)) { Write-Warning "Missing source: $($j.Src) — skipping"; continue }
    Write-Host ""
    Write-Host "==> $($j.Src)  ->  $($j.Dst)" -ForegroundColor Cyan
    $tmp = $j.Dst + ".tmp.mp4"
    ffmpeg -y -i $j.Src `
        -vf "scale='min(1920,iw)':-2" `
        -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p `
        -movflags +faststart `
        -an `
        $tmp
    if ($LASTEXITCODE -ne 0) { Remove-Item -Force $tmp -ErrorAction SilentlyContinue; throw "ffmpeg failed on $($j.Src)" }
    Move-Item -Force $tmp $j.Dst
    $sz = (Get-Item $j.Dst).Length / 1MB
    Write-Host ("    output: {0:N2} MiB" -f $sz) -ForegroundColor Green
}

Write-Host ""
Write-Host "Final sizes:" -ForegroundColor Yellow
foreach ($j in $jobs) {
    if (Test-Path $j.Dst) {
        $sz = (Get-Item $j.Dst).Length / 1MB
        Write-Host ("  {0,-55} {1,7:N2} MiB" -f $j.Dst, $sz)
    }
}
