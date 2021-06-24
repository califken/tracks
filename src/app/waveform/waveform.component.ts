import {
  Input,
  ChangeDetectorRef,
  Component,
  HostListener,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

import WebAudio from 'wavesurfer.js/src/webaudio.js';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import MarkersPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.markers.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js';
import { GlobalMediaControlService } from '../global-media-control.service';

import { WavesurferService } from '../wavesurfer.service';
@Component({
  selector: 'app-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss'],

  providers: [WavesurferService]
})
export class WaveformComponent implements AfterViewInit, OnDestroy {
  @Input() track;
  @Input() trackurl: string;
  @Input() trackkey: string;
  @Input() annotations?: boolean;
  @Input() authorid?: string;
  @Input() refpath?: string;
  progress = '0:00';
  volume = 1;
  zoom = 1;

  public wave: WaveSurfer = null;
  public trackduration;
  public localprogresspercentage;
  public regions;
  public isplaying;
  public ispaused;
  public isfinished = false;

  public playstateSubject: BehaviorSubject<string>;
  public playstate = 'ready';
  constructor(
    public ws: WavesurferService,
    public gmcs: GlobalMediaControlService
  ) {
    if (this.gmcs.playControlSubject) {
      this.gmcs.playControlSubject.subscribe(action => {
        if (action == 'stop') {
          this.ws.wave.stop();
        }
      });
    }

    this.playstateSubject = new BehaviorSubject<string>('ready');

    this.playstateSubject.subscribe(x => (this.playstate = x));
  }

  ngAfterViewInit(): void {
    if (!this.ws.wave) {
      if (this.annotations) {
        this.ws.generateWaveformWithAnnotations(this.trackkey, this.refpath);
      } else {
        this.ws.generateWaveform(this.trackkey);
      }
      if (this.ws.wave && this.trackurl) {
        this.ws.wave.load(this.trackurl);
      }
    }
  }

  ngOnDestroy() {
    if (this.ws.wave) this.ws.wave.destroy();
  }

  updateseek(v): void {
    console.log(v);
    this.ws.wave.seekTo(v / 100);
  }
  async playPause() {
    if (this.wave) {
      if (this.wave.isPlaying()) {
        this.wave.pause();
        this.ispaused = true;
        // this.registerplayback('pause');
      } else {
        if (this.gmcs.playControlSubject) {
          this.gmcs.playControlSubject.next('stop');
        }
        this.wave.play();
        this.ispaused = false;
        // this.registerplayback('play');
      }
    } else {
      return false;
    }
  }
}
