import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { UserModule } from './user/user.module';
import { TracksComponent } from './tracks/tracks.component';
import { WaveformComponent } from './waveform/waveform.component';
import { WavesurferService } from './wavesurfer.service';
import { MediaControlsComponent } from './media-controls/media-controls.component';
import { TrackViewComponent } from './track-view/track-view.component';
import { TrackListComponent } from './track-list/track-list.component';
import { NavComponent } from './nav/nav.component';
import { GlobalMediaControlService } from './global-media-control.service';
import { AnnotativeTrackViewComponent } from './annotative-track-view/annotative-track-view.component';
import { CommentsComponent } from './comments/comments.component';

const routes = [
  { path: 'tracks', component: TracksComponent },
  { path: 'track-list', component: TrackListComponent },

  { path: 'track-view/:authorid/:trackid', component: TrackViewComponent },

  {
    path: 'annotative-track-view/:authorid/:trackid',
    component: AnnotativeTrackViewComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    UserModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    HelloComponent,
    TracksComponent,
    WaveformComponent,
    MediaControlsComponent,
    TrackViewComponent,
    TrackListComponent,
    NavComponent,
    AnnotativeTrackViewComponent,
    CommentsComponent
  ],
  bootstrap: [AppComponent],
  providers: [WavesurferService, GlobalMediaControlService]
})
export class AppModule {}
