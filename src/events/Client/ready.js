const { prefix } = require("../../config/client.js");
const { Activity } = require("discord.js");

module.exports ={
name: "ready",
run: async (client) => {
	
    client.manager.init(client.user.id);
    client.logger.log(`Sesion iniciada en ${client.user.username}`, "ready");
    client.logger.log(`Servidores: ${client.guilds.cache.size}, Miembros: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, "ready");

    let statuses = [`mahiro.online/discord`]; // Estado del bot
    
	setInterval(function() {
  		let status = statuses[Math.floor(Math.random()*statuses.length)];
  		client.user.setActivity(status, {type: Activity.Watching});}, 10000)
	}}
