import type { ClientEvents } from "discord.js";
import { VoiceConnectionStatus } from "@discordjs/voice";

export type Event<Key extends keyof ClientEvents = keyof ClientEvents> = {
    name: Key;
    once?: boolean;
    execute(...parameters: ClientEvents[Key]): Promise<void> | void;
};