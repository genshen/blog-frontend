// auto load lib
let autoLoad = function (Prism) {
  if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createElement) {
    return
  }

  // The dependencies map is built automatically with gulp
  let langDependencies = /* languages_placeholder[ */ {
    'javascript': 'clike',
    'actionscript': 'javascript',
    'arduino': 'cpp',
    'aspnet': 'markup',
    'bison': 'c',
    'c': 'clike',
    'csharp': 'clike',
    'cpp': 'c',
    'coffeescript': 'javascript',
    'crystal': 'ruby',
    'css-extras': 'css',
    'd': 'clike',
    'dart': 'clike',
    'django': 'markup',
    'fsharp': 'clike',
    'flow': 'javascript',
    'glsl': 'clike',
    'go': 'clike',
    'groovy': 'clike',
    'haml': 'ruby',
    'handlebars': 'markup',
    'haxe': 'clike',
    'java': 'clike',
    'jolie': 'clike',
    'kotlin': 'clike',
    'less': 'css',
    'markdown': 'markup',
    'n4js': 'javascript',
    'nginx': 'clike',
    'objectivec': 'c',
    'opencl': 'cpp',
    'parser': 'markup',
    'php': 'clike',
    'php-extras': 'php',
    'processing': 'clike',
    'protobuf': 'clike',
    'pug': 'javascript',
    'qore': 'clike',
    'jsx': ['markup', 'javascript'],
    'reason': 'clike',
    'ruby': 'clike',
    'sass': 'css',
    'scss': 'css',
    'scala': 'java',
    'smarty': 'markup',
    'swift': 'clike',
    'textile': 'markup',
    'twig': 'markup',
    'typescript': 'javascript',
    'vbnet': 'basic',
    'wiki': 'markup'
  }
  /* ] */

  let langData = {}
  let ignoredLanguage = 'none'
  let config = Prism.plugins.autoloader = {
    languages_path: 'components/',
    use_minified: true
  }

  /**
   * Lazy loads an external script
   * @param {string} src
   * @param {function=} success
   * @param {function=} error
   */
  let script = function (src, success, error) {
    let s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = function () {
      document.body.removeChild(s)
      success && success()
    }
    s.onerror = function () {
      document.body.removeChild(s)
      error && error()
    }
    document.body.appendChild(s)
  }

  /**
   * Returns the path to a grammar, using the language_path and use_minified config keys.
   * @param {string} lang
   * @returns {string}
   */
  let getLanguagePath = function (lang) {
    return config.languages_path +
      'prism-' + lang +
      (config.use_minified ? '.min' : '') + '.js'
  }

  /**
   * Tries to load a grammar and
   * highlight again the given element once loaded.
   * @param {string} lang
   * @param {HTMLElement} elt
   */
  let registerElement = function (lang, elt) {
    let data = langData[lang]
    if (!data) {
      data = langData[lang] = {}
    }

    // Look for additional dependencies defined on the <code> or <pre> tags
    let deps = elt.getAttribute('data-dependencies')
    if (!deps && elt.parentNode && elt.parentNode.tagName.toLowerCase() === 'pre') {
      deps = elt.parentNode.getAttribute('data-dependencies')
    }

    if (deps) {
      deps = deps.split(/\s*,\s*/g)
    } else {
      deps = []
    }

    loadLanguages(deps, function () {
      loadLanguage(lang, function () {
        Prism.highlightElement(elt)
      })
    })
  }

  /**
   * Sequentially loads an array of grammars.
   * @param {string[]|string} langs
   * @param {function=} success
   * @param {function=} error
   */
  let loadLanguages = function (langs, success, error) {
    if (typeof langs === 'string') {
      langs = [langs]
    }
    let i = 0
    let l = langs.length
    let f = function () {
      if (i < l) {
        loadLanguage(langs[i], function () {
          i++
          f()
        }, function () {
          error && error(langs[i])
        })
      } else if (i === l) {
        success && success(langs)
      }
    }
    f()
  }

  /**
   * Load a grammar with its dependencies
   * @param {string} lang
   * @param {function=} success
   * @param {function=} error
   */
  let loadLanguage = function (lang, success, error) {
    let load = function () {
      let force = false
      // Do we want to force reload the grammar?
      if (lang.indexOf('!') >= 0) {
        force = true
        lang = lang.replace('!', '')
      }

      let data = langData[lang]
      if (!data) {
        data = langData[lang] = {}
      }
      if (success) {
        if (!data.success_callbacks) {
          data.success_callbacks = []
        }
        data.success_callbacks.push(success)
      }
      if (error) {
        if (!data.error_callbacks) {
          data.error_callbacks = []
        }
        data.error_callbacks.push(error)
      }

      if (!force && Prism.languages[lang]) {
        languageSuccess(lang)
      } else if (!force && data.error) {
        languageError(lang)
      } else if (force || !data.loading) {
        data.loading = true
        let src = getLanguagePath(lang)
        script(src, function () {
          data.loading = false
          languageSuccess(lang)
        }, function () {
          data.loading = false
          data.error = true
          languageError(lang)
        })
      }
    }
    let dependencies = langDependencies[lang]
    if (dependencies && dependencies.length) {
      loadLanguages(dependencies, load)
    } else {
      load()
    }
  }

  /**
   * Runs all success callbacks for this language.
   * @param {string} lang
   */
  let languageSuccess = function (lang) {
    if (langData[lang] && langData[lang].success_callbacks && langData[lang].success_callbacks.length) {
      langData[lang].success_callbacks.forEach(function (f) {
        f(lang)
      })
    }
  }

  /**
   * Runs all error callbacks for this language.
   * @param {string} lang
   */
  let languageError = function (lang) {
    if (langData[lang] && langData[lang].error_callbacks && langData[lang].error_callbacks.length) {
      langData[lang].error_callbacks.forEach(function (f) {
        f(lang)
      })
    }
  }

  Prism.hooks.add('complete', function (env) {
    if (env.element && env.language && !env.grammar) {
      if (env.language !== ignoredLanguage) {
        registerElement(env.language, env.element)
      }
    }
  })
}

export default autoLoad
