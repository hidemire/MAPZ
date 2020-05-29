export default class User {
  private info: Object;
  private name: Array<Object>;
  private login: Array<Object>;

  constructor(info: Object, name: Array<Object>, login: Array<Object>) {
    this.info = info;
    this.name = name;
    this.login = login;
  }

  getInfo() {
    return {
      info: this.info,
      name: this.name,
      login: this.login,
    };
  }
}
