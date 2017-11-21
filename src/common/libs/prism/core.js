/* http://prismjs.com/download.html?themes=prism&plugins=autoloader */
let _self = (typeof window !== 'undefined')
  ? window   // if in browser
  : (
    // todo (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    (typeof WorkerGlobalScope !== 'undefined')
      ? self // if in worker
      : {}   // if in node js
  )

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

let Prism = (function () {
// Private helper vars
  let lang = /\blang(?:uage)?-(\w+)\b/i
  let uniqueId = 0

  let _ = _self.Prism = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function (tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias)
        } else if (_.util.type(tokens) === 'Array') {
          return tokens.map(_.util.encode)
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ')
        }
      },

      type: function (o) {
        return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1]
      },

      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', {value: ++uniqueId})
        }
        return obj['__id']
      },

      // Deep clone a language definition (e.g. to extend it)
      clone: function (o) {
        let type = _.util.type(o)
        switch (type) {
          case 'Object':
            let clone = {}
            for (let key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = _.util.clone(o[key])
              }
            }
            return clone
          case 'Array':
            return o.map(function (v) { return _.util.clone(v) })
        }
        return o
      }
    },

    languages: {
      extend: function (id, redef) {
        let lang = _.util.clone(_.languages[id])

        for (let key in redef) {
          lang[key] = redef[key]
        }
        return lang
      },

      /**
       * Insert a token before another token in a language literal
       * As this needs to recreate the object (we cannot actually insert before keys in object literals),
       * we cannot just provide an object, we need anobject and a key.
       * @param inside The key (or language id) of the parent
       * @param before The key to insert before. If not provided, the function appends instead.
       * @param insert Object with the key/value pairs to insert
       * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
       */
      insertBefore: function (inside, before, insert, root) {
        root = root || _.languages
        let grammar = root[inside]
        if (arguments.length === 2) {
          insert = arguments[1]
          for (let newToken in insert) {
            if (insert.hasOwnProperty(newToken)) {
              grammar[newToken] = insert[newToken]
            }
          }
          return grammar
        }

        let ret = {}

        for (let token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token === before) {
              for (let newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken]
                }
              }
            }
            ret[token] = grammar[token]
          }
        }

        // Update references in other language definitions
        _.languages.DFS(_.languages, function (key, value) {
          if (value === root[inside] && key !== inside) {
            this[key] = ret
          }
        })
        root[inside] = ret
        return ret // todo return   root[inside] = ret
      },

      // Traverse a language definition with Depth First Search
      DFS: function (o, callback, type, visited) {
        visited = visited || {}
        for (let i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i)
            if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true
              _.languages.DFS(o[i], callback, null, visited)
            } else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true
              _.languages.DFS(o[i], callback, i, visited)
            }
          }
        }
      }
    },
    plugins: {},

    highlightAll: function (async, callback) {
      let env = {
        callback: callback,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      }

      _.hooks.run('before-highlightall', env)

      let elements = env.elements || document.querySelectorAll(env.selector)

      for (let i in elements) {  // var i = 0, element; element = elements[i++];
        _.highlightElement(elements[i], async === true, env.callback)
      }
    },

    highlightElement: function (element, async, callback) {
      // Find language
      let language
      let grammar
      let parent = element

      while (parent && !lang.test(parent.className)) {
        parent = parent.parentNode
      }

      if (parent) {
        // todo mean: language = (parent.className.match(lang) || [, ''])[1].toLowerCase()
        language = (parent.className.match(lang) || [''])[1].toLowerCase()
        grammar = _.languages[language]
      }

      // Set language on the element, if not present
      if (element.className) {
        element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language
      }

      if (element.parentNode) {
        // Set language on the parent, for styling
        parent = element.parentNode
        if (/pre/i.test(parent.nodeName)) {
          parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language
        }
      }

      let code = element.textContent
      let env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code
      }

      _.hooks.run('before-sanity-check', env)

      if (!env.code || !env.grammar) {
        if (env.code) {
          _.hooks.run('before-highlight', env)
          env.element.textContent = env.code
          _.hooks.run('after-highlight', env)
        }
        _.hooks.run('complete', env)
        return
      }

      _.hooks.run('before-highlight', env)

      if (async && _self.Worker) {
        let worker = new Worker(_.filename)

        worker.onmessage = function (evt) {
          env.highlightedCode = evt.data

          _.hooks.run('before-insert', env)

          env.element.innerHTML = env.highlightedCode

          callback && callback.call(env.element)
          _.hooks.run('after-highlight', env)
          _.hooks.run('complete', env)
        }

        worker.postMessage(JSON.stringify({
          language: env.language,
          code: env.code,
          immediateClose: true
        }))
      } else {
        env.highlightedCode = _.highlight(env.code, env.grammar, env.language)

        _.hooks.run('before-insert', env)

        env.element.innerHTML = env.highlightedCode

        callback && callback.call(element)

        _.hooks.run('after-highlight', env)
        _.hooks.run('complete', env)
      }
    },

    highlight: function (text, grammar, language) {
      let tokens = _.tokenize(text, grammar)
      return Token.stringify(_.util.encode(tokens), language)
    },

    matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
      let Token = _.Token

      for (let token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue
        }

        if (token === target) {
          return
        }

        let patterns = grammar[token]
        patterns = (_.util.type(patterns) === 'Array') ? patterns : [patterns]

        for (let j = 0; j < patterns.length; ++j) {
          let pattern = patterns[j]
          let inside = pattern.inside
          let lookbehind = !!pattern.lookbehind
          let greedy = !!pattern.greedy
          let lookbehindLength = 0
          let alias = pattern.alias

          if (greedy && !pattern.pattern.global) {
            // Without the global flag, lastIndex won't work
            let flags = pattern.pattern.toString().match(/[imuy]*$/)[0]
            pattern.pattern = new RegExp(pattern.pattern.source, flags + 'g')
            // pattern.pattern = RegExp(pattern.pattern.source, flags + 'g')
          }

          pattern = pattern.pattern || pattern

          // Don’t cache length as it changes during the loop
          for (let i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {
            let str = strarr[i]

            if (strarr.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return
            }

            if (str instanceof Token) {
              continue
            }

            pattern.lastIndex = 0

            let match = pattern.exec(str)
            let delNum = 1

            // Greedy patterns can override/remove up to two previously matched tokens
            if (!match && greedy && i !== strarr.length - 1) {
              pattern.lastIndex = pos
              match = pattern.exec(text)
              if (!match) {
                break
              }

              let from = match.index + (lookbehind ? match[1].length : 0)
              let to = match.index + match[0].length
              let k = i
              let p = pos

              for (let len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
                p += strarr[k].length
                // Move the index i to the element in strarr that is closest to from
                if (from >= p) {
                  ++i
                  pos = p
                }
              }

              /*
               * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
               * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
               */
              if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
                continue
              }

              // Number of tokens to delete and replace with the new match
              delNum = k - i
              str = text.slice(pos, p)
              match.index -= pos
            }

            if (!match) {
              if (oneshot) {
                break
              }

              continue
            }

            if (lookbehind) {
              lookbehindLength = match[1].length
            }

            let from = match.index + lookbehindLength
            match = match[0].slice(lookbehindLength)
            let to = from + match.length
            let before = str.slice(0, from)
            let after = str.slice(to)
            let args = [i, delNum]

            if (before) {
              ++i
              pos += before.length
              args.push(before)
            }

            let wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy)

            args.push(wrapped)

            if (after) {
              args.push(after)
            }

            Array.prototype.splice.apply(strarr, args)

            if (delNum !== 1) {
              _.matchGrammar(text, strarr, grammar, i, pos, true, token)
            }
            if (oneshot) {
              break
            }
          }
        }
      }
    },

    tokenize: function (text, grammar, language) {
      let strarr = [text]
      let rest = grammar.rest

      if (rest) {
        for (let token in rest) {
          grammar[token] = rest[token]
        }
        delete grammar.rest
      }
      _.matchGrammar(text, strarr, grammar, 0, 0, false)
      return strarr
    },

    hooks: {
      all: {},

      add: function (name, callback) {
        let hooks = _.hooks.all
        hooks[name] = hooks[name] || []
        hooks[name].push(callback)
      },

      run: function (name, env) {
        let callbacks = _.hooks.all[name]

        if (!callbacks || !callbacks.length) {
          return
        }

        for (let i = 0, callback; i < callbacks.length; i++) {
          callback = callback = callbacks[i++]
          callback(env)
        }
      }
    }
  }

  let Token = _.Token = function (type, content, alias, matchedStr, greedy) {
    this.type = type
    this.content = content
    this.alias = alias
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0
    this.greedy = !!greedy
  }

  Token.stringify = function (o, language, parent) {
    if (typeof o === 'string') {
      return o
    }

    if (_.util.type(o) === 'Array') {
      return o.map(function (element) {
        return Token.stringify(element, language, o)
      }).join('')
    }

    let env = {
      type: o.type,
      content: Token.stringify(o.content, language, parent),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language,
      parent: parent
    }

    if (o.alias) {
      let aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias]
      Array.prototype.push.apply(env.classes, aliases)
    }

    _.hooks.run('wrap', env)

    let attributes = Object.keys(env.attributes).map(function (name) {
      return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"'
    }).join(' ')
    return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>'
  }

  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _self.Prism
    }

    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener('message', function (evt) {
        let message = JSON.parse(evt.data)
        let lang = message.language
        let code = message.code
        let immediateClose = message.immediateClose

        _self.postMessage(_.highlight(code, _.languages[lang], lang))
        if (immediateClose) {
          _self.close()
        }
      }, false)
    }
    return _self.Prism
  }

// Get current script and highlight
  let script = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop()

  if (script) {
    _.filename = script.src

    if (!_.manual && !script.hasAttribute('data-manual')) {
      if (document.readyState !== 'loading') {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(_.highlightAll)
        } else {
          window.setTimeout(_.highlightAll, 16)
        }
      } else {
        document.addEventListener('DOMContentLoaded', _.highlightAll)
      }
    }
  }
  return _self.Prism
})()

// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = Prism
// }
export default Prism

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
  global.Prism = Prism
}
