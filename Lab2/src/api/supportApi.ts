import { Api } from '../common/Api';

import EmailNotify, { SlackDecorator, FacebookDecorator} from '../helpers/notify/Notify';

export default class ProposalApi implements Api {
  sendMessageToClient(args: any): any {
    const {
      message,
      to,
      additionalChanels = []
    } = args;

    let notify = new EmailNotify();

    for (const chanel of additionalChanels) {
      switch (chanel) {
        case 'slack':
          notify = new SlackDecorator(notify);
          break;
        case 'Facebook':
          notify = new FacebookDecorator(notify);
          break;
      }
    }

    notify.sendMessage(to, message);
    return true;
  }

  static getName() {
    return 'supportApi';
  }
}
