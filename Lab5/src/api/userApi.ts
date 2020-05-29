import { Api } from '../common/Api';

import UserFactory from '../helpers/user/User';

export default class UserApi implements Api {
  create(userInfo: any) {
    const factory = new UserFactory();
    switch (userInfo.type) {
      case 'guest':
        factory.createGuestUser(userInfo.info, userInfo.name, userInfo.login);
        break;
      case 'support':
        factory.createSupportUser({}, userInfo.info, userInfo.name, userInfo.login);
        break;
      default:
        break;
    }
  }

  static getName() {
    return 'userApi';
  }
}
