import SideBar from './SideBar';

import { useGlobalData } from '@contexts/global';

const ContactSidebar = () => {
    const { contactInfo } = useGlobalData();
    return (
        <>
            <SideBar {...contactInfo} />
        </>
    )
};

export default ContactSidebar;