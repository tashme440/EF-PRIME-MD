//atleast credit when stealing 

import axios from 'axios';
import config from '../config.cjs';

const pinterest = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!['pinterest', 'pin', 'img'].includes(cmd)) return;

  if (!query) {
    return Matrix.sendMessage(m.from, { text: "❌ *Usage:* `.pinterest [search query]`" }, { quoted: m });
  }

  await Matrix.sendMessage(m.from, { react: { text: "🔍", key: m.key } });
  await Matrix.sendMessage(m.from, { text: "*🔍 Searching Pinterest for images...*" }, { quoted: m });

  try {
    const apiUrl = `https://lance-frank-asta.onrender.com/api/pinterest?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result || !Array.isArray(response.data.result) || response.data.result.length === 0) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      return Matrix.sendMessage(m.from, { text: `❌ No Pinterest images found for "${query}". Please try another search term.` }, { quoted: m });
    }

    const images = response.data.result.slice(0, 5);
    
    const contextInfo = {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363419090892208@newsletter',
        newsletterName: "EF-PRIME",
        serverMessageId: 143
      }
    };

    await Matrix.sendMessage(m.from, {
      image: { url: images[0] },
      caption: `📌 *Pinterest: ${query}*\n\nFound ${response.data.result.length} results. Sending ${images.length} images...\n\n🔗 *Powered By EF-PRIME ✅*`,
      contextInfo
    }, { quoted: m });

    for (let i = 1; i < images.length; i++) {
      await Matrix.sendMessage(m.from, {
        image: { url: images[i] },
        contextInfo
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Pinterest Error:", error);
    await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
    Matrix.sendMessage(m.from, { text: "❌ An error occurred while fetching Pinterest images. Please try again later." }, { quoted: m });
  }
};

export default pinterest;
