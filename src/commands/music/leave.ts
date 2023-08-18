import { getVoiceConnection} from "@discordjs/voice";
import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type {Command} from '../../structs/command.js';

export default {
    data: new SlashCommandBuilder().setName('leave').setDescription('Leaves vc'),
    async execute(interaction: ChatInputCommandInteraction){
        const connection = getVoiceConnection(interaction.guild!.id);
        connection?.destroy();
        
        await interaction.reply('left vc');
    }
} satisfies Command;