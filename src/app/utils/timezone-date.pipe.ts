import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezoneDate',
  standalone: true,
})
export class TimezoneDatePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('en-US');

  transform(value: string, format: string = 'shortDate', timezone: string = 'UTC') {
    return this.datePipe.transform(value, format, timezone);
  }
}
