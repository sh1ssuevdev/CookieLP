import { VK } from "vk-io"
import * as func from "./Functions/function.js"
import { readFileSync, readdirSync, existsSync } from "fs"

const Bot = new VK({ token: "" })
const vk = new VK({ token: "" })

Bot.updates.start().then(async () => {
    for(const file of readdirSync("/root/CookieLP/database").filter(x => x.split('.').pop() == "json")){
        if(existsSync("/root/CookieLP/database/" + file)){
            const user = JSON.parse(readFileSync("/root/CookieLP/database/" + file))
            await func.connect(user)
        }
    }
    vk.api.messages.send({ user_id: 629359311, message: `Бот был перезагружен, все юзеры были включены.`, random_id: 0})
}).catch(console.error)

Bot.updates.on("message", async (message, next) => {
    console.log(message)
    for (const file of readdirSync("/root/CookieLP/commands").filter(x => x.split(".").pop() == "js")) {
        try {
            if(message.text){
                const script = await import("/root/CookieLP/commands/" + file);  
                if (Array.isArray(script.default.regexp)) {
                    for (const regxp of script.default.regexp) {
                        if (regxp.test(message.text)) {
                            message.args = message.text.match(regxp);
                            await script.default.run.call(Bot, message);
                            break;
                        }
                    }
                } else if (func.isRegExp(script.default.regexp)) {
                    if (script.default.regexp.test(message.text)) {
                        message.args = message.text.match(script.default.regexp);
                        await script.default.run.call(Bot, message);
                        break;
                    }
                }
            }
        } catch (err) {
            console.log(err);
            continue;
        }
    }
})
