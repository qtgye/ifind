import GeneralTemplate from "templates/GeneralTemplate";
import BreadCrumbs from "components/BreadCrumbs";
import ContactForm from "components/ContactForm";
import ContactSidebar from "components/ContactSidebar";
import { getLanguages } from "providers/globalDataContext";

const Contact = () => (
  <GeneralTemplate>
    <BreadCrumbs />

    <section id="contact-us" className="contact-us section">
      <div className="contact-us__container">
        <ContactForm />
        <ContactSidebar />
      </div>
    </section>
  </GeneralTemplate>
);

export const getStaticPaths = async () => {
  const { languages } = await getLanguages();

  // Build [language]/page-name paths
  const pagePaths: {
    params: {
      language: string;
    };
  }[] = [];

  languages.forEach(({ code: language }) => {
    pagePaths.push({
      params: {
        language,
      },
    });
  });

  return {
    paths: pagePaths,
    fallback: "blocking", // false or 'blocking'
  };
};

export const getStaticProps = async () => ({ props: {} });

export default Contact;
