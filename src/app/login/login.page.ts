import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FunctionsService } from '../services/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private body: any = {
    password: '',
    email: ''
  };

  loginForm: FormGroup;
  loginExplForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private auth: AuthService,
    private navCtrl: NavController,
    private func: FunctionsService,
  ) { }

  ngOnInit() {
    this.formValidator();
  }

  formValidator() {
    this.loginForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.pattern('.+\@.+\..+')]]
    });

    this.loginExplForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.pattern('.+\@.+\..+')]]
    });
  }

  async login(form) {
    this.body = form;

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'loading-loader-class'
    });
    await loading.present();
    await this.auth.loginStudent(this.body).subscribe(
      res => {
        console.log('RESPONSE_STATUS: ' + res.status);
        if (res.status) {
          this.func.presentToast('Bem vindo ' + res.return.name);
          console.log('LOG: ' + res.return.name);
          loading.dismiss();
          this.navCtrl.navigateRoot('/');
        } else {
          console.log('NLOG: ' + res);
          this.func.presentAlert('Falha ao Autenticar', null, 'Senha ou email inválidos');

        }
      }, err => {
        console.log(err);
        loading.dismiss();
        // this.func.presentAlert('Um erro ocorreu', null, 'Tente novamente!');
        this.func.presentAlert('Falha ao Autenticar', null, 'Senha ou email inválidos');
      }
    );
  }

  async loginExplainer(form) {
    this.body = form;

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'loading-loader-class'
    });
    await loading.present();
    await this.auth.loginExplainer(this.body).subscribe(
      res => {
        console.log('RESPONSE_STATUS: ' + res.status);
        if (res.status) {
          this.func.presentToast('Bem vindo ' + res.return.name);
          console.log('LOG: ' + res.return.name);
          loading.dismiss();
          this.navCtrl.navigateRoot('/');
        } else {
          console.log('NLOG: ' + res);
          this.func.presentAlert('Falha ao Autenticar', null, 'Senha ou email inválidos');

        }
      }, err => {
        console.log(err);
        loading.dismiss();
        // this.func.presentAlert('Um erro ocorreu', null, 'Tente novamente!');
        this.func.presentAlert('Falha ao Autenticar', null, 'Senha ou email inválidos');
      }
    );
  }
}
