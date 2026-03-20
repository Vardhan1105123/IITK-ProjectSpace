import React, { useState } from "react";
import Link from "next/link";
import "./Header.css";

interface HeaderProps {
  showEditProfile?: boolean;
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ showEditProfile = false }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="header">
      {/* Logo */}
      <div className="header__logo">
        <img src="/Logo.png" alt="Logo" />
      </div>

      {/* Search Bar */}
      <div className="header__search-wrapper">
        <span className="header__search-icon">
          <SearchIcon />
        </span>
        <input
          type="text"
          className="header__search"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Edit Profile Button */}
      {showEditProfile && (
        <Link href="/profilePage/editProfilePage" className="header__edit-btn">
          Edit Profile
        </Link>
      )}
    </header>
  );
};

export default Header;