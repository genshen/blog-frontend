import Prism from './core'

/* languages */
import Clike from './components/clike'
import Markup from './components/markup'
import Git from './components/git'
import SQL from './components/sql'
import Bash from './components/bash'
// plugins
import AutoLoad from './plugins/autoload'
AutoLoad(Prism)

// clike
Clike(Prism)
// Markup
Markup(Prism)
// git
Git(Prism)
// SQL
SQL(Prism)
// Bash
Bash(Prism)

export default Prism
