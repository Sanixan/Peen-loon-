module.exports = function ({ api, Threads }) {
    const logger = require("../../utils/log.js");
    return async function ({ event }) {
        const { threadID, logMessageType, logMessageData } = event;
        const { setData, getData, delData } = Threads;

        try {
            // Fetch current thread data
            let threadData = await getData(threadID);
            if (!threadData) {
                logger.log(`Thread data for ${threadID} not found. Creating new data...`, 'CREATE DATA');
                threadData = await Threads.createData(threadID);
            }

            switch (logMessageType) {
                // Admin role changes
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT === "add_admin") {
                        // Add new admin
                        threadData.adminIDs.push({ id: logMessageData.TARGET_ID });
                        logger.log(`Admin added in group ${threadID}: ${logMessageData.TARGET_ID}`, 'UPDATE DATA');
                    } else if (logMessageData.ADMIN_EVENT === "remove_admin") {
                        // Remove admin
                        threadData.adminIDs = threadData.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                        logger.log(`Admin removed from group ${threadID}: ${logMessageData.TARGET_ID}`, 'UPDATE DATA');
                    }
                    threadData.updatedAt = new Date().toISOString();
                    await setData(threadID, threadData);
                    break;
                }

                // Thread name change
                case "log:thread-name": {
                    logger.log(`Group name updated for ${threadID}: ${logMessageData.name}`, 'UPDATE DATA');
                    threadData.threadName = logMessageData.name;
                    threadData.updatedAt = new Date().toISOString();
                    await setData(threadID, threadData);
                    break;
                }

                // New participant(s) added to the group
                case "log:subscribe": {
                    if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

                    // Add new participants
                    for (let participant of logMessageData.addedParticipants) {
                        if (!threadData.participantIDs.includes(participant.userFbId)) {
                            threadData.participantIDs.push(participant.userFbId);
                        }
                    }

                    logger.log(`Added participants to group ${threadID}: ${logMessageData.addedParticipants.map(p => p.userFbId).join(', ')}`, 'UPDATE DATA');
                    threadData.updatedAt = new Date().toISOString();
                    await setData(threadID, threadData);
                    break;
                }

                // Participant left the group
                case "log:unsubscribe": {
                    const leftParticipantId = logMessageData.leftParticipantFbId;

                    // If bot leaves, delete the thread data
                    if (leftParticipantId == api.getCurrentUserID()) {
                        logger.log(`Bot left the group ${threadID}. Deleting thread data.`, 'DELETE DATA');
                        const index = global.data.allThreadID.findIndex(item => item == threadID);
                        if (index !== -1) global.data.allThreadID.splice(index, 1);
                        await delData(threadID);
                    } else {
                        // Remove participant from thread data
                        const participantIndex = threadData.participantIDs.indexOf(leftParticipantId);
                        if (participantIndex !== -1) {
                            threadData.participantIDs.splice(participantIndex, 1);
                        }

                        // Remove from admins if they were an admin
                        if (threadData.adminIDs.find(i => i.id == leftParticipantId)) {
                            threadData.adminIDs = threadData.adminIDs.filter(item => item.id != leftParticipantId);
                        }

                        logger.log(`Participant ${leftParticipantId} left the group ${threadID}. Data updated.`, 'UPDATE DATA');
                        threadData.updatedAt = new Date().toISOString();
                        await setData(threadID, threadData);
                    }
                    break;
                }
            }
        } catch (e) {
            console.log(`Error updating thread data for ${threadID}: ${e.message}`);
        }
    };
};