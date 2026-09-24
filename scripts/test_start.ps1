$releaseBin = 'D:\Hariharan R\Lucky charm\release-bin'
$homeDir = [System.Environment]::GetFolderPath('UserProfile')
$mingwBin = Join-Path $homeDir 'AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin'
$env:PATH = "$releaseBin;$mingwBin;$env:PATH"
$env:Path = "$releaseBin;$mingwBin;$env:Path"

$p = Start-Process -FilePath "$releaseBin\Lucky-Charm.exe" -WorkingDirectory $releaseBin -PassThru
Start-Sleep -Seconds 2
Write-Host "PID: $($p.Id) HasExited: $($p.HasExited)"
if ($p.HasExited) {
    Write-Host "ExitCode: $($p.ExitCode)"
} else {
    Write-Host "Process is happily running!"
}
