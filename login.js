const SERVER_URL = "http://127.0.0.1:2500";

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${SERVER_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json(); // 서버에서 JSON 데이터 받기
        console.log(data);

    } catch (error) {
        console.error('회원가입 에러:', error);
    }
}


async function  login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try{
        const response = await fetch('${SERVER_URL}/login'.{
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body : JSON.stringify({username,password})
        });
        const result = await response.json();
        alert(result.msg)
    }

    catch(error){
        console.error("로그인 에러",error);
    }


    
}