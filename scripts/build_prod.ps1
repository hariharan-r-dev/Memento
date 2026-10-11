Write-Host "=== 0. Terminating old instances ==="
Get-Process -Name "*memento*", "*Memento*", "*lucky*", "*Lucky*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

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
Get-Process -Name "*memento*", "*Memento*", "*lucky*", "*Lucky*" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

$targetRelease = "$env:TEMP\lucky-charm-target\release"
$releaseBin = "D:\Hariharan R\Lucky charm\release-bin"
New-Item -ItemType Directory -Path $releaseBin -Force | Out-Null

# Check for Memento.exe or lucky_charm.exe
$builtExe = "$targetRelease\lucky_charm.exe"
if (-not (Test-Path $builtExe)) {
    $builtExe = "$targetRelease\Memento.exe"
}
if (-not (Test-Path $builtExe)) {
    $builtExe = "$targetRelease\memento.exe"
}

if (Test-Path $builtExe) {
    Copy-Item $builtExe "$releaseBin\Memento.exe" -Force
    Copy-Item $builtExe "$releaseBin\Lucky-Charm.exe" -Force
    Write-Host "Copied $builtExe -> $releaseBin\Memento.exe and $releaseBin\Lucky-Charm.exe"
}

$builtNsis = Get-ChildItem "$targetRelease\bundle\nsis\*.exe" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($builtNsis) {
    Copy-Item $builtNsis.FullName "$releaseBin\Memento-Setup.exe" -Force
    Copy-Item $builtNsis.FullName "$releaseBin\Lucky-Charm-Setup.exe" -Force
    Write-Host "Copied $($builtNsis.FullName) -> $releaseBin\Memento-Setup.exe and $releaseBin\Lucky-Charm-Setup.exe"
}

$builtMsi = Get-ChildItem "$targetRelease\bundle\msi\*.msi" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($builtMsi) {
    Copy-Item $builtMsi.FullName "$releaseBin\Lucky-Charm.msi" -Force
    Copy-Item $builtMsi.FullName "$releaseBin\Memento.msi" -Force
    Write-Host "Copied $($builtMsi.FullName) -> $releaseBin\Lucky-Charm.msi and $releaseBin\Memento.msi"
}

# Update installed application directories if present
if (Test-Path "D:\Applications\Lucky Charm") {
    if (Test-Path $builtExe) {
        Copy-Item $builtExe "D:\Applications\Lucky Charm\Lucky-Charm.exe" -Force
    }
    if ($builtNsis) {
        Copy-Item $builtNsis.FullName "D:\Applications\Lucky Charm\Lucky-Charm-Setup.exe" -Force
    }
    if ($builtMsi) {
        Copy-Item $builtMsi.FullName "D:\Applications\Lucky Charm\Lucky-Charm.msi" -Force
    }
    Write-Host "Updated D:\Applications\Lucky Charm"
}

if (Test-Path "D:\Applications\Memento") {
    if (Test-Path $builtExe) {
        Copy-Item $builtExe "D:\Applications\Memento\lucky_charm.exe" -Force
        Copy-Item $builtExe "D:\Applications\Memento\Memento.exe" -Force
    }
    Write-Host "Updated D:\Applications\Memento"
}

Write-Host "=== Build and packaging complete ==="
