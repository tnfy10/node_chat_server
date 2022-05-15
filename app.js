const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/user");
const Chat = require("./model/chat");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/local", {
    useNewUrlParser: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

app.use(express.json());

app.post("/register", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(204).send();
    } catch (e) {
        res.status(500).json({
            message: "User 저장 실패"
        });
    }
});

app.post("/login", async(req, res) => {
    console.log(req.body);

    try {
        User.findOne({id: req.body.id}, (err, user) => {
            if (!user) {
                return res.status(500).json({
                    message: "해당 유저 없음"
                });
            }

            if (user.pwd !== req.body.pwd) {
                return res.status(500).json({
                    message: "로그인 실패"
                });
            }

            return res.status(200).json({
                id: user.id,
                nickName: user.nickName
            });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "로그인 실패"
        });
    }
});

app.get("/chat", async(req, res) => {
    try {
        const chatList = await Chat.find({});
        res.status(200).send(chatList);
    } catch (e) {
        res.status(500).json({
            message: "채팅 목록 조회 실패"
        });
    }
});

const HTTPServer = app.listen(port, () => {
    console.log("Server is upo on port " + port);
});

const wsModule = require('ws');

const webSocketServer = new wsModule.Server(
    {
        server: HTTPServer
    }
);

webSocketServer.on('connection', (ws, request) => {
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    console.log(`새로운 클라이언트[${ip}] 접속`);

    ws.on('message', (msg) => {
        console.log(`클라이언트[${ip}]에게 수신한 메세지 : ${msg}`);

        webSocketServer.clients.forEach(client => {
            client.send(`${msg}`);
        });

        chatSave(JSON.parse(msg)).then(_ => {
            /* empty */
        });
    });

    ws.on('error', (error) => {
        console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`);
    });

    ws.on('close', () => {
        console.log(`클라이언트[${ip}] 웹소켓 연결 종료`);
    });
});

async function chatSave(json) {
    const chat = new Chat(json);

    try {
        await chat.save();
        console.log("대화 저장 성공");
    } catch (e) {
        console.log("대화 저장 실패");
        console.log(e);
    }
}