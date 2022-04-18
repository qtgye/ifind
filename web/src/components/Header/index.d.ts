declare interface HeaderMiddleProps {
  onInterSect?: (isIntersecting: boolean) => any;
  onSubmit?: (args: any) => any;
}

declare interface HeaderNavProps {
  withSideNav?: boolean;
}

declare interface HeaderSideNavSubMenuProps {
  id?: string;
  categories?: (CategoryWithChild | null)[];
  checked?: boolean;
  checkChange?: (args: any) => any;
  triggerScroll?: (args: any) => any;
}

declare interface HeaderSideNavSubMenu2Props {
  id?: string;
  categories?: (CategoryWithChild | null)[];
  checked?: boolean;
  checkChange?: (args: any) => any;
  triggerScroll?: (args: any) => any;
}

declare interface HeaderSideNavMenuItemProps {
  category: CategoryWithChild | null;
  checked?: boolean;
  checkChange?: (args: any) => any;
}

declare interface HeaderSideNavMenuItem2Props {
  category?: CategoryWithChild | null;
  key?: any;
  //checkChange?: (args: any) => any;
}

declare interface HeaderTopProps extends ContactInfo {
  email?: string;
}
