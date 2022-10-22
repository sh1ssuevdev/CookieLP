export default {
    regexp: /^(.*) (?:гс)\s([^]+)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        if(!message.user.gs) message.user.gs = []
        let name = message.args[2]
        let gs = message.user.gs.find(x => x.name == name)
        if(!gs) return message.editMessage({ message_id: message.id, message: `🛑 | Голосового шаблона «${name}» не существует.`});
        else {
            await this.api.messages.delete({
                message_id: message.id,
                peer_id: message.peerId,
                delete_for_all: 1
            })
            return message.send({ attachment: gs.link })
        }
    }
}
