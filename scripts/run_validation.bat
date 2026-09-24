@echo off
taskkill /F /IM Lucky-Charm.exe >nul 2>&1
taskkill /F /IM lucky_charm.exe >nul 2>&1
timeout /t 1 /nobreak >nul

set RELEASE_BIN=D:\Hariharan R\Lucky charm\release-bin
set MINGW_BIN=%USERPROFILE%\AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin
set PATH=%RELEASE_BIN%;%MINGW_BIN%;%PATH%

start "" "%RELEASE_BIN%\Lucky-Charm.exe"
timeout /t 3 /nobreak >nul

"%~dp0HitTester.exe"
