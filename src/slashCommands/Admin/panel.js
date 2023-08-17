const { Discord, WebhookClient, PermissionsBitField, ActionRowBuilder, MessageActionRow, EmbedBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, CommandInteraction, Client, ApplicationCommandOptionType } = require("discord.js");
const options = require('../../config/options.json');
const messages = require('../../config/messages.json');
const panel = require('../../config/panel.json');

/* 
	Developed by @RonaldZav in
	Mahiro Studios, visit us
	website on https://mahiro.online 
*/

module.exports = {
    name: "panel",
    description: "Enviar panel de tickets, solo administradores.",
	userPerms: ["Administrator"],
		
    run: async (client, interaction) => { await interaction.deferReply({ ephemeral: true });
	
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) { interaction.reply({ ephemeral: true, content: "Ops! You can't use this command."}); } else {
	
	
	const ticketsmenu = new ActionRowBuilder()
	.addComponents(
	new SelectMenuBuilder()
	.setCustomId('createTicket')
	.setPlaceholder(messages.selectAnOption)
		.addOptions(options))

	let embed = new EmbedBuilder().setColor(client.embedColor);
	
	if(panel.title) embed.setTitle(panel.title);
	if(panel.description) embed.setDescription(panel.description);
 	if(panel.thumbnail) embed.setThumbnail(panel.thumbnail);
	if(panel.image) embed.setImage(panel.image);
       
	await interaction.editReply({ content: messages.panelSended })

       interaction.channel.send({ embeds: [embed], components: [ticketsmenu]});

    }
	
	
	
}}