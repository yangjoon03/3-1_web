/**
 * register.js
 * Node.js 서버의 /register 엔드포인트와 통신하여 회원가입을 처리하는 스크립트
 */

// 서버의 기본 URL (Node.js 서버가 실행 중인 주소)
const SERVER_URL = "http://127.0.0.1:8081";

/**
 * 회원가입 폼 제출 이벤트 핸들러.
 * @param {Event} event - 폼 제출 이벤트 객체
 */
async function registerUser(event) {
    // 폼의 기본 제출 동작(페이지 새로고침) 방지
    event.preventDefault();

    // 1. 입력 필드에서 값 가져오기
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    // 2. 클라이언트 측 유효성 검사: 비밀번호 일치 확인
    if (password !== password2) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        // 비밀번호 입력 필드를 초기화하여 재입력을 유도
        document.getElementById("password").value = '';
        document.getElementById("password2").value = '';
        return;
    }

    // 3. 서버에 회원가입 요청 전송
    try {
        const response = await fetch(`${SERVER_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // 이름, 이메일, 비밀번호를 JSON 형태로 서버에 전송
            body: JSON.stringify({ name, email, password }),
        });

        // HTTP 응답 상태 확인
        if (!response.ok) {
            alert(`회원가입 중 서버 오류 발생: ${response.status}`);
            return;
        }

        const result = await response.json();
        
        // 4. 서버 응답 처리
        if (result.msg === "회원가입 성공!") {
            alert(`🎉 ${result.user}님, 회원가입이 성공적으로 완료되었습니다!`);
            // 회원가입 성공 후 로그인 페이지로 리다이렉션
            window.location.href = "login.html"; 
        } else {
            // 회원가입 실패 메시지 출력 (예: "이미 사용 중인 이메일입니다.")
            alert(`회원가입 실패: ${result.msg}`);
        }

    } catch (error) {
        // 네트워크 연결 문제 등 기타 오류 처리
        console.error("회원가입 요청 중 오류 발생:", error);
        alert("네트워크 연결 또는 서버에 문제가 발생했습니다.");
    }
}