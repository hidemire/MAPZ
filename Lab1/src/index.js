const fs = require('fs');

const InputStream = require('./analysis/input-stream');
const TokenStream = require('./analysis/token-stream');
const Parser = require('./analysis/parser');
const Context = require('./context');
const Eval = require('./eval');

const code = `
someObj = object {
  a: 1,
  b: object {
    test: 123,
    f: function(t) {
      g = t;
    },
  },
};

if (|someObj.a| == 1) {
  print("true!");
};

print(|someObj.b.f|(123));
#print(g);

|someObj.b.f| = 1;
print(|someObj.b.f|);

print(readDir("./"));

print(mkDir("./test"));

print(readDir("./"));

createFile("./t.in", "test Data");
print(readFile("./t.in"));
`;


const inputStream = new InputStream(code);
const is = new InputStream(code);

const context = new Context();

context.def('print', val => {
  console.log(val);
});

context.def('readDir', (path) => {
  return fs.readdirSync(path);
});

context.def('mkDir', (path) => {
  return fs.mkdirSync(path);
});

context.def('createFile', (path, data) => {
  return fs.writeFileSync(path, data);
});

context.def('readFile', (path, data) => {
  return fs.readFileSync(path).toString();
});

const ts = new TokenStream(is);

while(!ts.eof()) {
  console.log(ts.next());
}

const ast = new Parser(new TokenStream(inputStream)).parseToplevel();
console.log('ast', JSON.stringify(ast, null, 2));
console.log(Eval(ast, context));

//process.stdin.setEncoding("utf8");

// rl.on('line', (code) => {
//   try {
//     const ast = new Parser(new TokenStream(new InputStream(code))).parseToplevel();
//     console.log(Eval(ast, context));
//   } catch (error) {
//     console.log(error);
//   }
// });


// let code = '';

// process.stdin.on('readable', function(){
//   const chunk = process.stdin.read();
//   if (chunk) code += chunk;
// });

// process.stdin.on('end', function(){
//   const ast = new Parser(new TokenStream(new InputStream(code))).parseToplevel();
//   console.log(Eval(ast, context));
// });
