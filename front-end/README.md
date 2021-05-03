# Dev Workflow

1. Clone this repo and cd into the folder
2. Run `git config core.hooksPath .githooks` to ensure our githooks will be picked up  
3. Run `chmod -R +x .githooks` to ensure our githooks will execute

## Front End

1. **cd** into `front-end` folder.
2. Run `npm install`  
3. Run necessary scripts for development:  
   - `npm run start` to start the front-end site. This will automatically refresh on file changes.
   - `npm run test` to start the test watcher. This will automatically run tests on changed files.
   - `npm run storybook` to start the Storybook. This contains the styleguide and component libraries.
