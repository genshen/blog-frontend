/* **********************************************
     Begin prism-markup.js
********************************************** */

let grammar = {
  'comment': /<!--[\s\S]*?-->/,
  'prolog': /<\?[\s\S]+?\?>/,
  'doctype': /<!DOCTYPE[\s\S]+?>/i,
  'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
  'tag': {
    pattern: /<\/?(?!\d)[^\s>/=$<]+(?:\s+[^\s>/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>/]+/i,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>/:]+:/
        }
      },
      'attr-value': {
        pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
        inside: {
          'punctuation': [
            /^=/,
            {
              pattern: /(^|[^\\])["']/,
              lookbehind: true
            }
          ]
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>/]+/,
        inside: {
          'namespace': /^[^\s>/:]+:/
        }
      }

    }
  },
  'entity': /&#?[\da-z]{1,8};/i
}

let markup = function (Prism) {
  Prism.languages.markup = grammar
  // markup; Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity']

// Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function (env) {
    if (env.type === 'entity') {
      env.attributes['title'] = env.content.replace(/&amp;/, '&')
    }
  })

  Prism.languages.xml = Prism.languages.markup
  Prism.languages.html = Prism.languages.markup
  Prism.languages.mathml = Prism.languages.markup
  Prism.languages.svg = Prism.languages.markup
}

export default markup
