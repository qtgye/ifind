import React, { useState } from 'react';
import HeaderLanguages from './HeaderLanguages';
// import { languages } from '@mocks/components/languages';

import { AiFillCaretDown } from 'react-icons/ai';
import CountryFlag from 'react-country-flag';
import { set } from 'lodash';


const HeaderLanguageButton = ({ onClick, dropdown, language, setLanguage }) => {

    return (
        <div>
            <button onClick={onClick}>
                <CountryFlag countryCode="us" svg />
                <span><AiFillCaretDown /></span>
            </button>
            <ul className="single-bar">
                {dropdown && language.map((item, index) => {
                    return (
                        <HeaderLanguages item={item} key={index} />
                    )
                })}
            </ul>
        </div>

    )
}

export default HeaderLanguageButton;
