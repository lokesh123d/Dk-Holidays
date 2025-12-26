import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/pages/Insurance.css';

const Insurance = () => {
    const insuranceTypes = [
        {
            icon: 'fa-plane',
            title: 'Travel Insurance',
            description: 'Comprehensive coverage for your domestic and international trips',
            features: [
                'Medical emergencies coverage',
                'Trip cancellation protection',
                'Lost baggage coverage',
                'Flight delay compensation',
                'Emergency evacuation'
            ]
        },
        {
            icon: 'fa-heartbeat',
            title: 'Health Insurance',
            description: 'Complete health protection for you and your family',
            features: [
                'Cashless hospitalization',
                'Pre & post hospitalization',
                'Day care procedures',
                'Ambulance charges',
                'No claim bonus'
            ]
        },
        {
            icon: 'fa-car',
            title: 'Vehicle Insurance',
            description: 'Protect your car and bike with comprehensive coverage',
            features: [
                'Own damage coverage',
                'Third party liability',
                'Personal accident cover',
                'Zero depreciation',
                'Roadside assistance'
            ]
        },
        {
            icon: 'fa-shield-alt',
            title: 'Life Insurance',
            description: 'Secure your family\'s financial future',
            features: [
                'Death benefit coverage',
                'Critical illness rider',
                'Accidental death benefit',
                'Tax benefits',
                'Flexible premium payment'
            ]
        }
    ];

    const handleGetQuote = (insuranceType) => {
        // Redirect to Turtlemint advisor page
        window.open('https://advisor.turtlemintinsurance.com/profile/1343125/manish_kumar', '_blank');
    };

    return (
        <div className="insurance-page">
            <Navbar />

            {/* Hero Section */}
            <section className="insurance-hero">
                <div className="container">
                    <h1>Insurance Services</h1>
                    <p>Comprehensive insurance solutions for complete peace of mind</p>
                    <p className="powered-by">Powered by <strong>Turtlemint Insurance</strong></p>
                </div>
            </section>

            {/* Insurance Advisor Banner */}
            <section className="advisor-banner">
                <div className="container">
                    <div className="advisor-card">
                        <div className="advisor-info">
                            <div className="advisor-icon">
                                <i className="fas fa-user-tie"></i>
                            </div>
                            <div className="advisor-details">
                                <h3>Your Trusted Insurance Advisor</h3>
                                <p className="advisor-name">Manish Kumar</p>
                                <p className="advisor-company">Certified Turtlemint Insurance Advisor</p>
                                <p className="advisor-description">
                                    Get personalized insurance solutions tailored to your needs. Compare plans from top insurers and choose the best coverage for you and your family.
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://advisor.turtlemintinsurance.com/profile/1343125/manish_kumar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="advisor-cta-btn"
                        >
                            <i className="fas fa-external-link-alt"></i>
                            Visit Advisor Profile
                        </a>
                    </div>
                </div>
            </section>

            {/* Insurance Types */}
            <section className="insurance-types">
                <div className="container">
                    <h2 className="section-title">Our Insurance Products</h2>
                    <div className="insurance-grid">
                        {insuranceTypes.map((insurance, index) => (
                            <div key={index} className="insurance-card">
                                <div className="insurance-icon">
                                    <i className={`fas ${insurance.icon}`}></i>
                                </div>
                                <h3>{insurance.title}</h3>
                                <p className="insurance-description">{insurance.description}</p>
                                <ul className="insurance-features">
                                    {insurance.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <i className="fas fa-check-circle"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="get-quote-btn"
                                    onClick={() => handleGetQuote(insurance.title)}
                                >
                                    Get Quote
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Our Insurance */}
            <section className="why-insurance">
                <div className="container">
                    <h2 className="section-title">Why Choose Our Insurance Services?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <i className="fas fa-hand-holding-usd"></i>
                            <h3>Best Premiums</h3>
                            <p>Competitive rates with maximum coverage benefits</p>
                        </div>
                        <div className="benefit-card">
                            <i className="fas fa-file-alt"></i>
                            <h3>Quick Claims</h3>
                            <p>Fast and hassle-free claim settlement process</p>
                        </div>
                        <div className="benefit-card">
                            <i className="fas fa-headset"></i>
                            <h3>Expert Support</h3>
                            <p>Dedicated insurance advisors for guidance</p>
                        </div>
                        <div className="benefit-card">
                            <i className="fas fa-chart-line"></i>
                            <h3>Flexible Plans</h3>
                            <p>Customized insurance plans to suit your needs</p>
                        </div>
                        <div className="benefit-card">
                            <i className="fas fa-shield-check"></i>
                            <h3>Trusted Partners</h3>
                            <p>Leading insurance providers in India</p>
                        </div>
                        <div className="benefit-card">
                            <i className="fas fa-mobile-alt"></i>
                            <h3>Easy Process</h3>
                            <p>Simple online application and policy management</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Visit Advisor Page</h3>
                            <p>Click on "Visit Advisor Profile" to access our insurance advisor's page</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Compare Plans</h3>
                            <p>Browse and compare insurance plans from multiple providers</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Get Quote</h3>
                            <p>Receive personalized quotes based on your requirements</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Buy Policy</h3>
                            <p>Complete your purchase online and get instant policy confirmation</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="insurance-cta">
                <div className="container">
                    <h2>Ready to Get Insured?</h2>
                    <p>Speak with our certified insurance advisor for personalized recommendations</p>
                    <div className="cta-buttons">
                        <a
                            href="https://advisor.turtlemintinsurance.com/profile/1343125/manish_kumar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            <i className="fas fa-shield-alt"></i> Get Insurance Quote
                        </a>
                        <a href="/contact" className="btn-secondary">
                            <i className="fas fa-phone"></i> Contact Us
                        </a>
                        <a href="https://wa.me/919178212412" className="btn-whatsapp">
                            <i className="fab fa-whatsapp"></i> Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Insurance;
