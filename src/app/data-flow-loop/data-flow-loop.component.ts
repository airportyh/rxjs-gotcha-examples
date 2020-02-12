/*
This example demonstrates what happens when you have a 2-way data flow loop
in your RxJS pipe. By 2-way data flow loop, what I mean is towards the bottom
part of your pipe, you have an operation that causes an upstream observable to emit
a new value, which conceptually would cause the entire chain to execute again from
the beginning. If there were no terminating condition, this could cause an infinite loop.

Credit to Illia and Huiqi for finding 2 workarounds for this problem.

In my opinion, however, I still don't think either of the workarounds are worth it.
*/

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, empty } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

interface Customer {
    name: string;
    flavor?: string;
}

@Component({
  selector: 'app-data-flow-loop',
  templateUrl: './data-flow-loop.component.html',
  styleUrls: ['./data-flow-loop.component.css']
})
export class DataFlowLoopComponent implements OnInit {

  iceCreamFlavors = ["Vanilla", "Chocolate", "Strawberry"];
  subject = new BehaviorSubject<Customer>({
      name: "Jacki"
  });
  customer$: Observable<Customer>;

  constructor() {
      this.customer$ = this.getSubject();
  }

  ngOnInit() {
      this.subject.subscribe((c) => console.log("customer", c));
  }

  // this method returns an observable of the customer, but if
  // they haven't chosen their flavor, it will default it to Vanilla,
  // or will it? No, it doesn't actually work.
  //
  getSubject(): Observable<Customer> {
      return this.subject.pipe(
          tap((customer) => {
              console.log("in tap");
              if (!customer.flavor) {
                  console.log("calling next");
                  // It's puzzling why this doesn't work,
                  // and I don't have a good theory right now.
                  //
                  // looking at the console.log's will reveal that
                  // this call to next is actually a recursive call
                  // ad will execute the code within tap in a nested way.
                  this.subject.next({
                      ...customer,
                      flavor: this.iceCreamFlavors[0]
                  });
                  console.log("done calling next");
              } else {
                  console.log("not calling next");
              }
          })
      )
  }

  // the following is one workaround: using a setTimeout to slightly
  // delay the call to .next
  getSubject2(): Observable<Customer> {
      return this.subject.pipe(
          tap((customer) => {
              if (!customer.flavor) {
                  setTimeout(() => {
                      this.subject.next({
                          ...customer,
                          flavor: this.iceCreamFlavors[0]
                      });
                  }, 0);
              }
          })
      )
  }

  // this is another workaround: use a switchMap which calls next
  // internally, but then uses the empty operator to "skip this turn".
  getSubject3(): Observable<Customer> {
      return this.subject.pipe(
          switchMap((customer) => {
              if (!customer.flavor) {
                  this.subject.next({
                      ...customer,
                      flavor: this.iceCreamFlavors[0]
                  });
                  return empty();
              } else {
                  return of(customer);
              }
          })
      )
  }

}
