const ContactSidebar = () => (
    <div className="col-lg-4 col-12">
        <div className="single-head">
            <div className="single-info">
                <i className="fa fa-phone"></i>
                <h4 className="title">Call us Now:</h4>
                <ul>
                    <li>+123 456-789-1120</li>
                    <li>+522 672-452-1120</li>
                </ul>
            </div>
            <div className="single-info">
                <i className="fa fa-envelope-open"></i>
                <h4 className="title">Email:</h4>
                <ul>
                    <li><a href="mailto:info@yourwebsite.com">info@ifindilu.com</a></li>
                </ul>
            </div>
            <div className="single-info">
                <i className="fa fa-location-arrow"></i>
                <h4 className="title">Our Address:</h4>
                <ul>
                    <li>Address</li>
                </ul>
            </div>
        </div>
    </div>
);

export default ContactSidebar;