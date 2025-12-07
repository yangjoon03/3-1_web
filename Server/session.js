
// 페이지 로드 시 로그인 상태 확인
async function checkLogin() {
  try {
    const response = await fetch("http://202.31.147.167:8081/check-login", {
      credentials: "include" // 쿠키 전달 필수
    });
    const data = await response.json();

    if (data.loggedIn) {
      console.log("로그인 상태:", data.user);
      // 예: 로그인된 사용자 이름을 화면에 표시할 수 있음
      // document.getElementById("usernameDisplay").textContent = data.user.name;
    } else {
      console.log("로그인 안 됨");
      // 예: 로그인하지 않은 사용자용 UI 처리
      // window.location.href = "login.html"; // 원하면 로그인 페이지로 이동
    }

  } catch (error) {
    console.error("로그인 상태 확인 실패:", error);
  }
}

// 페이지가 로드되면 로그인 상태 체크
checkLogin();
