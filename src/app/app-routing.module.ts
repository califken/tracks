import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackListComponent } from './track-list/track-list.component';
import { TrackViewComponent } from './track-view/track-view.component';
import { TracksComponent } from './tracks/tracks.component';
const routes: Routes = [
  { path: 'tracks', component: TracksComponent },
  { path: 'tracklist', component: TrackListComponent },
  { path: 'trackview/:trackid', component: TrackViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
