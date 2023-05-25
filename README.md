# Prerequisites
1. [Docker](https://www.docker.com/)
2. [NodeJS](https://nodejs.org/en) -  This is only needed for the web layer, since it has to run independently outside of the docker container.

## Setup

1. Clone this repo and cd into the folder
2. Run `git config core.hooksPath .githooks` to ensure our githooks will be picked up  
3. Run `chmod -R +x .githooks` to ensure our githooks will execute


## Site layers
- Admin
- Web
- IFIND Icons

## TODO
- Fully integrate web into the docker container, with an optional start/stop control.
- Consider removing `ifind-utils` in favor of `ifind-utilities` git submodule.
- Consider moving `ifind-icons` into `ifind-utilities` instead.
