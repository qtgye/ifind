import React from 'react';
import HeaderSideNavMenuItem2 from './HeaderSideNavMenuItem2';

const HeaderSideNavSubMenu2 = ({ categories }: HeaderSideNavSubMenu2Props) => {
    return (
        <>
            {categories?.map(category => (
                <HeaderSideNavMenuItem2 category={category} key={category?.id} />
            ))
            }
        </>
    )
}

export default HeaderSideNavSubMenu2;
