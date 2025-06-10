import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})

export class CadastroComponent {
  cadastroForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fb: FormBuilder
  ) 
  {
    this.cadastroForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.cadastroForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator para verificar se as senhas coincidem
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // Verifica se um campo específico é inválido e foi tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.cadastroForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.cadastroForm.valid) {
      this.isLoading = true;
      
      try {
        const formData = this.cadastroForm.value;
        
        // Simula uma chamada de API
        await this.simulateApiCall(formData);
        
        // Sucesso - redireciona para login ou dashboard
        console.log('Cadastro realizado com sucesso:', formData);
        alert('Cadastro realizado com sucesso!');
        
        // Redireciona para a página de login
        this.router.navigate(['/login']);
        
      } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marca todos os campos como tocados para mostrar os erros
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cadastroForm.controls).forEach(key => {
      const control = this.cadastroForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private simulateApiCall(userData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simula sucesso na maior parte das vezes
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Erro simulado na API'));
        }
      }, 2000);
    });
  }

  // Método auxiliar para acessar facilmente os controles do formulário
  get f() {
    return this.cadastroForm.controls;
  }
}
