chokidar "{admin,api,components,config,extensions,helpers,hooks,plugins,prerenderer,scheduled-tasks}/**/*.{js,jsx,ts,tsx}" "index.js" -c "pm2 restart ./ecosystem.config.js"
