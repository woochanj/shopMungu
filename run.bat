@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org 에서 설치 후 다시 실행하세요.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo 의존성 설치 중...
    call npm install
    if errorlevel 1 (
        echo [오류] npm install 실패
        pause
        exit /b 1
    )
)

echo.
echo 문구도매센터 개발 서버를 시작합니다.
echo 브라우저: http://localhost:3200
echo 종료: Ctrl+C
echo.

start "" "http://localhost:3200"
call npm run dev

if errorlevel 1 (
    echo.
    echo [오류] 개발 서버 실행 실패
    pause
    exit /b 1
)
