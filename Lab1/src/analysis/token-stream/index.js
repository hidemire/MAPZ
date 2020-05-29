class TokenStream {
  constructor(inputStream) {
    this.inputStream = inputStream;
    this.current = null;
    this.kw = ' if then else function object true false ';
    this.croak = inputStream.croak.bind(inputStream);
  }

  isKeyWord(token) {
    return this.kw.includes(` ${token} `);
  }

  isDigit(ch) {
    return /[0-9]/i.test(ch);
  }

  isIdStart(ch) {
    return /[a-z_]/i.test(ch);
  }
  
  isId(ch) {
    return this.isIdStart(ch) || '?!-<>=0123456789'.includes(ch);
  }

  isOpChar(ch) {
    return '+-*/%=&|<>!'.includes(ch);
  }

  isPunc(ch) {
    return '.|,:;(){}[]'.includes(ch);
  }

  isWhitespace(ch) {
    return ' \t\n'.includes(ch);
  }

  readWhile(predicate) {
    let str = '';

    while (!this.inputStream.eof() && predicate.call(this, this.inputStream.peek())) {
      str += this.inputStream.next();
    }

    return str;
  }

  readIdent() {
    const id = this.readWhile(this.isId);
    return {
      type: this.isKeyWord(id) ? 'kw' : 'var',
      value: id,
    };
  }

  readNumber() {
    let hasDot = false;

    const number = this.readWhile(ch => {
      if (ch === '.') {
        if (hasDot) return false;
        hasDot = true;
        return true;
      }
      return this.isDigit(ch);
    });

    return {
      type: 'num',
      value: parseFloat(number),
    };
  }

  readEscaped(end) {
    let escaped = false;
    let str = '';

    this.inputStream.next();

    while(!this.inputStream.eof()) {
      const ch = this.inputStream.next();
      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === end) {
        break;
      } else {
        str += ch;
      }
    }

    return str;
  }

  readString() {
    return {
      type: 'str',
      value: this.readEscaped('"'),
    };
  }

  skipComment() {
    this.readWhile(ch => ch != '\n');
    this.inputStream.next();
  }

  readNext() {
    this.readWhile(this.isWhitespace);
    if (this.inputStream.eof()) return null;
    const ch = this.inputStream.peek();

    if (ch === '#') {
      this.skipComment();
      return this.readNext();
    }
    if (ch === '"') {
      return this.readString();
    }
    if (this.isDigit(ch)) {
      return this.readNumber();
    }
    if (this.isIdStart(ch)) {
      return this.readIdent();
    }
    if (this.isPunc(ch)) {
      return {
        type: 'punc',
        value: this.inputStream.next(),
      };
    }
    if (this.isOpChar(ch)) {
      return {
        type: 'op',
        value: this.readWhile(this.isOpChar)
      };
    }

    this.inputStream.croak(`Character error: ${ch}`);
    
  }

  peek() {
    return this.current || (this.current = this.readNext());
  }

  next() {
    const token = this.current;
    this.current = null;
    return token || this.readNext();
  }

  eof() {
    return this.peek() === null;
  }
}

module.exports = TokenStream;
