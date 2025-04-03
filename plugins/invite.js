import config from '../config.cjs';

const invite = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim(); // Keep only this declaration

    const validCommands = ['invite', 'add'];

    if (!validCommands.includes(cmd)) return;
    
    if (!m.isGroup) return m.reply("*❌ command can only be used in groups*");

    const botNumber = await gss.decodeJid(gss.user.id);
    const groupMetadata = await gss.groupMetadata(m.from); // Ensure group metadata is fetched before use
    const isBotAdmins = groupMetadata.participants.find(p => p.id === botNumber)?.admin;

    if (!isBotAdmins) {
      return m.reply('*❌. bot must be admin to work*');
    }

    if (!text) return m.reply(`*❌enter number to send group invite link*\n\nExample:\n*${prefix + cmd}* 265993702468`);
    if (text.includes('+')) return m.reply(`*❌ ENTER THE NUMBER TOGETHER WITHOUT *+*`);
    if (isNaN(text)) return m.reply(`*❌ ENTER ONLY THE NUMBERS PLUS YOUR COUNTRY CODE WITHOUT SPACES`);

    const link = 'https://chat.whatsapp.com/' + await gss.groupInviteCode(m.from);
    const inviteMessage = `≡ *GROUP INVITATION*\n\nA USER INVITES YOU TO JOIN THE GROUP "${groupMetadata.subject}".\n\nInvite Link: ${link}\n\nINVITED BY: @${m.sender.split('@')[0]}`;

    await gss.sendMessage(`${text}@s.whatsapp.net`, { text: inviteMessage, mentions: [m.sender] });
    m.reply(`*☑ AN INVITE LINK IS SENT TO THE USER.*`);

  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default invite;