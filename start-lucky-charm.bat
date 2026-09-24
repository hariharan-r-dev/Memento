@echo off
title Lucky Charm Launcher
cd /d "%~dp0"

set "PATH=C:\Users\HarisH\AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin;%~dp0release-bin;C:\Users\HarisH\.cargo\bin;C:\Program Files\nodejs;%PATH%"
set "CARGO_TARGET_DIR=%TEMP%\lucky-charm-target"

if exist "release-bin\Lucky-Charm.exe" (
    echo Starting Lucky Charm Native Desktop App...
    start "" "%~dp0release-bin\Lucky-Charm.exe"
    exit /b 0
)

echo Starting Lucky Charm in Development Mode...
npm run tauri dev
