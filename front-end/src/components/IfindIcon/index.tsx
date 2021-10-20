import './ifind-icon.scss';
import PropTypes from 'prop-types';

const IfindIcon = ({ icon, dark, className, ...props }: IfindIconProps) => {
    const processedClassName = [
        className,
        'ifind-icon',
        dark ? 'ifind-icon--dark' : ''
    ].filter(Boolean).join(' ');

    return (
        <svg className={processedClassName} {...props}>
            <use xlinkHref={`#${icon.replace(/_/g, '-')}`} ></use>
        </svg>
    )
};

IfindIcon.propTypes = {
    dark: PropTypes.bool,
};

IfindIcon.defaultProps = {
    dark: false,
}

export default IfindIcon;
