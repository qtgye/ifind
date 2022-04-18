import SideBar from './SideBar';

import { useGlobalData } from 'providers/globalDataContext';

const ContactSidebar = () => {
    const { contactInfo } = useGlobalData();
    return (
        <>
            <SideBar {...contactInfo} />
        </>
    )
};

export default ContactSidebar;
