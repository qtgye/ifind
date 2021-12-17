import React from 'react';
import HeaderSideNavMenuItem2 from './HeaderSideNavMenuItem2';
import withConditionalRender from "@utilities/hocs/withConditionalRender";

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

export default withConditionalRender<HeaderSideNavSubMenu2Props>(HeaderSideNavSubMenu2);
