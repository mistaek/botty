//code inspired by https://github.com/joeyk710/sample-discordjs-bot/blob/master/src/misc/util.ts
import { pathToFileURL } from 'node:url';
import { type PathLike, readdirSync } from 'node:fs';
import { join } from 'node:path';

//music functions should probably be moved
import { InfoData, YouTubeChannel, video_basic_info } from 'play-dl';
import {Song} from '../structs/song.js';
import play from 'play-dl';


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

export const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;

function hmsToSecondsOnly(str:string) {
    let p = str.split(':');
    let s = 0, m = 1, i = p.length -1;

    while (i >= 0) {
        s += m * parseInt(p[i--], 10);
        m *= 60;
    }

    return s;
}

export async function getSong(name: string): Promise<Song|null>{
    const isYoutubeUrl = videoPattern.test(name);
    let songInfo : InfoData;
    if(isYoutubeUrl){
        songInfo = await video_basic_info(name);
        return {
            url: songInfo.video_details.url,
            title: songInfo.video_details.title!,
            thumbnail: songInfo.video_details.thumbnails[0].url,
            duration: songInfo.video_details.durationRaw
        } satisfies Song;
    }
    else{
        const result = await play.search(name, {limit: 1});
        if(!result.length){
            return null;
        }
        const topResult = result[0];
        if(topResult.type !== 'video') return null;
        return {
            url: topResult.url,
            title: topResult.title!,
            thumbnail: topResult.thumbnails[0].url,
            duration: topResult.durationRaw
        } satisfies Song; 
        
    }
}
