const SERVER_URL = "http://127.0.0.1:8081";

<<<<<<< HEAD
// 페이지 로드 시 로그인 상태 확인
async function checkLogin() {
  try {
    const response = await fetch("http://202.31.147.167:8081/check-login", {
      credentials: "include" // 쿠키 전달 필수
    });
    const data = await response.json();
=======
async function checkLoginStatus() {
    const statusDiv = document.getElementById('login-status'); // 상태 표시를 위한 HTML 요소
    
    try {
        const response = await fetch(`${SERVER_URL}/check-login`, {
            credentials: 'include'
        });
        const data = await response.json();
>>>>>>> e9f6bf6827438b9627ea210b2307645c23b151c6

        if (data.loggedIn) {
            // 로그인 상태
            console.log("✅ 세션 유효: 현재 로그인 상태입니다.");
            if (statusDiv) {
                statusDiv.innerHTML = `환영합니다, <strong>${data.user.name}</strong>님! <button onclick="logout()">로그아웃</button>`;
            }
        } else {
            // 로그아웃 상태 또는 세션 만료 시
            // 🚨 세션이 끝났을 때 콘솔에 출력하는 부분
            console.warn("⚠️ 세션 만료 또는 로그아웃 상태: 로그인 정보가 없습니다.");
            
            if (statusDiv) {
                statusDiv.innerHTML = `<a href="/login.html">로그인</a> | <a href="/register.html">회원가입</a>`;
            }
        }

    } catch (error) {
        console.error("🚨 상태 확인 중 오류 발생: 서버에 연결할 수 없습니다.", error);
    }
}

// 페이지가 로드될 때 로그인 상태를 확인합니다.
window.onload = checkLoginStatus;