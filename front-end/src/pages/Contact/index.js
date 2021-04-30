import BreadCrumbs from '@components/BreadCrumbs';
import ContactForm from '@components/ContactForm';
import ContactSidebar from '@components/ContactSidebar';

const Contact = () => (
    <>
        <BreadCrumbs />

        <section id="contact-us" className="contact-us section">
            <div className="container">
                <div className="contact-head">
                    <div className="row">
                        <ContactForm />
                        <ContactSidebar />
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default Contact;