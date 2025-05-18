import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "./Home.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";
import { getAllCauseRequests } from "../../../functions/user/RequestCauses";
import HomeImage from "../../../assets/hom.webp";
// Team data
const TEAM_MEMBERS = [
  {
    name: "Reem Hussein",
    title: "Executive Director",
    bio: "With over 10 years of nonprofit experience, Reem drives our mission forward with passion and vision.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Freem.jpeg?alt=media&token=82155e3d-6492-42c9-8b99-b6aebd394cc7",
  },
  {
    name: "Seif Ebeid",
    title: "Operations Manager",
    bio: "Seif ensures our day-to-day operations run seamlessly, maximizing our impact in communities.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fseif.jpeg?alt=media&token=bfc5ef87-efb0-41ce-bfcc-f69c47d32a08",
  },
  {
    name: "John Maged",
    title: "Program Director",
    bio: "John develops and oversees our initiatives, ensuring they create lasting positive change.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fjohn.JPEG?alt=media&token=5d6f6886-2532-4824-b5ee-f813bf91285e",
  },
  {
    name: "Cherine Hassan",
    title: "Outreach Coordinator",
    bio: "Cherine builds strong relationships with communities and partners to expand our reach.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fcherine.jpeg?alt=media&token=850aadfe-50f0-4a18-9c65-c562442e6db8",
  },
  {
    name: "Mayar Fathi",
    title: "Marketing Specialist",
    bio: "Mayar shares our story with the world, raising awareness and inspiring action.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fmayar.jpeg?alt=media&token=9cc4c87a-da05-4bdb-aa99-7cdf8ad5e131",
  },
  {
    name: "Abdullah Nagy",
    title: "Financial Officer",
    bio: "Abdullah ensures proper stewardship of funds, maintaining transparency and accountability.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2FAbdullah.jpeg?alt=media&token=0995399d-643b-4372-a590-236c1c463d9e",
  },
];

// Testimonials data
const TESTIMONIALS = [
  {
    quote:
      "The impact this organization has had on our community is immeasurable. They've brought hope where there was none.",
    author: "Sarah Ahmed",
    title: "Community Leader",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    quote:
      "I've volunteered with many nonprofits, but none match the dedication and effectiveness I've seen here.",
    author: "Michael Torres",
    title: "Regular Donor",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    quote:
      "Their programs transformed my family's life. We're forever grateful for the support during our difficult time.",
    author: "Layla Kamal",
    title: "Program Beneficiary",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

function AnimatedCounter({ value, title, icon }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/,/g, ""));

    // Don't run if already at value or no value
    if (start === end) return;

    if (inView) {
      // Get duration based on value size (larger = longer)
      const duration = Math.floor(2000 / end);

      // Timer for counting up
      let timer = setInterval(() => {
        start += 1;
        setCount(String(start));
        if (start >= end) clearInterval(timer);
      }, duration);

      // Cleanup on unmount
      return () => {
        clearInterval(timer);
      };
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="stat-box">
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <h3>
        {inView ? count : "0"}
        {value.includes("+") ? "+" : ""}
      </h3>
      <p>{title}</p>
    </div>
  );
}

