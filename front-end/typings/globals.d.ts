export declare global {
  interface Window {
    gtag: (event: string, action: string, data: {[key: string]: any}) => any;
    cookieconsent?: {
      initialise: (args: any) => any;
    }
  }

  interface NamedComponent extends React.FunctionComponent {
    componentName?: string;
  }

  interface ComponentWithProvider extends NamedComponent {
    provider?: string;
  }

}
