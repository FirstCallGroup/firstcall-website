# Compress hero videos for Cloudflare Pages (25 MiB per-file limit)
# Targets: 1280x720, H.264, CRF 28, no audio, faststart for streaming
# Run from repo root in a fresh PowerShell window (so ffmpeg PATH is loaded).

$ErrorActionPreference = "Stop"

$videos = @(
    @{ In = "assets\central-texas\videos\austin_hero.mp4";       Out = "assets\central-texas\videos\austin_hero.compressed.mp4" }
    @{ In = "assets\columbus\videos\columbus_downtown.mp4";      Out = "assets\columbus\videos\columbus_downtown.compressed.mp4" }
    @{ In = "shared\img\videos\production-flyover.mp4";          Out = "shared\img\videos\production-flyover.compressed.mp4" }
    @{ In = "assets\dfw\videos\dfw_hero.mp4";                    Out = "assets\dfw\videos\dfw_hero.compressed.mp4" }
)

foreach ($v in $videos) {
    Write-Host ""
    Write-Host "==> Encoding $($v.In)" -ForegroundColor Cyan
    ffmpeg -y -i $v.In `
        -vf "scale='min(1280,iw)':-2" `
        -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p `
        -movflags +faststart `
        -an `
        $v.Out
    if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed on $($v.In)" }

    $origSize = (Get-Item $v.In).Length / 1MB
    $newSize  = (Get-Item $v.Out).Length / 1MB
    Write-Host ("    {0:N1} MiB -> {1:N1} MiB" -f $origSize, $newSize) -ForegroundColor Green

    Move-Item -Force $v.Out $v.In
}

Write-Host ""
Write-Host "Done. Final sizes:" -ForegroundColor Yellow
foreach ($v in $videos) {
    $sz = (Get-Item $v.In).Length / 1MB
    Write-Host ("  {0,-55} {1,6:N2} MiB" -f $v.In, $sz)
}
