import DataBaseConnectionProvider, { Connection } from "../db/DataBaseConnectionProvider";

export default class ReleaseService {
  private connection: Connection;

  constructor() {
    this.connection = DataBaseConnectionProvider.getConnection();
  }

  getReleaseById() {
    const data = this.connection.query('getReleaseById');
    return data;
  }

  getReleaseDateRange(cost: number) {
    const data = this.connection.query(`getReleaseDateRange ${cost}`);
    return data;
  }
}
