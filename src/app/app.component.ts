import { Component, OnInit, ElementRef } from '@angular/core';
import { VgFullscreenAPI, VgAPI } from 'videogular2/core'; 


interface AframeEntity {
    id: string;
    position: string;
    rotation: string;
}
interface VrDoor extends AframeEntity {
    goto: string;
}
interface VrText extends AframeEntity {
    text: string;
    scale: string;
}
interface Video {
    id: string;
    url: string;
    doors: Array<VrDoor>;
    texts: Array<VrText>;
}

@Component({
    selector: 'vr-player',
    templateUrl: './app/vr-player.html'
})
export class VRPlayer implements OnInit {
    elem: any;
    aframe: any;
    currentVideo: Video;
    timeout: number;
    vgApi:VgAPI;
    videos: Array<Video> = [
        {
            id: 'v0',
            url: 'http://static.videogular.com/assets/videos/vr-route-0.mp4',
            doors: [
                {id: 'd1', position: '-3 2 -10', rotation: '0 0 0', goto: 'v1'}
            ],
            texts: []
        },
        {
            id: 'v1',
            url: 'http://static.videogular.com/assets/videos/vr-route-1.mp4',
            doors: [
                {id: 'd1', position: '-15 -3 -18', rotation: '0 -180 0', goto: 'v0'},
                {id: 'd2', position: '8 1 9', rotation: '0 -130 0', goto: 'v2' }
            ],
            texts: [
                {id: 'd1', text: 'Estany de St. Maurici', position: '3 1 -2', rotation: '0 310 0', scale: '1 1 1'}
            ]
        },
        {
            id: 'v2',
            url: 'http://static.videogular.com/assets/videos/vr-route-2.mp4',
            doors: [
                {id: 'd1', position: '-1 1 -8', rotation: '0 -30 0', goto: 'v1'},
                {id: 'd2', position: '0 2 7', rotation: '0 180 0', goto: 'v3'}
            ],
            texts: []
        },
        {
            id: 'v3',
            url: 'http://static.videogular.com/assets/videos/vr-route-3.mp4',
            doors: [
                {id: 'd1', position: '-5 2 7', rotation: '0 130 0', goto: 'v2'},
                {id: 'd2', position: '3 4 7', rotation: '0 210 0', goto: 'v4'}
            ],
            texts: []
        },
        {
            id: 'v4',
            url: 'http://static.videogular.com/assets/videos/vr-route-4.mp4',
            doors: [
                {id: 'd1', position: '2 1 10', rotation: '0 180 0', goto: 'v3'},
                {id: 'd2', position: '3 2 -10', rotation: '0 180 0', goto: 'v0'}
            ],
            texts: []
        }
    ];

    constructor(ref: ElementRef) {
        this.elem = ref.nativeElement;
        this.currentVideo = this.videos[0];
    }

    ngOnInit() {
        this.aframe = this.elem.querySelector('a-scene');
        VgFullscreenAPI.onChangeFullscreen.subscribe(this.onChangeFullscreen.bind(this));
    }

    onAframeRenderStart() {
        const media = this.vgApi.getDefaultMedia();
        if(media.isMetadataLoaded) {
            this.displayDoors();
        }
    }

    onPlayerReady(api:VgAPI) {
        this.vgApi = api;
        const media = api.getDefaultMedia();
        if(media.isMetadataLoaded) {
            this.displayDoors();
        }
        media.subscriptions.loadedMetadata.subscribe(this.displayDoors.bind(this));
    }

    displayDoors() {
        Array.from(document.querySelectorAll('a-image'))
            .forEach(item => item.dispatchEvent(new CustomEvent('vgStartFadeInAnimation')));
    }

    onChangeFullscreen(fsState) {
        if (fsState) {
            this.aframe.setStereoRenderer();
            this.aframe.addState('vr-mode');
        }
    }

    onMouseEnter($event, door:VrDoor) {
        $event.target.dispatchEvent(new CustomEvent('vgStartAnimation'));

        this.timeout = setTimeout( () => {
            this.currentVideo = this.videos.filter( v => v.id === door.goto )[0];
        }, 2000 );
    }

    onMouseLeave($event) {
        $event.target.dispatchEvent(new CustomEvent('vgPauseAnimation'));

        // Send start and pause again to reset the scale and opacity
        $event.target.dispatchEvent(new CustomEvent('vgStartAnimation'));
        $event.target.dispatchEvent(new CustomEvent('vgPauseAnimation'));

        clearTimeout(this.timeout);
    }
}
