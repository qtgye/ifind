import { component } from '@sb';
import TiIcon from '..';

import icons from './icons';
import './styles.scss';

export default component({
    title: TiIcon.componentName,
    component: TiIcon
});

const Template = TiIcon.bind({});

export const Icons = () => (
    <ul className="icons">
        {icons.map(icon => (
            <li className="icon">
                <TiIcon icon={icon} />
                <span className="icon-name">{icon}</span>
            </li>
        ))}
    </ul>
);