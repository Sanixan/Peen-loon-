module.exports = function ({ api, models, Users, Threads, Currencies, ...rest }) {
    return async function ({ event, ...rest2 }) {
        if (!event.messageReply) return;
        const { handleReply, commands } = global.client;
    const { ADMINBOT } = global.config 
        const { senderID, messageID, threadID, messageReply } = event;
        if (handleReply.length !== 0) {
            const indexOfHandle = handleReply.findIndex(e => e.messageID == messageReply.messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReply[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name) || commands.get(indexOfMessage.commadName);
            if (!handleNeedExec) return api.sendMessage(global.getText('handleReply', 'missingValue'), threadID, messageID);
            try {
                var permssion = 0;
                var threadInfoo = (await Threads.get(threadID));
                const find = threadInfoo.adminIDs.find((el) => el.id == senderID);
                if (ADMINBOT.includes(senderID)) permssion = 2;
                else if (!ADMINBOT.includes(senderID) && find) permssion = 1;
                if (
                    handleNeedExec &&
                    handleNeedExec.config &&
                    handleNeedExec.config.hasPermssion &&
                    handleNeedExec.config.hasPermssion > permssion
                ) {
                  return api.sendMessage("❌ | You Don't have enough permission to reply this message",
                    event.threadID,
                    event.messageID,
                  );
                }
                
                var getText2;
                if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') 
                	getText2 = (...value) => {
                    const reply = handleNeedExec.languages || {};
                    if (!reply.hasOwnProperty(global.config.language)) 
                    	return api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name), threadID, messageID);
                    var lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                    for (var i = value.length; i > -0x4 * 0x4db + 0x6d * 0x55 + -0x597 * 0x3; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                };
                else getText2 = () => {};
                const Obj = {
                    ...rest,
                    ...rest2
                };
                Obj.api = api
                Obj.event = event 
                Obj.models = models
                Obj.Users = Users
                Obj.Threads = Threads 
                Obj.usersData = Users
                Obj.threadsData = Threads 
                Obj.Currencies = Currencies
                Obj.handleReply = indexOfMessage
                Obj.models = models
                Obj.getText = getText2
                handleNeedExec.handleReply(Obj);
                return;
            } catch (error) {
                return api.sendMessage(global.getText('handleReply', 'executeError', error), threadID, messageID);
            }
        }
    };
}
