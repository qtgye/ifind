# Prerequisites
1. [Docker](https://www.docker.com/)
2. [NodeJS](https://nodejs.org/en) -  This is only needed for the web layer, since it has to run independently outside of the docker container.

## Setup

1. Clone this repo and cd into the folder
2. Run `git config core.hooksPath .githooks` to ensure our githooks will be picked up  
3. Run `chmod -R +x .githooks` to ensure our githooks will execute
4. Install node dependencies for each of the layers: `npm install`
    - `./admin`
    - `./ifind-icons`
    - `./web`

## Dev Workflow
1. To start the Strapi CMS, Database, and Icons builder (Admin layer), run `docker compose up`.
    - Intentionally leaving out detached argument (`-d`) in order to see the logs right away.
2. To start the Web server (Web layer), which is optional based on the task at hand:
    - Go to the `web` folder: `cd web`
    - Run the server: `npm run dev`  
    **Note** the Admin layer needs to be running whenever the Web layer is started.


## Site layers
- Admin
- Web
- IFIND Icons

## TODO
- Fully integrate web into the docker container, with an optional start/stop control.
- Consider removing `ifind-utils` in favor of `ifind-utilities` git submodule.
- Consider moving `ifind-icons` into `ifind-utilities` instead.
