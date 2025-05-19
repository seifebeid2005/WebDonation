import React, { useEffect, useRef, useState } from "react";
import "./CausesPage.css";
import Header from "../../shared/Header/Header";
import Footer from "../../shared/Footer/Footer";
import { getAllCauses } from "../../../functions/user/causes";

function FeaturedCauses({ user }) {
  const featuredRef = useRef(null);
  const whyDonateRef = useRef(null);

  // Dynamic state for causes
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch causes from backend
    async function fetchCauses() {
      setLoading(true);
      setError("");
      try {
        const data = await getAllCauses();
        // Map backend fields to UI fields if needed
        const mapped = (data || []).map((c) => ({
          id: Number(c.id),
          title: c.title,
          shortDescription:
            c.short_description ||
            c.shortDescription ||
            c.description?.substring(0, 120) ||
            "",
          category: c.category,
          imageUrl: c.image_url,
          currency: c.currency || "USD",
          raisedAmount: Number(c.raised_amount || 0),
          goalAmount: Number(c.goal_amount || 0),
          progressPercentage:
            c.goal_amount > 0
              ? Math.min(100, (c.raised_amount / c.goal_amount) * 100)
              : 0,
          endDate: c.end_date,
          donorCount: c.donor_count || 0,
          featured:
            c.is_featured === "1" || c.is_featured === 1 || c.featured === true,
        }));
        setCauses(mapped);
      } catch (err) {
        setError(err.message || "Failed to load causes.");
      }
      setLoading(false);
    }
    fetchCauses();
  }, []);

  useEffect(() => {
    const revealElements = [featuredRef.current, whyDonateRef.current].filter(
      Boolean
    );
    function revealOnScroll() {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 100) {
          el.classList.add("fc-revealed");
        }
      });
    }
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <div className="fc-page">
      <Header activePage={"causes"} user={user} />

      <div className="fc-hero">
        <div className="fc-hero__overlay" />
        <div className="fc-hero__content">
          <h1 className="fc-hero__title">
            Make a <span className="fc-accent">Difference</span> Today
          </h1>
          <p className="fc-hero__subtitle">
            Explore featured causes and bring positive change to communities in
            need.
          </p>
          <a href="#featured-causes" className="fc-btn fc-btn--primary">
            Explore Causes
          </a>
        </div>
      </div>

      <main className="fc-main">
        <section
          id="featured-causes"
          className="fc-section fc-section--featured fc-scroll-reveal"
          ref={featuredRef}
        >
          <div className="fc-container">
            <div className="fc-section__header">
              <h2 className="fc-section__title">
                <span className="fc-accent">
                  <i className="fas fa-star"></i>
                </span>{" "}
                Featured Causes
              </h2>
              <div className="fc-underline"></div>
              <p className="fc-section__desc">
                Discover worthy causes that need your support
              </p>
            </div>

            <div className="fc-cause-grid">
              {loading ? (
                <div className="fc-empty-state">
                  <div className="fc-loader">
                    <div className="fc-loader__spinner"></div>
                  </div>
                  <h3 className="fc-empty-state__title">Loading Causes...</h3>
                </div>
              ) : error ? (
                <div className="fc-empty-state">
                  <i className="fas fa-exclamation-circle fc-empty-state__icon"></i>
                  <h3 className="fc-empty-state__title">
                    Failed to load causes
                  </h3>
                  <p className="fc-empty-state__message">{error}</p>
                </div>
              ) : causes && causes.length ? (
                causes.map((cause) => (
                  <div
                    className={`fc-cause-card ${
                      cause.featured ? "fc-cause-card--featured" : ""
                    }`}
                    key={cause.id}
                  >
                    <div className="fc-cause-card__image-wrapper">
                      <img
                        src={cause.imageUrl}
                        alt={cause.title}
                        className="fc-cause-card__image"
                      />
                      <div className="fc-cause-card__category">
                        <span>
                          <i className="fas fa-tag"></i> {cause.category}
                        </span>
                      </div>
                      {cause.featured && (
                        <div className="fc-cause-card__featured-badge">
                          <i className="fas fa-star"></i> Featured
                        </div>
                      )}
                    </div>

                    <div className="fc-cause-card__content">
                      <h3 className="fc-cause-card__title">{cause.title}</h3>
                      <p className="fc-cause-card__description">
                        {cause.shortDescription}
                      </p>

                      <div className="fc-progress">
                        <div className="fc-progress__stats">
                          <span className="fc-progress__raised">
                            {cause.currency}{" "}
                            {cause.raisedAmount.toLocaleString()} raised
                          </span>
                          <span className="fc-progress__goal">
                            of {cause.currency}{" "}
                            {cause.goalAmount.toLocaleString()}
                          </span>
                        </div>

                        <div className="fc-progress__bar-container">
                          <div
                            className="fc-progress__bar"
                            style={{
                              width: `${cause.progressPercentage}%`,
                            }}
                          ></div>
                        </div>

                        <div className="fc-progress__percentage">
                          <span>
                            {Number(cause.progressPercentage).toFixed(1)}%
                            Complete
                          </span>
                        </div>
                      </div>

                      <div className="fc-cause-card__footer">
                        <div className="fc-cause-card__meta">
                          <span className="fc-cause-card__date">
                            <i className="far fa-calendar-alt"></i> Ends:{" "}
                            {cause.endDate}
                          </span>
                          <span className="fc-cause-card__donors">
                            <i className="fas fa-users"></i> {cause.donorCount}{" "}
                            Donors
                          </span>
                        </div>

                        {user ? (
                          <a
                            href={`causesdetails?causeId=${cause.id}`}
                            className="fc-btn fc-btn--donate"
                          >
                            <i className="fas fa-heart"></i> Donate Now
                          </a>
                        ) : (
                          <div className="fc-login-prompt">
                            <a href="/login" className="fc-btn fc-btn--outline">
                              <i className="fas fa-lock"></i> Login to Donate
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="fc-empty-state">
                  <i className="fas fa-hands-helping fc-empty-state__icon"></i>
                  <h3 className="fc-empty-state__title">No Causes Available</h3>
                  <p className="fc-empty-state__message">
                    There are no featured causes at the moment. Please check
                    back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          className="fc-section fc-section--why-donate fc-scroll-reveal"
          ref={whyDonateRef}
        >
          <div className="fc-container">
            <div className="fc-section__header">
              <h2 className="fc-section__title">
                <i className="fas fa-question-circle fc-accent"></i> Why Donate
                With Us
              </h2>
              <div className="fc-underline"></div>
              <p className="fc-section__desc">
                Join thousands of donors making a difference through our trusted
                platform
              </p>
            </div>

            <div className="fc-benefits-grid">
              <div className="fc-benefit-card">
                <div className="fc-benefit-card__icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="fc-benefit-card__title">Secure Donations</h3>
                <p className="fc-benefit-card__desc">
                  All transactions are encrypted and secure. Your financial
                  information is never compromised.
                </p>
              </div>

              <div className="fc-benefit-card">
                <div className="fc-benefit-card__icon">
                  <i className="fas fa-hand-holding-usd"></i>
                </div>
                <h3 className="fc-benefit-card__title">Transparent Funding</h3>
                <p className="fc-benefit-card__desc">
                  Track where your money goes with regular updates and detailed
                  impact reports.
                </p>
              </div>

              <div className="fc-benefit-card">
                <div className="fc-benefit-card__icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="fc-benefit-card__title">Verified Causes</h3>
                <p className="fc-benefit-card__desc">
                  We carefully vet every cause to ensure your donation makes a
                  real difference.
                </p>
              </div>

              <div className="fc-benefit-card">
                <div className="fc-benefit-card__icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h3 className="fc-benefit-card__title">Global Impact</h3>
                <p className="fc-benefit-card__desc">
                  Support causes locally or internationally and help create
                  worldwide change.
                </p>
              </div>
            </div>

            <div className="fc-cta">
              <h3 className="fc-cta__title">Ready to make a difference?</h3>
              <a
                href="#featured-causes"
                className="fc-btn fc-btn--primary fc-btn--large"
              >
                Start Donating Today
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FeaturedCauses;
