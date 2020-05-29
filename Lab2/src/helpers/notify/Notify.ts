interface Notify {
  sendMessage(to: string, message: string): any;
}

export default class EmailNotify implements Notify {
  sendMessage(to: string, message: string) {
    // send email
  }
}

class NotifyDecorator implements Notify {
  private _notify: Notify;

  constructor(notify: Notify) {
    this._notify = notify;
  }

  sendMessage(to: string, message: string) {
    this._notify.sendMessage(to, message);
  }
}

export class SlackDecorator extends NotifyDecorator {
  sendMessage(to: string, message: string) {
    // send slack notify
    super.sendMessage(to, message);
  }
}

export class FacebookDecorator extends NotifyDecorator {
  sendMessage(to: string, message: string) {
    // send facebook notify
    super.sendMessage(to, message);
  }
}