export default function Home({ user }) {
  const [activePlan, setActivePlan] = useState("monthly");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [donationAmount, setDonationAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const impactRef = useRef(null);
  const teamRef = useRef(null);
  const donateRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // Fetch cause requests data on component mount
    const fetchCauses = async () => {
      try {
        const data = await getAllCauseRequests();
        console.log("Cause Requests:", data);
      } catch (error) {
        console.error("Error fetching cause requests:", error);
      }
    };
    fetchCauses();
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials every 5 seconds
    const intervalId = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDonationAmountChange = (amount) => {
    setDonationAmount(amount);
    if (amount !== "custom") {
      setCustomAmount("");
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();

    const finalAmount =
      donationAmount === "custom" ? customAmount : donationAmount;

    if (!finalAmount || parseInt(finalAmount, 10) < 1) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // Handle donation submission (would connect to payment gateway)
    console.log("Donation data:", {
      ...formData,
      amount: finalAmount,
      plan: activePlan,
    });

    alert(`Thank you for your ${activePlan} donation of EGP ${finalAmount}!`);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setDonationAmount("100");
    setCustomAmount("");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent. We'll get back to you soon!");
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      <Header activePage={"home"} user={user} />

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Together We Can <span className="highlight">Change Lives</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Join our mission to create lasting positive impact in communities
            around the world.
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              className="btn-primary"
              onClick={() => scrollToSection(donateRef)}
            >
              Donate Now
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection(aboutRef)}
            >
              Learn More
            </button>
          </motion.div>
        </div>
        <div className="hero-overlay"></div>
        <video autoPlay muted loop className="hero-video">
          <source
            src="https://cdn.coverr.co/videos/coverr-hands-forming-a-heart-shape-2287/1080p.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* About Section */}
      <section className="about-section" id="about" ref={aboutRef}>
        <div className="container">
          <div className="section-header">
            <h2>Who We Are</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Our story and mission</p>
          </div>

          <div className="about-content">
            <div className="about-image">
              <img
                src="https://img.freepik.com/free-photo/volunteers-teaming-up-organize-donations-charity_23-2149230524.jpg?w=996"
                alt="Volunteers organizing donations"
                className="rounded-image"
              />
              <div className="about-image-overlay">
                <span>Since 2010</span>
              </div>
            </div>

            <div className="about-text">
              <h3>Our Mission</h3>
              <p>
                We believe in creating sustainable change through compassionate
                action. Our organization is dedicated to addressing the root
                causes of poverty, inequality, and educational gaps in
                underserved communities.
              </p>

              <h3>Our Approach</h3>
              <p>
                We take a holistic approach to community development by
                combining immediate relief with long-term empowerment programs.
                By partnering with local leaders and organizations, we ensure
                culturally appropriate and sustainable solutions.
              </p>

              <div className="values-container">
                <h3>Our Core Values</h3>
                <div className="values-grid">
                  <div className="value-item">
                    <div className="value-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    <h4>Compassion</h4>
                    <p>We act with kindness and empathy in all we do</p>
                  </div>

                  <div className="value-item">
                    <div className="value-icon">
                      <i className="fas fa-handshake"></i>
                    </div>
                    <h4>Integrity</h4>
                    <p>We maintain transparency and ethical standards</p>
                  </div>

                  <div className="value-item">
                    <div className="value-icon">
                      <i className="fas fa-seedling"></i>
                    </div>
                    <h4>Sustainability</h4>
                    <p>We create lasting solutions, not temporary fixes</p>
                  </div>

                  <div className="value-item">
                    <div className="value-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <h4>Community</h4>
                    <p>We believe in the power of people coming together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section" id="impact" ref={impactRef}>
        <div className="container">
          <div className="section-header">
            <h2>Our Impact</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Making a difference that matters</p>
          </div>

          <div className="impact-stats">
            <AnimatedCounter
              value="5,000+"
              title="People Helped"
              icon="fas fa-hands-helping"
            />
            <AnimatedCounter
              value="12"
              title="Communities Served"
              icon="fas fa-globe-americas"
            />
            <AnimatedCounter
              value="15"
              title="Years of Service"
              icon="fas fa-calendar-check"
            />
            <AnimatedCounter
              value="50+"
              title="Ongoing Projects"
              icon="fas fa-project-diagram"
            />
          </div>

          <div className="impact-projects">
            <div className="project-card">
              <div className="project-image">
                <img
                  src="https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Education project"
                />
              </div>
              <div className="project-content">
                <h3>Education First</h3>
                <p>
                  Providing educational resources, scholarships, and mentorship
                  to disadvantaged youth.
                </p>
                <ul className="project-stats">
                  <li>
                    <i className="fas fa-user-graduate"></i> 1,200+ Students
                    Supported
                  </li>
                  <li>
                    <i className="fas fa-book"></i> 15 Schools Built
                  </li>
                </ul>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Water project"
                />
              </div>
              <div className="project-content">
                <h3>Clean Water Initiative</h3>
                <p>
                  Building wells and water purification systems to provide clean
                  drinking water.
                </p>
                <ul className="project-stats">
                  <li>
                    <i className="fas fa-tint"></i> 50+ Wells Constructed
                  </li>
                  <li>
                    <i className="fas fa-users"></i> 3,000+ Lives Improved
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section" id="team" ref={teamRef}>
        <div className="container">
          <div className="section-header">
            <h2>Our Team</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Meet the passionate people behind our mission
            </p>
          </div>

          <div className="team-grid">
            {TEAM_MEMBERS.map((member, index) => (
              <div className="team-member" key={index}>
                <div className="member-image">
                  <img src={member.img} alt={member.name} />
                  <div className="member-social">
                    <a href="#" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <h4>{member.title}</h4>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Voices of Impact</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">What people say about our work</p>
          </div>

          <div className="testimonials-carousel">
            <div
              className="testimonials-track"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <div className="testimonial-card" key={index}>
                  <div className="testimonial-content">
                    <i className="fas fa-quote-left quote-icon"></i>
                    <p>{testimonial.quote}</p>
                    <div className="testimonial-author">
                      <img src={testimonial.avatar} alt={testimonial.author} />
                      <div>
                        <h4>{testimonial.author}</h4>
                        <p>{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${
                    index === activeTestimonial ? "active" : ""
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="donate-section" id="donate" ref={donateRef}>
        <div className="container">
          <div className="section-header">
            <h2>Support Our Cause</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Your generosity powers our mission
            </p>
          </div>

          <div className="donate-container">
            <div className="donate-info">
              <h3>Why Your Support Matters</h3>
              <p>
                Your donation directly funds our programs and initiatives,
                making a tangible difference in the lives of those we serve.
                We're committed to transparency and efficiency, ensuring your
                contribution creates maximum impact.
              </p>

              <div className="donate-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-hand-holding-heart"></i>
                  </div>
                  <div>
                    <h4>Direct Impact</h4>
                    <p>85% of donations go directly to our programs</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div>
                    <h4>Tax Benefits</h4>
                    <p>Donations are tax-deductible where applicable</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h4>Secure Donation</h4>
                    <p>Your information is protected with encryption</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="donate-form-container">
              <div className="donation-plan-toggle">
                <button
                  className={`plan-button ${
                    activePlan === "monthly" ? "active" : ""
                  }`}
                  onClick={() => setActivePlan("monthly")}
                >
                  Monthly Giving
                </button>
                <button
                  className={`plan-button ${
                    activePlan === "one-time" ? "active" : ""
                  }`}
                  onClick={() => setActivePlan("one-time")}
                >
                  One-Time Gift
                </button>
              </div>

              <form className="donate-form" onSubmit={handleDonationSubmit}>
                <div className="donation-amount-options">
                  <h4>Select Amount (EGP)</h4>
                  <div className="amount-buttons">
                    {["50", "100", "200", "500", "custom"].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`amount-button ${
                          donationAmount === amount ? "active" : ""
                        }`}
                        onClick={() => handleDonationAmountChange(amount)}
                      >
                        {amount === "custom" ? "Custom" : `${amount}`}
                      </button>
                    ))}
                  </div>

                  {donationAmount === "custom" && (
                    <div className="custom-amount-input">
                      <label htmlFor="customAmount">Enter amount (EGP)</label>
                      <input
                        type="text"
                        id="customAmount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share why you're donating (optional)"
                    rows="3"
                  ></textarea>
                </div>

                <button type="submit" className="donate-submit-btn">
                  <i className="fas fa-credit-card"></i>
                  Proceed to Payment
                </button>

                <p className="donation-security-note">
                  <i className="fas fa-lock"></i> Your payment information is
                  securely processed
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact" ref={contactRef}>
        <div className="container">
          <div className="section-header">
            <h2>Get in Touch</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">We'd love to hear from you</p>
          </div>

          <div className="contact-container">
            <div className="contact-info">
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Visit Us</h3>
                <p>
                  123 Charity Street
                  <br />
                  Cairo, Egypt 12345
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <h3>Call Us</h3>
                <p>
                  +20 123 456 7890
                  <br />
                  Mon-Fri, 9am-5pm
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email Us</h3>
                <p>
                  info@organizationname.org
                  <br />
                  support@organizationname.org
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-header">
                  <h3>Send Us a Message</h3>
                  <p>We'll get back to you as soon as possible</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">Your Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you"
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
