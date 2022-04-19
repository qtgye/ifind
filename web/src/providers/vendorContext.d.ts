declare interface VendorMap {
  [vendorId: string]: {
    stylesheets?: string[];
    scripts?: string[];
    loadedCheck?: () => boolean;
    injecting?: boolean;
    loaded?: boolean;
  };
}

declare interface VendorContextData {
  isVendorInjected?: (vendorId: string) => boolean;
  injectVendor?: (vendorId: string, onVendorLoaded: () => void) => void;
}
