import {getVoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnectionStatus, AudioPlayer, AudioPlayerState, AudioPlayerStatus, VoiceConnection} from '@discordjs/voice';
import play from 'play-dl'
import type {Song} from './song.js';
import { error } from 'console';

export class Queue{
    private guildId: string;
    private currentSong: Song | undefined | null; //questionable design decision but im too lazy to rewrite some of the other stuff
    private queue: Song[];
    private player: AudioPlayer;
    private connection: VoiceConnection

    constructor(id: string, connection: VoiceConnection){
        this.guildId = id;
        this.connection = connection;
        this.queue = [];
        this.currentSong = null;
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });
        this.player.on('stateChange', async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if(newState.status == AudioPlayerStatus.Idle){
                //console.log('audio player update, try to play a song');
                if(this.currentSong) this.currentSong = null;
                if(this.queue.length) this.play();
            }
        })
    }
    
    public addSong(song: Song){
        this.queue.push(song);
    }

    public async play(){
        if(this.player.state.status !== AudioPlayerStatus.Idle) return;
        this.currentSong = this.queue.shift(); 
        if(!this.currentSong) return; 
        const stream = await play.stream(this.currentSong.url);
        const connection = getVoiceConnection(this.guildId);
        if(!connection){
            throw error("not connected");
        }
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type,
            inlineVolume: true,
        })
        resource.volume?.setVolume(0.2);
        this.player.play(resource);
        connection.subscribe(this.player);    
    }

    public async pause(){
        if(this.player.state.status === AudioPlayerStatus.Playing) this.player.pause(); 
        else if(this.player.state.status === AudioPlayerStatus.Paused) this.player.unpause();
    }

    public async skip(){
        this.player.stop();
        this.play();
    }

    public connected() {
        return (this.connection.state.status === VoiceConnectionStatus.Ready);
    }
    
    public async stop(){
        this.player.stop();
        this.currentSong = null;
        this.queue = [];
        this.connection.destroy();
    }

    public remove(index: number){
        if(index <= 0 || index-1 > this.queue.length) return null;

        let removed : Song; 
        if(index == 1){
            if(!this.currentSong) return null;
            removed = this.currentSong; 
            this.skip(); 
            return removed; 
        }
        else{
            removed = this.queue[index-2]; 
            this.queue.splice(index-2, 1); 
            return removed; 
        }
    }
    public getSongs(){
        return this.queue;
    }

    public np(){
        return this.currentSong;
    }
}