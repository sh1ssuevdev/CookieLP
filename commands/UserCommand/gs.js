export default {
    regexp: /^(.*) (?:\+|\-)(?:гс)\s([^]+)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        if(!message.user.gs) message.user.gs = []
        let byid = (await this.api.messages.getById({message_ids: [message.id]})).items.pop();
        if(byid.reply_message){
            if(message.text.match(/\+гс/)){
                let name = message.args[2]
                let gs = message.user.gs.find(x => x.name == name)
                if(gs) return message.editMessage({ message_id: message.id, keep_forward_messages: 0, message: `🛑 | Голосовой Шаблон «${name}» уже существует.`});
                else {
                    message.user.gs.push({
                        name: name,
                        link: `doc${byid.reply_message.attachments[0].audio_message.owner_id}_${byid.reply_message.attachments[0].audio_message.id}_${byid.reply_message.attachments[0].audio_message.access_key}`
                    })
                    return message.editMessage({ message_id: message.id, keep_forward_messages: 0, message: `✅| Добавлен голосовой шаблон «${name}».`})
                }
            }
        }
        if(message.text.match(/\-гс/)){
            let name = message.args[2]
            let gs = message.user.gs.find(x => x.name == name)
            if(!gs) return message.editMessage({ message_id: message.id, keep_forward_messages: 0, message: `🛑 | Голосового шаблона «${name}» не существует.`});
            else {
                message.user.gs[message.user.gs.findIndex(x => x.name == name)] = undefined;
                message.user.gs = message.user.gs.filter(Boolean)
                return message.editMessage({ message_id: message.id, keep_forward_messages: 0, message: `✅| Удален голосовой шаблон «${name}».`})
            }
        }
    }
}
