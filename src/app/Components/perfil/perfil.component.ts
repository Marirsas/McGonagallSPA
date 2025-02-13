import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { User1 } from '../../Models/user1';
import {} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  user?: User1;
  name?: string;
  isLogged: any;

  constructor(private service: AuthService) {}

  ngOnInit(): void {
    this.service.getUser().subscribe((answer) => {
      this.user = answer;
      let arr = this.user.name.split(' ');
      this.name = arr[0];
    });

    this.service.user.pipe(map((user) => user)).subscribe((user) => {
      this.isLogged = user;
    });
  }

  logout(): void {
    this.service.logout();
  }
}
