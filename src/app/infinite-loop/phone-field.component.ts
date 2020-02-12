import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-phone-field',
  template: `<input type="text" [ngModel]="phone" (ngModelChange)="update($event)"/>`
})
export class PhoneFieldComponent {
  @Input() phone: string;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
      setTimeout(() => this.format());
  }

  // this is call any time inputs change
  ngOnChanges(changes: SimpleChanges) {
      this.format();
  }

  // format the data phone number, and then updates it by calling update,
  // which in turn emits a change event to the parent.
  format() {
      const phone = this.phone;
      const formatted = "1-" + phone.substr(0, 3) + "-" + phone.substr(3, 3) + "-" + phone.substr(6);
      this.update(formatted);
  }

  update(value) {
      this.change.emit(value);
  }

}
