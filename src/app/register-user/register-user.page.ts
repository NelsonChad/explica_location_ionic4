import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  public selected = false;
  constructor() { }

  ngOnInit() {
  }

  select() {
    this.selected = true;
  }

}
