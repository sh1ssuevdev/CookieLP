import xtend from "xtend"

export default {
    regexp: /^(.*) (?:\+шаб(?:лон)?)(?:(?:\s*(?<title>.+))?\n(?<desc>.+)|$)?$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        if(!message.user.templates) message.user.templates = []

        let title = message.args.groups.title
        let desc = message.args.groups.desc

        let template = message.user.templates.find(x => x.name == title)
        if(template) return message.editMessage({message_id: message.id, message: `Данный шаблон уже существует, придумайте другое название или удалите старый шаблон`});
        else {
            let byid = (await this.api.messages.getById({ message_ids: [message.id] })).items.pop();
            message.user.templates.push({
                name: title,
                payload: desc,
                attachments: Array.isArray(byid.attachments) ? byid.attachments.map((attachment) => xtend(attachment, { [attachment.type]: { ...(attachment[attachment.type]), sizes: null, image: null, first_frame: null}})) : []
            })
            return message.editMessage({ message_id: message.id, attachment: '', message: `Шаблон <<${title}>> добавлен`})
        }
    }
}