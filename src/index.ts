import {Client, Collection, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { ExtendedClient } from './structs/client.js';
import 'dotenv/config';

import { SlashCommandBuilder } from 'discord.js';
const client = new ExtendedClient();

client.start();

