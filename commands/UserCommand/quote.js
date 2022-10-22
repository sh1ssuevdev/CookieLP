import { citata } from "../../Functions/function.js"
import moment from "moment"
import { VK } from "vk-io"

export default {
    regexp: /^(.*) (?:цитата)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        message.editMessage({message_id: message.id, message: "✨ Создание цитаты, ожидайте.."})
        let byid = (await this.api.messages.getById({message_ids: [message.id]})).items.pop();
        if(byid.reply_message){
            const buffer = await citata(message, this.api, byid.reply_message.from_id, byid.reply_message.text);
            const photov = await this.upload.messagePhoto({ source:{
                    value: buffer
                },
                peer_id:message.peerId
            });
            return message.editMessage({message_id: message.id, keep_forward_messages: 0, message: "", attachment: photov})
        }
        if(byid.fwd_messages[0]){
            const buffer = await citata(message, this.api, byid.fwd_messages[0].from_id, byid.fwd_messages[0].text);
            const photov = await this.upload.messagePhoto({ source:{
                    value: buffer
                },
                peer_id:message.peerId
            });
            return message.editMessage({message_id: message.id, keep_forward_messages: 0, message: "", attachment: photov})
        }
    }
}