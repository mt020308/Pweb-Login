import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  email: string;
  password: string;
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
    { email: 'usuario@exemplo.com', password: '123456' },
    { email: 'admin@teste.com', password: 'admin123' },
    { email: 'teste@gmail.com', password: 'senha123' }
  ];

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
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

    console.log('Tentando login com:', email);
    this.login(email, password);
  }

  private login(email: string, password: string): void {
    const user = this.users.find(u => u.email === email);
    
    console.log('Usuário encontrado:', user);
    
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
