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
          el.classList.add("revealed");
        }
      });
    }
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <>
      <Header activePage={"causes"} />
      <div className="causes-hero">
        <div className="causes-hero-overlay" />
        <div className="causes-hero-content">
          <h1>
            Make a <span className="brand-accent">Difference</span> Today
          </h1>
          <p>
            Explore featured causes and bring positive change to communities in
            need.
          </p>
        </div>
      </div>
      <main>
        <section
          id="featured-causes"
          className="featured-causes scroll-reveal"
          ref={featuredRef}
        >
          <div className="container">
            <div className="section-header">
              <h2>
                <span className="brand-accent">
                  <i className="fas fa-star"></i>
                </span>{" "}
                Featured Causes
              </h2>
              <div className="underline"></div>
              <p className="section-desc">
                Discover worthy causes that need your support
              </p>
            </div>
            <div className="cause-grid">
              {loading ? (
                <div className="empty-state">
                  <i className="fas fa-spinner fa-spin empty-icon"></i>
                  <h3>Loading Causes...</h3>
                </div>
              ) : error ? (
                <div className="empty-state">
                  <i className="fas fa-exclamation-circle empty-icon"></i>
                  <h3>Failed to load causes</h3>
                  <p>{error}</p>
                </div>
              ) : causes && causes.length ? (
                causes.map((cause) => (
                  <div
                    className={
                      "cause-card modern-shadow" +
                      (cause.featured ? " cause-card-featured" : "")
                    }
                    key={cause.id}
                  >
                    <div className="cause-image modern-image">
                      <img src={cause.imageUrl} alt="cause" />
                      <div className="cause-category badge-pill">
                        <span>
                          <i className="fas fa-tag"></i> {cause.category}
                        </span>
                      </div>
                      {cause.featured && (
                        <div className="cause-badge-featured">
                          <i className="fas fa-star"></i> Featured
                        </div>
                      )}
                    </div>
                    <div className="cause-content">
                      <h3 className="cause-title">{cause.title}</h3>
                      <p className="cause-description">
                        {cause.shortDescription}
                      </p>
                      <div className="cause-progress-wrap">
                        <div className="progress-stats">
                          <span className="amount-raised">
                            {cause.currency}{" "}
                            {cause.raisedAmount.toLocaleString()} raised
                          </span>
                          <span className="goal-amount">
                            of {cause.currency}{" "}
                            {cause.goalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="progress-bar-container gradient-bar">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${cause.progressPercentage}%`,
                              background:
                                "linear-gradient(90deg, #7fbbff 0%, #4361ee 100%)",
                            }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          <span>
                            {Number(cause.progressPercentage).toFixed(1)}%
                            Complete
                          </span>
                        </div>
                      </div>
                      <div className="cause-footer-modern">
                        <div className="cause-meta">
                          <span>
                            <i className="far fa-calendar-alt"></i> Ends:{" "}
                            {cause.endDate}
                          </span>
                          <span>
                            <i className="fas fa-users"></i> {cause.donorCount}{" "}
                            Donors
                          </span>
                        </div>
                        {user ? (
                          <a
                            href={`causesdetails?causeId=${cause.id}`}
                            className="btn btn-donate-modern"
                          >
                            <i className="fas fa-heart"></i> Donate
                          </a>
                        ) : (
                          <div className="login-prompt">
                            <a href="/auth" className="btn btn-outline-modern">
                              <i className="fas fa-lock"></i> Login to Donate
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-hands-helping empty-icon"></i>
                  <h3>No Causes Available</h3>
                  <p>
                    There are no featured causes at the moment. Please check
                    back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="why-donate scroll-reveal" ref={whyDonateRef}>
          <div className="container">
            <div className="section-header">
              <h2>
                <i className="fas fa-question-circle brand-accent"></i> Why
                Donate With Us
              </h2>
              <div className="underline"></div>
            </div>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon gradient-bg">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure Donations</h3>
                <p>
                  All transactions are encrypted and secure. Your financial
                  information is never compromised.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon gradient-bg">
                  <i className="fas fa-hand-holding-usd"></i>
                </div>
                <h3>Transparent Funding</h3>
                <p>
                  Track where your money goes with regular updates and detailed
                  impact reports.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon gradient-bg">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>Verified Causes</h3>
                <p>
                  We carefully vet every cause to ensure your donation makes a
                  real difference.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon gradient-bg">
                  <i className="fas fa-globe"></i>
                </div>
                <h3>Global Impact</h3>
                <p>
                  Support causes locally or internationally and help create
                  worldwide change.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default FeaturedCauses;
