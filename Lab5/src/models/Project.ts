export default class Project {
  private team: Object;
  private notes: Array<Object>;
  private tasks: Array<Object>;
  private state: StateContext;

  constructor(team: Object, notes: Array<Object>, tasks: Array<Object>, state?: StateContext) {
    this.team = team;
    this.notes = notes;
    this.tasks = tasks;

    this.state = state;
  }

  handleState() {
    this.state.request();
  }

  getInfo() {
    return {
      team: this.team,
      notes: this.notes,
      tasks: this.tasks,
    };
  }
}

interface State {
  handle(context: StateContext, project: Project): void;
}

class StateContext {
  private state: State;
  private project: Project;

  constructor(state: State, project: Project) {
    this.state = state;
    this.project = project;
  }

  get State(): State {
    return this.state;
  }

  set State(state: State) {
    this.state = state;
  }

  public request(): void {
    this.state.handle(this, this.project);
  }
}

export class UnderReviewState implements State {
  public handle(context: StateContext, project: Project) {
    // notify
    context.State = new InProcessState();
  }
}

export class InProcessState implements State {
  public handle(context: StateContext, project: Project) {
    // notify
    // do some aggregation
    context.State = new FinishedState();
  }
}

export class FinishedState implements State {
  public handle(context: StateContext, project: Project) {
    // notification
  }
}
