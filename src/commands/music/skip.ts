import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { Queue } from "../../structs/queue.js";
import { ExtendedClient } from "../../structs/client.js";

export default {
    data: new SlashCommandBuilder().setName('skip').setDescription('skips song'), 
    async execute(interaction: ChatInputCommandInteraction){
        const client = interaction.client as ExtendedClient; 
        const queue = client.queues.get(interaction.guild!.id);
        if(queue){
            queue.skip();
        }
        await interaction.reply('skippered');
    }
}