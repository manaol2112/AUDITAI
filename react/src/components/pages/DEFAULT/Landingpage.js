import React, { useState } from 'react';
import logo from '../../../../src/assets/images/logo.jpeg';
import './css.css';

const LandingPage = () => {
    const [email, setEmail] = useState('');  // State to store the email input value

    // Handle input change
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Handle form submission (to be implemented further for real backend handling)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            console.log('User email:', email);  // For now, we just log the email
            // Here you would typically send the email to your server or API
        }
    };

    return (
        
        <div className="landing-page">
            {/* Header Section */}
            <header className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <div className="logo">
                        <a href="/" className="navbar-logo">
                            <img 
                                src={logo} 
                                width="40" 
                                height="40" 
                                className="d-inline-block align-top" 
                                alt="Audit-AI logo" 
                            />
                            <span className="logo-text">Audit-AI</span>
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <nav className="nav-links">
                        <ul>
                            <li><a href="/solutions">Updates</a></li>
                            <li><a href="/solutions">Resources</a></li>
                            <li><a href="/resources">Contact Us</a></li>
                        </ul>
                    </nav>

                    {/* Call to Action (CTA) Buttons */}
                    <div className="cta-buttons">
                        <a href="/request-demo" className="btn">Join Waitlist</a>
                        <a href="/login" className="btn">Login</a>
                    </div>
                </div>
            </header>

            {/* Main Content Section (Slogan and Description) */}
            <section className="main-content">
                <div className="content-container">
                    <h1 className="slogan">Compliance Made Easy. Audits Made Smarter.</h1>
                    
                    <p className="description">
                    Empower your IT, compliance, and audit teams with automated workflows, turning data into actionable insights. Stay ahead of compliance requirements and effortlessly maintain audit readiness, all with just a very few clicks.
                    </p>
                    
                    {/* Waitlist Form */}
                    <form onSubmit={handleSubmit} className="waitlist-form">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={email} 
                            onChange={handleEmailChange} 
                            className="email-input"
                            required
                        />
                        <button type="submit" className="cta-btn">Join Waitlist</button>
                    </form>

                    {/* Additional Encouragement Below Form */}
                    <p className="description">
                        By joining the waitlist, you'll get early access to exclusive features and updates. Don't miss out!
                    </p>
                </div>


            </section>
        </div>
    );
}

export default LandingPage;
