import { useTranslation } from "translations/index";
import { phoneHeading, emailHeading, addressHeading } from "./translations";

const SideBar = ({
  phone,
  supportPhone,
  supportEmail,
}: ContactSidebarProps) => {
  const translate = useTranslation();

  return (
    <div className="col-lg-4 col-12 contact-sidebar">
      <div className="single-head">
        <div className="single-info">
          <i className="fa fa-phone"></i>
          <h4 className="title">{translate(phoneHeading)}:</h4>
          <ul>
            <li>{phone}</li>
            <li>{supportPhone}</li>
          </ul>
        </div>
        <div className="single-info">
          <i className="fa fa-envelope-open"></i>
          <h4 className="title">{translate(emailHeading)}:</h4>
          <ul>
            <li>{supportEmail}</li>
          </ul>
        </div>
        <div className="single-info">
          <i className="fa fa-location-arrow"></i>
          <h4 className="title">{translate(addressHeading)}</h4>
          <ul>
            <li>Address</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
