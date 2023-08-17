const { Discord, WebhookClient, PermissionsBitField, ActionRowBuilder, MessageActionRow, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js")
const options = require('../../config/options.json');
const messages = require('../../config/messages.json');
const panel = require('../../config/panel.json');

/* 
	Developed by @RonaldZav in
	Mahiro Studios, visit us
	website on https://mahiro.online 
   
   Licenced only for HellsCloud   
*/

module.exports = {
    name: "add",
    description: "Add a member to this ticket.",
    owner: false,
	options: [{ name: "member", description: "Select a member to add.", type: ApplicationCommandOptionType.User, required: true }],
		
    run: async (client, interaction) => { //await interaction.deferReply({ ephemeral: true });
	let db = new megadb.crearDB({ nombre: "config", carpeta: "databases" });
	const member = interaction.options.getUser('member');
	
	const embed = new EmbedBuilder()
	.setAuthor({ 
	name: 'HellsCloud Support', 
	iconURL: 'https://cdn.discordapp.com/avatars/1139454266373853225/a17e039ad7307a1912649d5936d28350.webp', 
	url: 'https://hellscloud.net' })
	.setColor(client.embedColor)
	.setDescription(`${member} has been added.`);
	
	const embedNotIsTicket = new EmbedBuilder()
	.setAuthor({ 
	name: 'HellsCloud Support', 
	iconURL: 'https://cdn.discordapp.com/avatars/1139454266373853225/a17e039ad7307a1912649d5936d28350.webp', 
	url: 'https://hellscloud.net' })
	.setColor(client.embedColor)
	.setDescription(`You can't add a member to this channel because this channel not is a ticket.`);
	
	const embedNotPermission = new EmbedBuilder()
	.setAuthor({ 
	name: 'HellsCloud Support', 
	iconURL: 'https://cdn.discordapp.com/avatars/1139454266373853225/a17e039ad7307a1912649d5936d28350.webp', 
	url: 'https://hellscloud.net' })
	.setColor(client.embedColor)
	.setDescription(`Ops! You can't use this command.`);
	
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) { interaction.reply({ ephemeral: true, embeds: [embedNotPermission] }) } else {
	
	const permissionsChannel = interaction.channel.permissionOverwrites.cache.map((o) => {
	return {
		id: o.id,
		allow: o.allow.toArray(),
		deny: o.deny.toArray()
	};
	});
//	const permissions = JSON.stringify(permissionsChannel);
	
	/* Add member to ticket */
	const permissionsAdd = [
      {
        id: member.id,
        allow: ['SendMessages', 'ViewChannel'],
      },
    ];
	
	permissionsChannel.push(...permissionsAdd);
	
    await interaction.channel.permissionOverwrites.set(permissionsChannel);
	
	/* Successfull member added embed */
	interaction.reply({ embeds: [embed] });
			
}}}