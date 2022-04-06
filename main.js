const path = require('path');
const MTProto = require('@mtproto/core');
const natural = require('natural');
require('dotenv').config()

const api = new MTProto({
  api_id: process.env.API_ID,
  api_hash: process.env.API_HASH,

  storageOptions: {
    path: path.resolve(__dirname, './data/1.json'),
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  try {
    await sleep(5000); // This is done for a timeout between the request in order not to get banned from the telegram
    const resolvedPeer = await api.call('contacts.resolveUsername', {
      username: 'testupdate5',
    });
    const channel = resolvedPeer.chats.find(
      (chat) => chat.id === resolvedPeer.peer.channel_id,
    );
    const toPeer = {
      _: 'inputPeerChannel',
      channel_id: channel.id,
      access_hash: channel.access_hash,
    };
    api.updates.on('updates', async (updateInfo) => {
      const timer = 5000 + Math.floor(Math.random() * 10000);
      await sleep(timer); // This is done for a timeout between the request in order not to get banned from the telegram, but here we using random time to make view that is real human using telegram
      if (updateInfo.updates[0]._ === 'updateNewChannelMessage') {
        if (updateInfo.chats[0].id === '1105313000'
                    || updateInfo.chats[0].id === '1197363285'
                    || updateInfo.chats[0].id === '1101170442'
                    || updateInfo.chats[0].id === '1158325608'
                    || updateInfo.chats[0].id === '1463721328'
                    || updateInfo.chats[0].id === '1242446516'
                    || updateInfo.chats[0].id === '1233777422'
                    || updateInfo.chats[0].id === '1280273449'
                    || updateInfo.chats[0].id === '1755601718') {
          await sleep(timer); // This is done for a timeout between the request in order not to get banned from the telegram, but here we using random time to make view that is real human using telegram
          const resolvedPeerFrom = await api.call('contacts.resolveUsername', {
            username: updateInfo.chats[0].username,
          }).catch((e) => console.log(e));
          if (resolvedPeerFrom && resolvedPeerFrom.chats.length) {
            await sleep(timer); // check upper comment
            const previousMessage = await api.call('messages.getHistory', {
              peer: toPeer,
              add_offset: 0,
              limit: 15,
            });
            const channelFrom = resolvedPeerFrom.chats.find(
              (chat) => chat.id === resolvedPeerFrom.peer.channel_id,
            );
            const fromPeer = {
              _: 'inputPeerChannel',
              channel_id: channelFrom.id,
              access_hash: channelFrom.access_hash,
            };
            const updateMessage = updateInfo.updates[0].message;
            // let isSimularText = false
            // for(let i = 0; i < previousMessage.messages.length; i++) {
            //     try {
            //         if(natural.JaroWinklerDistance(previousMessage.messages[i].message,updateInfo.updates[0].message.message) >= 0.80) {
            //             isSimularText = true
            //             break
            //         }
            //     } catch (e) {
            //         console.log(updateInfo.updates[0].message.message)
            //         console.log(e)
            //     }
            // }
            const isNotSimularText = previousMessage.messages.every((message) => {
              const coincideOfMessages = natural.JaroWinklerDistance(
                message.message,
                updateMessage.message,
              );
              console.log(coincideOfMessages);
              return coincideOfMessages <= 0.80;
            });
            console.log(isNotSimularText);
            if (isNotSimularText) {
              await sleep(timer);
              api.call('messages.forwardMessages', {
                _: 'messages.forwardMessages',
                silent: false,
                background: false,
                from_peer: fromPeer,
                to_peer: toPeer,
                id: [updateMessage.id],
                random_id: [Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff)],
              }).catch((e) => console.log(e));
            }
            // isSimularText = false
          }
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
})();
