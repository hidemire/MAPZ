
export interface Connection {
  query(sql: string): any;
}

class DatabaseConnectionProvider {
  private static connection: Connection;

  private constructor() {
    // createConnection()
  }

  public static getConnection(): Connection {
    if (DatabaseConnectionProvider.connection == null) {
      DatabaseConnectionProvider.connection = {
        query: function(sql: string) {
          return `DATA: ${sql}`;
        }
      };
    }
    return DatabaseConnectionProvider.connection;
  }
}

export default DatabaseConnectionProvider;
