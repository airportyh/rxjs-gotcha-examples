import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { MultipleSubsComponent } from './multiple-subs/multiple-subs.component';
import { ShareReplayCleanupComponent } from './share-replay-cleanup/share-replay-cleanup.component';
import { ColdToHotComponent } from './cold-to-hot/cold-to-hot.component';
import { DataFlowLoopComponent } from './data-flow-loop/data-flow-loop.component';
import { ShareReplayCleanTwoComponent } from './share-replay-clean-two/share-replay-clean-two.component';
import { UserDetailsComponent } from "./share-replay-clean-two/user-details.component";
import { InfiniteLoopComponent } from './infinite-loop/infinite-loop.component';
import { PhoneFieldComponent } from "./infinite-loop/phone-field.component";
import { RepeatComponent } from './repeat/repeat.component';
import { HttpClientModule } from '@angular/common/http';
import { WithLatestFromComponent } from './with-latest-from/with-latest-from.component';

@NgModule({
  declarations: [
    AppComponent,
    MultipleSubsComponent,
    ShareReplayCleanupComponent,
    ColdToHotComponent,
    DataFlowLoopComponent,
    ShareReplayCleanTwoComponent,
    UserDetailsComponent,
    InfiniteLoopComponent,
    PhoneFieldComponent,
    RepeatComponent,
    WithLatestFromComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
