const precedence = require('../../constants/precedence');
const { NodesType } = require('../../constants/ast');

class Parse {
  constructor(tokenStream) {
    this.tokenStream = tokenStream;
  }

  isPunc(ch) {
    const token = this.tokenStream.peek();
    return token && token.type === 'punc' && (!ch || token.value === ch) && token;
  }

  isKw(kw) {
    const token = this.tokenStream.peek();
    return token && token.type === 'kw' && (!kw || token.value === kw) && token;
  }

  isOp(op) {
    const token = this.tokenStream.peek();
    return token && token.type === 'op' && (!op || token.value === op) && token;
  }

  isVar(v) {
    const token = this.tokenStream.peek();
    return token && token.type === 'var' && (!v || token.value === v) && token;
  }

  skipPunc(ch) {
    if (this.isPunc(ch)) this.tokenStream.next();
    else this.tokenStream.croak(`Expecting punctuation: "${ch}"`);
  }

  skipKw(kw) {
    if (this.isKw(kw)) this.tokenStream.next();
    else this.tokenStream.croak(`Expecting keyword: "${kw}"`);
  }

  skipOp(op) {
    if (this.isOp(op)) this.tokenStream.next();
    else this.tokenStream.croak(`Expecting keyword: "${op}"`);
  }

  unexpected() {
    this.tokenStream.croak(`Unexpected toke: ${JSON.stringify(this.tokenStream.peek())}`);
  }

  delimited(start, stop, separator, parser) {
    let a = [];
    let first = true;
    this.skipPunc(start);
    while(!this.tokenStream.eof()) {
      if (this.isPunc(stop)) break;
      if (first) first = false;
      else this.skipPunc(separator);
      if (this.isPunc(stop)) break;
      a.push(parser.call(this));
    }
    this.skipPunc(stop);
    return a;
  }

  parseCall(func) {
    return {
      type: NodesType.CALL,
      func,
      args: this.delimited('(', ')', ',', this.parseExpression),
    };
  }

  parseVarname() {
    const name = this.tokenStream.next();
    if (name.type != 'var') this.tokenStream.croak("Expecting variable name");
    return name.value;
  }

  parseIf() {
    this.skipKw('if');

    const cond = this.parseExpression();

    if (!this.isPunc('{')) this.skipKw('then');
    const then = this.parseExpression();
    const ret = {
      type: NodesType.IF,
      cond,
      then,
    };
    if (this.isKw('else')) {
      this.tokenStream.next();
      ret.else = this.parseExpression();
    };

    return ret;
  }

  parseFunction() {
    return {
      type: NodesType.FUNCTION,
      vars: this.delimited('(', ')', ',', this.parseVarname),
      body: this.parseExpression(),
    };
  }

  parseObject() {
    this.skipKw('object');
    return {
      type: NodesType.OBJECT,
      vars: this.delimited('{', '}', ',', () => {
        const name = this.parseVarname();
        this.skipPunc(':');
        const value = this.parseExpression();
        return {
          name,
          value,
        };
      }),
    }
  }

  parseBool() {
    return {
      type: NodesType.BOOL,
      value: this.tokenStream.next().value === 'true',
    }
  }

  parseProg() {
    const prog = this.delimited('{', '}', ';', this.parseExpression);
    if (prog.length === 0) return { type: "bool", value: false };
    if (prog.length === 1) return prog[0];
    return {
      type: NodesType.PROG,
      prog,
    };
  }

  maybeBinary(left, myPrec) {
    const token = this.isOp();
    if (token) {
      const hisPrec = precedence[token.value];
      if (hisPrec > myPrec) {
        this.tokenStream.next();
        return this.maybeBinary({
          type: token.value === '=' ? NodesType.ASSIGN : NodesType.BINARY,
          operator: token.value,
          left,
          right: this.maybeBinary(this.parseNode(), hisPrec),
        }, myPrec)
      }
    }
    return left;
  }

  maybeCall(expr) {
    const res = expr();
    return this.isPunc('(') ? this.parseCall(res) : res;
  }

  parseExpression() {
    return this.maybeCall(() => {
      const node = this.parseNode();
      return this.maybeBinary(node, 0);
    });
  }

  parseObjectPath(property) {
    const keys = this.delimited('|', '|', '.', this.parseVarname);
    return {
      type: NodesType.OBJECT_PATH,
      value: keys,
    }
  }

  parseToplevel() {
    const prog = [];
    while(!this.tokenStream.eof()) {
      prog.push(this.parseExpression());
      if (!this.tokenStream.eof()) this.skipPunc(';');
    }
    return {
      type: NodesType.PROG,
      prog,
    };
  }

  parseNode() {
    return this.maybeCall(() => {
      if (this.isPunc('(')) {
        this.tokenStream.next();
        const exp = this.parseExpression();
        this.skipPunc(')');
        return exp;
      }
      if (this.isPunc('|')) return this.parseObjectPath();
      if (this.isPunc('{')) return this.parseProg();
      if (this.isKw('if')) return this.parseIf();
      if (this.isKw("true") || this.isKw("false")) return this.parseBool();
      if (this.isKw('function')) {
        this.tokenStream.next();
        return this.parseFunction();
      }
      if (this.isKw('object')) {
        return this.parseObject();
      }
      const token = this.tokenStream.next();
      if (token.type === NodesType.NUM || token.type === NodesType.STR || token.type === NodesType.VAR) {
        return token;
      }
      this.unexpected();
    });
  }
}

module.exports = Parse;