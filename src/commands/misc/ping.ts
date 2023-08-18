import {type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js"; 
import type {Command} from '../../structs/command.js';

export default {
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('replies pong'),
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.reply('pong');
    }
} satisfies Command;
