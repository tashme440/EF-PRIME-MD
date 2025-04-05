import axios from "axios";

import config from '../config.cjs';

const ai = async (m, gss) => {

  const prefix = config.PREFIX;

  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  const args = m.body.slice(prefix.length + cmd.length).trim();

  // Check which AI command was used

  const aiCommands = {

    "deepseek": "deepseek-v3",

    "deepseek2": "deepseek-r1",

    "claude": "claude3-haiku"

  };

  const selectedModel = aiCommands[cmd];

  

  if (selectedModel) {

    if (!args) return m.reply(`Please provide a prompt for ${selectedModel}\nExample: .${cmd} Tell me about Matrix bots`);

    try {

      m.reply(`🤖 Processing your request with ${selectedModel}...`);

      const apiUrl = `https://kaiz-apis.gleeze.com/api/${selectedModel}?ask=${encodeURIComponent(args)}`;

      const { data } = await axios.get(apiUrl);

      if (!data || !data.response) return m.reply(`❌ No response from ${selectedModel}.`);

      const responseText = `🤖 *${selectedModel.toUpperCase()}*\n\n${data.response}`;

      await gss.sendMessage(

        m.from,

        { 

          text: responseText,

          contextInfo: {

            mentionedJid: [m.sender],

            forwardingScore: 999,

            isForwarded: true,

            forwardedNewsletterMessageInfo: {

              newsletterJid: '120363419090892208@newsletter',

              newsletterName: "EF-PRIME",

              serverMessageId: 143

            }

          }

        },

        { quoted: m }

      );

    } catch (error) {

      console.error(error);

      m.reply(`❌ An error occurred with ${selectedModel}: ${error.message}`);

    }

  }

};

export default ai;
