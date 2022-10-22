import { readFileSync, readdirSync, existsSync } from "fs"

export default {
    regexp: /^(?:acclist|акклист)$/i,
    async run(message){
        let use = readdirSync("/root/CookieLP/database")
        if(use.length == 0) return;
        let text = ``
        for(let i = 0; i < use.length; i++){
            if(existsSync("/root/CookieLP/database/" + use[i])){
                let user = JSON.parse(readFileSync("/root/CookieLP/database/" + use[i]))
                let info = (await this.api.users.get({ user_ids: user.user_id}))[0]
                text += `${i+1} -- *id${info.id} (${info.first_name} ${info.last_name})\n`
            }
        }
        return message.send(`Список подключенных аккаунтов:\n\n${text}`)
    }
}