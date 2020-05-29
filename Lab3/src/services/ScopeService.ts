import DataBaseConnectionProvider, { Connection } from "../db/DataBaseConnectionProvider";

export default class ScopeService {
  private connection: Connection;

  constructor() {
    this.connection = DataBaseConnectionProvider.getConnection();
  }

  getScopeData(project: any) {
    const data = this.connection.query(`getScopeData ${project}`);
    return data;
  }
}
