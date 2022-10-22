export default {
    regexp: /^(.*) (?:шабы|шаблоны)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        if(!message.user.templates) message.user.templates = []
        let text = `[🔰] Мои шаблоны:\n\n`;
        for(let i = 0; i < message.user.templates.length; i++){
            text += `${i + 1}. ${message.user.templates[i].name}\n`
        }
        if(!message.user.templates.length) text += `Нету сохраненных шаблонов`
        return message.editMessage({ message: text })
    }
}