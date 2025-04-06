import config from '../config.cjs';

const tagall = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();
    
    const validCommands = ['hidetag', 'tag', 'f_tag'];
    if (!validCommands.includes(cmd)) return;

    await gss.sendMessage(m.from, { react: { text: '🔊', key: m.key } });

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const isGroup = m.isGroup;
    const isAdmins = isGroup ? participants.find(p => p.id === m.sender)?.admin : false;
    const isBotAdmins = isGroup ? participants.find(p => p.id === botNumber)?.admin : false;
    const isDev = Array.isArray(config.OWNER) ? config.OWNER.includes(m.sender.split('@')[0]) : false;

    if (!isGroup) return m.reply("*❌ This command can only be used in groups*");
    if (!isAdmins && !isDev) return m.reply("*❌ Only group admins can use this command*");
    if (!isBotAdmins) return m.reply("*❌ I need admin privileges to use this command*");

    if (!text && !m.quoted) return m.reply('*Please add a Message* ℹ️');
    
    let teks = text || (m.quoted ? m.quoted.text : '');
    
    await gss.sendMessage(m.from, { 
      text: teks, 
      mentions: participants.map(a => a.id) 
    }, { 
      quoted: m 
    });
    
  } catch (error) {
    console.error('Error:', error);
    await gss.sendMessage(m.from, { react: { text: '❌', key: m.key } });
    await m.reply(`❌ *Error Occurred!*\n\n${error}`);
  }
};

export default tagall;
