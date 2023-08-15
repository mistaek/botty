import type { RESTPostAPIApplicationCommandsJSONBody, RESTPostAPIApplicationGuildCommandsJSONBody, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

//type properly later
export type Command ={
    data: SlashCommandBuilder;
    execute(interaction: ChatInputCommandInteraction) : Promise<void> | void; 
};