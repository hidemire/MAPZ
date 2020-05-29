class Row {
  private conn: any;

  constructor(conn: any) {
    this.conn = conn;
  }

  public write(data: any): any {
    const conn = this.conn;
    const state = data;
    // write to db
    return `${conn} ${state}`;
  }
}

class InsertManyFactory {
  private rows: {[key: string]: Row} = {} as any;

  constructor(rows: Array<Array<any>>) {
    for(const state of rows) {
      this.rows[this.getId(state)] = new Row(state);
    }
  }

  getId(state: Array<string>): string {
    return state.join('-');
  }

  getRowByState(state: Array<string>) {
    const key = this.getId(state);

    if (!(key in this.rows)) {
      this.rows[key] = new Row(state);
    }

    return this.rows[key];
  }

  getRows() {
    const count = Object.keys(this.rows).length;
    for(const key of Object.keys(this.rows)) {
      console.log(key, count);
    }
  }
}

const rowCache = new InsertManyFactory([]);

export default class Connection {
  insertMany(array: Array<Array<string>>) {
    const rows: any = {};
    for(const row of array) {
      rows[rowCache.getId(row)] = rowCache.getRowByState(row);
    }
    // processing with rows
  }
}
