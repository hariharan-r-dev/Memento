$ErrorActionPreference = "Stop"

Write-Host "=== 1. Building Frontend ==="
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed!"
    exit 1
}

Write-Host "=== 2. Building Tauri Application ==="
$homeDir = [System.Environment]::GetFolderPath('UserProfile')
$mingwBin = Join-Path $homeDir "AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin"
$env:PATH = "$mingwBin;$env:PATH"
$env:Path = "$mingwBin;$env:Path"
$env:CARGO_TARGET_DIR = "$env:TEMP\lucky-charm-target"

npm run tauri -- build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Tauri build failed!"
    exit 1
}

Write-Host "=== 3. Copying binaries to release-bin ==="
$targetRelease = "$env:TEMP\lucky-charm-target\release"
$releaseBin = "D:\Hariharan R\Lucky charm\release-bin"
New-Item -ItemType Directory -Path $releaseBin -Force | Out-Null

$builtExe = "$targetRelease\lucky_charm.exe"
if (Test-Path $builtExe) {
    Copy-Item $builtExe "$releaseBin\Lucky-Charm.exe" -Force
    Write-Host "Copied $builtExe -> $releaseBin\Lucky-Charm.exe"
}

$builtNsis = Get-ChildItem "$targetRelease\bundle\nsis\*.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($builtNsis) {
    Copy-Item $builtNsis.FullName "$releaseBin\Lucky-Charm-Setup.exe" -Force
    Write-Host "Copied $($builtNsis.FullName) -> $releaseBin\Lucky-Charm-Setup.exe"
}

Write-Host "=== Build and packaging complete ==="
