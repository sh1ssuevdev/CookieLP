export default {
    regexp: /^(.*) (?:гсшаб|гсшаблоны)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        if(!message.user.gs) message.user.gs = []
        let text = `[🔰] Мои голосовые шаблоны:\n\n`;
        for(let i = 0; i < message.user.gs.length; i++){
            text += `${i + 1}. ${message.user.gs[i].name}\n`
        }
        if(!message.user.gs.length) text += `Нету сохраненных шаблонов`
        return message.editMessage({ message_id: message.id, message: text})
    }
}