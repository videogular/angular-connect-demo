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
    opaAnim: string;
    posAnim: string;
}
interface VrTextPlane extends AframeEntity {
    position: string;
    rotation: string;
    target: string;
    width: number;
    height: number;
    isShown: boolean;
}
interface Video {
    id: string;
    url: string;
    doors: Array<VrDoor>;
    texts: Array<VrText>;
    textPlanes: Array<VrTextPlane>;
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
            texts: [],
            textPlanes: []
        },
        {
            id: 'v1',
            url: 'http://static.videogular.com/assets/videos/vr-route-1.mp4',
            doors: [
                {id: 'd1', position: '-15 -3 -18', rotation: '0 -180 0', goto: 'v0'},
                {id: 'd2', position: '8 1 9', rotation: '0 -130 0', goto: 'v2' }
            ],
            texts: [
                {
                    id: 't1',
                    text: 'St. Maurici lake (1910 m)',
                    position: '6 0 -4',
                    rotation: '0 -30 0',
                    scale: '2 2 2',
                    opaAnim: 'startEvents: t1; property: opacity; dur: 300; from: 0; to: 1; elasticity: 1000',
                    posAnim: 'startEvents: t1; property: position; dur: 500; from: 6 0 -4; to: 6 0.3 -4; elasticity: 1000'
                }
            ],
            textPlanes: [
                {id: 'p1', position: '17 0 -7', rotation: '-90 -30 0', width: 20, height: 20, target: 't1', isShown: false}
            ]
        },
        {
            id: 'v2',
            url: 'http://static.videogular.com/assets/videos/vr-route-2.mp4',
            doors: [
                {id: 'd1', position: '-1 1 -8', rotation: '0 -30 0', goto: 'v1'},
                {id: 'd2', position: '0 2 7', rotation: '0 180 0', goto: 'v3'}
            ],
            texts: [],
            textPlanes: []
        },
        {
            id: 'v3',
            url: 'http://static.videogular.com/assets/videos/vr-route-3.mp4',
            doors: [
                {id: 'd1', position: '-5 2 7', rotation: '0 130 0', goto: 'v2'},
                {id: 'd2', position: '3 4 7', rotation: '0 210 0', goto: 'v4'}
            ],
            texts: [],
            textPlanes: []
        },
        {
            id: 'v4',
            url: 'http://static.videogular.com/assets/videos/vr-route-4.mp4',
            doors: [
                {id: 'd1', position: '2 1 10', rotation: '0 180 0', goto: 'v3'},
                {id: 'd2', position: '3 2 -10', rotation: '0 180 0', goto: 'v0'}
            ],
            texts: [
                {
                    id: 't1',
                    text: 'Ratera lake (2370 m)',
                    position: '9 0 -7',
                    rotation: '0 -90 0',
                    scale: '2 2 2',
                    opaAnim: 'startEvents: t1; property: opacity; dur: 300; from: 0; to: 1; elasticity: 1000',
                    posAnim: 'startEvents: t1; property: position; dur: 500; from: 9 0 -7; to: 9 0.6 -7; elasticity: 1000'
                }
            ],
            textPlanes: [
                {id: 'p1', position: '17 0 -7', rotation: '-90 0 0', width: 20, height: 40, target: 't1', isShown: false}
            ]
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
            this.aframe.addFullScreenStyles();
        }
        else {
            this.aframe.removeFullScreenStyles();
        }
    }

    onMouseEnterPlane(plane:VrTextPlane) {
        if (!plane.isShown) {
            let target = document.querySelector('#' + plane.target);
            console.log(plane, target);
            target.dispatchEvent(new CustomEvent(plane.target));
            plane.isShown = true;
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
