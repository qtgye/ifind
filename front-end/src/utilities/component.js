export const withComponentName = (componentName) => (Component) => {
    Component.componentName = componentName;
    return Component;
};