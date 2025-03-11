import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addSpaceAfterCurrency'
})
export class AddSpaceAfterCurrencyPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return ''; // or handle null appropriately
    }
    // This regex assumes the output starts with a currency symbol followed immediately by a digit.
    // It inserts a space between them.
    return  value.replace(/(\D)(?=\d)/, '$1 ');;
  }
}
