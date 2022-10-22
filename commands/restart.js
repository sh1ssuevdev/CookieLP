export default {
    regexp: /^(?:restart|куыефке)$/i,
    async run(message){
        await message.send(`Перезагружаю`)
        process.exit()
    }
}