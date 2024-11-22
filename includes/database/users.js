module.exports = function ({ api }) {
    const fs = require("fs");
    const path = __dirname + "/data/usersData.json";
    function loadDatabase() {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "[]");
        }
        const rawData = fs.readFileSync(path);
        return JSON.parse(rawData);
    }
    function saveDatabase(data) {
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }

    // Find a user by userID //
    function findUser(data, userID) {
        return data.find((user) => user.userID === userID);
    }

// Get information for a specific user by ID
    function getInfo(userID) {
        const data = loadDatabase();
        return findUser(data, userID) || null;
    }

    //--- Get a user's name by ID --//
    function getNameUser(userID) {
        const user = getInfo(userID);
        return user ? user.name : "Facebook user";
    }

    //---- Get all users' data ----//
    function getAll() {
        return loadDatabase();
    }
//--- Get specific data from a user by ID --//
    function getData(userID, key) {
        const user = getInfo(userID);
        return user && user.data[key] ? user.data[key] : null;
    }

 //--- Set specific data for a user --//
    function setData(userID, key, value) {
        const data = loadDatabase();
        const user = findUser(data, userID);
        if (!user) return false;

        const updates = typeof key === 'object' ? key : { [key]: value };
        Object.entries(updates).forEach(([k, v]) => setNestedProperty(user, k, v));

        user.updatedAt = new Date().toISOString();
        saveDatabase(data);
        return true;
    }

    function setNestedProperty(obj, key, value) {
        key.split('.').reduce((acc, cur, idx, arr) => {
            return acc[cur] = idx === arr.length - 1 ? value : acc[cur] || {};
        }, obj);
    }

//-- Delete specific data from a user --//
    function delData(userID, key) {
        const data = loadDatabase();
        const user = findUser(data, userID);
        if (!user || !user.data[key]) return false;

        delete user[key];
        user.updatedAt = new Date().toISOString();
        saveDatabase(data);
        return true;
    }

//--Create a new user entry in the database-//
    async function createData(senderID) {
        const data = loadDatabase();
        const userInfo = await api.getUserInfo(senderID);
        const user = userInfo[senderID];

        if (!findUser(data, senderID)) {
            const newUser = {
                userID: senderID,
                name: user.name || "Unknown", 
                gender: user.gender,
                vanity: user.vanity || "",
                exp: 0,
                money: 0,
                banned: {},
                settings: {},
                data: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            data.push(newUser);
            saveDatabase(data);
            return true;
        }
        return false;
    }

    return {
        getInfo,
        get:getInfo,
        getNameUser,
        getName:getNameUser,
        getAll,
        getData,
        setData,
        set:setData,
        delData,
        del:delData,
        createData,
        create:createData
    };
};