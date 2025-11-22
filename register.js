const SERVER_URL = "http://127.0.0.1:2500";

async function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    // 비밀번호 확인
    if (password !== password2) {
        alert("비밀번호가 일치하지 않습니다!");
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();
        alert(result.msg);

        if (result.msg.includes("성공")) {
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error("회원가입 에러:", error);
    }
}
