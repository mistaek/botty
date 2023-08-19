import {type GuildMember, type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder} from "discord.js"; 
import {joinVoiceChannel, VoiceConnectionStatus} from '@discordjs/voice';
import type {Command} from '../../structs/command.js';
import { Queue } from "../../structs/queue.js";
import {getSong} from '../../misc/utils.js'
import { ExtendedClient } from "src/structs/client.js";

export default {
    data: new SlashCommandBuilder()
            .addStringOption(option => option.setName('input').setDescription('song url or name').setMaxLength(1000).setRequired(true)) // need to add first to avoid type errors
            .setName('play')
            .setDescription('plays a song'), 
    async execute(interaction: ChatInputCommandInteraction){
        const user = interaction.member! as GuildMember; //should always be guild member, not sure how to resolve these kinda type issues 
        if(!user.voice.channel){
            await interaction.reply(`bud you are not in a vc`);
            return;
        }
        
        const client = interaction.client as ExtendedClient;
        let queue : Queue|undefined = client.queues.get(interaction.guild!.id);
        if(!queue || !queue.connected()){
            const connection = joinVoiceChannel({
                channelId: user.voice.channel.id,
                guildId: interaction.guild!.id,
                adapterCreator: interaction.guild!.voiceAdapterCreator
            });
            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('Joined voice channel');
            });
            queue = new Queue(interaction.guild!.id, connection);
            client.queues.set(interaction.guild!.id, queue);
        }

        //need better place to manage connection, do i move it to queue??        

        const song = await getSong(interaction.options.getString('input')!);
        if(!song){
            await interaction.reply('No song found');
            return; 
        }

        
        queue.addSong(song);
        queue.play();
        let embed = new EmbedBuilder().setAuthor({name: 'Added to queue'})
                                            .setThumbnail(song!.thumbnail)
                                            .setTitle(`${song!.title}`)
                                            .setURL(song!.url)
                                            .setDescription(`Duration: ${song!.duration}`);
        await interaction.reply({embeds: [embed]});
    }
} satisfies Command;

