import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import "./About.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";

// Timeline data
const TIMELINE_EVENTS = [
  {
    year: "2010",
    title: "Our Beginning",
    description:
      "Founded with a vision to create sustainable change in communities across Egypt.",
  },
  {
    year: "2013",
    title: "First Major Project",
    description:
      "Launched our clean water initiative, bringing safe drinking water to 5 rural villages.",
  },
  {
    year: "2016",
    title: "National Recognition",
    description:
      "Received the National Community Service Award for our educational programs.",
  },
  {
    year: "2019",
    title: "International Expansion",
    description:
      "Extended our reach to neighboring countries, helping communities in crisis.",
  },
  {
    year: "2022",
    title: "Technology Initiative",
    description:
      "Introduced digital literacy programs to bridge the technological divide.",
  },
  {
    year: "2025",
    title: "15 Years of Impact",
    description:
      "Celebrating a milestone of helping over 50,000 individuals across 20+ communities.",
  },
];

// Team data
const TEAM_MEMBERS = [
  {
    name: "Reem Hussein",
    title: "Executive Director",
    bio: "With over 12 years of experience in nonprofit management, Reem leads our organization with vision and compassion.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Freem.jpeg?alt=media&token=82155e3d-6492-42c9-8b99-b6aebd394cc7",
  },
  {
    name: "Seif Ebeid",
    title: "Operations Manager",
    bio: "Seif oversees our day-to-day operations, ensuring our programs run efficiently and effectively.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fseif.jpeg?alt=media&token=bfc5ef87-efb0-41ce-bfcc-f69c47d32a08",
  },
  {
    name: "John Maged",
    title: "Program Director",
    bio: "John designs and implements our community initiatives with a focus on sustainable development.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fjohn.JPEG?alt=media&token=5d6f6886-2532-4824-b5ee-f813bf91285e",
  },
  {
    name: "Cherine Hassan",
    title: "Outreach Coordinator",
    bio: "Cherine builds partnerships with communities and organizations to expand our impact.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fcherine.jpeg?alt=media&token=850aadfe-50f0-4a18-9c65-c562442e6db8",
  },
  {
    name: "Mayar Fathi",
    title: "Marketing Specialist",
    bio: "Mayar brings our stories to life, raising awareness and inspiring others to join our cause.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2Fmayar.jpeg?alt=media&token=9cc4c87a-da05-4bdb-aa99-7cdf8ad5e131",
  },
  {
    name: "Abdullah Nagy",
    title: "Financial Officer",
    bio: "Abdullah ensures fiscal responsibility and transparency in all our operations.",
    img: "https://firebasestorage.googleapis.com/v0/b/readspace-b5434.appspot.com/o/pic%2FAbdullah.jpeg?alt=media&token=0995399d-643b-4372-a590-236c1c463d9e",
  },
];

// Partners data
const PARTNERS = [
  {
    name: "Global Health Initiative",
    logo: "https://img.freepik.com/free-vector/abstract-logo-flame-shape_1043-44.jpg?w=200&t=st=1684389510~exp=1684390110~hmac=22e19b5eee2f4b39bfd5ce4c5f6d9f875d5a7727776e25fdc54b5247f1d63e9a",
  },
  {
    name: "EduForward Foundation",
    logo: "https://img.freepik.com/free-vector/gradient-education-logo_23-2149482360.jpg?w=200&t=st=1684389557~exp=1684390157~hmac=1fc2b2a1250dbcf3bd9f5034c1d3558a22b52838ac4e1d4e6a94bd6364f31748",
  },
  {
    name: "Community Builders Alliance",
    logo: "https://img.freepik.com/free-vector/gradient-community-logo_23-2149729127.jpg?w=200&t=st=1684389585~exp=1684390185~hmac=2e0159a2e3d9add8fb869d0a8f4cc23428e07b1bb328a0f3f4914b2ad3f07e96",
  },
  {
    name: "Sustainable Future NGO",
    logo: "https://img.freepik.com/free-vector/ecology-logo-green-energy-icon-lightning-bolt-with-leaf-power-electricity-eco-friendly-concept_53562-14918.jpg?w=200&t=st=1684389621~exp=1684390221~hmac=40423fe80624c51a678e2d1f05aad897a63291b39d7d37c0f9219ef796a07a8d",
  },
  {
    name: "Youth Development Fund",
    logo: "https://img.freepik.com/free-vector/flat-design-youth-day-logo_23-2149451794.jpg?w=200&t=st=1684389649~exp=1684390249~hmac=cf99b2c4f74afb2c5f4fc0b3abcf806a14ce3dd6f1c3cef3ece9fcc9c34d7bba",
  },
  {
    name: "Clean Water Project",
    logo: "https://img.freepik.com/free-vector/water-drop-logo-template_23-2147618165.jpg?w=200&t=st=1684389684~exp=1684390284~hmac=e66be51aa4e01ec8d1d634d02fc9e9ae5f9eb2f01b0cb3a82ee5eba0613c9d12",
  },
];

