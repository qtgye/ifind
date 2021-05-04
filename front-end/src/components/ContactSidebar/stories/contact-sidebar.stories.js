import { component } from '@sb';
import ContactSidebarComponent from '../';

export default component({
    component: ContactSidebarComponent,
});

export const ContactSidebar = () => (
    <div className="contact-us">
        <ContactSidebarComponent />
    </div>
)