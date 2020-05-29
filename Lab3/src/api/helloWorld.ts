import { Api } from '../common/Api';
import Application from '../common/Application';

export default class HelloWorldApi implements Api {
  execute(app: Application, ...args: Array<any>): any {
    console.log(app.deps.t());
    return args;
  }
}