// Animated section component
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function AboutPage() {
  // Implement smooth scrolling
  useEffect(() => {
    // Smooth scroll function
    const smoothScroll = (target) => {
      const element = document.querySelector(target);
      if (!element) return;

      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for header
        behavior: "smooth",
      });
    };

    // Add event listeners to all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href");
        smoothScroll(target);
      });
    });

    return () => {
      // Cleanup event listeners
      links.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <div className="about-page">
      <Header activePage={"about"} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            About <span className="highlight">Our Mission</span>
          </h1>
          <p>
            Learn about our journey, our team, and the impact we're making
            together.
          </p>
          <div className="hero-buttons">
            <a href="#mission" className="btn-primary">
              Our Mission
            </a>
            <a href="#team" className="btn-secondary">
              Meet Our Team
            </a>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <AnimatedSection className="mission-section" id="mission">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Purpose</span>
            <h2>Mission & Vision</h2>
            <div className="section-divider"></div>
          </div>

          <div className="mission-content">
            <div className="mission-image">
              <img
                src="https://img.freepik.com/free-photo/people-stacking-hands-together-park_53876-63292.jpg?w=740&t=st=1684386801~exp=1684387401~hmac=f483b3e9b4c4c41ac369058f97cb58c603c145b80c0a07593003a4bb83fa2a5d"
                alt="Team collaboration"
              />
            </div>

            <div className="mission-text">
              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                  We are dedicated to empowering communities through sustainable
                  development, education, and humanitarian assistance. We
                  believe in creating lasting solutions that address the root
                  causes of poverty and inequality.
                </p>
              </div>

              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                  We envision a world where all communities have the resources,
                  opportunities, and support they need to thrive. A world where
                  equality, justice, and sustainability are the foundation of
                  society.
                </p>
              </div>

              <div className="mission-stats">
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Years of Service</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">20+</span>
                  <span className="stat-label">Communities</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Lives Improved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Story/Timeline Section */}
      <AnimatedSection className="story-section" id="story">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Journey</span>
            <h2>Our Story</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              From humble beginnings to lasting impact
            </p>
          </div>

          <div className="timeline">
            {TIMELINE_EVENTS.map((event, index) => (
              <motion.div
                className="timeline-item"
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{event.year}</div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection className="values-section" id="values">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Foundation</span>
            <h2>Core Values</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              The principles that guide our work
            </p>
          </div>

          <div className="values-grid">
            <motion.div
              className="value-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Compassion</h3>
              <p>
                We act with empathy and understanding, recognizing the dignity
                and potential in every person.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Integrity</h3>
              <p>
                We uphold the highest ethical standards, with transparency and
                accountability in all our actions.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="value-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Sustainability</h3>
              <p>
                We create solutions that endure, respecting our environment and
                building long-term resilience.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>
                We believe in the power of people coming together, fostering
                collaboration and mutual support.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>
                We embrace creativity and new approaches, adapting to challenges
                with resourcefulness.
              </p>
            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="value-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>Inclusivity</h3>
              <p>
                We celebrate diversity and ensure our work respects and benefits
                people of all backgrounds.
              </p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Team Section */}
      <AnimatedSection className="team-section" id="team">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our People</span>
            <h2>Leadership Team</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">
              Meet the dedicated individuals driving our mission forward
            </p>
          </div>

          <div className="team-grid">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                className="team-card"
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="member-photo">
                  <img src={member.img} alt={member.name} />
                  <div className="member-social">
                    <a href="#" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" aria-label="Email">
                      <i className="fas fa-envelope"></i>
                    </a>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <span className="member-title">{member.title}</span>
                  <p>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="team-cta">
            <p>Interested in joining our team?</p>
            <a href="#" className="btn-primary">
              View Open Positions
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* Impact Section */}
      <AnimatedSection className="impact-section" id="impact">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Achievements</span>
            <h2>Our Impact</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Measuring what matters</p>
          </div>

          <div className="impact-content">
            <div className="impact-image">
              <img
                src="https://img.freepik.com/free-photo/young-group-volunteers-outdoors_23-2149048223.jpg?w=740&t=st=1684387555~exp=1684388155~hmac=56a42920336cc8b5c6e2e79bc86d53dd11b9ec0cbfd090da75eed489307e3a83"
                alt="Volunteers working"
              />
            </div>

            <div className="impact-stats">
              <motion.div
                className="impact-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="stat-icon">
                  <i className="fas fa-home"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-number">250+</span>
                  <span className="stat-label">Homes Built</span>
                  <p>
                    Providing safe and dignified housing for families in need.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="impact-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="stat-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-number">5,000+</span>
                  <span className="stat-label">Students Educated</span>
                  <p>
                    Supporting educational opportunities from primary to
                    university level.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="impact-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="stat-icon">
                  <i className="fas fa-tint"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-number">35+</span>
                  <span className="stat-label">Water Projects</span>
                  <p>
                    Bringing clean, safe drinking water to communities in need.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="impact-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="stat-icon">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-number">12,000+</span>
                  <span className="stat-label">Medical Treatments</span>
                  <p>
                    Providing essential healthcare services to underserved
                    populations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="impact-map">
            <h3>Where We Work</h3>
            <p>
              Our projects span across Egypt and neighboring countries, focusing
              on areas with the greatest need.
            </p>
            <img
              src="https://img.freepik.com/free-vector/egypt-map-concept_23-2147768936.jpg?w=740&t=st=1684387709~exp=1684388309~hmac=8c99c7e0fd5cf407e28bde85ce48335ea2dc5e0ca3220e1ef38dcbf5c70310c7"
              alt="Map of project locations"
              className="map-image"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Partners Section */}
      <AnimatedSection className="partners-section" id="partners">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Collaborators</span>
            <h2>Strategic Partners</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Together, we achieve more</p>
          </div>

          <div className="partners-grid">
            {PARTNERS.map((partner, index) => (
              <motion.div
                className="partner-card"
                key={index}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={partner.logo} alt={partner.name} />
                <h3>{partner.name}</h3>
              </motion.div>
            ))}
          </div>

          <div className="partners-quote">
            <blockquote>
              <i className="fas fa-quote-left"></i>
              <p>
                Our partners are essential to our success. Through
                collaboration, we multiply our impact and reach communities that
                might otherwise be left behind.
              </p>
              <cite>— Reem Hussein, Executive Director</cite>
            </blockquote>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="cta-section">
        <div className="container">
          <div className="cta-content">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Join Our Mission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Together, we can create lasting change. There are many ways to get
              involved and support our work.
            </motion.p>
            <motion.div
              className="cta-buttons"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <a href="/donate" className="btn-primary">
                Donate Now
              </a>
              <a href="/volunteer" className="btn-secondary">
                Volunteer
              </a>
              <a href="/contact" className="btn-tertiary">
                Contact Us
              </a>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
