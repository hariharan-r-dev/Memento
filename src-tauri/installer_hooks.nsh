!macro NSIS_HOOK_PREINSTALL
  nsExec::Exec 'taskkill /F /IM Memento.exe /T'
  nsExec::Exec 'taskkill /F /IM Lucky-Charm.exe /T'
  nsExec::Exec 'taskkill /F /IM lucky_charm.exe /T'
!macroend

!macro NSIS_HOOK_POSTINSTALL
  CopyFiles /SILENT "$INSTDIR\dlls\*.dll" "$INSTDIR"
  CopyFiles /SILENT "$INSTDIR\resources\dlls\*.dll" "$INSTDIR"
  CopyFiles /SILENT "$INSTDIR\resources\*.dll" "$INSTDIR"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  nsExec::Exec 'taskkill /F /IM Memento.exe /T'
  nsExec::Exec 'taskkill /F /IM Lucky-Charm.exe /T'
  nsExec::Exec 'taskkill /F /IM lucky_charm.exe /T'
!macroend
