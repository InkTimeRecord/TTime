!define APP_NAME "TTime"
!define MUI_FINISHPAGE_LINK "官方网站 : https://ttime.timerecord.cn"
!define MUI_FINISHPAGE_LINK_LOCATION "https://ttime.timerecord.cn"

; 开机自启配置必须在 BUILD_UNINSTALLER 这里面加载 否则打包时会报错
!ifndef BUILD_UNINSTALLER
  ; 添加开机自启配置
  Function AutoStartup
      WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}" "$INSTDIR\${APP_NAME}.exe"
  FunctionEnd

  !define MUI_FINISHPAGE_SHOWREADME
  !define MUI_FINISHPAGE_SHOWREADME_TEXT "开机自启"
  !define MUI_FINISHPAGE_SHOWREADME_FUNCTION AutoStartup
!endif

; 安装时触发
!macro customInstall
  ; 注册表中检测 VC_redist.x64.exe DLL 是否安装
  ; VC_redist.x64.exe 下载来源：https://aka.ms/vs/17/release/VC_redist.x64.exe
  ; 目前内置 VC_redist.x64.exe 的版本号为 14.34
  ; 目前下面校验有个问题：
  ;   因为内置的版本是 14.34 ，而如果用户电脑上当前安装的版本大于 14.34 时下列校验就会以为没有安装 VC_redist
  ;   所以这里手动把大于 14.34 的新版本加入到下列中作判断 如果后续 VC_redist 版本更新了 下面的校验也需要同步更新
  ;   最新版本号是通过上面的下载来源获取到的最新版本查看的
  ReadRegStr $0 HKEY_CLASSES_ROOT "Installer\Dependencies\VC,redist.x64,amd64,14.34,bundle" "Version"
  ${If} $0 == ""
      ReadRegStr $0 HKEY_CLASSES_ROOT "Installer\Dependencies\VC,redist.x64,amd64,14.35,bundle" "Version"
  ${EndIf}
  ${If} $0 == ""
      ReadRegStr $0 HKEY_CLASSES_ROOT "Installer\Dependencies\VC,redist.x64,amd64,14.36,bundle" "Version"
  ${EndIf}
  ${If} $0 == ""
      ReadRegStr $0 HKEY_CLASSES_ROOT "Installer\Dependencies\VC,redist.x64,amd64,14.37,bundle" "Version"
  ${EndIf}
  ${If} $0 == ""
      ; 不存在则提示安装
      MessageBox MB_OK "检测到电脑缺少DLL依赖文件，点击确认后将会弹出更新界面"
      File /oname=$PLUGINSDIR\VC_redist.x64.exe "${BUILD_RESOURCES_DIR}\VC_redist.x64.exe"
      ExecWait '"$PLUGINSDIR\VC_redist.x64.exe"'
  ${EndIf}

; 安装时删除开机自启配置 防止如果用户前一个版本是开机自启的
; 但是覆盖安装新版本时选择不开机自启 最后开启自启逻辑还在 导致安装时即使设置的关闭开机自启 但应用启动时还是开启自启状态的
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}"
!macroend

; 卸载时删除开机自启配置
!macro customUnInstall
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}"
!macroend

; 选择的安装路径尾部自动追加应用名称
Function .onVerifyInstDir
  StrLen $0 "\${APP_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0
  StrCmp $1 "\${APP_NAME}" +2 0
  StrCpy $INSTDIR "$INSTDIR\${APP_NAME}"
FunctionEnd
