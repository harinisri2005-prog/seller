import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <Link to="/vendor/dashboard" className="logo" data-discover="true">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-gold-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-gem"
                    aria-hidden="true"
                >
                    <path d="M10.5 3 8 9l4 13 4-13-2.5-6"></path>
                    <path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"></path>
                    <path d="M2 9h20"></path>
                </svg>
                Project J
            </Link>

            <nav className="header-nav">
                <NavLink
                    to="/vendor/dashboard"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    HOME
                </NavLink>
                <NavLink
                    to="/offers"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    OFFERS
                </NavLink>
                <NavLink
                    to="/regulation"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    REGULATION
                </NavLink>
                <NavLink
                    to="/trending-news"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    TRENDING NEWS
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
