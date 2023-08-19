import { SlashCommandBuilder, type ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction, GuildMember } from "discord.js";
import {joinVoiceChannel, VoiceConnectionStatus} from '@discordjs/voice';
import { Queue } from "../../structs/queue.js";
import { ExtendedClient } from "../../structs/client.js";
import { searchSongs, videoPattern } from "../../misc/utils.js";
export default {
    data: new SlashCommandBuilder().addStringOption(option => option.setName('input').setDescription('Search term').setMaxLength(1000).setRequired(true))
                                    .setName('search')
                                    .setDescription('Search for a song'), 
    async execute(interaction: ChatInputCommandInteraction){
        const user = interaction.member! as GuildMember; //should always be guild member, not sure how to resolve these kinda type issues 
        const client = interaction.client as ExtendedClient; 
        let queue = client.queues.get(interaction.guild!.id);
        await interaction.deferReply();

        const songs = await searchSongs(interaction.options.getString('input')!);
        if(!songs){
            await interaction.reply('No results found');
            return; 
        }
        
        const list = songs.map((song, index) => `${index+1}: [${song.title}](${song.url})`).join("\n");
        const options = songs.map((song,index) => { return new StringSelectMenuOptionBuilder().setLabel(song.title).setValue(index.toString())});
        
        const embed = new EmbedBuilder().setTitle(`Search results for ${interaction.options.getString('input')!}`).setDescription(list);
        
        const select =  new StringSelectMenuBuilder().setCustomId("search-select")
                                        .setPlaceholder("Nothing selected")
                                        .setMinValues(1)
                                        .setMaxValues(songs.length)
                                        .addOptions(options);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select); 

        //this part is rather ugly
        const reply = await interaction.editReply({embeds: [embed], components: [row]});
        reply.awaitMessageComponent({
            time: 10000 //collect all interactions within timeframe ??
        }).then((selectInteraction: any) => {
            if(!(selectInteraction instanceof StringSelectMenuInteraction)) return; 
            if(!user.voice.channel){ return; }
            selectInteraction.values.forEach((idx) => {
                if(!queue){
                    const connection = joinVoiceChannel({
                        channelId: user.voice.channel!.id,
                        guildId: interaction.guild!.id,
                        adapterCreator: interaction.guild!.voiceAdapterCreator
                    });
                    connection.on(VoiceConnectionStatus.Ready, () => {
                        console.log('Joined voice channel');
                    });
                    queue = new Queue(interaction.guild!.id, connection);
                    client.queues.set(interaction.guild!.id, queue);
                }
                queue.addSong(songs[parseInt(idx)]); 
            });
            queue!.play();
            selectInteraction.reply({content: "Added selected songs", ephemeral: true});
        })
    }
}