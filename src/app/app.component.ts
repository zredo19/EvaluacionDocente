import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html'
,
  styles: []
})
export class AppComponent {
  title = 'proyecto-aplicaciones';
}
