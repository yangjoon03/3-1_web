
const SERVER_URL = "http://127.0.0.1:8081";

/**
 * 로그인 폼 제출 이벤트 핸들러.
 * @param {Event} event - 폼 제출 이벤트 객체
 */
async function login(event) {
    // 폼의 기본 제출 동작(페이지 새로고침) 방지
    event.preventDefault();

    // 입력 필드에서 값 가져오기
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("이메일과 비밀번호를 모두 입력해주세요.");
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // 이메일과 비밀번호를 JSON 형태로 서버에 전송
            body: JSON.stringify({ email, password }),
        });

        // HTTP 응답이 성공적인지 확인
        if (!response.ok) {
            // 서버에서 500 등 오류 코드를 반환한 경우
            alert(`로그인 중 서버 오류 발생: ${response.status}`);
            return;
        }

        const result = await response.json();
        
        // 서버에서 보낸 JSON 응답 처리
        if (result.msg === "로그인 성공!") {
            alert(`환영합니다, ${result.user}님!`);
            // 로그인 성공 후 메인 페이지(예: index.html)로 이동
            window.location.href = "/index.html"; 
        } else {
            // 로그인 실패 메시지 출력 (예: "존재하지 않는 이메일입니다.", "비밀번호가 올바르지 않습니다.")
            alert(`로그인 실패: ${result.msg}`);
        }

    } catch (error) {
        // 네트워크 연결 문제, CORS 오류 등 기타 오류 처리
        console.error("로그인 요청 중 오류 발생:", error);
        alert("네트워크 연결 또는 서버에 문제가 발생했습니다.");
    }
}