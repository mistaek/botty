import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import { Queue } from "../../structs/queue.js";
import { ExtendedClient } from "../../structs/client.js";

export default {
    data: new SlashCommandBuilder().setName('np').setDescription('Displays current song'), 
    async execute(interaction: ChatInputCommandInteraction){
        const client = interaction.client as ExtendedClient; 
        const queue = client.queues.get(interaction.guild!.id);
        if(!queue || !queue.np()){
            await interaction.reply('Queue is empty'); 
            return;
        }
        
        const song = queue!.np(); 
        let nowPlaying = new EmbedBuilder().setAuthor({name: 'Now playing'})
                                            .setThumbnail(song!.thumbnail)
                                            .setTitle(`${song!.title}`)
                                            .setURL(song!.url)
                                            .setDescription(`Duration: ${song!.duration}`);
                                            
        await interaction.reply({embeds: [nowPlaying]});

    }
}