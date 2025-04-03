import axios from "axios";

import yts from "yt-search";

import pkg from '@whiskeysockets/baileys';

const { generateWAMessageFromContent, proto } = pkg;

import config from '../config.cjs';

const play = async (m, gss) => {

  const prefix = config.PREFIX;

  const text = m.body || "";

  

  if (text.startsWith(prefix)) {

    const cmdWithArgs = text.slice(prefix.length).trim();

    const [cmd, ...args] = cmdWithArgs.split(" ");

    const fullArgs = args.join(" ");

    

    if (cmd === "play") {

      if (!fullArgs) return m.reply("*Please provide a song name or keywords to search for.*");

      await m.React('🎧');

      

      try {

        const searchResults = await yts(fullArgs);

        if (!searchResults.videos || searchResults.videos.length === 0) {

          await m.React('❌');

          return m.reply(`❌ No results found for "${fullArgs}".`);

        }

        const firstResult = searchResults.videos[0];

        

        let buttons = [

          {

            name: "quick_reply",

            buttonParamsJson: JSON.stringify({

              display_text: "🎵 Audio",

              id: `${prefix}confirm_audio ${firstResult.url}`

            })

          },

          {

            name: "quick_reply",

            buttonParamsJson: JSON.stringify({

              display_text: "🎥 Video",

              id: `${prefix}confirm_video ${firstResult.url}`

            })

          },

          {

            name: "quick_reply",

            buttonParamsJson: JSON.stringify({

              display_text: "❌ Cancel",

              id: `${prefix}cancel_play`

            })

          }

        ];

        let msg = generateWAMessageFromContent(m.from, {

          viewOnceMessage: {

            message: {

              messageContextInfo: {

                deviceListMetadata: {},

                deviceListMetadataVersion: 2

              },

              interactiveMessage: proto.Message.InteractiveMessage.create({

                body: proto.Message.InteractiveMessage.Body.create({

                  text: `*Found:* ${firstResult.title}\n*Duration:* ${firstResult.timestamp}\n*Channel:* ${firstResult.author.name}\n\nChoose the format you want to download:`

                }),

                footer: proto.Message.InteractiveMessage.Footer.create({

                  text: "> *EF-PRIME MD *"

                }),

                header: proto.Message.InteractiveMessage.Header.create({

                  title: "🎵 Media Found",

                  subtitle: "Click a button to continue",

                  hasMediaAttachment: false

                }),

                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({

                  buttons: buttons

                })

              })

            }

          }

        }, {});

        await gss.relayMessage(msg.key.remoteJid, msg.message, {

          messageId: msg.key.id

        });

        

        await m.React('✅');

      } catch (error) {

        await m.React('❌');

        m.reply("❌ An error occurred while searching for the media.");

      }

    } else if (cmd === "confirm_audio") {

      if (!fullArgs) return m.reply("*Invalid request. Please try again.*");

      await m.React('⏳');

      

      try {

        const videoUrl = fullArgs;

        const apiKey = "30de256ad09118bd6b60a13de631ae2cea6e5f9d";

        const headers = {

          accept: "*/*",

          "accept-language": "en-US,en;q=0.9",

          "sec-fetch-dest": "empty",

          "sec-fetch-mode": "cors",

          "sec-fetch-site": "cross-site",

          Referer: "https://v4.mp3paw.link/",

        };

        

        const downloadInitUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(videoUrl)}&api=${apiKey}`;

        const initResponse = await axios.get(downloadInitUrl, { headers, timeout: 8000 });

        

        if (initResponse.data && initResponse.data.url) {

          const downloadUrl = initResponse.data.url;

          const title = initResponse.data.title || "Downloaded audio";

          await gss.sendMessage(

            m.from,

            {

              audio: { url: downloadUrl },

              mimetype: "audio/mp4",

              ptt: false,

              fileName: `${title}.mp3`,

            },

            { quoted: m }

          );

          await m.React('🎵');

          return m.reply(`✅ *${title}* has been downloaded successfully!`);

        }

        

        const apiUrl = `https://api.agungny.my.id/api/youtube-audiov2?url=${encodeURIComponent(videoUrl)}`;

        const response = await axios.get(apiUrl, { timeout: 8000 });

        if (response.data.status && response.data.result.url) {

          const mp3Url = response.data.result.url;

          const title = response.data.result.title || "Downloaded audio";

          await gss.sendMessage(

            m.from,

            {

              audio: { url: mp3Url },

              mimetype: "audio/mpeg",

              ptt: false,

              fileName: `${title}.mp3`,

            },

            { quoted: m }

          );

          await m.React('🎵');

          return m.reply(`✅ *${title}* has been downloaded successfully!`);

        }

        

        await m.React('❌');

        m.reply("❌ Failed to download the audio. Please try again later.");

      } catch (error) {

        await m.React('❌');

        m.reply("❌ An error occurred during the download process. Please try again later.");

      }

    } else if (cmd === "confirm_video") {

      if (!fullArgs) return m.reply("*Invalid request. Please try again.*");

      await m.React('⏳');

      

      try {

        const videoUrl = fullArgs;

        

        const apiUrl = `https://api.agungny.my.id/api/youtube-videov2?url=${encodeURIComponent(videoUrl)}`;

        const response = await axios.get(apiUrl, { timeout: 8000 });

        if (response.data.status && response.data.result.url) {

          const videoUrlDownload = response.data.result.url;

          const title = response.data.result.title || "Downloaded video";

          await gss.sendMessage(

            m.from,

            {

              video: { url: videoUrlDownload },

              mimetype: 'video/mp4',

              caption: title,

            },

            { quoted: m }

          );

          await m.React('🎥');

          return m.reply(`✅ *${title}* has been downloaded successfully!`);

        }

        

        const backupApiUrl = `https://bk9.fun/download/youtube?url=${encodeURIComponent(videoUrl)}`;

        const backupResponse = await axios.get(backupApiUrl, { timeout: 8000 });

        if (backupResponse.data?.status && backupResponse.data?.BK9?.BK8) {

          const { title, BK8 } = backupResponse.data.BK9;

          

          const lowestQualityVideo = BK8.find(video => video.quality && video.format === "mp4") || BK8[0];

          if (lowestQualityVideo?.link) {

            await gss.sendMessage(

              m.from,

              {

                video: { url: lowestQualityVideo.link },

                mimetype: 'video/mp4',

                caption: `${title} (${lowestQualityVideo.quality || "N/A"})`,

              },

              { quoted: m }

            );

            await m.React('🎥');

            return m.reply(`✅ *${title}* has been downloaded successfully!`);

          }

        }

        

        await m.React('❌');

        m.reply("❌ Failed to download the video. Please try again later.");

      } catch (error) {

        await m.React('❌');

        m.reply("❌ An error occurred during the video download process. Please try again later.");

      }

    } else if (cmd === "cancel_play") {

      await m.React('🚫');

      m.reply("*Download cancelled.*");

    }

  }

};

export default play;