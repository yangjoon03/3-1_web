const SERVER_URL = "http://202.31.147.167:8081";


async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${SERVER_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),  // <- 여기 변경
            credentials: "include"
        });

        const result = await response.json();
        alert(result.msg);

        if (result.msg.includes("성공")) {
            window.location.href = "index.html";
        }

    } catch (error) {
        console.error("로그인 에러:", error);
    }
}
