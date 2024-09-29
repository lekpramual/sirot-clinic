import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters


    if (input.length > 0) {
      input = input.substring(0, 3);
    }
    if(input.length > 4){
      input += '-' + input.substring(3, 10)
    }


    // if (input.length > 0) {
    //   input = '(' + input.substring(0, 3);
    // }
    // if (input.length > 4) {
    //   input += ') ' + input.substring(3, 6);
    // }
    // if (input.length > 9) {
    //   input += '-' + input.substring(6, 10);
    // }

    this.el.nativeElement.value = input;
  }
}
