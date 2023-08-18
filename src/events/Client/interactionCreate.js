const { PermissionsBitField, CommandInteraction, ButtonBuilder, ButtonStyle, ChannelType, InteractionType, ActionRowBuilder, SelectMenuBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const MahiroStudios = require("../../structures/Client");
const discordTranscripts = require('discord-html-transcripts');
const options = require('../../config/options.json');
const messages = require('../../config/messages.json');
const panel = require('../../config/panel.json');
const { intersection } = require("lodash");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    
    let closeTicket = new ButtonBuilder().setCustomId("closeTicket").setLabel("🗑️ Borrar").setStyle(ButtonStyle.Danger);
    let transcriptTicket = new ButtonBuilder().setCustomId("transcriptTicket").setLabel("📝 Transcribir").setStyle(ButtonStyle.Success).setDisabled(false);
    
    let prefix = client.prefix;
    const ress = interaction.guildId
    if (ress && ress.Prefix) prefix = ress.Prefix;


    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;

      const embed = new EmbedBuilder().setColor("Red");

      if (command.botPerms) { if (!interaction.guild.members.me.permissions.has( PermissionsBitField.resolve(command.botPerms || [])))
		{
          embed.setDescription(`No tengo el permiso **\`${command.botPerms}\`** en ${interaction.channel.toString()} para hacer esto.**`);
          return interaction.reply({ embeds: [embed] });
        }}

      if (command.userPerms) { if (!interaction.member.permissions.has( PermissionsBitField.resolve(command.userPerms || []))) 
	  {
          embed.setDescription(`No tienes el permiso**\`${command.userPerms}\`**${interaction.channel.toStrinf()} para usar **\`${command.name}\`** command.`);
          return interaction.reply({ embeds: [embed] });
      }}

      const player = interaction.client.manager.get(interaction.guildId);


      try { await command.run(client, interaction, prefix); } catch (error) {
        if (interaction.replied) { await interaction.editReply({ content: `¡Ocurrio un error! Avisa al equipo de Soporte` }).catch(() => {});
        } else { await interaction.reply({ ephemeral: true, content: `¡Ocurrio un error! Avisa al equipo de Soporte` }).catch(() => {}); }
        console.error(error); }}

        /* Eventos del sistema de tickets */

        if(interaction.isSelectMenu() && interaction.customId === 'createTicket'){

          let choices = "";
		      await interaction.values.forEach(async value => {
			      choices += `${value}`
		      })

          interaction.member.guild.channels.create({ 
            name: `ticket-${interaction.user.username}`,
                parent: client.ticketsCategory,
                topic: interaction.user.id,
            type: ChannelType.GuildText,
                permissionOverwrites: [{
                    id: interaction.user.id,
                    allow: ['SendMessages', 'ViewChannel'],
                  },
                  {
                    id: client.staffRole,
                    allow: ['SendMessages', 'ViewChannel'],
                  },
                  {
                    id: interaction.guild.roles.everyone,
                    deny: ['ViewChannel'],
                  }],
              }).then( async c => {  
            
            const embed = new EmbedBuilder()
            .setColor(client.embedColor);
            if(panel.title) embed.setTitle(panel.title);
            
            const textWithMemberPlaceholder = choices.replace("<miembro>", `<@${interaction.member.id}>`);

            embed.setDescription(textWithMemberPlaceholder);
            embed.setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true, size: 512}));
            
            const ticketsmenu = new ActionRowBuilder()
            .addComponents(
            new SelectMenuBuilder()
            .setCustomId('createTicket')
            .setPlaceholder(messages.selectAnOption)
              .addOptions(options))
          
            let embedPanel = new EmbedBuilder().setColor(client.embedColor);
            
            if(panel.title) embedPanel.setTitle(panel.title);
            if(panel.description) embedPanel.setDescription(panel.description);
             if(panel.thumbnail) embedPanel.setThumbnail(panel.thumbnail);
            if(panel.image) embedPanel.setImage(panel.image);

            const goToTicket = new ButtonBuilder()
            .setLabel(messages.clickToGoToTicket)
            .setURL(`https://discordapp.com/channels/${interaction.guild.id}/${c.id}`)
            .setStyle(ButtonStyle.Link);

            c.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(closeTicket, transcriptTicket)] });

            interaction.reply({ content: messages.ticketCreated, components: [new ActionRowBuilder().addComponents(goToTicket)], ephemeral: true })
            interaction.message.edit({ embeds: [embedPanel], components: [ticketsmenu] });
            
          });

        };
    
    if(interaction.isButton() && interaction.customId === "closeTicket"){
	
      const embed = new EmbedBuilder()
      .setTitle(panel.title)
      .setColor(client.embedColor)
      
      let confirm = new ButtonBuilder().setCustomId("closeTicketConfirm").setLabel("Confirmar").setStyle(ButtonStyle.Danger);
      let cancel = new ButtonBuilder().setCustomId("closeTicketCancel").setLabel("Cancelar").setStyle(ButtonStyle.Success);


      embed.setDescription(messages.closeTicket); interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(confirm, cancel)] });
        
      };
    
      if(interaction.isButton() && interaction.customId === "closeTicketCancel"){
        interaction.message.edit({ content: messages.closeTicketCancel, components: [], embeds: [] });
      };

    if(interaction.isButton() && interaction.customId === "closeTicketConfirm"){
      
      const embed = new EmbedBuilder()
      .setTitle(panel.title)
      .setColor(client.embedColor)
      .setDescription(messages.closeTicketConfirm);

       interaction.message.edit({ embeds: [embed], components: [] });
      setTimeout(()=> { interaction.channel.delete() } ,6000);
        
      };

      if(interaction.isButton() && interaction.customId === "transcriptTicket"){

    const c = client.channels.cache.find(channel => channel.id === client.transcriptChannel);	
    const textWithChannelPlaceholder = messages.transcriptSave.replace("<canal>", `<#${c.id}>`);

	const embed = new EmbedBuilder()
	  .setTitle(panel.title)
	  .setColor(client.embedColor)
	  .setDescription(textWithChannelPlaceholder);
	

	const attachmentTranscript = await discordTranscripts.createTranscript(interaction.channel, {filename: `transcript-${interaction.channel.id}.html`, poweredBy: false});
	
	await interaction.reply({ embeds: [embed] });
	c.send({ files: [attachmentTranscript] });

      };

 }};
