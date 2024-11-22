/*module.exports = {
  config: {
    name: "eval",
    version: "1.6",
    author: "NTKhang",
    countDown: 5,
    role: 2,
    usePrefix: true,
    description: {
      en: "Test code quickly"
    },
    commandCategory: "owner",
    guide: {
      en: "{pn} <code to test>"
    }
  },
  run: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
    function output(msg) {
      if (typeof msg == "number" || typeof msg == "boolean" || typeof msg == "function")
        msg = msg.toString();
      else if (msg instanceof Map) {
        let text = `Map(${msg.size}) `;
        text += JSON.stringify(mapToObj(msg), null, 2);
        msg = text;
      }
      else if (typeof msg == "object")
        msg = JSON.stringify(msg, null, 2);
      else if (typeof msg == "undefined")
        msg = "undefined";

      message.reply(msg);
    }

    function mapToObj(map) {
      const obj = {};
      map.forEach(function (v, k) {
        obj[k] = v;
      });
      return obj;
    }
    
    const cmd = `(async () => {
      try {
        ${args.join(" ")}
      }
      catch (err) {
        console.error("eval command error:", err);
        message.send("❌ An error occurred:\n" + (err.stack || err));
      }
    })();`;

    try {
      eval(cmd);
    } catch (err) {
      message.send("❌ Failed to evaluate the code:\n" + (err.stack || err));
    }
  }
};*/
module.exports.config = {
  name: "eval",
  version: "1.0.0",
  credits: "NTKhang",
  hasPermssion: 2,
  usePrefix: true,
  Description: "Test api response",
  commandCategory: "api response tester",
  useges: "[code]",
  countDowns: 5
};
module.exports.run = async function ({ api, args, event ,Users, Threads , message ,usersData, threadsData}) {
  function output(msg) {
    if (typeof msg == "number" || typeof msg == "boolean" || typeof msg == "function")
      msg = msg.toString();
    else if (msg instanceof Map) {
      let text = `Map(${msg.size}) `;
      text += JSON.stringify(mapToObj(msg), null, 2);
      msg = text;
    }
    else if (typeof msg == "object")
      msg = JSON.stringify(msg, null, 2);
    else if (typeof msg == "undefined")
      msg = "undefined";

    api.sendMessage(msg, event.threadID, event.messageID);
  }
  function out(msg) {
    output(msg);
  }
  function mapToObj(map) {
    const obj = {};
    map.forEach(function (v, k) {
      obj[k] = v;
    });
    return obj;
  }
  const cmd = `
  (async () => {
const dipto = require('axios');
    try {
      ${args.join(" ")}
    }
    catch(err) {
      console.log("eval command", err);
      api.sendMessage( err.stack
      , event.threadID);
    }
  })()`;
eval(cmd);
}