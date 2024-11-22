const { Hercai } = require('hercai');
const herc = new Hercai();

module.exports.config = {
  name: 'ai',
  version: '1.1.0',
  aliases: ["gpt3"],
  hasPermssion: 0,
  credits: 'Yan Maglinte | Liane Cagara',
  description: 'An AI command using Hercai API!',
  usePrefix: false,
  allowPrefix: true,
  commandCategory: 'chatbots',
  usages: 'Ai [prompt]',
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, message }) {
  const prompt = args.join(' ');

  try {
    // Available Models: "v3", "v3-32k", "turbo", "turbo-16k", "gemini"
    if (!prompt) {
      message.reply('Please specify a message!');
      message.react('❓');
    } else {
      const info = await message.reply(`Fetching answer...`);
      message.react('⏱️');
      const response = await herc.question({ model: 'v3', content: prompt });
      await message.edit(response.reply, info.messageID);
      message.react('');
    }
  } catch (error) {
    message.reply('⚠️ Something went wrong: ' + error);
    message.react('⚠️');
  }
};
