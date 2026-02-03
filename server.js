require("./models/agent");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const sequelize = require("./config/db");
const usersRouter = require("./routes/user");
const timeOfDayRouter = require("./routes/timeofday.js");
const sendmonyRouter = require("./routes/send_mony.js");
const counterRouter = require("./routes/counter.js");
const notifications = require("./routes/notifications.js");
const agentsRouter = require("./routes/agents.js");
const adsRouter = require("./routes/ads");
const stateCounterRouter = require("./routes/StateCounter");
const chat = require("./routes/chatRoutes");
const cors = require("cors");
require("./cron");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    },
    allowEIO3: true
});

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use("/uploads", express.static("./" + "uploads"));
app.use(express.static("public"));


sequelize.sync({ force: false, logging: false }).then(() => {console.log("✅ Database & User table synced!");
    }).catch(err => console.error("❌ Error syncing database:", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});



app.use("/", usersRouter);
app.use("/", sendmonyRouter);
app.use("/timeofday", timeOfDayRouter);
app.use("/", counterRouter);
app.use("/", notifications);
app.use("/", agentsRouter);
app.use("/", adsRouter);
app.use("/", stateCounterRouter);
app.use("/", chat.router);

const chatNamespace = io.of("/chat");
chat.initChatSocket(chatNamespace);


server.listen(1300, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:1300`);
});