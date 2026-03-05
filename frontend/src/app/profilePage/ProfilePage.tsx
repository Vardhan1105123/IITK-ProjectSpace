import React, { useState } from "react";
import "./ProfilePage.css";
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

{/* Reusable icon components */}
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const ScholarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const RecruitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ProjectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

{/* Types */}
type TabType = "recruitment" | "project";

interface CardData {
  id: string;
  title: string;
  author: string;
  role: string;
  tags: string[];
  prerequisites: string;
}

const CARDS: CardData[] = [
  {
    id: "1",
    title: "Generative AI For Healthcare Applications",
    author: "Alice Myers",
    role: "PhD Student",
    tags: ["Generative AI", "LLMs", "Agentic AI"],
    prerequisites: "Python, Natural Language Processing (introductory level)",
  },
  {
    id: "2",
    title: "Computer Vision in Autonomous Systems",
    author: "Alice Myers",
    role: "PhD Student",
    tags: ["Computer Vision", "Deep Learning", "ROS"],
    prerequisites: "Python, Linear Algebra, Basic ML",
  },
];

{/* PROFILE PAGE */}
const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("recruitment");

  return (
    <div className="app-shell">
          <Header onEditProfile={() => console.log("edit clicked")} />

      <div className="app-body">
            <Sidebar defaultActive="profile" />

        {/* Main scrollable content */}
        <main className="profile-page">
          <section className="profile-card" aria-label="User profile">
            <div className="profile-card__top">

              {/* Avatar */}
              <div className="profile-card__avatar-wrap">
                <div className="profile-card__avatar">
                  {/* replace with profile picture of the user */}
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="profile-card__avatar-svg">
                    <rect width="80" height="80" rx="12" fill="#1a3a5c" />
                    <circle cx="40" cy="28" r="14" fill="#49769F" />
                    <ellipse cx="40" cy="68" rx="24" ry="18" fill="#49769F" />
                  </svg>
                </div>
              </div>

              {/* Identity — must be replaced while wiring with the user information */}
              <div className="profile-card__identity">
                <h1 className="profile-card__name">Alice Myers</h1>
                <p className="profile-card__email">alicem26@iitk.ac.in</p>
                <p className="profile-card__role">PhD Student</p>
                <p className="profile-card__dept">Intelligent Systems</p>
                <p className="profile-card__inst">Indian Institute of Technology Kanpur</p>
              </div>

              {/* Social links */}
              <div className="profile-card__links">
                <a href="#" className="profile-card__link" aria-label="LinkedIn">
                  <LinkedInIcon /> LinkedIn
                </a>
                <a href="#" className="profile-card__link" aria-label="Google Scholar">
                  <ScholarIcon /> Google Scholar
                </a>
                <a href="#" className="profile-card__link" aria-label="GitHub">
                  <GitHubIcon /> GitHub
                </a>
              </div>
            </div>

            {/* Skills + Bio */}
            <div className="skills-bio">
              <div className="skills-bio__skills-row">
                <span className="skills-bio__label">SKILLS</span>
                <span className="skills-bio__tag skills-bio__tag--teal">Machine Learning</span>
                <span className="skills-bio__tag skills-bio__tag--blue">Computer Vision</span>
                <span className="skills-bio__tag skills-bio__tag--red">Python</span>
              </div>
              <p className="skills-bio__bio">
                Currently pursuing a PhD in Intelligent Systems at IIT Kanpur. My work bridges
                the gap between theoretical machine learning and real-world computer vision
                applications. I have published papers on object detection in low-light
                environments and am an active contributor to several open-source CV libraries
                on GitHub. Passionate about teaching and mentoring undergraduates.
              </p>
            </div>

          </section>

          {/* Tabs */}
          <div className="tabs" role="tablist" aria-label="Content sections">
            <button
              role="tab"
              aria-selected={activeTab === "recruitment"}
              className={`tabs__btn${activeTab === "recruitment" ? " tabs__btn--active" : ""}`}
              onClick={() => setActiveTab("recruitment")}
            >
              <RecruitIcon /> Recruitment
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "project"}
              className={`tabs__btn${activeTab === "project" ? " tabs__btn--active" : ""}`}
              onClick={() => setActiveTab("project")}
            >
              <ProjectIcon /> Project
            </button>
          </div>

          {/* Cards grid */}
          <div className="cards-grid" role="tabpanel">
            {CARDS.map((card) => (
              <article key={card.id} className="post-card">
                <h2 className="post-card__title">{card.title}</h2>
                <div className="post-card__divider" />
                <p className="post-card__author">
                  <strong>{card.author}</strong>, {card.role}
                </p>
                <div className="post-card__tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="post-card__tag">{tag}</span>
                  ))}
                </div>
                <p className="post-card__prereq">
                  <span className="post-card__prereq-label">Prerequisites: </span>
                  {card.prerequisites}
                </p>
              </article>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default ProfilePage;