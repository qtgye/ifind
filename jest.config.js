module.exports = {
    moduleNameMapper: {

        /**
         * should match webpack aliases from paths.js
         */
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@templates/(.*)$': '<rootDir>/src/templates/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
        '^@bootstrap(/.*)?$': '<rootDir>/node_modules/bootstrap/scss/bootstrap',

        /**
         * Mocks css imports
         */
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/config/jest/fileTransform.js",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
}