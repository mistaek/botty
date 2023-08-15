//code inspired by https://github.com/joeyk710/sample-discordjs-bot/blob/master/src/misc/util.ts
import { pathToFileURL } from 'node:url';
import { type PathLike, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type {Command} from '../structs/command.js';
export async function dynamicImport(path: string): Promise<any> {
    const module = await import(pathToFileURL(path).toString());
    return module?.default;
};

/**
 * Loads all structures from files in provided directory
 * @param {PathLike} path - The directory path to load the structures from
 * @param {[string, string]} props - The properties to check if the structure is valid
 */
export async function loadFolder(path: PathLike, props: [string, string]) {
    const fileData : any[] = [];

    const folders = readdirSync(path);
    for(const folder of folders){
        const filesPath = join(path.toString(), folder);
        const files = readdirSync(filesPath);

        for(const file of files){
            const filePath = join(filesPath, file); 
            const data = await dynamicImport(filePath); 
            if (props[0] in data && props[1] in data) fileData.push(data);
            else console.warn(`\u001b[33m The command at ${filePath} is missing a required ${props[0]} or ${props[1]} property.`);
        }
    }

    return fileData;
}
