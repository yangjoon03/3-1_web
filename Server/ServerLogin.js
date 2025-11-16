    // server.js
    const express = require("express");
    const cors = require("cors");
    const sqlite3 = require("sqlite3").verbose();
    const session = require("express-session");
    const bcrypt = require("bcrypt"); // 비밀번호 해시
    const app = express();
    const PORT = 2500;

    // -------------------------
    // 미들웨어
    // -------------------------
    app.use(cors({
        origin: "http://127.0.0.1:5500", // 프론트 주소
        credentials: true // 세션 쿠키 전달
    }));
    app.use(express.json());
    app.use(session({
        secret: "아주_복잡한_비밀키", 
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 1 } // 1시간
    }));

    // -------------------------
    // SQLite DB 연결
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
                    return res.json({ msg: "DB 오류 발생", error: err });
                }
                return res.json({ msg: "회원가입 성공!", user: email });
            });
        } catch (error) {
            return res.json({ msg: "해시 처리 중 오류", error });
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
            if (err) return res.json({ msg: "DB 오류", error: err });
            if (!row) return res.json({ msg: "존재하지 않는 이메일입니다." });

            const match = await bcrypt.compare(password, row.password);
            if (!match) return res.json({ msg: "비밀번호가 올바르지 않습니다." });

            // 로그인 성공 → 세션 저장
            req.session.user = { name: row.name, email: row.email };
            res.json({ msg: "로그인 성공!", user: row.name });
        });
    });

    // -------------------------
    // 로그인 상태 확인 (다른 창에서 사용 가능)
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
            if (err) return res.json({ msg: "로그아웃 실패", error: err });
            res.clearCookie("connect.sid"); // 세션 쿠키 삭제
            res.json({ msg: "로그아웃 성공!" });
        });
    });

    // -------------------------
    // 서버 실행
    // -------------------------
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
    });
