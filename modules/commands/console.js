const moment = require("moment-timezone");

module.exports.config = {
    name: "console",
    version: "1.0.0",
    permission: 3,
    credits: "UPDATE BY Dipto",
    usePrefix: true,
    description: "This module logs chat events in the console.",
    commandCategory: "system",
    usages: "This module logs various chat events and messages for monitoring purposes.",
    cooldowns: 0
};

module.exports.handleEvent = async function ({ api,Users, event }) {
  let { messageID, threadID, senderID } = event;
  const chalk = require('chalk');
  var time = moment.tz("Asia/Dhaka").format("LLLL");
  const thread = global.data.threadData.get(event.threadID) || {};

  if (typeof thread["console"] !== "undefined" && thread["console"] == true) return;
  if (event.senderID == global.data.botID) return;

  let nameBox;
  let userorgroup;
  let threadid;
  let username;
  let ummah1;
  try {
    const threadInfo = await api.getThreadInfo(event.threadID) || "name does not exist";
    nameBox = `${threadInfo.threadName}`;
    threadid = `${threadID}`;
    username = chalk.blue('Group name : ');
    ummah1 = chalk.blue('Group id : ');
    userorgroup = `GROUP CHAT MESSAGE`;
  } catch (error) {
    username = "";
    ummah1 = "";
    threadid = "";
    nameBox = "";
    userorgroup = `PRIVATE CHAT MESSAGE`;
  }

  var nameUser = await Users.getNameUser(event.senderID);
  var msg = event.body || "photos, videos, or special characters";
  console.log(`${chalk.blue('\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯')}

  ${userorgroup}
  ${chalk.blue('\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯')}
${username} ${nameBox}
${ummah1} ${threadid}
${chalk.blue('User name :')} ${chalk.white(nameUser)}
${chalk.blue('User id :')} ${chalk.white(senderID)}
${chalk.blue('Message :')} ${chalk.blueBright(msg)}
${chalk.blue('Time:')} ${chalk.white(time)}`);
}
