import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { UserAuthenticated } from 'src/app/base/models/user-authenticated.interface';
import { AuthService } from 'src/app/base/services/auth.service';

@Component({
    templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

    public userAuthenticated: UserAuthenticated | null = null;

    constructor(private authService: AuthService) { }

    public ngOnInit() {
        this.authService.getUser().subscribe(user => this.userAuthenticated = user);
    }
}
