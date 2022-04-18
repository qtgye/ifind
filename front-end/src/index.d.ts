import './contexts/index.d';
import './translations/index.d';

declare global {
  interface GenericObject {
    [key: string]: any;
  }
}
