export default {
    regexp: /^(.*) (?:бот)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        return message.editMessage({message_id: message.id, disable_mention: 1, attachment: `photo-210084234_457239018`, message: `[❤️] Shelby LP Bot [❤️]\n
        [🎃] Версия: 1.3.37
        [💎] Разработчик: *vincere.out.mori (Он)
        [💰] Цена: 70 руб / Месяц`})
    }
}