import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { Queue } from "../../structs/queue.js";
import { ExtendedClient } from "../../structs/client.js";

export default {
    data: new SlashCommandBuilder().addIntegerOption( option => option.setName('index').setDescription('Index to remove').setRequired(true))
                                    .setName('remove').setDescription('Removes element from queue'), 
    async execute(interaction: ChatInputCommandInteraction){
        const client = interaction.client as ExtendedClient; 
        const queue = client.queues.get(interaction.guild!.id);
        if(!queue){
            await interaction.reply('Nothing in queue!'); 
            return; 
        }
        
        const index = interaction.options.getInteger('index')!; 
        const removed = queue.remove(index);

        if(!removed){
            await interaction.reply("That element does not exist!"); 
        } 
        else{
            await interaction.reply(`Removed ${removed.title} from queue`);
        }
    }
}