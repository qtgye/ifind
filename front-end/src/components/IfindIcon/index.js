import './ifind-icon.scss';

const IfindIcon = ({ icon, ...props }) => {

    props.className = [ props.className, 'ifind-icon' ].filter(Boolean).join(' ');

    return (
        <svg {...props}>
            <use xlinkHref={`#${icon.replace(/_/g, '-')}`} ></use>
        </svg>
    )
};

export default IfindIcon;