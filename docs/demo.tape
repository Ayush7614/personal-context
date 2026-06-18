# vhs tape for the personal-context teaser GIF.
# Render with:  vhs docs/demo.tape   (from the repo root)
Output docs/demo.gif

Require node

Set Shell bash
Set FontSize 17
Set Width 1080
Set Height 760
Set Padding 28
Set TypingSpeed 70ms
Set Framerate 24
Set Theme { "name": "ember", "background": "#0b0b0f", "foreground": "#f4f0eb", "black": "#0b0b0f", "red": "#ff6b35", "green": "#7ee787", "yellow": "#ffb800", "blue": "#7aa2f7", "magenta": "#bb9af7", "cyan": "#56d4dd", "white": "#e8e4df", "brightBlack": "#3b3b46", "brightRed": "#ff8c5a", "brightGreen": "#a3ff12", "brightYellow": "#ffd479", "brightBlue": "#9db4ff", "brightMagenta": "#d2a8ff", "brightCyan": "#7be3ea", "brightWhite": "#ffffff", "cursor": "#ff6b35", "selection": "#ff6b3540" }

# Hidden setup: put the CLI on PATH, set a clean ember prompt, start in the repo.
Hide
Type "export PATH=$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
Enter
Type "unset NO_COLOR && export FORCE_COLOR=3 COLORTERM=truecolor TERM=xterm-256color"
Enter
Type "export PS1='\[\e[38;5;208m\]❯ \[\e[0m\]'"
Enter
Type "cd ~/Projects/personal-context && clear"
Enter
Show

Sleep 800ms
Type "personal-context teaser"
Sleep 600ms
Enter
Sleep 10s
