

import ScopeService from '../services/ScopeService';
import ReleaseService from '../services/ReleaseService';
import TeamService from '../services/TeamService';

import ProposalApi from '../api/ProposalApi';
import SupportApi from '../api/supportApi';
import UserApi from '../api/userApi';

export default class Application {
  private api: Map<string, any> = new Map();
  public deps: any = {};
  public Ready: Promise<any>;

  private scopeSerivce: ScopeService;
  private releaseService: ReleaseService;
  private teamService: TeamService;

  constructor() {
    this.Ready = new Promise(async (resolve, reject) => {
      await this.cacheMethods();
      resolve();
    });
  }

  public defineDep(name: string, dep: any) {
    this.deps[name] = dep;
  }

  public async execApi(controllerName: string, methodName: string, ...args: Array<any>) {
    const api = this.api.get(controllerName);
    if (!api || !api[methodName]) {
      throw new Error('Invalid method');
    }
    return await api[methodName](...args);
  }

  private async cacheMethods() {
    this.scopeSerivce = new ScopeService();
    this.releaseService = new ReleaseService();
    this.teamService = new TeamService();

    this.api.set(ProposalApi.getName(), new ProposalApi(
      this.scopeSerivce, this.releaseService, this.teamService,
    ));
    this.api.set(SupportApi.getName(), new SupportApi());
    this.api.set(UserApi.getName(), new UserApi());
  }
}
