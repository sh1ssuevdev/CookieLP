import { save } from "../../Functions/function.js"

export default {
    regexp: /^(.*) (?:префикс)\s([^]+)$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        message.user.prefix = message.args[2]
        //await save(message.user.user_id, message.user)
        return message.editMessage({message_id: message.id, message: `Ваш префикс был изменен на ${message.args[2]}`
        })
    }
}