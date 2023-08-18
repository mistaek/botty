import {getVoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnectionStatus, AudioPlayer, AudioPlayerState, AudioPlayerStatus} from '@discordjs/voice';
import play from 'play-dl'
import type {Song} from './song.js';
import { error } from 'console';

export class Queue{
    private guildId: string;
    private queue: Song[]; 
    private player: AudioPlayer;

    constructor(id: string){
        this.guildId = id;
        this.queue = [];
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });
        this.player.on('stateChange', async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if(newState.status == AudioPlayerStatus.Idle){
                console.log('audio player update, try to play a song');
                if(this.queue.length) this.play();
            }
        })
    }
    
    public addSong(song: Song){
        this.queue.push(song);
    }

    public async play(){
        if(this.player.state.status !== AudioPlayerStatus.Idle) return;
        const song = this.queue.shift(); 
        if(!song) return; 
        const stream = await play.stream(song.url);
        const connection = getVoiceConnection(this.guildId);
        if(!connection){
            throw error("not connected");
        }
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })
        this.player.play(resource);
        connection.subscribe(this.player);    
    }
}