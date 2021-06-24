import { Component, OnInit } from '@angular/core';
import { WavesurferService } from '../wavesurfer.service';

@Component({
  selector: 'app-media-controls',
  templateUrl: './media-controls.component.html',
  styleUrls: ['./media-controls.component.scss']
})
export class MediaControlsComponent implements OnInit {
  playstate;
  constructor(public ws: WavesurferService) {
    this.ws.playstateSubject.subscribe(x => (this.playstate = x));
  }

  ngOnInit(): void {}
}
