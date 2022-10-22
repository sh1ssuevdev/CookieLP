import axios from "axios"
import { generate } from "rand-token"

export default {
    regexp: /^(?:testff)$/i,
    async run(message){
        const request_post = await generate(80);
        console.log(JSON.stringify(generate, null, 4))
        return message.send(`${JSON.stringify({token: request_post}, null, 4)}`)
        
    }
}
