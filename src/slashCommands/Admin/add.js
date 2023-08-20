const { Discord, WebhookClient, PermissionsBitField, ActionRowBuilder, MessageActionRow, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js")
const options = require('../../config/options.json');
const messages = require('../../config/messages.json');
const panel = require('../../config/panel.json');

/* 
	Developed by @RonaldZav in
	Mahiro Studios, visit us
	website on https://mahiro.online 
*/

module.exports = {
    name: "add",
    description: "Añadir un miembro a este ticket",
	options: [{ name: "miembro", description: "Selecciona un miembro.", type: ApplicationCommandOptionType.User, required: true }],
		
    run: async (client, interaction) => { //await interaction.deferReply({ ephemeral: true });
	const member = interaction.options.getUser('miembro');
	
	const embed = new EmbedBuilder()
	.setTitle(panel.title)
	.setColor(client.embedColor)
	.setDescription(messages.memberAdded);
	
	const embedNotIsTicket = new EmbedBuilder()
	.setTitle(panel.title)
	.setColor(client.embedColor)
	.setDescription(messages.notInThisChannel);
	
	const embedNotPermission = new EmbedBuilder()
	.setTitle(panel.title)
	.setColor(client.embedColor)
	.setDescription(messages.notPermissions);
	
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) { interaction.reply({ ephemeral: true, embeds: [embedNotPermission] }) } else {
	
	const permissionsChannel = interaction.channel.permissionOverwrites.cache.map((o) => {
	return {
		id: o.id,
		allow: o.allow.toArray(),
		deny: o.deny.toArray()
	};
	});

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
