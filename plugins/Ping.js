import config from '../config.cjs';

const ping = async (m, Matrix) => {

  const prefix = config.PREFIX;

  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "ping") {

    const start = new Date().getTime();

    const reactionEmojis = ['⚡', '🚀', '💫', '✨', '🌟', '🔮', '💥', '⚔️', '🛡️', '📱'];

    const textEmojis = ['🌌', '📷', '💠', '🌠', '✴️', '📹', '💎', '✨', '⚜️', '🛏️'];

    const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

    while (textEmoji === reactionEmoji) {

      textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

    }

    await m.React(textEmoji);

    const end = new Date().getTime();

    const responseTime = (end - start) / 1000;

    const pingQuality = responseTime < 0.5 ? "PRIME HYPER" : 

                         responseTime < 1.0 ? "PRIME ULTRA" : 

                         responseTime < 1.5 ? "PRIME PLUS" : 

                         responseTime < 2.0 ? "PRIME" : "PRIME STABLE";

    const text = `> EF-${pingQuality}: ${responseTime.toFixed(2)}s ${reactionEmoji}`;

    await Matrix.sendMessage(m.from, {

      text,

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

    }, { quoted: m });

  }

};

export default ping;