import { getVoiceConnection} from "@discordjs/voice";
import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type {Command} from '../../structs/command.js';
import { ExtendedClient } from "../../structs/client.js";
export default {
    data: new SlashCommandBuilder().setName('leave').setDescription('Leaves vc'),
    async execute(interaction: ChatInputCommandInteraction){
        let client = interaction.client as ExtendedClient;
        let queue = client.queues.get(interaction.guild!.id);
        if(queue) queue.stop();
        
        await interaction.reply({content: `left vc`, ephemeral: true});
    }
} satisfies Command;