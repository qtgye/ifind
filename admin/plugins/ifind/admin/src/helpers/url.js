import pluginId from '../pluginId';

export const generatePluginLink = (relativeToPlugin, withParentRoute = false) => `${
  withParentRoute ? '/admin/' : ''
  }/plugins/${pluginId}/${relativeToPlugin}`;