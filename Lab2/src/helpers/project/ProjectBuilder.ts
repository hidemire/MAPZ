import Project from "../../models/Project";

interface IProjectBuilder {
  buildTeam(count: number, level: number): ProjectBuilder;
  buildNote(note: string): ProjectBuilder;
  buildTask(estimate: number): ProjectBuilder;
  getProject(): Project;
}

export default class ProjectBuilder implements IProjectBuilder  {
  private _team: Object;
  private _notes: Array<Object>;
  private _tasks: Array<Object>;

  constructor(team: Object = {}, notes: Array<Object> = [], tasks: Array<Object> = []) {
    this._team = team;
    this._notes = notes;
    this._tasks = tasks;
  }

  public get team(): Object {
    return this._team;
  }

  public get notes(): Array<Object> {
    return this._notes;
  }

  public get tasks(): Array<Object> {
    return this._tasks;
  }

  public buildTeam(count: number, level: number): ProjectBuilder {
    // fetch some data
    this._team = {
      count: count,
      level: level,
    };

    return this;
  }

  public buildNote(note: string): ProjectBuilder {
    // fetch some data
    this._notes.push({
      note: note,
    });

    return this;
  }

  public buildTask(estimate: number): ProjectBuilder {
    // fetch some data
    this._tasks.push({
      estimate: estimate,
    });

    return this;
  }

  getProject(): Project {
    return new Project(
      this.team,
      this._notes,
      this._tasks
    );
  }
}
