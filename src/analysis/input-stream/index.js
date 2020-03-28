class InputStream {
  constructor(code = '') {
    this.code = code;
    this.pos = 0;
    this.line = 1;
    this.col = 0;
  }

  next() {
    const ch = this.code.charAt(this.pos++);

    if (ch === '\n') {
      this.line += 1;
      this.col = 0;
    } else {
      this.col += 1;
    }

    return ch;
  }

  peek() {
    return this.code.charAt(this.pos);
  }

  eof() {
    return this.peek() === '';
  }

  croak(msg) {
    throw new Error(`${msg} (${this.line}:${this.col})`);
  }
};

module.exports = InputStream;
