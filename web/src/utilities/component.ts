export const withComponentName = (componentName: string) => (Component?: NamedComponent) => {
    if ( Component ) {
      Component.componentName = componentName;
      return Component;
    }
    return null;
};

export const withProvider = (providerName: string) => (Component?: ComponentWithProvider) => {
    if ( Component ) {
      Component.provider = providerName;
      return Component;
    }
    return null;
};
