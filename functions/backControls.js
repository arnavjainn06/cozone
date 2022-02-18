const users = [];

function newUser(id, name, room) {
    const user = { name, id, room };
    users.push(user);
}

function getGlobalUsers() {
    return users;
}

function userExit(id) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1);
    }
}

function getUsersByRoom(room) {
    let byRoomUsers = users.filter((user) => user.room === room);
    return byRoomUsers;
}

function queryUser(id) {
    let index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users[index].name;
    }
}

module.exports = {
    newUser,
    getGlobalUsers,
    userExit,
    getUsersByRoom,
    queryUser,
};
