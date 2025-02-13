import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appUnavailableBooks]',
  standalone: true,
})
export class UnavailableBooksDirective {
  @Input() set appUnavailableBooks(available: string) {
    if (available == 'false') {
      this.theElement.nativeElement.style.color = 'grey';
      this.theElement.nativeElement.style.backgroundColor = 'Gainsboro';
      this.theElement.nativeElement.style.filter = 'grayscale(100%)';
    }
  }
  constructor(private theElement: ElementRef) {}
}
