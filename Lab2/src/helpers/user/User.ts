import User from "../../models/User";

abstract class AbstractGuestUser extends User {
  abstract getInfo(): any;
}

abstract class AbstractSuppurtUser extends User {
  abstract getInfo(): any;
  abstract sendEmail(): any;
}

class GuestUser extends AbstractGuestUser {
  constructor(info: any, name: any, login: any) {
    super(info, name, login);
  }

  getInfo() {
    return 'some info';
  }
}

class SuppurtUser extends AbstractSuppurtUser {
  private emailer: any;
  constructor(emailer: any, info: any, name: any, login: any) {
    super(info, name, login);
    this.emailer = emailer;
  }

  getInfo() {
    return 'some info';
  }

  sendEmail() {
    // send email
    return this.emailer;
  }
}


abstract class AbstractFactory {
  abstract createGuestUser(info: any, name: any, login: any): AbstractGuestUser;
  abstract createSupportUser(emailer: object, info: any, name: any, login: any): AbstractSuppurtUser;
}

export default class UserFactory extends AbstractFactory {
  createGuestUser(info: any, name: any, login: any): GuestUser {
    return new GuestUser(info, name, login);
  }

  createSupportUser(emailer: object, info: any, name: any, login: any): SuppurtUser {
    return new SuppurtUser(emailer, info, name, login);
  }
}
