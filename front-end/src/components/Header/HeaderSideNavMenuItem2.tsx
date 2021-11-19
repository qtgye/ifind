import React, { useState, useCallback, useRef, useEffect, useContext, LegacyRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import IfindIcon from '@components/IfindIcon';
import { getGrandchildrenCategories } from '../../utilities/category';

const HeaderSideNavMenuItem2 = ({ category }: HeaderSideNavMenuItem2Props) => {

    const [subCategories, setSubCategories] = useState(false);
    const showSubCategories = () => setSubCategories(!subCategories);
    const { activeCategory, onCategoryClick } = useContext(GlobalStateContext);
    const grandChildren = getGrandchildrenCategories(category?.children || []);
    //const len = grandChildren.length;
    const str = category?.label?.label || '';
    const withSpace = str.indexOf(" ");
    const categoryRef = useRef<HTMLDivElement | null>();

    const onItemClick = useCallback((id) => {
        if (onCategoryClick) {
            onCategoryClick(id);
        }
        console.log(id);
    }, [onCategoryClick]);

    const onActiveCategory = useCallback((activeCategory) => {
        if (grandChildren.find((category) => category?.id === activeCategory.toString())) {
            setSubCategories(true);
        }
        else {
            setSubCategories(false);
        }
    }, [grandChildren]);

    useEffect(() => {
        onActiveCategory(activeCategory);
        console.log(category, activeCategory);
    }, [activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

    const categoryClick = () => {
        showSubCategories();
    }

    const categoryClick2 = (id: any) => {
        onItemClick(id);
    }

    return (
        <>
            <div key={category?.id} className="list">
                {/* {category?.parent === null ? "" : */}
                <button onClick={categoryClick}>
                    <IfindIcon icon={category?.icon || ''} className="header-side-nav__icon" />
                    <span className={["category-label", withSpace > 0 ? "change-width" : ""].join(" ")}>{category?.label?.label}</span>
                    {/* {len === 0 ? "" : <div className="num-of-elements">{len}</div>} */}
                </button>
                {/* } */}
                {
                    subCategories && category?.children?.map((cat => (
                        <div className="listing">
                            <div ref={categoryRef as LegacyRef<HTMLDivElement>}
                                className={["active-listing", activeCategory?.toString() === cat?.id ? "active" : ""].join(" ")}
                                key={cat?.id}
                            >
                                <button onClick={() => categoryClick2(cat?.id)}>
                                    <IfindIcon icon={cat?.icon || ''} className="header-side-nav__icon" />
                                    <span className={["category-label", withSpace > 0 ? "change-width" : ""].join(" ")}>{cat?.label?.label}</span>
                                </button>
                            </div>
                        </div>
                    )))
                }
            </div >
        </>
    )
}

export default HeaderSideNavMenuItem2;