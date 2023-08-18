import { ExtendedClient } from './structs/client.js';
import 'dotenv/config';

const client = new ExtendedClient();

client.start();