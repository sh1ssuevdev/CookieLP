import { connect, checkToken } from "../Functions/function.js"

export default {
    regexp: [
        /^(?:api)\s(.*)$/i
    ],
    async run(message){
        let info = await checkToken(message.args[1])
        if(!info) return message.send(`Отправленный вами токен не верный!`);
        let user_info = (await this.api.users.get({access_token: info}))[0]
        if(!user_info) return;
        await message.send(`Connected`)
        connect({user_id: message.senderId, token: info, token_vkme: "", prefix: ".д", prefix_access: '.ю', access: [ message.senderId ]})
    }
}