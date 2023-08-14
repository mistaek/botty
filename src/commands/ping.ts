import {Interaction, SlashCommandBuilder} from "discord.js"; 

export const data = new SlashCommandBuilder().setName('ping').setDescription('Checks if bot is up'); 
export async function execute(interaction: Interaction){ await interaction.reply('Pong!');}