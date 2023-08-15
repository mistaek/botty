import {Events, type Client, Interaction} from 'discord.js';
import {ExtendedClient} from '../../structs/client.js'
import {Event} from '../../structs/event.js'
export default {
    name: Events.InteractionCreate, 
    async execute(interaction : Interaction) {
        if(!interaction.isChatInputCommand()) return; 
        //console.log(interaction);
        const command = (interaction.client as ExtendedClient).commands.get(interaction.commandName);
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

    }
} satisfies Event; 
