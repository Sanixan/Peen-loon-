module.exports = function ({ api }) {
    const Users = require("./users")({ api });
    const logger = require("../../utils/log.js");
    const { writeFileSync, readFileSync } = require("fs-extra");
    var path = __dirname + "/data/threadsData.json";

    try {
        var threadsData = require(path);
    } catch {
        writeFileSync(path, "[]"); 
    }

    async function getInfo(threadID) {
        try {
            const result = await api.getThreadInfo(threadID);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async function getData(threadID, callback) {
        try {
            if (!threadID) throw new Error("threadID cannot be empty");
            if (isNaN(threadID)) throw new Error("Invalid threadID");
            const thread = threadsData.find(thread => thread.threadID == threadID);
            if (!thread) await createData(threadID); // Create data if it doesn't exist
            const data = thread || threadsData.find(thread => thread.threadID == threadID);
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false;
        }
    }

    async function saveData(data) {
        try {
            if (!data) throw new Error('Data cannot be left blank');
            writeFileSync(path, JSON.stringify(data, null, 4));
        } catch (error) {
            return false;
        }
    }

    async function getAll(keys, callback) {
        try {
            if (!keys) {
                if (threadsData.length == 0) return [];
                return threadsData;
            }
            if (!Array.isArray(keys)) throw new Error("The input parameter must be an array");
            const data = threadsData.map(thread => {
                const database = { ID: thread.threadID }; // Include thread ID
                keys.forEach(key => database[key] = thread[key]);
                return database;
            });
            if (callback && typeof callback == "function") callback(null, data);
            return data;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false;
        }
    }

    async function setData(threadID, options, callback) {
        try {
            if (!threadID) throw new Error("threadID cannot be empty");
            if (isNaN(threadID)) throw new Error("Invalid threadID");
             const currentTime = new Date().toISOString();
            
            const threadIndex = threadsData.findIndex(thread => thread.threadID == threadID);
            if (threadIndex === -1) throw new Error(`Thread with ID: ${threadID} does not exist in Database`);
            threadsData[threadIndex] = {
                ...threadsData[threadIndex],
                ...options,
                updatedAt:currentTime
            };
            await saveData(threadsData);
            if (callback && typeof callback == "function") callback(null, threadsData[threadIndex]);
            return threadsData[threadIndex];
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false;
        }
    }

    async function delData(threadID, callback) {
        try {
            if (!threadID) throw new Error("threadID cannot be empty");
            if (isNaN(threadID)) throw new Error("Invalid threadID");
            const threadIndex = threadsData.findIndex(thread => thread.threadID == threadID);
            if (threadIndex === -1) throw new Error(`Thread with ID: ${threadID} does not exist in Database`);
            threadsData.splice(threadIndex, 1); // Remove the thread from the array
            await saveData(threadsData);
            if (callback && typeof callback == "function") callback(null, "REMOVE THREAD " + threadID + " SUCCESS");
            return true;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false;
        }
    }

    async function createData(threadID, callback) {
        try {
            if (!threadID) throw new Error("threadID cannot be empty");
            if (isNaN(threadID)) throw new Error("Invalid threadID");
            if (threadsData.some(thread => thread.threadID === threadID)) {
                throw new Error(`Thread with ID: ${threadID} already exists in Database`);
            }

            var threadInfo = await api.getThreadInfo(threadID);
            var newData = {
                threadID,
                threadName: threadInfo.threadName,
    prefix: global.config?.PREFIX || "!",
        emoji: threadInfo?.emoji || "",
                adminIDs: threadInfo.adminIDs,
                participantIDs: threadInfo.participantIDs,
                isGroup: threadInfo.isGroup,
                data: {},
                settings: {},
                games: {},
                createTime: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Push newData to threadsData array
            threadsData.push(newData);

            const dataUser = global.data.allUserID;
            for (const singleData of threadInfo.userInfo) {
                if (singleData.gender != undefined) {
                    try {
                        if (dataUser.includes(singleData.id) || Users.hasOwnProperty(singleData.id)) continue;
                        dataUser.push(singleData.id);
                        await Users.createData(singleData.id);
                        logger.log(global.getText('handleCreateDatabase', 'newUser', singleData.id), 'DATABASE');
                    } catch (e) { console.log(e); }
                }
            }

            await saveData(threadsData);
            if (callback && typeof callback == "function") callback(null, newData);
            return newData;
        } catch (error) {
            if (callback && typeof callback == "function") callback(error, null);
            return false;
        }
    }

    return {
        getInfo,
        getAll,
        getData,
        get:getData,
        setData,
        set:setData,
        delData,
        del:delData,
        createData,
        create:createData
    };
};