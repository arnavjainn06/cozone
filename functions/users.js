const users = [];

function exportUser(id, name, room) {
    const user = { id, name, room };
    users.push(user);

    return user;
}

function queryUser(id) {
    return users.find((user) => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1);
    }
}

function getAllUsers(room) {
    return users.filter((user) => user.room === room);
}

module.exports = {
    exportUser,
    queryUser,
    userLeave,
    getAllUsers,
};
