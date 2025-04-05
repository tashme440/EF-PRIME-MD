import axios from "axios";
import config from '../config.cjs';

const joke = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd === "joke") {
    try {
      m.reply("😄 Finding a joke for you...");

      const apiUrl = "https://kaiz-apis.gleeze.com/api/joke";
      const { data } = await axios.get(apiUrl);

      if (!data || !data.joke) return m.reply("❌ Couldn't fetch a joke at this time.");

      const jokeText = `😂 *Joke*\n\n${data.joke}`;

      await gss.sendMessage(
        m.from,
        { 
          text: jokeText,
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
      m.reply("❌ An error occurred: " + error.message);
    }
  }
};

export default joke;
