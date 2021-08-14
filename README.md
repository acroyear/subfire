### SubFire 4

A refactoring of SubFire 3 to a 'monorepo', able to handle the library and the applications at the same time. This project will divide the code into packages.

- core - the main access libraries and radio generator systems, converted to typescript.
- hooks - react contexts and hooks for building apps
- components - material-ui based components for re-use
- storybook - demo pages for the above
- mobile - the main mobile player (including the 'auto' player option)
- tv - the main tv player
- fireos - combining the mobile and tv players to a single app for fire tablets and tv devices
- quick - the next edition of the quickplayer code
- portal - wrapping the quick player with the ability to add public widgets (weather, calendar)
- pl - the playlist editor and radio generator
- tags - an nwjs app for editing ID3 tags and organizing files
- ...

# lerna-typescript-cra-uilib-starter
Starter for Monorepos: Lerna, TypeScript, CRA and Storybook

- now supports react-scripts version 4
- contains the storybook "sb init" scaffolding with typescript, with slight modifications
- the UI library packages .css and .scss files in the library-folders now

[more details in the blogpost](https://dev.to/shnydercom/monorepos-lerna-typescript-cra-and-storybook-combined-4hli)
