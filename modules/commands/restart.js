const fs = require("fs-extra");

module.exports = {
  config: {
    name: "restart",
    version: "1.0",
    credits: "NTKhang",
    countDown: 5,
    usePrefix: true,
    hasPermssion: 2,
    description:  "Restart bot",
    commandCategory: "system",
    usages:  ""
  },

  onLoad: function ({ api }) {
    const pathFile = `${__dirname}/cache/restart.txt`;
    const chngFile = `${__dirname}/cache/change.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
      api.sendMessage(`✅ | Bot restarted\n⏰ | Time: ${(Date.now() - time) / 1000}s`, tid);
      fs.unlinkSync(pathFile);
    }
  },

  run: async function ({ message, event, getLang }) {
    const pathFile = `${__dirname}/cache/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
    await message.reply("⚫⚪🔴 𝐑𝐞𝐬𝐭𝐚𝐫𝐭𝐢𝐧𝐠 𝐁𝐨𝐭...");
    process.exit(2);
  }
};