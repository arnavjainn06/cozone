var express = require("express"),
    http = require("http");
//make sure you keep this order
var app = express();
var server = http.createServer(app);
const io = require("socket.io")(server);

// const {
//     exportUser,
//     queryUser,
//     userLeave,
//     getAllUsers,
// } = require("./functions/users");

const {
    newUser,
    getGlobalUsers,
    userExit,
    getUsersByRoom,
    queryUser,
} = require("./functions/backControls");

app.set("view engine", "ejs");
app.use(express.static("public"));

// Null Indexed
app.get("/", (req, res) => {
    res.redirect(`/create`);
});

app.get("/docs", (req, res) => {
    res.render("docs");
});

// Creation entrypoint
//* Render pattern: Backend > frontend > views > [EJS Engine] > Files
app.get("/create", (req, res) => {
    res.render("create.ejs");
});

let name = null;

app.get("/join/:room", (req, res) => {
    res.render("join.ejs", { room: req.params.room });
});

app.get("/room-primary/:name/:room", (req, res) => {
    name = req.params.name;
    res.redirect(`/room/${req.params.room}`);
});

app.get("/room/:room", (req, res) => {
    if (name === null) {
        res.redirect(`/join/${req.params.room}`);
    }
    res.render("room.ejs", { room: req.params.room, name: name });
    name = null;
});

io.on("connection", function (socket) {
    let ROOM;

    //* On creation of new chat room
    socket.on("join-room", (room, name) => {
        const user = newUser(socket.id, name, room);

        socket.join(room);
        ROOM = room;
        io.to(room).emit("new-connection", name);
        io.to(room).emit("users", getUsersByRoom(room));
    });

    socket.on("send", (data) => {
        io.to(ROOM).emit("message", data);
    });

    socket.on("leaving", (name) => {
        userExit(socket.id);
        io.to(ROOM).emit("users", getUsersByRoom(ROOM));
        io.to(ROOM).emit("disconnection", name);
    });

    socket.on("typing-out", (sender) => {
        io.to(ROOM).emit("typing-in", sender);
    });

    socket.on("typing-stopped", () => {
        io.to(ROOM).emit("hide-typing");
    });

    socket.on("disconnect", () => {
        const name = queryUser(socket.id);

        if (name !== undefined) {
            console.log(`${name} disconnected...`);
            userExit(socket.id);
            io.to(ROOM).emit("users", getUsersByRoom(ROOM));
            io.to(ROOM).emit("disconnection", name);
        }
    });
});

server.listen(3000, () => {
    console.log("SERVER ONLINE");
});
