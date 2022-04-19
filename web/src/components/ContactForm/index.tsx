import emailjs from "emailjs-com";
import React from "react";
import { useTranslation } from "translations/index";
import {
  eyebrow,
  title,
  nameLabel,
  emailLabel,
  subjectLabel,
  phoneLabel,
  messageLabel,
  submitLabel,
  formSubmittedAlert,
  formFailedAlert,
} from "./translations";

const ContactForm = () => {
  const translate = useTranslation();

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "ionos",
        "template_sjy5hvg",
        e.target as HTMLFormElement,
        "user_NZBqX55LWZGHJiJDgGB7r"
      )
      .then(
        (result) => {
          console.log(result.text);
          window.alert(translate(formSubmittedAlert));
        },
        (error) => {
          console.log(error.text);
          window.alert(translate(formFailedAlert));
        }
      );

    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="col-lg-8 col-12 contact-form">
      <div className="form-main">
        <div className="title">
          <h4>{translate(eyebrow)}</h4>
          <h3>{translate(title)}</h3>
        </div>
        <form className="form" onSubmit={sendEmail}>
          <div className="row">
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label>
                  {translate(nameLabel)}<span>*</span>
                </label>
                <input name="name" type="text" placeholder="" required />
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label>
                  {translate(subjectLabel)}<span>*</span>
                </label>
                <input name="subject" type="text" placeholder="" required />
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label>
                  {translate(emailLabel)}<span>*</span>
                </label>
                <input name="email" type="email" placeholder="" required />
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div className="form-group">
                <label>
                  {translate(phoneLabel)}<span>*</span>
                </label>
                <input name="phone_no" type="text" placeholder="" required />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group message">
                <label>
                  {translate(messageLabel)}<span>*</span>
                </label>
                <textarea name="message" placeholder="" required></textarea>
              </div>
            </div>
            <div className="col-12">
              <div className="form-group button">
                <button type="submit" className="btn ">
                  {translate(submitLabel)}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
