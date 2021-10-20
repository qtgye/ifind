import React from 'react';
import HeaderSideNavMenuItem from './HeaderSideNavMenuItem';

const HeaderSideNavSubMenu = ({ categories, checked, checkChange }: HeaderSideNavSubMenuProps) => {

    return (
        <>
            {categories?.map(category => (
                <HeaderSideNavMenuItem category={category} checked={checked} checkChange={checkChange} key={category?.id} />
            ))
            }
        </>
    )
}

export default HeaderSideNavSubMenu;
