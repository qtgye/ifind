export const styleguide = (config: {[key: string]: any}) => ({
    ...config,
    title: [ '00 - Styleguide', config.title ].filter(Boolean).join('/'),
});

export const component = (config: {[key: string]: any}) => ({
    ...config,
    title: [ '01 - Components', config.title ].filter(Boolean).join('/'),
});

export const template = (config: {[key: string]: any}) => ({
    ...config,
    title: [ '02 - Templates', config.title ].filter(Boolean).join('/'),
});

export const page = (config: {[key: string]: any}) => ({
    ...config,
    title: [ '03 - Pages', config.title ].filter(Boolean).join('/'),
});
