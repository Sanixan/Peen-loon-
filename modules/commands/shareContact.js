module.exports.config = {
  name: "sharecontact",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Yan Maglinte",
  description: "Share a contact of a certain userID",
  usePrefix: true,
  commandCategory: "message",
  cooldowns: 5,
};

module.exports.run = async function ({ api, args, event }) {
  try {
    api.shareContact(
      args ? args.join(" ") : "• Hello this is your contact!",
      event.messageReply?.senderID || event.senderID,
      event.threadID,
      event.messageID
    );
  } catch (error) {
    api.sendMessage("error", event.threadID, event.messageID);
  }
};
