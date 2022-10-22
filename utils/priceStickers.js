import { VKMe as API } from "../Functions/function.js"

function splitTo(e,t){ const r=[];for(let s=0;s<e.length;s+=t)r.push(e.slice(s,s+t));return r }

function total(e){ return e.reduce(((e,t)=>e+t),0) }

async function getStickerPacksInfo(e,t){
    const r=new API({token:e}), s=[];
    for(const e of splitTo(t,350)){
        const t=await r.call("store.getStockItems",{type:"stickers",product_ids:e,lang:"ru"});
        s.push(...t.items.map((e=>{
            const t=e.price || e.old_price || 0, r=0===t,s=!!e.product.has_animation, n=!!e.product.style_sticker_ids;
            return {id:e.product.id,price:t,title:e.product.title,author:e.author,description:e.description,copyright:e.product.copyright,url:e.product.url,isFree:r,isAnimation:s,isStyle:n }
        })))
        return s
    }
}

async function getUserStickerPacks(e,t,r){
    const s=new API({token:e}), n=(await s.call("store.getProducts",{type:"stickers",filters:"purchased",user_id:t})).items.map((e=>({id:e.id,isStyle:!!e.base_id,isActive:Boolean(e.active),
    purchaseDate:new Date(1e3*e.purchase_date)})));
    if(r){
        const t=await getStickerPacksInfo(e,n.map((e=>e.id))), r=[];
        for(const e of t){
            const t=n.find((t=>t.id===e.id));
            r.push(Object.assign(e,t))
        }
        
        return {stickers:r.filter(x=>x.isFree == false).map(x=>({id: x.id, name: x.title })), price: { totalPrice:total(r.map((e=>e.price))), totalPriceRub: total(r.map((e=>e.price))) * 7 }
            }
        }
    }

export { getUserStickerPacks }
