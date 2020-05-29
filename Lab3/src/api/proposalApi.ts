import { Api } from '../common/Api';

import ScopeService from '../services/ScopeService';
import ReleaseService from '../services/ReleaseService';
import TeamService from '../services/TeamService';

export default class ProposalApi implements Api {
  private scopeSerivce: ScopeService;
  private releaseService: ReleaseService;
  private teamService: TeamService;

  constructor(
    scopeSerivce: ScopeService,
    releaseService: ReleaseService,
    teamService: TeamService,
  ) {
    this.scopeSerivce = scopeSerivce;
    this.releaseService = releaseService;
    this.teamService = teamService;
  }

  getProposal(args: any): any {
    const {
      cost,
      dateEstimate,
    } = args;

    return {
      scopeResult: this.scopeSerivce.getScopeData(dateEstimate),
      releaseResult: this.releaseService.getReleaseDateRange(cost),
      teamResult: this.teamService.getTeamDesicion(dateEstimate),
    };
  }

  static getName() {
    return 'proposalApi';
  }
}
