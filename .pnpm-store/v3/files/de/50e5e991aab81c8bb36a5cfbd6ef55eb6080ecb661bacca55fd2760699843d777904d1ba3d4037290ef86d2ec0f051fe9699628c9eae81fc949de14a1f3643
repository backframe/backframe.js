"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var prism_exports = {};
__export(prism_exports, {
  Prism: () => Prism,
  Token: () => Token
});
module.exports = __toCommonJS(prism_exports);
var import_theme = require("./theme");
const _self = {};
let uniqueId = 0;
const Prism = {
  manual: _self.Prism && _self.Prism.manual,
  disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
  util: {
    encode: function(tokens) {
      if (tokens instanceof Token) {
        const anyTokens = tokens;
        return new Token(anyTokens.type, Prism.util.encode(anyTokens.content), anyTokens.alias);
      } else if (Array.isArray(tokens)) {
        return tokens.map(Prism.util.encode);
      } else {
        return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
      }
    },
    type: function(o) {
      return Object.prototype.toString.call(o).slice(8, -1);
    },
    objId: function(obj) {
      if (!obj["__id"]) {
        Object.defineProperty(obj, "__id", { value: ++uniqueId });
      }
      return obj["__id"];
    },
    clone: /* @__PURE__ */ __name(function deepClone(o, visited) {
      visited = visited || {};
      let clone, id;
      const type = Prism.util.type(o);
      switch (type) {
        case "Object":
          id = Prism.util.objId(o);
          if (visited[id]) {
            return visited[id];
          }
          clone = {};
          visited[id] = clone;
          for (const key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = deepClone(o[key], visited);
            }
          }
          return clone;
        case "Array":
          id = Prism.util.objId(o);
          if (visited[id]) {
            return visited[id];
          }
          clone = [];
          visited[id] = clone;
          o.forEach(function(v, i) {
            clone[i] = deepClone(v, visited);
          });
          return clone;
        default:
          return o;
      }
    }, "deepClone")
  },
  languages: {
    extend: function(id, redef) {
      const lang = Prism.util.clone(Prism.languages[id]);
      for (const key in redef) {
        lang[key] = redef[key];
      }
      return lang;
    },
    insertBefore: function(inside, before, insert, root) {
      root = root || Prism.languages;
      const grammar = root[inside];
      const ret = {};
      for (const token in grammar) {
        if (grammar.hasOwnProperty(token)) {
          if (token == before) {
            for (const newToken in insert) {
              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken];
              }
            }
          }
          if (!insert.hasOwnProperty(token)) {
            ret[token] = grammar[token];
          }
        }
      }
      const old = root[inside];
      root[inside] = ret;
      Prism.languages.DFS(Prism.languages, function(key, value) {
        if (value === old && key != inside) {
          this[key] = ret;
        }
      });
      return ret;
    },
    DFS: /* @__PURE__ */ __name(function DFS(o, callback, type, visited) {
      visited = visited || {};
      const objId = Prism.util.objId;
      for (const i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i);
          const property = o[i], propertyType = Prism.util.type(property);
          if (propertyType === "Object" && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, null, visited);
          } else if (propertyType === "Array" && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, i, visited);
          }
        }
      }
    }, "DFS")
  },
  plugins: {},
  highlight: function(text, grammar, language) {
    const env = {
      code: text,
      grammar,
      language
    };
    Prism.hooks.run("before-tokenize", env);
    env.tokens = Prism.tokenize(env.code, env.grammar);
    Prism.hooks.run("after-tokenize", env);
    return Token.stringify(Prism.util.encode(env.tokens), env.language);
  },
  matchGrammar: function(text, strarr, grammar, index, startPos, oneshot, target) {
    for (const token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }
      if (token == target) {
        return;
      }
      let patterns = grammar[token];
      patterns = Prism.util.type(patterns) === "Array" ? patterns : [patterns];
      for (let j = 0; j < patterns.length; ++j) {
        let pattern = patterns[j], inside = pattern.inside, lookbehind = !!pattern.lookbehind, greedy = !!pattern.greedy, lookbehindLength = 0, alias = pattern.alias;
        if (greedy && !pattern.pattern.global) {
          const flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
          pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
        }
        pattern = pattern.pattern || pattern;
        for (let i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
          let str = strarr[i];
          if (strarr.length > text.length) {
            return;
          }
          if (str instanceof Token) {
            continue;
          }
          if (greedy && i != strarr.length - 1) {
            pattern.lastIndex = pos;
            const match2 = pattern.exec(text);
            if (!match2) {
              break;
            }
            var from = match2.index + (lookbehind ? match2[1].length : 0), to = match2.index + match2[0].length, k = i, p = pos;
            for (let len = strarr.length; k < len && (p < to || !strarr[k].type && !strarr[k - 1].greedy); ++k) {
              p += strarr[k].length;
              if (from >= p) {
                ++i;
                pos = p;
              }
            }
            if (strarr[i] instanceof Token) {
              continue;
            }
            delNum = k - i;
            str = text.slice(pos, p);
            match2.index -= pos;
          } else {
            pattern.lastIndex = 0;
            var match = pattern.exec(str), delNum = 1;
          }
          if (!match) {
            if (oneshot) {
              break;
            }
            continue;
          }
          if (lookbehind) {
            lookbehindLength = match[1] ? match[1].length : 0;
          }
          var from = match.index + lookbehindLength, match = match[0].slice(lookbehindLength), to = from + match.length, before = str.slice(0, from), after = str.slice(to);
          const args = [i, delNum];
          if (before) {
            ++i;
            pos += before.length;
            args.push(before);
          }
          const wrapped = new Token(token, inside ? Prism.tokenize(match, inside) : match, alias, match, greedy);
          args.push(wrapped);
          if (after) {
            args.push(after);
          }
          Array.prototype.splice.apply(strarr, args);
          if (delNum != 1)
            Prism.matchGrammar(text, strarr, grammar, i, pos, true, token);
          if (oneshot)
            break;
        }
      }
    }
  },
  tokenize: function(text, grammar) {
    const strarr = [text];
    const rest = grammar.rest;
    if (rest) {
      for (const token in rest) {
        grammar[token] = rest[token];
      }
      delete grammar.rest;
    }
    Prism.matchGrammar(text, strarr, grammar, 0, 0, false);
    return strarr;
  },
  hooks: {
    all: {},
    add: function(name, callback) {
      const hooks = Prism.hooks.all;
      hooks[name] = hooks[name] || [];
      hooks[name].push(callback);
    },
    run: function(name, env) {
      const callbacks = Prism.hooks.all[name];
      if (!callbacks || !callbacks.length) {
        return;
      }
      for (var i = 0, callback; callback = callbacks[i++]; ) {
        callback(env);
      }
    }
  },
  Token
};
Prism.languages.clike = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  "class-name": {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: true,
    inside: {
      punctuation: /[.\\]/
    }
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: true
    }
  ],
  keyword: [
    {
      pattern: /((?:^|})\s*)(?:catch|finally)\b/,
      lookbehind: true
    },
    {
      pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }
  ],
  number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
    lookbehind: true,
    greedy: true
  },
  "function-variable": {
    pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    alias: "function"
  },
  parameter: [
    {
      pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }
  ],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore("javascript", "string", {
  "template-string": {
    pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|[^\\`])*`/,
    greedy: true,
    inside: {
      interpolation: {
        pattern: /\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\${|}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      string: /[\s\S]+/
    }
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined("script", "javascript");
}
Prism.languages.js = Prism.languages.javascript;
Prism.languages.typescript = Prism.languages.extend("javascript", {
  keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
  builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/
});
Prism.languages.ts = Prism.languages.typescript;
function Token(type, content, alias, matchedStr, greedy) {
  this.type = type;
  this.content = content;
  this.alias = alias;
  this.length = (matchedStr || "").length | 0;
  this.greedy = !!greedy;
}
__name(Token, "Token");
Token.stringify = function(o, language) {
  if (typeof o == "string") {
    return o;
  }
  if (Array.isArray(o)) {
    return o.map(function(element) {
      return Token.stringify(element, language);
    }).join("");
  }
  return getColorForSyntaxKind(o.type)(o.content);
};
function getColorForSyntaxKind(syntaxKind) {
  return import_theme.theme[syntaxKind] || import_theme.identity;
}
__name(getColorForSyntaxKind, "getColorForSyntaxKind");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Prism,
  Token
});
