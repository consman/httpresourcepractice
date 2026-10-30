import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Jeocode } from './funTypes';
import { Boxes } from './boxes/boxes';

@Component({
  imports: [ Boxes],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('httpresourcepractice');

    
}
