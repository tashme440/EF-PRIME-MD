import axios from "axios";

import config from '../config.cjs';

const mal = async (m, gss) => {

  const prefix = config.PREFIX;

  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  const args = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "mal") {

    if (!args) return m.reply("Please provide an anime title\nExample: .mal Jujutsu Kaisen");

    try {

      m.reply("🔍 Searching for anime...");

      const apiUrl = `https://kaiz-apis.gleeze.com/api/mal?title=${encodeURIComponent(args)}`;

      const { data } = await axios.get(apiUrl);

      if (!data || !data.title) return m.reply("❌ Anime not found. Please check your spelling.");

      let responseText = `🎬 *${data.title}* (${data.japanese || ''})\n`;

      responseText += `📊 *Type:* ${data.type || 'N/A'}\n`;

      responseText += `📺 *Episodes:* ${data.episodes || 'N/A'}\n`;

      responseText += `⏱️ *Duration:* ${data.duration || 'N/A'}\n`;

      responseText += `⭐ *Score:* ${data.score || 'N/A'} (${data.scoreStats || ''})\n`;

      responseText += `🥇 *Ranked:* ${data.ranked || 'N/A'}\n`;

      responseText += `💫 *Popularity:* ${data.popularity || 'N/A'}\n`;

      responseText += `🔞 *Rating:* ${data.rating || 'N/A'}\n`;

      responseText += `🎭 *Genres:* ${data.genres || 'N/A'}\n`;

      responseText += `🎬 *Studios:* ${data.studios || 'N/A'}\n`;

      responseText += `📅 *Aired:* ${data.aired || 'N/A'}\n`;

      responseText += `📌 *Status:* ${data.status || 'N/A'}\n\n`;

      

      if (data.description) {

        const shortDesc = data.description.split('\n')[0]; // Get first paragraph

        responseText += `📝 *Synopsis:*\n${shortDesc}\n\n`;

      }

      

      responseText += `🔗 *MAL URL:* ${data.url || 'N/A'}`;

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

      // If there's an image, send it as a separate message

      if (data.picture) {

        await gss.sendMessage(

          m.from,

          {

            image: { url: data.picture },

            caption: `🖼️ *${data.title}*`

          },

          { quoted: m }

        );

      }

    } catch (error) {

      console.error(error);

      m.reply("❌ An error occurred: " + error.message);

    }

  }

};

export default mal;
