export default {
    regexp: /^(.*) (?:шаблон|шаб)\s([^]+)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        let name = message.args[2]
        let attachments = []
        if(!name) return;

        let template = message.user.templates.find(x => x.name == name);
        if(!template) return message.editMessage({ message: `Шаблона <<${name}>> не существует!`});

        if(template.attachments.length !== 0){
            for(const data of template.attachments){
                attachments.push(`${data.type}${data[data.type].owner_id}_${data[data.type].id}_${data[data.type].access_key}`)
            }
        }
        return message.editMessage({ message: template.payload, attachment: attachments})
    }
}