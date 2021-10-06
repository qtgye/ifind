import React, { AnchorHTMLAttributes, useCallback, MouseEventHandler, MouseEvent } from 'react';
import { useHistory } from 'react-router';

import './styles.scss';

// TYPES
export enum E_ButtonLinkColor {
  primary = 'primary',
  secondary = 'secondary',
  cancel = 'cancel',
  success = 'success',
  delete = 'delete',
  none = 'none',
};

export interface I_ButtonLinkProps extends AnchorHTMLAttributes<any> {
  color?: E_ButtonLinkColor
}

// COMPONENT
const ButtonLink = ({ href = '', color = E_ButtonLinkColor.primary, children = null, ...props }: I_ButtonLinkProps): JSX.Element => {
  const history = useHistory();
  
  const className = [
    'button-link',
    `button-link--${color}`,
  ];

  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>((e: MouseEvent) => {
    e.preventDefault();

    // Prevents page reload
    history.push(href);
  }, [ href ]);

  return (
    <a href={href} className={className.join(' ')} {...props} onClick={onClick}>
      {children}
    </a>
  );
}

export default ButtonLink;