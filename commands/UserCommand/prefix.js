export default {
    regexp: /^(.*) (?:префиксы)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        return message.editMessage({message_id: message.id, message: `Ваши префиксы:\nЛичный префикс: ${message.user.prefix}`})
    }
}