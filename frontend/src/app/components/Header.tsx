import React, { useState } from "react";
import Link from "next/link";
import "./Header.css";

interface HeaderProps {
  showEditProfile?: boolean;
  editHref?: string;
  editLabel?: string;
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ showEditProfile = false, editHref, editLabel = "Edit" }) => {
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

      {/* Profile page edit button */}
      {showEditProfile && (
        <Link href="/profilePage/editProfilePage" className="header__edit-btn">
          Edit Profile
        </Link>
      )}

      {/* edit button for project / recruitment pages */}
      {editHref && (
        <Link href={editHref} className="header__edit-btn">
          {editLabel}
        </Link>
      )}
    </header>
  );
};

export default Header;