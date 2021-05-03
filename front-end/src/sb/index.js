export const styleguide = (config) => ({
    ...config,
    title: `00 - Styleguide/${config.title}`
});

export const component = (config) => ({
    ...config,
    title: `01 - Components/${config.title}`
});

export const page = (config) => ({
    ...config,
    title: `02 - Pages/${config.title}`
});