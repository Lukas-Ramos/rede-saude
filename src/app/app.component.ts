import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule], 
  template: `
    <router-outlet></router-outlet> 
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
