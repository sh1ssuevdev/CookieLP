export default {
    regexp: /^(.*) (?:\-шаб|\-шаблон)\s([^]+)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        if(!message.user.templates) message.user.templates = []

        let name = message.args[2]

        let template = message.user.templates.find(x => x.name == name);
        if(!template) return message.editMessage({ message: `Шаблон <<${name}>> отсувствует` })

        message.user.templates[message.user.templates.findIndex(x => x.name == name)] = undefined;
        message.user.templates = message.user.templates.filter(Boolean)
        return message.editMessage({ message: `Шаблон <<${name}>> удален` })
    }
}