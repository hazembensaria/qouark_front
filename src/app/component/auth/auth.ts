import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
