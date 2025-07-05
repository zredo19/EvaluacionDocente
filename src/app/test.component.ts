import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background-color: #f0f0f0;">
      <h1 style="color: red;">¡TEST FUNCIONANDO!</h1>
      <p>Si ves esto, Angular está trabajando</p>
    </div>
  `,
})
export class TestComponent {}
