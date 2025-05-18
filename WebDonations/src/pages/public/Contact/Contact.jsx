import React, { useState, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./Contact.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";

const ContactPro = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: false,
    loading: false,
    message: "",
  });

  const formRef = useRef(null);
  const mapRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({
      ...formStatus,
      loading: true,
      success: false,
      error: false,
      message: "",
    });

    // Simulate form submission with a delay
    setTimeout(() => {
      if (formState.email && formState.name && formState.message) {
        // Success case
        setFormStatus({
          submitted: true,
          success: true,
          error: false,
          loading: false,
          message: "Thank you! Your message has been sent successfully.",
        });
        // Reset form
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        // Error case
        setFormStatus({
          submitted: true,
          success: false,
          error: true,
          loading: false,
          message: "Please fill in all required fields.",
        });
      }
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MapPin className="cpro-info-icon" />,
      title: "Our Location",
      content: "1234 Business Avenue, Suite 500, San Francisco, CA 94107",
      link: "https://maps.google.com",
      linkText: "Get Directions",
    },
    {
      icon: <Phone className="cpro-info-icon" />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      linkText: "Call Now",
    },
    {
      icon: <Mail className="cpro-info-icon" />,
      title: "Email Us",
      content: "contact@yourcompany.com",
      link: "mailto:contact@yourcompany.com",
      linkText: "Send Email",
    },
    {
      icon: <Clock className="cpro-info-icon" />,
      title: "Business Hours",
      content: "Monday - Friday: 9AM - 5PM",
      additionalInfo: "Weekend: Closed",
      link: null,
    },
  ];

  const faqItems = [
    {
      question: "How quickly can I expect a response?",
      answer:
        "We strive to respond to all inquiries within 24 business hours. For urgent matters, please call our support line directly.",
    },
    {
      question: "Do you offer virtual consultations?",
      answer:
        "Yes, we offer video consultations via Zoom or Google Meet. You can schedule an appointment through our booking system or by contacting us directly.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, bank transfers, and digital wallets including Apple Pay and Google Pay.",
    },
  ];

  return (
    <>
      <Header activePage={"about"} />
      <div className="cpro-container">
        {/* Page Header */}
        <main className="cpro-main">
          {/* Contact Info Cards */}
          <section className="cpro-info-section">
            <div className="cpro-info-grid">
              {contactInfo.map((info, index) => (
                <div className="cpro-info-card" key={index}>
                  <div className="cpro-info-icon-wrapper">{info.icon}</div>
                  <h3 className="cpro-info-title">{info.title}</h3>
                  <p className="cpro-info-content">{info.content}</p>
                  {info.additionalInfo && (
                    <p className="cpro-info-additional">
                      {info.additionalInfo}
                    </p>
                  )}
                  {info.link && (
                    <a
                      href={info.link}
                      className="cpro-info-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {info.linkText}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form and Map Section */}
          <section className="cpro-contact-section">
            <div className="cpro-section-wrapper">
              <div className="cpro-form-container">
                <div className="cpro-form-header">
                  <h2 className="cpro-form-title">Send Us a Message</h2>
                  <p className="cpro-form-description">
                    Fill out the form below, and our team will get back to you
                    as soon as possible.
                  </p>
                </div>

                <form
                  ref={formRef}
                  className="cpro-form"
                  onSubmit={handleSubmit}
                >
                  {formStatus.submitted && (
                    <div
                      className={`cpro-form-status ${
                        formStatus.success ? "cpro-success" : "cpro-error"
                      }`}
                    >
                      {formStatus.success ? (
                        <CheckCircle className="cpro-status-icon" />
                      ) : (
                        <AlertCircle className="cpro-status-icon" />
                      )}
                      <p className="cpro-status-message">
                        {formStatus.message}
                      </p>
                    </div>
                  )}

                  <div className="cpro-form-row">
                    <div className="cpro-form-group">
                      <label htmlFor="name" className="cpro-form-label">
                        Your Name <span className="cpro-required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="cpro-form-input"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="cpro-form-group">
                      <label htmlFor="email" className="cpro-form-label">
                        Email Address <span className="cpro-required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="cpro-form-input"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="cpro-form-group">
                    <label htmlFor="subject" className="cpro-form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="cpro-form-input"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="cpro-form-group">
                    <label htmlFor="message" className="cpro-form-label">
                      Message <span className="cpro-required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      className="cpro-form-textarea"
                      placeholder="Type your message here..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="cpro-submit-button"
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? (
                      <span className="cpro-loading-spinner"></span>
                    ) : (
                      <>
                        <Send className="cpro-submit-icon" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="cpro-map-container" ref={mapRef}>
                {/* This would typically be replaced with a real map integration */}
                <div className="cpro-map-placeholder">
                  <iframe
                    title="Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26430.393553120906!2d-122.43633459371594!3d37.75866639518578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e1cd91f0113%3A0x45c25d58e848a53e!2sSan%20Francisco%2C%20CA%2094107!5e0!3m2!1sen!2sus!4v1698675187457!5m2!1sen!2sus"
                    className="cpro-map-iframe"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="cpro-faq-section">
            <div className="cpro-section-header">
              <h2 className="cpro-section-title">Frequently Asked Questions</h2>
              <p className="cpro-section-subtitle">
                Find quick answers to commonly asked questions about contacting
                us.
              </p>
            </div>

            <div className="cpro-faq-container">
              {faqItems.map((item, index) => (
                <details key={index} className="cpro-faq-item">
                  <summary className="cpro-faq-question">
                    {item.question}
                  </summary>
                  <div className="cpro-faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section className="cpro-newsletter-section">
            <div className="cpro-newsletter-container">
              <div className="cpro-newsletter-content">
                <h2 className="cpro-newsletter-title">Stay Updated</h2>
                <p className="cpro-newsletter-description">
                  Subscribe to our newsletter to receive news, updates, and
                  special offers.
                </p>
              </div>
              <form className="cpro-newsletter-form">
                <input
                  type="email"
                  className="cpro-newsletter-input"
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit" className="cpro-newsletter-button">
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ContactPro;
