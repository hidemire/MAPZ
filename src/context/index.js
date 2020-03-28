class Context {
  constructor(parent) {
    this.parent = parent;
    this.vars = Object.create(parent ? parent.vars : null);
  }

  extend() {
    return new Context(this);
  }

  lookup(name) {
    let scope = this;
    while(scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)){
        return scope;
      }
      scope = scope.parent;
    }
  }

  get(name, path = []) {
    if (name in this.vars) {
      if (path.length > 0) {
        return this._getByPath(this.vars[name], path)
      }
      return this.vars[name];
    }
    throw new Error(`Undefined variable: ${name}`);
  }

  set(name, value, path = []) {
    const scope = this.lookup(name);
    
    if (!scope && this.parent) {
      //throw new Error(`Undefined variable: ${name}`);
      this.def(name, value);
    }

    if (path.length > 0) {
      return this._setToValue((scope || this).vars[name], value, path)
    } else {
      return (scope || this).vars[name] = value;
    }
  }

  def(name, value) {
    this.vars[name] = value;
  }

  _setToValue(obj, value, path) {
    let i;

    for (i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    } 

    return obj[path[i]] = value;
  }

  _getByPath(obj, path) {
    let i;

    for (i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    } 

    return obj[path[i]];
  }
}

module.exports = Context;
