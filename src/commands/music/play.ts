import {type GuildMember, type ChatInputCommandInteraction, SlashCommandBuilder, messageLink} from "discord.js"; 
import {createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnectionStatus} from '@discordjs/voice';
import type {Command} from '../../structs/command.js';
import { Queue } from "../../structs/queue.js";
import {getSong} from '../../misc/utils.js'
import play from 'play-dl';
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
        
        //need better place to manage connection, do i move it to queue??
        const connection = joinVoiceChannel({
            channelId: user.voice.channel.id,
            guildId: interaction.guild!.id,
            adapterCreator: interaction.guild!.voiceAdapterCreator
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('Joined voice channel');
        });

        const song = await getSong(interaction.options.getString('input')!);
        if(!song){
            await interaction.reply('No song found');
            return; 
        }

        const client = interaction.client as ExtendedClient;
        let queue : Queue|undefined = client.queues.get(interaction.guild!.id);
        if(!queue || !queue.connected()){
            queue = new Queue(interaction.guild!.id, connection);
            client.queues.set(interaction.guild!.id, queue);
        }
        queue.addSong(song);
        queue.play();
        await interaction.reply(`added ${song.title} to queue`);
    }
} satisfies Command;

