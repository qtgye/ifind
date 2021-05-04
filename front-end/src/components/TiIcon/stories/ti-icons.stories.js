import { component } from '@sb';
import TiIconComponent from '..';

import icons from './icons';
import styles from './styles.scss';

export default component({
    title: '',
    component: TiIconComponent
});

const Template = TiIconComponent.bind({});

export const TiIcon = () => (
    <ul className="ti_icons">
        {icons.map(icon => (
            <li className="ti_icons__icon" key={icon}>
                <TiIconComponent icon={icon} />
                <span className="ti_icons__name">{icon}</span>
            </li>
        ))}
    </ul>
);
