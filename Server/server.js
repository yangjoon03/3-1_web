const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path"); // path 모듈 추가
const app = express();

// -------------------------
// 서버 설정
// -------------------------
const PORT = 8081;
const HOST = "0.0.0.0"; // LAN 내 다른 장치에서도 접근 가능

// 정적 파일이 있는 폴더 (🚨 이 경로는 사용자 환경에 맞게 정확히 지정해야 합니다!)
const baseDir = "/3-1_web"; 

// -------------------------
// 미들웨어
// -------------------------
app.use(cors({
    origin: true, // 모든 origin 허용 (개발용)
    credentials: true // 세션 쿠키 전달 허용
}));
app.use(express.json());

// 💡 정적 파일 서빙 미들웨어: /index.html, .css, .js 등의 파일 요청을 처리합니다.
app.use(express.static(baseDir));

app.use(session({
    secret: "아주_복잡한_비밀키", 
    resave: false,
    saveUninitialized: true,
    // 클라이언트와 서버가 같은 도메인이 아니라면 sameSite: 'lax' 또는 'none' 고려
    cookie: { 
        maxAge: 1000 * 60 * 1, // 1시간
        sameSite: 'lax' // 보안을 위해 추가
    } 
}));

// -------------------------
// SQLite DB 연결 및 테이블 생성
// -------------------------
const db = new sqlite3.Database("users.db", (err) => {
    if (err) console.error("DB 연결 실패:", err);
    else console.log("SQLite DB 연결 성공");
});

// 테이블 생성
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

// -------------------------
// 회원가입
// -------------------------
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ msg: "모든 입력값이 필요합니다." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.json({ msg: "이미 사용 중인 이메일입니다." });
                }
                console.error("DB 오류 발생:", err);
                return res.json({ msg: "DB 오류 발생", error: err.message });
            }
            return res.json({ msg: "회원가입 성공!", user: email });
        });
    } catch (error) {
        console.error("해시 처리 중 오류:", error);
        return res.json({ msg: "서버 오류: 해시 처리 중 오류", error });
    }
});



// -------------------------
// 로그인
// -------------------------
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ msg: "이메일 또는 비밀번호를 입력하세요." });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, row) => {
        if (err) {
            console.error("DB 오류:", err);
            return res.json({ msg: "DB 오류", error: err.message });
        }
        if (!row) return res.json({ msg: "존재하지 않는 이메일입니다." });

        try {
            const match = await bcrypt.compare(password, row.password);
            if (!match) return res.json({ msg: "비밀번호가 올바르지 않습니다." });

            // 로그인 성공 → 세션 저장
            req.session.user = { name: row.name, email: row.email };
            res.json({ msg: "로그인 성공!", user: row.name });
        } catch (compareError) {
            console.error("비밀번호 비교 중 오류:", compareError);
            return res.json({ msg: "서버 오류: 비밀번호 비교 실패" });
        }
    });
});



// -------------------------
// 로그인 상태 확인
// -------------------------
app.get("/check-login", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// -------------------------
// 로그아웃
// -------------------------
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("로그아웃 실패:", err);
            return res.json({ msg: "로그아웃 실패", error: err.message });
        }
        // 세션 쿠키 삭제 (클라이언트 측에서도 세션 정보 삭제 유도)
        res.clearCookie("connect.sid"); 
        res.json({ msg: "로그아웃 성공!" });
    });
});

// -------------------------
// 서버 실행
// -------------------------
app.listen(PORT, HOST, () => {
    console.log(`✅ 서버가 http://${HOST}:${PORT} 에서 실행 중입니다.`);
    console.log(`Serving all files from: ${baseDir}`);
});