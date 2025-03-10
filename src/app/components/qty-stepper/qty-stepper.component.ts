import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-qty-stepper',
  templateUrl: './qty-stepper.component.html',
  styleUrls: ['./qty-stepper.component.scss']
})
export class QtyStepperComponent {
  /** The current quantity value. Defaults to 1. */
  @Input() qty: number = 1;

  /** Minimum allowed quantity. Defaults to 1. */
  @Input() minQty: number = 1;

  /** Maximum allowed quantity (optional). If undefined, no upper limit. */
  @Input() maxQty?: number;

  /** Event emitted whenever the quantity changes. */
  @Output() qtyChange = new EventEmitter<number>();

  decrement(): void {
    if (this.qty > this.minQty) {
      this.qty--;
      this.qtyChange.emit(this.qty);
    }
  }

  increment(): void {
    // If maxQty is defined, ensure we don't exceed it
    if (this.maxQty === undefined || this.qty < this.maxQty) {
      this.qty++;
      this.qtyChange.emit(this.qty);
    }
  }
}
