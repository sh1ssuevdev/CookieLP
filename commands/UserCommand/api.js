export default {
    regexp: [
        /^(.*) (?:apiuser)$/i
    ],
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        let byid = (await this.api.messages.getById({message_ids: [message.id]})).items.pop()
        if(byid.attachments[0]){
            message.send({attachment: `photo${byid.attachments[0].photo.owner_id}_${byid.attachments[0].photo.id}`})
            return message.editMessage({ message_id: message.id, message: JSON.stringify(byid.attachments, null, 4)})
        }
    }
}