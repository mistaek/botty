import {Client, Collection, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { ExtendedClient } from './structs/client.js';
import 'dotenv/config';

import { SlashCommandBuilder } from 'discord.js';
const client = new ExtendedClient();

client.start();
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction : Interaction) =>{
    if(!interaction.isChatInputCommand()) return; 
    //console.log(interaction);
    const command = client.commands.get(interaction.commandName);
    if (!command) {
		  console.error(`No command matching ${interaction.commandName} was found.`);
		  return;
	  }
    try {
      await command.execute(interaction);
      console.log(`Executed command ${interaction.commandName} executed by user ${interaction.member}`);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }

});