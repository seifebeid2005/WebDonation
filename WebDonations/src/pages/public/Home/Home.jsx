import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";
import { getAllCauseRequests } from "../../../functions/user/RegquestCauses";
// Dummy team data
const TEAM_MEMBERS = [
  {
    name: "Reem Hussein",
    title: "Executive Director",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Freem.jpeg?alt=media&token=82155e3d-6492-42c9-8b99-b6aebd394cc7",
  },
  {
    name: "Seif Ebeid",
    title: "Operations Manager",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fseif.jpeg?alt=media&token=bfc5ef87-efb0-41ce-bfcc-f69c47d32a08",
  },
  {
    name: "John Maged",
    title: "Operations Manager",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fjohn.JPEG?alt=media&token=5d6f6886-2532-4824-b5ee-f813bf91285e",
  },
  {
    name: "Cherine Hassan",
    title: "Outreach Coordinator",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fcherine.jpeg?alt=media&token=850aadfe-50f0-4a18-9c65-c562442e6db8",
  },
  {
    name: "Mayar Fathi",
    title: "Marketing Specialist",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fmayar.jpeg?alt=media&token=9cc4c87a-da05-4bdb-aa99-7cdf8ad5e131",
  },
  {
    name: "Adbullah Nagy",
    title: "Financial Officer",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2FAbdullah.jpeg?alt=media&token=0995399d-643b-4372-a590-236c1c463d9e",
  },
];
function AboutDonations() {
  // Mobile nav state
  const fetchData = async () => {
    try {
      const data = await getAllCauseRequests();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [navOpen, setNavOpen] = useState(false);

  // Donation form state
  const [donationAmount, setDonationAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [donationForm, setDonationForm] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "100",
    customAmount: "",
    message: "",
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    contactName: "",
    contactEmail: "",
    subject: "",
    contactMessage: "",
  });

  // Scroll reveal
  useEffect(() => {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          el.classList.add("revealed");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  // Smooth scroll
  useEffect(() => {
    const handler = (e) => {
      if (
        e.target.tagName === "A" &&
        e.target.getAttribute("href") &&
        e.target.getAttribute("href").startsWith("#") &&
        e.target.getAttribute("href") !== "#"
      ) {
        e.preventDefault();
        const id = e.target.getAttribute("href");
        const target = document.querySelector(id);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 70,
            behavior: "smooth",
          });
          setNavOpen(false);
        }
      }
    };
    document.body.addEventListener("click", handler);
    return () => document.body.removeEventListener("click", handler);
  }, []);

  // Donation form handler
  const handleDonationInputChange = (e) => {
    const { name, value } = e.target;
    setDonationForm((prev) => ({ ...prev, [name]: value }));
    if (name === "amount") {
      setDonationAmount(value);
      if (value !== "custom") setCustomAmount("");
    }
    if (name === "customAmount") setCustomAmount(value);
  };

  const handleDonationSubmit = (e) => {
    if (
      donationAmount === "custom" &&
      (!customAmount || parseInt(customAmount, 10) < 1)
    ) {
      e.preventDefault();
      alert("Please enter a valid donation amount.");
      return;
    }
    // Submit logic here (e.g., fetch or axios post)
    // Demo: prevent default
    e.preventDefault();
    alert("Donation submitted! (demo)");
  };

  // Contact form handler
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Submit logic here (e.g., fetch or axios post)
    alert("Message sent! (demo)");
  };

  return (
    <div>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1 className="fade-in">Making a Difference Together</h1>
            <p className="fade-in delay-1">
              Learn about our mission and how your donations help us create
              lasting change.
            </p>
            <a href="#donate" className="btn fade-in delay-2">
              Donate Now
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about scroll-reveal">
          <div className="container">
            <div className="section-header">
              <h2>About Us</h2>
              <div className="underline"></div>
            </div>
            <div className="about-content">
              <div className="about-image">
                <img
                  src="https://img.freepik.com/free-photo/volunteers-teaming-up-organize-donations-charity_23-2149230524.jpg?t=st=1746721731~exp=1746725331~hmac=44be2e7d7dc1bac5d95af1a1a3b9ca11f22a06fea72511304576f876c9417bd8&w=996"
                  alt="Our Mission"
                  className="rounded-image"
                />
              </div>
              <div className="about-text">
                <h3>Our Mission</h3>
                <p>
                  We are dedicated to creating positive change in our community
                  through sustainable programs, educational initiatives, and
                  compassionate outreach. Since our founding in 2010, we've
                  helped thousands of individuals achieve better futures.
                </p>
                <h3>Our Vision</h3>
                <p>
                  We envision a world where everyone has access to the
                  resources, opportunities, and support they need to thrive.
                  Through collaborative partnerships and innovative approaches,
                  we're working to make this vision a reality.
                </p>
                <h3>Our Values</h3>
                <ul className="values-list">
                  <li>
                    <i className="fas fa-heart"></i> Compassion
                  </li>
                  <li>
                    <i className="fas fa-handshake"></i> Integrity
                  </li>
                  <li>
                    <i className="fas fa-seedling"></i> Sustainability
                  </li>
                  <li>
                    <i className="fas fa-users"></i> Community
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="impact scroll-reveal">
          <div className="container">
            <div className="section-header">
              <h2>Our Impact</h2>
              <div className="underline"></div>
            </div>
            <div className="stats-container">
              <div className="stat-box">
                <i className="fas fa-hands-helping"></i>
                <h3>5,000+</h3>
                <p>People Helped</p>
              </div>
              <div className="stat-box">
                <i className="fas fa-globe-americas"></i>
                <h3>12</h3>
                <p>Communities Served</p>
              </div>
              <div className="stat-box">
                <i className="fas fa-calendar-check"></i>
                <h3>15</h3>
                <p>Years of Service</p>
              </div>
              <div className="stat-box">
                <i className="fas fa-project-diagram"></i>
                <h3>50+</h3>
                <p>Ongoing Projects</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="team scroll-reveal">
          <div className="container">
            <div className="section-header">
              <h2>Our Team</h2>
              <div className="underline"></div>
            </div>
            <div className="team-grid">
              {TEAM_MEMBERS.map((member) => (
                <div className="team-member" key={member.name}>
                  <div className="member-image">
                    <img src={member.img} alt={member.name} />
                  </div>
                  <h4>{member.name}</h4>
                  <p>{member.title}</p>
                  <div className="social-icons">
                    <a href="#">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section id="donate" className="donate scroll-reveal">
          <div className="container">
            <div className="section-header">
              <h2>Make a Donation</h2>
              <div className="underline"></div>
            </div>
            <div className="donation-content">
              <div className="donation-text">
                <h3>Your Support Makes a Difference</h3>
                <p>
                  Your generous donations help us continue our vital work in the
                  community. Every contribution, no matter the size, makes a
                  significant impact on the lives of those we serve.
                </p>
                <div className="donation-info">
                  <div className="info-item">
                    <i className="fas fa-hand-holding-heart"></i>
                    <h4>Direct Impact</h4>
                    <p>
                      85% of your donation goes directly to our programs and
                      services.
                    </p>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-receipt"></i>
                    <h4>Tax Deductible</h4>
                    <p>
                      All donations are tax-deductible under applicable laws.
                    </p>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-shield-alt"></i>
                    <h4>Secure Process</h4>
                    <p>
                      Your financial information is protected with top-level
                      encryption.
                    </p>
                  </div>
                </div>
              </div>
              <div className="donation-form-container">
                <form
                  className="donation-form"
                  id="donationForm"
                  onSubmit={handleDonationSubmit}
                  autoComplete="off"
                >
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={donationForm.name}
                      onChange={handleDonationInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={donationForm.email}
                      onChange={handleDonationInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={donationForm.phone}
                      onChange={handleDonationInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Donation Amount</label>
                    <div className="donation-amounts">
                      {["25", "50", "100", "custom"].map((amt) => (
                        <div className="amount-option" key={amt}>
                          <input
                            type="radio"
                            id={`amount${amt}`}
                            name="amount"
                            value={amt}
                            checked={donationAmount === amt}
                            onChange={handleDonationInputChange}
                          />
                          <label htmlFor={`amount${amt}`}>
                            {amt === "custom" ? "Custom" : `EGP ${amt}`}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div
                      id="customAmountContainer"
                      className={donationAmount === "custom" ? "" : "hidden"}
                    >
                      <label htmlFor="customAmount">Enter Amount (EGP)</label>
                      <input
                        type="number"
                        id="customAmount"
                        name="customAmount"
                        min="1"
                        step="1"
                        value={customAmount}
                        onChange={handleDonationInputChange}
                        required={donationAmount === "custom"}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="3"
                      value={donationForm.message}
                      onChange={handleDonationInputChange}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-donate">
                    Go pay with Card
                  </button>
                  <p className="security-note">
                    <i className="fas fa-lock"></i> Your information is secure
                    and encrypted
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact scroll-reveal">
          <div className="container">
            <div className="section-header">
              <h2>Contact Us</h2>
              <div className="underline"></div>
            </div>
            <div className="contact-content">
              <div className="contact-info">
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <h4>Our Location</h4>
                  <p>
                    123 Charity Street
                    <br />
                    Anytown, ST 12345
                  </p>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone-alt"></i>
                  <h4>Phone</h4>
                  <p>(555) 123-4567</p>
                </div>
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <h4>Email</h4>
                  <p>info@yourorganization.org</p>
                </div>
                <div className="info-item">
                  <i className="far fa-clock"></i>
                  <h4>Office Hours</h4>
                  <p>
                    Monday - Friday: 9am - 5pm
                    <br />
                    Saturday: 10am - 2pm
                  </p>
                </div>
              </div>
              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="contactName">Name</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={contactForm.contactName}
                      onChange={handleContactInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactEmail">Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      required
                      value={contactForm.contactEmail}
                      onChange={handleContactInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={contactForm.subject}
                      onChange={handleContactInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactMessage">Message</label>
                    <textarea
                      id="contactMessage"
                      name="contactMessage"
                      rows="5"
                      required
                      value={contactForm.contactMessage}
                      onChange={handleContactInputChange}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Replace with your React footer component if needed */}
      <Footer />
    </div>
  );
}

export default AboutDonations;
