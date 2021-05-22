import FooterContent from './FooterContent';
import { logo, text, call, phone, copyright, copyright2, link, affiliate } from '@mocks/components/footer';

const Footer = () => {

    return (
        <>
            <FooterContent logo={logo} text={text} call={call} phone={phone} copyright={copyright} copyright2={copyright2} link={link} affiliate={affiliate} />
        </>
    )

};

export default Footer;