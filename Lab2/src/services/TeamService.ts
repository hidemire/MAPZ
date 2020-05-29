import DataBaseConnectionProvider, { Connection } from "../db/DataBaseConnectionProvider";

export default class TeamService {
  private connection: Connection;

  constructor() {
    this.connection = DataBaseConnectionProvider.getConnection();
  }

  getTeamLoad() {
    const data = this.connection.query('getTeamLoad');
    return data;
  }

  getTeamDesicion(dateEstimate: string) {
    const data = this.connection.query(`getTeamDesicion ${dateEstimate}`);
    return data;
  }

  getTeamMembers() {
    const data = this.connection.query('getTeamMembers');
    return data;
  }

  getLeadOfTeam() {
    const data = this.connection.query('getLeadOfTeam');
    return data;
  }
}
