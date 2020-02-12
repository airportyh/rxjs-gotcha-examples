/*
This examples demonstrates the shareReplay-not-cleaning-up-subscribers bug:
https://github.com/ReactiveX/rxjs/issues/3336 that was encountered in
a scenario when we used it together with a store.

*/

import { Component, OnInit } from '@angular/core';
import { Store } from '../store';
import { Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

interface User {
    username: string;
    email: string;
}

@Component({
  selector: 'app-share-replay-clean-two',
  templateUrl: './share-replay-clean-two.component.html',
  styleUrls: ['./share-replay-clean-two.component.css']
})
export class ShareReplayCleanTwoComponent implements OnInit {
  log: string[] = [];
  store = new Store({
      username: "kitty"
  });
  userDetails$: Observable<User>;
  username$: Observable<string>;
  showDetails: boolean = true;

  constructor() { }

  ngOnInit() {
      this.username$ = this.store.get(["username"]);
      this.userDetails$ = this.getUserDetails();
  }

  // This is a phony method which pretends to make an API call
  // and return some data. Pretend it did that.
  fetchUserDetails(username: string): Observable<User> {
      return Observable.create((observer) => {
          this.log.push("requesting user details for " + username);
          setTimeout(() => {
              observer.next({
                  username,
                  email: username + "@gmail.com"
              });
          }, 200);
      })
  }

  // This method returns an observable that gives a User object.
  // It does so by chaining a hot observable to a switchMap that
  // makes a request, and then chaining that to shareReplay,
  // this pattern is what triggers the shareReplay bug.
  // When this happens, even when subscribers have all unsubscribed,
  // the switchMap will still be triggered in the event that there
  // is a username change within the store.
  //
  // In this example, you can unsubscribe the only subscriber
  // by clicking the "Toggle" button to switch the UserDetailsComponent
  // off to test this. Thereafter, if you change the username in the
  // text input, it will still call `fetchUserDetails` for each
  // change.
  getUserDetails(): Observable<User> {
      return this.store.get(["username"]).pipe(
          switchMap((username) => {
              return this.fetchUserDetails(username);
          }),
          shareReplay()
          // With the latest version of RxJS (version 6.2.2 does not have this)
          // (which is not the default chosen by a blank ng-cli template)
          // you can fix this but using the refCount parameter:
          // shareReplay({ refCount: true })
      )
  }

  changeUsername(value) {
      this.store.set(["username"], value);
  }

}
