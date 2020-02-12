/*
This is an example that illustrates an infinite loop scenario we ran into.

There is a UI component, in this case PhoneFieldComponent, which wants to
make a change to the data (format the phone number) during its initialization
and anytime that its input changes.
It changes the data by emitting an event to the parent component,
and since that in turn triggers a set to the store, it creates an infinite loop.

*/

import { Component, OnInit } from '@angular/core';
import { Store } from '../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-infinite-loop',
  templateUrl: './infinite-loop.component.html',
  styleUrls: ['./infinite-loop.component.css']
})
export class InfiniteLoopComponent {

  store = new Store({
      person: {
          name: "Loris",
          phone: "6755345837"
      }
  });
  state$ = this.store.get([]);
  phone$: Observable<string>;

  constructor() {
      this.phone$ = this.store.get(["person", "phone"]);
  }

  updatePhone(value) {
      console.log("update phone to", value);
      this.store.set(["person", "phone"], value);
  }

}
