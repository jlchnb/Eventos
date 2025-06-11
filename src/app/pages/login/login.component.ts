import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase/supabase.service';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from 'app/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mensaje: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async login() {
    this.mensaje = '';
    this.emailError = '';
    this.passwordError = '';

    let hasError = false;

    if (!this.email.trim()) {
      this.emailError = 'Campo requerido';
      hasError = true;
    }

    if (!this.password.trim()) {
      this.passwordError = 'Campo requerido';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const user = await this.supabaseService.loginUsuario(
        this.email,
        this.password
      );

      if (!user) {
        this.mensaje = '❌ Email o contraseña incorrectos.';
        return;
      }

      console.log('✅ Usuario autenticado:', user);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error.message || error);

      if (error?.message?.includes('Email not confirmed')) {
        this.mensaje =
          '❌ Tu correo no está confirmado. Revisa tu bandeja de entrada.';
      } else {
        this.mensaje = '❌ Error al iniciar sesión. Revisa tus credenciales.';
      }
    }
  }

  reenviarCorreo() {
    if (this.email) {
      this.supabaseService
        .reenviarCorreoConfirmacion(this.email)
        .then(() => {
          this.mensaje =
            '📨 Correo de confirmación reenviado. Revisa tu bandeja de entrada.';
        })
        .catch((error: any) => {
          console.error('Error al reenviar el correo:', error);
          this.mensaje = '❌ Error al reenviar el correo de confirmación.';
        });
    }
  }

  irARecuperar() {
    this.router.navigate(['/registro']);
  }
}
