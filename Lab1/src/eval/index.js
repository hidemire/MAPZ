const { NodesType } = require('../constants/ast');

const Eval = (ast, env) => {
  switch(ast.type) {
    case NodesType.NUM:
    case NodesType.STR:
    case NodesType.BOOL:
      return ast.value;
    
    case NodesType.VAR:
      return env.get(ast.value);

    case NodesType.ASSIGN:
      if (ast.left.type == NodesType.VAR) {
        return env.set(ast.left.value, Eval(ast.right, env));
      } else if (ast.left.type == NodesType.OBJECT_PATH) {
        return env.set(
          ast.left.value[0],
          Eval(ast.right, env),
          ast.left.value.slice(1),
        );
      }
      throw new Error(`Cannot assign to% ${JSON.stringify(ast.left)}`);
      

    case NodesType.BINARY:
      return appyOp(ast.operator, Eval(ast.left, env), Eval(ast.right, env));

    case NodesType.FUNCTION:
      return makeFunction(ast, env);

    case NodesType.OBJECT:
      return makeObject(ast, env);

    case NodesType.OBJECT_PATH:
      return env.get(ast.value[0], ast.value.slice(1));

    case NodesType.IF:
      const cond = Eval(ast.cond, env);
      if (cond !== false) return Eval(ast.then, env);
      return ast.else ? Eval(ast.else, env) : false;

    case NodesType.PROG:
      let value = false;
      ast.prog.forEach((progAst) => value = Eval(progAst, env));
      return value;

    case NodesType.CALL:
      const func = Eval(ast.func, env);
      return func.apply(null, ast.args.map(arg => Eval(arg, env)));

    default:
      throw new Error(`Eval error: ${ast.type}`);
  }
};

const appyOp = (op, a, b) => {
  const num = x => {
    if (typeof x != 'number') {
      throw new Error(`Expected number but got ${x}`);
    }
    return x;
  };

  const div = x => {
    if (num(x) === 0) {
      throw new Error('Devide by zero');
    }

    return x;
  }

  switch(op) {
    case '+': return num(a) + num(b);
    case '-': return num(a) - num(b);
    case '*': return num(a) * num(b);
    case '/': return num(a) / div(b);
    case '%': return num(a) % div(b);
    case '&&': return a !== false && b;
    case '||': return a !== false ? a : b;
    case '<': return num(a) < num(b);
    case '>': return num(a) > num(b);
    case '<=': return num(a) <= num(b);
    case '>=': return num(a) >= num(b);
    case '==': return a === b;
    case '!=': return a !== b;
    default: throw new Error(`Can't apply operator ${op}`);
  }
};

function makeFunction(ast, env) {
  function func() {
    const names = ast.vars;
    const scope = env.extend();
    for (let i = 0; i < names.length; i++) {
      scope.def(names[i], i < arguments.length ? arguments[i]: false);
    }
    return Eval(ast.body, scope);
  }

  return func;
}

function makeObject(ast, env) {
  const obj = {};
  ast.vars.forEach(key => {
    obj[key.name] = Eval(key.value, env);
  });

  return obj;
}

module.exports = Eval;
 