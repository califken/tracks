import { Injectable } from '@angular/core';
import WebAudio from 'wavesurfer.js/src/webaudio.js';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import MarkersPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.markers.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js';

import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, first, map, toArray, tap } from 'rxjs/operators';
import { GlobalMediaControlService } from './global-media-control.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { v4 as uuidv4 } from 'uuid';
export interface Region {
  id?: string;
  start: string;
  end: string;
  color: string;
  authorid: string;
  comment: string;
  active: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class WavesurferService {
  public wave: WaveSurfer = null;
  public trackduration;
  public progress;
  public localprogresspercentage;
  public regions;
  public wsregions;
  public trackurl;
  public isplaying;
  public ispaused;
  public isfinished = false;
  public trackkey;

  public playstateSubject: BehaviorSubject<string>;
  public playstate: string;

  savedregions: Observable<Region[]>;

  regionsRef: AngularFireList<any>;

  wsOptions;
  regionsloaded: boolean = false;
  constructor(
    public gmcs: GlobalMediaControlService,
    public db: AngularFireDatabase
  ) {
    this.playstateSubject = new BehaviorSubject<string>('ready');

    this.playstateSubject.subscribe(x => (this.playstate = x));

    if (this.gmcs.playControlSubject) {
      this.gmcs.playControlSubject.subscribe(action => {
        if (action == 'stop' && this.wave) {
          this.wave.stop();
        }
      });
    }
  }

  updateseek(v): void {
    console.log(v);
    this.wave.seekTo(v / 100);
  }
  generateWaveform(trackkey): void {
    this.wsOptions = {
      container: '#' + trackkey,
      backgroundColor: this.randomColor(0.9),
      cursorColor: '#fff',
      progressColor: this.randomColor(0.9),
      waveColor: '#ccc',
      barGap: 2,
      barHeight: 0.5,
      barMinHeight: 1,
      barRadius: 3,
      barWidth: 5,
      autoCenter: true,
      normalize: true,
      scrollParent: false,
      backend: 'WebAudio',
      responsive: true,
      maxCanvasWidth: 100,
      hideScrollbar: true,
      height: 100
    };

    this.wave = WaveSurfer.create(this.wsOptions);

    // this.wave.on('ready', () =>
    //   this.wave.enableDragSelection({
    //     color: this.randomColor(0.1)
    //     })
    // );

    this.wave.on('play', () => this.playstateSubject.next('playing'));

    this.wave.on('finish', () => {
      this.wave.stop();
      this.playstateSubject.next('finished');
    });
    this.wave.on('pause', () => this.playstateSubject.next('paused'));

    this.wave.on('audioprocess', e => {
      this.progress = this.fmtMSS(Math.floor(e));
    });
  }

  generateWaveformWithAnnotations(trackkey, refpath): void {
    this.regionsRef = this.db.list(`${refpath}/annotations`);

    this.savedregions = this.regionsRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );

    this.regions = [];

    // this.regions.push({
    //   start: 0,
    //   end: 2,
    //   color: 'hsla(400, 100%, 30%, 0.5)'
    // });
    // this.regions.push({
    //   start: 2,
    //   end: 4,
    //   color: 'hsla(200, 50%, 70%, 0.4)'
    // });
    let thissavedregions = this.savedregions.subscribe(d =>
      d.map(r => {
        this.regions.push({
          start: r['start'],
          end: r['end'],
          color: r['color']
        });
      })
    );
    this.regions.push({
      start: 1,
      end: 3,
      color: 'hsla(400, 100%, 30%, 0.5)'
    });
    console.log('tr', this.regions);
    this.wsOptions = {
      container: '#' + trackkey,
      backgroundColor: this.randomColor(0.9),
      cursorColor: '#fff',
      progressColor: this.randomColor(0.9),
      waveColor: '#ccc',
      barGap: 2,
      barHeight: 0.5,
      barMinHeight: 1,
      barRadius: 3,
      barWidth: 5,
      autoCenter: true,
      normalize: true,
      scrollParent: false,
      backend: 'WebAudio',
      responsive: true,
      maxCanvasWidth: 100,
      hideScrollbar: true,
      height: 100,
      plugins: [
        TimelinePlugin.create({
          container: '#wave-timeline'
        }),
        RegionsPlugin.create({
          dragSelection: {
            slop: 5
          }
        })
      ]
    };

    this.wave = WaveSurfer.create(this.wsOptions);

    // this.wave.on('ready', () =>
    //   this.wave.enableDragSelection({
    //     color: this.randomColor(0.1)
    //     })
    // );
    this.wave.on('ready', () => {
      this.regions.map(r => {
        this.wave.addRegion(r);
      });
      this.wave.addRegion({
        start: 1,
        end: 3,
        color: 'hsla(400, 100%, 30%, 0.5)'
      });
    });
    this.wave.on('play', () => this.playstateSubject.next('playing'));

    this.wave.on('finish', () => {
      this.wave.stop();
      this.playstateSubject.next('finished');
    });
    this.wave.on('pause', () => this.playstateSubject.next('paused'));

    this.wave.on('audioprocess', e => {
      this.progress = this.fmtMSS(Math.floor(e));
    });

    this.wave.on(
      'region-click',
      r => (r.attributes.active = !r.attributes.active)
    );

    // this.wave.on('region-created', r => {
    //   if (this.regionsloaded) {
    //     let thisstart = r.start;
    //     let thisend = r.end;
    //     let thiscolor = r.color;

    //     this.regionsRef.push({
    //       start: thisstart,
    //       end: thisend,
    //       color: thiscolor
    //     });
    //   }
    // });

    // this.wave.on('region-updated', r => {
    //   let regiondata = {
    //     start: r.start,
    //     end: r.end,
    //     color: r.color
    //   };
    //   this.regionsRef.update(r.id, regiondata);
    //   console.log(r, 'rd', regiondata);
    // });
  }

  fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  }

  async playPause() {
    if (this.wave && this.wave.isPlaying()) {
      this.wave.pause();
      this.ispaused = true;
      // this.registerplayback('pause');
    } else if (this.wave && this.gmcs.playControlSubject) {
      this.gmcs.playControlSubject.next('stop');
      this.wave.play();
      this.ispaused = false;
      // this.registerplayback('play');
    } else {
      return false;
    }
  }

  /**
   * Random RGBA color.
   */
  randomColor(alpha): string {
    return (
      'rgba(' +
      [
        // tslint:disable-next-line: no-bitwise
        ~~(Math.random() * 255),
        // tslint:disable-next-line: no-bitwise
        ~~(Math.random() * 255),
        // tslint:disable-next-line: no-bitwise
        ~~(Math.random() * 255),
        alpha || 1
      ] +
      ')'
    );
  }
}
