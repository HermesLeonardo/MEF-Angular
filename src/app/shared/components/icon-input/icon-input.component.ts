import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-input',
  standalone: false,
  templateUrl: './icon-input.component.html',
  styleUrls: ['./icon-input.component.css']
})
export class IconInputComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
