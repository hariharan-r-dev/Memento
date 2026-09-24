!macro NSIS_HOOK_POSTINSTALL
  CopyFiles /SILENT "$INSTDIR\dlls\*.dll" "$INSTDIR"
  CopyFiles /SILENT "$INSTDIR\resources\dlls\*.dll" "$INSTDIR"
  CopyFiles /SILENT "$INSTDIR\resources\*.dll" "$INSTDIR"
!macroend
