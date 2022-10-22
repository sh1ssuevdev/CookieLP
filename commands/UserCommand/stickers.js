import { getUserStickerPacks } from "../../utils/priceStickers.js"
import axios from "axios"

import { resolveResource as resolve } from "vk-io"

export default {
    regexp: /^(.*) (?:стикеры)\s?([^]+)?$/i,
    async run(message){
        if(message.user.prefix !== message.args[1]) return;
        let byid = (await this.api.messages.getById({message_ids:[message.id]})).items.pop()
        let link = ``

        if(byid.fwd_messages[0] || byid.reply_message) {
            link = byid.fwd_messages[0] ? byid.fwd_messages[0].from_id : byid.reply_message.from_id
        } else if(message.args[2]){
            link = (await resolve({api: this.api, resource: message.args[2]})).id
}

        if(!link) return message.editMessage({message: "Укажите пользователя. Пример: {префикс} стикеры @durov"})
        
        let dataUserInfo = (await this.api.users.get({user_id: link}))[0]
        
        let dataStickerPacks = (await axios.post("http://erillapp.ru/api", { type: "get_data_stickers",get_data_stickers: {token: "vk1.a.RQ6sK-W_CAgXosOC06hNjmnxN7aDD3pvF4SD0P2f9HZA4KO0TSo1_gX__uBPtwmpKRmb1G7qCJAwjoYuO7CZOLwIHDzDwgc_pErW6iKdlwratgWeiRVvh-BoK1CVoE4q7epMGp9uWLeNlHouhDhJvUEkz6_-GEzyNVvKDbuWCFbQAuJbQOLWh14c-mXU9q0L",userId: link}})).data
        
        return message.editMessage({ message: `Пользователь *id${dataUserInfo.id} (${dataUserInfo.first_name} ${dataUserInfo.last_name}) имеет ${dataStickerPacks.stickers.length} стикер-паков\n\n${(dataStickerPacks.stickers.map(x=>x.name)).join(", ")}\n\nПримерная стоимость:\n-- ${(dataStickerPacks.price.totalPrice).toLocaleString()} голосов
-- ${(dataStickerPacks.price.totalPriceRub).toLocaleString()} рублей`})
    }
}
