import axios from "axios";
import yts from "yt-search";
import config from '../config.cjs';

const play2 = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "song") {
    if (!args) return m.reply("Please provide a YouTube link or song name\nExample: .song Moye Moye\nOr: .song https://youtu.be/xyz");

    try {
      m.reply("🔍 Processing your request...");

      let videoUrl;
      
      if (args.match(/(youtube\.com|youtu\.be)/)) {
        videoUrl = args;
      } else {
        const searchResults = await yts(args);
        if (!searchResults.videos.length) return m.reply("❌ No results found");
        videoUrl = searchResults.videos[0].url;
      }

      const apiUrl = `https://kaiz-apis.gleeze.com/api/ytmp3?url=${encodeURIComponent(videoUrl)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.download_url) return m.reply("❌ Failed to download audio");

      await gss.sendMessage(
        m.from,
        { 
          audio: { url: data.download_url },
          mimetype: 'audio/mpeg',
          fileName: data.title || "audio.mp3",
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

export default play2;
