/*
This an implementation of the store which allows the developer to track
from where a change to the data originated. It uses JavaScript stacktraces
to deliver this information. Example usage:

```
private store: Store = ...

ngOnInit() {
  this.store.state$.subscribe(({ stack, value }) => {
    console.log("new state:", value, "from", stack);
  });
}
```

The `state$` public property of the store is an observable giving
an object containing the properties:

* stack - the stacktrace taken `store.set` was called to instigate this change
* value - the resulting new value of the store

The console output from the above example might look like:

```
new state: {name: "Bobby"} from
    at Store.push../src/app/store.ts.Store.set (http://localhost:4200/main.js:372:122)
    at FieldComponent.push../src/app/field/field.component.ts.FieldComponent.modelChanged (http://localhost:4200/main.js:289:20)
    at Object.eval [as handleEvent] (ng:///AppModule/FieldComponent.ngfactory.js:31:23)
    at handleEvent (http://localhost:4200/vendor.js:41372:41)
    at callWithDebugContext (http://localhost:4200/vendor.js:42465:25)
    at Object.debugHandleEvent [as handleEvent] (http://localhost:4200/vendor.js:42168:12)
    at dispatchEvent (http://localhost:4200/vendor.js:38831:25)
    at http://localhost:4200/vendor.js:40311:38
    at SafeSubscriber.schedulerFn [as _next] (http://localhost:4200/vendor.js:34684:36)
    at SafeSubscriber.push../node_modules/rxjs/_esm5/internal/Subscriber.js.SafeSubscriber.__tryOrUnsub (http://localhost:4200/vendor.js:62766:16)
```

Architecturally, the main change is that the current value within the behavior subject is not
only the value, but the stacktrace plus the value.

*/

import { Observable, BehaviorSubject } from "rxjs";
import { set, get } from "lodash/fp";
import { map, distinctUntilChanged } from "rxjs/operators";
import { environment } from "src/environments/environment";

export class Store {

    subject$: BehaviorSubject<any>;

    constructor(initialState: any) {
      // We capture the stacktrace for the initial "set", which is actually the creation of the
      // behavior subject
      // The following line obtains the stacktrace (a.k.a callstack)
      // See https://til.hashrocket.com/posts/478143b559-print-call-stack-on-javascript for more info
      // we turn this off in production, because doing this incurs a significant performance panelty
      //

      // using another environment variable (other than `production`) is possible. More on that here:
      // https://medium.com/beautiful-angular/angular-2-and-environment-variables-59c57ba643be
      const stack = environment.production ? null : "\n" + (new Error()).stack.split("\n").slice(1).join("\n");
      this.subject$ = new BehaviorSubject({ stack, value: initialState });
    }

    get state$(): Observable<any> {
      return this.subject$;
    }

    get(path: string[]): Observable<any> {
      // the internal path requires an extra "value" property in front due our change in the "state schema".
      const internalPath = ["value", ...path];
      return this.subject$.pipe(
          map((state) => get(internalPath, state)),
          distinctUntilChanged()
      );
    }

    set(path: string[], value: any): void {
      // Now we capture the stacktrace for the actual "set" method call
      const stack = environment.production ? null : "\n" + (new Error()).stack.split("\n").slice(1).join("\n");
      const newValue = set(path, value, this.subject$.value.value)
      this.subject$.next({ stack, value: newValue });
    }

}
