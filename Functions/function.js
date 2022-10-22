import { VK, CallbackService, API } from "vk-io"
import moment from "moment"
import constants from "./constants.js"
import { writeFileSync, readdirSync, readFileSync, existsSync } from "fs"
import { createCanvas, loadImage, CanvasRenderingContext2D, registerFont } from "canvas"

moment.locale("ru")

const callbackService = new CallbackService();

CanvasRenderingContext2D.prototype.wrapText = function(text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let lineLength = 0;
    let lines = [];
    let line = ''; 

    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = this.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push({ line, x, y, length: lineLength }); 
            lineLength += 1;
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }

    lines.push({ line, x, y, length: lineLength }); 
    
    return lines;
}

CanvasRenderingContext2D.prototype.drawRoundedImage = function(image, radius, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight){ 
    let x = dx || sx;
    let y = dy || sy;
    let width =  dWidth || sWidth || image.naturalWidth;
    let height = dHeight || sHeight || image.naturalHeight;
    let r = {topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0};
  
    radius = !Array.isArray(radius) ? [radius] : radius;
  
    r.topLeft = radius[0];
    r.topRight = radius[1] || (radius[1]===undefined) * radius[0];
    r.bottomRight = radius[2] || (radius[2]===undefined) * radius[0];
    r.bottomLeft = radius[3] || (radius[3]===undefined) * (radius[1] || (radius[1]===undefined) * radius[0]);
  
    this.beginPath();
    this.arc(x + r.topLeft, y + r.topLeft, r.topLeft, Math.PI, Math.PI + Math.PI / 2);
    this.lineTo(x + width - r.topRight, y);
    this.arc(x + width - r.topRight, y + r.topRight, r.topRight, Math.PI + Math.PI/2, Math.PI*2);
    this.lineTo(x + width, y + height - r.bottomRight);
    this.arc(x + width - r.bottomRight, y + height - r.bottomRight, r.bottomRight, Math.PI*2, Math.PI/2);
    this.lineTo(x + r.bottomLeft, y + height);
    this.arc(x + r.bottomLeft, y + height - r.bottomLeft, r.bottomLeft, Math.PI/2, Math.PI);
    this.closePath();
    this.save();
    this.clip();
  
    switch(true){
        case arguments.length > 6:
            this.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);   
        break;
    
        case arguments.length > 4:
            this.drawImage(image, sx, sy, sWidth, sHeight);   
        break;
    
        default:
            this.drawImage(image, sx, sy);   
        break;
    }
  
    this.restore();
}



const bot = new VK({ token: "vk1.a.po6jeDLgCZL_lRuPCG_7p1x8Kl-_CnfBkKzInyIsP99oKBMNjIiYSYAfi_5ZpZx-4SKUiyOTp55XC84bdUJzXAO3B9GEpI19MBMm82vCQb5IXtRNXtcEMX1dEujXUl_GchAySE-FJHmbdDeLar8aUmCYsag8wHxgHttXd5Mx6e2N8pKFQFQwgOzH0IFh6sO8" })

