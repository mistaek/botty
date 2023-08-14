import { Interaction } from "discord.js";

//type properly later
export type Command ={
    data: any;
    execute(interaction: Interaction) : Promise<void> | void; 
};