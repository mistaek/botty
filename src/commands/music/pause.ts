import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { Queue } from "../../structs/queue.js";
import { ExtendedClient } from "../../structs/client.js";

export default {
    data: new SlashCommandBuilder().setName('pause').setDescription('pauses song'), 
    async execute(interaction: ChatInputCommandInteraction){
        const client = interaction.client as ExtendedClient; 
        const queue = client.queues.get(interaction.guild!.id);
        if(queue){
            queue.pause();
        }
        await interaction.reply('paused or maybe unpaused i dunno');
    }
}