const citata = async (message, api, userid, text) => {
            const image = await loadImage("/root/CookieLP/citatphoto/citat.jpg");
            //const image = await loadImage('https://i.imgur.com/YzwG7yk.jpeg')

            const [user] = await api.users.get({ user_ids: [ userid ], fields: ["photo_max_orig"] });

             const stickers = message.getAllAttachments("sticker"); 

            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext("2d");
            
            const TopText = 760;
    
            ctx.drawImage(image, 0, 0, image.width, image.height);
                
            registerFont("./fonts/Montserrat-Regular.ttf", {
                family: "Montserrat Regular" 
            }); 

            if (Boolean(stickers[0])) {
                const sticker = await loadImage(stickers[0].imagesWithBackground.pop().url);
                const stickerPos = {
                    x: ((canvas.width - sticker.width) * 0.5) + 230,
                    y: (canvas.height - sticker.height) * 0.5,
                };

                ctx.beginPath(); 
                ctx.drawImage(sticker, stickerPos.x, stickerPos.y, 512, 512);
                ctx.closePath();
            } else { 
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.font = "46px 'Montserrat Regular'";
                const lines = ctx.wrapText(text, (canvas.width / 2) + 230, (canvas.height / 2) - 50, 800, 60);  
                ctx.fillStyle = "#fff";
                for (let i = 0; i < lines.length; i++) {
                    const topPadding = lines.length * 18;
                    if (lines[i]) {
                        ctx.fillText(lines[i].line, lines[i].x, lines[i].y - topPadding);
                    } 
                }
                ctx.fill(); 
                ctx.closePath();
            }

            ctx.beginPath();
            const avatar = await loadImage(user.photo_max_orig);
            const scale = 450;
            ctx.drawRoundedImage(avatar, scale / 2, 60, ((canvas.height - scale) * 0.5) - 50, scale, scale);
            ctx.closePath();

            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
          ctx.font = "40px 'Montserrat Regular'";
            ctx.fillStyle = "#fff";
            ctx.fillText(user.first_name, 280, TopText);
            const metricsNickname = ctx.measureText(user.first_name);
            ctx.fillText(user.last_name, 280, TopText + 50);
            ctx.fillText(moment().format("DD MMM YYYY"), 280, TopText + 150);
            ctx.fill();
            ctx.closePath();

            return canvas.toBuffer()
        }

const checkToken = async function(resing){
    if(!resing.includes(`access_token=`) || !resing.includes(`&expires_in=`)) return false;
    if(resing.includes(`access_token=`)){
        resing = resing.split('access_token=')[1]
    }
    if(resing.includes(`&expires_in=`)){
        resing = resing.split('&expires_in=')[0]
    }
    return resing
}

class VKMe extends API {
	constructor(params={}) {
		super({
			token: params.token,
			callbackService,
			...constants.vk.master.defaultParams,
		});
	}
}

const isRegExp = async function(e){
    return e instanceof RegExp;
}

const connect = async function(params={}){
    let param = params
    let user_info = (await bot.api.users.get({access_token: param.token}))[0]
    new user(param)
}

const save = async function (user_id, data) {
    writeFileSync('/root/CookieLP' + '/database/'+user_id+'.json', JSON.stringify(data, null, 4))
    return true;
}

const user = class {
    constructor(params={}){
        return new Promise(async (res, rej) => {
            this.params = params
            this.vk = new VK({token: this.params.token})
            this.vk.updates.startPolling().then(() => console.log("user polling started"))
            this.vk.api.users.get().then((res) => {
                if(!existsSync(`/root/CookieLP/database/${res[0].id}.json`)){
                    writeFileSync('/root/CookieLP' + '/database/'+res[0].id+'.json', JSON.stringify(params, null, 4))
                }
            }).catch((err) => console.log(`Error connected from @id${this.params.user_id}`))
			
            this.vk.updates.on("message_new", async (message, next) => {
                let byid = (await this.vk.api.messages.getById({message_ids: [message.id]})).items.pop()
                message.user = JSON.parse(readFileSync(`/root/CookieLP/database/${params.user_id}.json`))
                if(!message.user.access) message.user.access = []
                //if(!(message.user.access.find(x => x == byid.from_id))) return;
                for (const file of readdirSync("/root/CookieLP/commands/UserCommand").filter(x => x.split(".").pop() == "js")) {
                    try {
                        if(message.text){
                            const script = await import("/root/CookieLP/commands/UserCommand/" + file);  
                            if (Array.isArray(script.default.regexp)) {
                                for (const regxp of script.default.regexp) {
                                    if (regxp.test(message.text)) {
                                        message.args = message.text.match(regxp);
                                        await script.default.run.call(this.vk, message);

                                        if(params.user_id == byid.from_id) await save(byid.from_id, message.user)
                                        break;
                                    }
                                }
                            } else if (isRegExp(script.default.regexp)) {
                                if (script.default.regexp.test(message.text)) {
                                    message.args = message.text.match(script.default.regexp)
                                    await script.default.run.call(this.vk, message);
                                    
                                    if(params.user_id == byid.from_id) await save(byid.from_id, message.user)
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
        })
    }
}

export { connect, checkToken, save, VKMe, citata, isRegExp }
