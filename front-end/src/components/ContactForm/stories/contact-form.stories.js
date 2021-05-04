import { component } from '@sb';
import ContactFormComponent from '../';

export default component({
    component: ContactFormComponent,
});

export const ContactForm = () => (
    <div className="contact-us">
        <ContactFormComponent />
    </div>
)