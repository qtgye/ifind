const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const sassRegex = /\.scss$/i;

const PROJECT_ROOT = process.cwd();

module.exports = {
  webpack: (config, webpack) => {

    // config.module.rules[0].include = [
    //   path.resolve(process.cwd(), 'plugins/_includes'),
    //   path.resolve(process.cwd(), 'node_modules'),
    // ];

    // Update loader for js files to accept ts and tsx
    config.module.rules[0].test = /\.((m?j)|t)sx?$/;
    config.module.rules[0].use.options.presets.push('@babel/preset-typescript');
    config.resolve.extensions.push('.ts', '.tsx')

    // Additional rules
    config.module.rules.push(
      // SASS support.
    // Extracted from config/webpack.config.js
    {
      test: sassRegex,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            sourceMap: true,
          },
        },
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            postcssOptions: {
              ident: 'postcss',
              plugins: [
                // require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
              ],
            },
            sourceMap: true,
          },
        },
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: true,
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
            sassOptions: {}
          },
        }
      ].filter(Boolean)
    });

    config.resolve = config.resolve || {};

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@plugins': path.resolve(PROJECT_ROOT, 'plugins'),
      '@custom-types': path.resolve(PROJECT_ROOT, 'types'),
    }

    // Add your variable using the DefinePlugin
    // Admin FE can then have access to ENV global object.
    config.plugins.push(
      new webpack.DefinePlugin({
        //All your custom ENVs that you want to use in frontend
        ENV: JSON.stringify(Object.entries(process.env).reduce((customEnv, [key, value]) => {
          // Expose only selected custom variables
          if ( /^(SCRIPTS_SERVER_URL)$/i.test(key) ) {
            customEnv[key] = value;
          }

          return customEnv;
        }, {})),
      })
    );

    return config;
  },
};
