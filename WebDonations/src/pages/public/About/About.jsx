import React, { useState } from "react";
import "./About.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";

// Assume Header and Footer are reusable React components
// import Header from "./Header";
// import Footer from "./Footer";

const teamMembers = [
  {
    name: "Sarah Johnson",
    title: "Executive Director",
    img: "images/team-sarah.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Michael Chen",
    title: "Operations Director",
    img: "images/team-michael.jpg",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Aisha Patel",
    title: "Community Outreach",
    img: "images/team-aisha.jpg",
    linkedin: "#",
    twitter: "#",
  },
];

const awards = [
  { src: "images/award-1.png", alt: "Charity Excellence Award" },
  { src: "images/award-2.png", alt: "Community Impact Award" },
  { src: "images/award-3.png", alt: "Transparency Certificate" },
  { src: "images/award-4.png", alt: "Corporate Partner" },
];

const AboutPage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterMsg("");
    if (!newsletterEmail) {
      setNewsletterMsg("Please enter an email address.");
      return;
    }
    // Replace with your API call logic
    try {
      // Example: await fetch("/api/subscribe", { ... });
      setNewsletterMsg("Thank you for subscribing!");
      setNewsletterEmail("");
    } catch {
      setNewsletterMsg("Subscription failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div>
        {/* <Header /> */}
        <div id="hero-banner">
          <div className="overlay"></div>
          <div id="wrapper">
            <div className="hero-content">
              <h1>About HeartBridge</h1>
              <p>Building bridges of compassion since 2018</p>
            </div>
          </div>
        </div>

        <div id="content">
          <div id="wrapper">
            <div id="about-section">
              <div className="mission-statement">
                <div className="mission-icon">
                  <i className="fas fa-heart-pulse"></i>
                </div>
                <h2>Our Mission</h2>
                <p>
                  HeartBridge connects those in need with those who can help. We
                  believe that everyone deserves access to basic necessities and
                  opportunities for growth, regardless of their circumstances.
                </p>
              </div>

              <div className="about-content">
                <div className="left-column">
                  <div className="content-card story-section">
                    <div className="section-header">
                      <i className="fas fa-book-open"></i>
                      <h2>Our Story</h2>
                    </div>
                    <img
                      src="images/about-story.jpg"
                      alt="HeartBridge volunteers at community event"
                      className="story-image"
                    />
                    <p>
                      Founded in 2018, HeartBridge began with a simple idea:
                      create a platform where compassionate individuals could
                      directly support community initiatives. What started as a
                      small project has grown into a nationwide network of
                      donors and community organizations.
                    </p>
                    <p>
                      Over the years, we've facilitated thousands of donations,
                      supported hundreds of local projects, and helped
                      communities rebuild after natural disasters. Our journey
                      has been one of growth, learning, and unwavering
                      commitment to those we serve.
                    </p>
                  </div>

                  <div className="content-card impact-section">
                    <div className="section-header">
                      <i className="fas fa-chart-line"></i>
                      <h2>Our Impact</h2>
                    </div>
                    <div className="impact-stats">
                      <div className="stat-box">
                        <i className="fas fa-hand-holding-dollar"></i>
                        <span className="stat-number">$2.5M+</span>
                        <span className="stat-label">Donations Raised</span>
                      </div>
                      <div className="stat-box">
                        <i className="fas fa-users"></i>
                        <span className="stat-number">15,000+</span>
                        <span className="stat-label">Donors</span>
                      </div>
                      <div className="stat-box">
                        <i className="fas fa-lightbulb"></i>
                        <span className="stat-number">450+</span>
                        <span className="stat-label">Projects Funded</span>
                      </div>
                    </div>
                    <div className="impact-map">
                      <h3>Where We Work</h3>
                      <img
                        src="images/impact-map.jpg"
                        alt="Map showing HeartBridge's national impact"
                        className="map-image"
                      />
                    </div>
                  </div>
                </div>
                <div className="right-column">
                  <div className="content-card team-section">
                    <div className="section-header">
                      <i className="fas fa-people-group"></i>
                      <h2>Our Team</h2>
                    </div>
                    <div className="team-members">
                      {teamMembers.map((member) => (
                        <div className="team-member" key={member.name}>
                          <img
                            src={member.img}
                            alt={member.name}
                            className="member-photo"
                          />
                          <h3>{member.name}</h3>
                          <p className="member-title">{member.title}</p>
                          <div className="member-social">
                            <a
                              href={member.linkedin}
                              className="social-icon"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-linkedin"></i>
                            </a>
                            <a
                              href={member.twitter}
                              className="social-icon"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-twitter"></i>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href="team" className="text-link">
                      Meet our full team <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>

                  <div className="content-card values-section">
                    <div className="section-header">
                      <i className="fas fa-star"></i>
                      <h2>Our Values</h2>
                    </div>
                    <ul className="values-list">
                      <li>
                        <div className="value-icon">
                          <i className="fas fa-balance-scale"></i>
                        </div>
                        <div className="value-content">
                          <h3>Transparency</h3>
                          <p>
                            We believe in full accountability for all donations
                            and maintain open communication about our
                            operations.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="value-icon">
                          <i className="fas fa-hands-holding-heart"></i>
                        </div>
                        <div className="value-content">
                          <h3>Compassion</h3>
                          <p>
                            We approach our work with empathy and understanding,
                            recognizing the dignity of everyone we serve.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="value-icon">
                          <i className="fas fa-bolt"></i>
                        </div>
                        <div className="value-content">
                          <h3>Efficiency</h3>
                          <p>
                            We maximize the impact of every dollar donated
                            through strategic planning and minimal overhead.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="value-icon">
                          <i className="fas fa-hand-holding-heart"></i>
                        </div>
                        <div className="value-content">
                          <h3>Community</h3>
                          <p>
                            We build meaningful connections between donors and
                            recipients, creating a network of support.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="content-card testimonial-section">
                    <div className="section-header">
                      <i className="fas fa-quote-left"></i>
                      <h2>Testimonials</h2>
                    </div>
                    <div className="testimonial">
                      <div className="testimonial-quote">
                        <p>
                          "HeartBridge made it so easy to connect with causes
                          that matter to me. I know my donations are making a
                          real difference."
                        </p>
                      </div>
                      <div className="testimonial-author">
                        <img
                          src="images/donor-emma.jpg"
                          alt="Emma T."
                          className="testimonial-photo"
                        />
                        <div>
                          <h4>Emma T.</h4>
                          <p>Monthly Donor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="awards-section">
                <div className="section-header">
                  <i className="fas fa-award"></i>
                  <h2>Recognition & Partnerships</h2>
                </div>
                <div className="awards-logos">
                  {awards.map((award) => (
                    <img key={award.alt} src={award.src} alt={award.alt} />
                  ))}
                </div>
              </div>

              <div className="cta-section">
                <div className="cta-content">
                  <h2>Join Our Mission</h2>
                  <p>
                    Together, we can build stronger communities and bring
                    positive change to those who need it most.
                  </p>
                  <div className="cta-buttons">
                    <a href="donate" className="cta-button">
                      <i className="fas fa-hand-holding-heart"></i> Donate Now
                    </a>
                    <a href="volunteer" className="secondary-button">
                      <i className="fas fa-hands-helping"></i> Volunteer
                    </a>
                    <a href="contact" className="tertiary-button">
                      <i className="fas fa-envelope"></i> Contact Us
                    </a>
                  </div>
                </div>
                <div className="cta-image">
                  <img
                    src="images/cta-image.jpg"
                    alt="Children benefiting from HeartBridge programs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="newsletter-banner">
          <div id="wrapper">
            <div className="newsletter-content">
              <div className="newsletter-text">
                <h3>
                  <i className="fas fa-envelope-open-text"></i> Stay Updated
                </h3>
                <p>
                  Subscribe to our newsletter for updates on our projects and
                  impact stories.
                </p>
              </div>
              <form
                className="newsletter-form"
                onSubmit={handleNewsletterSubmit}
                autoComplete="off"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
                {newsletterMsg && (
                  <div className="newsletter-msg">{newsletterMsg}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
