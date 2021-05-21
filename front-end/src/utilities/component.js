export const withComponentName = (componentName) => (Component) => {
    Component.componentName = componentName;
    return Component;
};

export const withProvider = (providerName) => (Component) => {
    Component.provider = providerName;
    return Component;
};