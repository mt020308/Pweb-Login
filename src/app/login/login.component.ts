import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  email: string;
  password: string;
}

export function passwordLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    return value.length >= minLength ? null : { passwordTooShort: { requiredLength: minLength, actualLength: value.length } };
  };
}

export function caracpasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const hasUpperCase = /[A-Z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(value);

  const valid = hasUpperCase && hasSpecialChar;

  return valid
    ? null
    : {
        passwordStrength: {
          hasUpperCase,
          hasSpecialChar,
        },
      };
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';
  messageType = '';
  
  private users: User[] = [
    { email: 'usuario@exemplo.com', password: 'U_123456' },
    { email: 'admin@teste.com', password: 'Admin_123' },
    { email: 'teste@gmail.com', password: 'Senha_123' }
  ];

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordLengthValidator(6), caracpasswordValidator]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.login(email, password);
  }

  private login(email: string, password: string): void {
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      this.showMessage('Não há uma conta com esse email', 'error');
      return;
    }

    if (user.password === password) {
      this.showMessage('Login bem sucedido!', 'success');
      setTimeout(() => {
        this.loginForm.reset();
        this.message = '';
      }, 3000);
    } else {
      this.showMessage('Email ou senha estão errados', 'error');
    }
  }

  private showMessage(text: string, type: string): void {
    console.log('Mostrando mensagem:', text, type);
    this.message = text;
    this.messageType = type;
    
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }
}
