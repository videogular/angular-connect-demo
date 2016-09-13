import { Component, OnInit, ElementRef } from '@angular/core';
import { VgFullscreenAPI } from 'videogular2/core';


interface HotSpot {
    id: string;
    point: string;
    goto: string;
    rotation: string;
}
interface Video {
    id: string;
    url: string;
    hotspots: Array<HotSpot>;
}

@Component({
    selector: 'vr-player',
    templateUrl: './app/vr-player.html'
})
export class VRPlayer implements OnInit {
    elem: any;
    aframe: any;
    currentVideo: Video;
    spinning: boolean;
    timeout: number;
    videos: Array<Video> = [
        {
            id: 'v0',
            url: 'http://static.videogular.com/assets/videos/vr-route-0.mp4',
            hotspots: [
                {id: 'h1', point: '-3 2 -10', rotation: '0 0 0', goto: 'v1'}
            ]
        },
        {
            id: 'v1',
            url: 'http://static.videogular.com/assets/videos/vr-route-1.mp4',
            hotspots: [
                {id: 'h1', point: '-15 -3 -18', rotation: '0 -180 0', goto: 'v0'},
                {id: 'h2', point: '8 1 9', rotation: '0 -130 0', goto: 'v2' }
            ]
        },
        {
            id: 'v2',
            url: 'http://static.videogular.com/assets/videos/vr-route-2.mp4',
            hotspots: [
                {id: 'h1', point: '-1 1 -8', rotation: '0 -30 0', goto: 'v1'},
                {id: 'h2', point: '0 2 7', rotation: '0 180 0', goto: 'v3'}
            ]
        },
        {
            id: 'v3',
            url: 'http://static.videogular.com/assets/videos/vr-route-3.mp4',
            hotspots: [
                {id: 'h1', point: '-5 2 7', rotation: '0 130 0', goto: 'v2'},
                {id: 'h2', point: '3 4 7', rotation: '0 210 0', goto: 'v4'}
            ]
        },
        {
            id: 'v4',
            url: 'http://static.videogular.com/assets/videos/vr-route-4.mp4',
            hotspots: [
                {id: 'h1', point: '2 1 10', rotation: '0 180 0', goto: 'v3'},
                {id: 'h2', point: '3 2 -10', rotation: '0 180 0', goto: 'v0'}
            ]
        }
    ];

    constructor(ref: ElementRef) {
        this.elem = ref.nativeElement;
        this.currentVideo = this.videos[0];
        this.spinning = false;
    }

    ngOnInit() {
        this.aframe = this.elem.querySelector('a-scene');
        VgFullscreenAPI.onChangeFullscreen.subscribe(this.onChangeFullscreen.bind(this));
    }

    onChangeFullscreen(fsState) {
        if (fsState) {
            this.aframe.setStereoRenderer();
            this.aframe.addState('vr-mode');
        }
    }

    onMouseEnter($event, hotSpot:HotSpot) {
        $event.target.dispatchEvent(new CustomEvent('vgStartAnimation'));

        this.timeout = setTimeout( () => {
            this.currentVideo = this.videos.filter( v => v.id === hotSpot.goto )[0];
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
