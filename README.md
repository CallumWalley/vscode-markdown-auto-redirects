# markdown-auto-redirects

## Features

Intented to be used with the the mkdocs plugin [mkdocs redirect](https://github.com/mkdocs/mkdocs-redirects).
The idea is, whenever a file is moved or renamed, an entry should be written into the map file to preserve links for users.

## Requirements

* minimatch

## Extension Settings

* `markdownAutoRedirects.mapFile`: Where the mapping of old to new file will be written out.
* `markdownAutoRedirects.relativeTo`: Entries will be relative to this.
* `markdown.updateLinksOnFileMove.include`: Will respect patterns defined here.
