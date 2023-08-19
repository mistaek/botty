import { SlashCommandBuilder, EmbedBuilder, type Embed, type ChatInputCommandInteraction } from "discord.js";
import { Queue } from "../../structs/queue.js";
import { ExtendedClient } from "../../structs/client.js";

//little awk that there are two files with same name, could do some reorg

export default {
    data: new SlashCommandBuilder().setName('queue')
                                    .setDescription('Lists current queue'),
    async execute(interaction: ChatInputCommandInteraction){
        const client = interaction.client as ExtendedClient; 
        const queue = client.queues.get(interaction.guild!.id);
        if(!queue || !queue.np()){
            await interaction.reply('Queue is empty'); 
            return;
        }

        await interaction.deferReply();
        let cur = queue.np();
        let songs = queue.getSongs();
        songs = songs.slice(0, 10);
        
        let i = 1; 
        const list = `1: [${cur!.title}](${cur!.url})` + "\n" + songs.map((song) => `${++i}: [${song.title}](${song.url})`).join("\n");

        const embed = new EmbedBuilder().setTitle("Queue")
                                        .setDescription(list);
        
        await interaction.editReply(
            {embeds: [embed]}
        )
        
    }
}