import './ifind-icon.scss';

const IfindIcon = ({ icon, ...props }) => {

    const classNames = [ props.className, 'ifind-icon' ];

    props.className = [ props.className, 'ifind-icon' ].join(' ');

    return (
        <svg {...props}>
            <use xlinkHref={`#${icon}`} ></use>
        </svg>
    )
};

export default IfindIcon;