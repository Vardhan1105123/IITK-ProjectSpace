"use client";

import React, { useState, useEffect, useRef } from "react";
import "./homePage.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import { getAllProjects, getProjectCount, ProjectSummary } from "@/lib/projectApi";
import { getAllRecruitments, getRecruitmentCount, RecruitmentSummary } from "@/lib/recruitmentApi";

/* Types */
export interface FeedMember {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface ProjectFeedItem {
  id: string;
  title: string;
  description: string;
  media_urls: string[];
  creator_name: string;
  creator_role?: string;
  creator_avatar_url?: string;
  institution?: string;
  time_ago: string;
  other_count: number;
  team_members: FeedMember[];
}

export interface RecruitmentFeedItem {
  id: string;
  title: string;
  description: string;
  media_urls: string[];
  status: "Open" | "Closed";
  creator_name: string;
  creator_role?: string;
  creator_avatar_url?: string;
  institution?: string;
  time_ago: string;
  other_count: number;
  team_members: FeedMember[];
}

/* Helpers */
function chunkPairs<T>(arr: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    rows.push(arr.slice(i, i + 2));
  }
  return rows;
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const getFullUrl = (url?: string) => url ? (url.startsWith("http") ? url : `${API_BASE_URL}${url}`) : undefined;

function mapProjectToFeedItem(p: ProjectSummary): ProjectFeedItem {
  return {
    id: p.id,
    title: p.title,
    description: p.summary,
    media_urls: p.media_urls ? p.media_urls.map(url => getFullUrl(url) as string) : [],
    creator_name: p.creator_name,
    creator_avatar_url: getFullUrl(p.creator_avatar_url ?? undefined),
    institution: "IIT Kanpur",
    time_ago: timeAgo(p.created_at),
    other_count: 0,
    team_members: p.team_members?.map(m => ({ id: m.id, name: m.fullname, avatar_url: getFullUrl(m.profile_picture_url) })) || [],
  };
}

function mapRecruitmentToFeedItem(r: RecruitmentSummary): RecruitmentFeedItem {
  return {
    id: r.id,
    title: r.title,
    description: r.domains.join(", ") || "Open recruitment",
    media_urls: r.media_urls ? r.media_urls.map(url => getFullUrl(url) as string) : [],
    status: r.status,
    creator_name: r.creator_name,
    creator_avatar_url: getFullUrl(r.creator_avatar_url ?? undefined),
    institution: "IIT Kanpur",
    time_ago: timeAgo(r.created_at),
    other_count: 0,
    team_members: r.recruiters?.map(m => ({ id: m.id, name: m.fullname, avatar_url: getFullUrl(m.profile_picture_url) })) || [],
  };
}

/* Pagination helpers */
function buildPageSequence(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];

  const addRange = (from: number, to: number) => {
    for (let i = from; i <= to; i++) pages.push(i);
  };

  pages.push(1);

  if (current <= 4) {
    addRange(2, 5);
    pages.push("…");
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push("…");
    addRange(total - 4, total);
  } else {
    pages.push("…");
    addRange(current - 1, current + 1);
    pages.push("…");
    pages.push(total);
  }

  return pages;
}

/* Team Panel */
const TeamPanel: React.FC<{ members: FeedMember[] }> = ({ members }) => (
  <div className="feed-team-panel">
    <div className="feed-team-label">Team Members</div>
    <div className="feed-team-list">
      {members.length === 0 ? (
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>—</span>
      ) : (
        members.map((m, i) => (
          <div key={m.id} className="feed-team-chip">
            <div className={`feed-member-avatar c${(i % 6) + 1}`}>
              {m.avatar_url ? <img src={m.avatar_url} alt={m.name} /> : getInitials(m.name)}
            </div>
            <span className="feed-chip-name">{m.name}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

/* Action Bar */
const ActionBar: React.FC = () => {
  const [liked, setLiked] = useState(false);
  return (
    <div className="feed-actions">
      <button className={`feed-action-btn${liked ? " liked" : ""}`} onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        Like
      </button>
      <button className="feed-action-btn" onClick={(e) => e.stopPropagation()}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comment
      </button>
      <button className="feed-action-btn" onClick={(e) => e.stopPropagation()}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>
    </div>
  );
};

/* Post Header */
const PostHeader: React.FC<{
  name: string; otherCount: number; role?: string;
  institution?: string; timeAgo: string; avatarUrl?: string;
}> = ({ name, otherCount, role, institution, timeAgo, avatarUrl }) => (
  <div className="feed-post-header">
    <div className="feed-creator-avatar">
      {avatarUrl ? <img src={avatarUrl} alt={name} /> : getInitials(name)}
    </div>
    <div className="feed-creator-meta">
      <div className="feed-creator-name-row">
        <strong>{name}</strong>
        {otherCount > 0 && `, with ${otherCount} others`}
      </div>
      <div className="feed-creator-detail">
        {[role, institution, timeAgo].filter(Boolean).join(" · ")}
      </div>
    </div>
  </div>
);

/* Project Card */
const ProjectCard: React.FC<{ item: ProjectFeedItem; onClick: () => void }> = ({ item, onClick }) => {
  const hasImage = item.media_urls.length > 0;
  return (
    <div className="feed-group" onClick={onClick} style={{ cursor: "pointer" }}>
      <TeamPanel members={item.team_members} />
      <div className="feed-post">
        <PostHeader name={item.creator_name} otherCount={item.other_count} role={item.creator_role} institution={item.institution} timeAgo={item.time_ago} avatarUrl={item.creator_avatar_url} />
        <div className="feed-post-title">{item.title}</div>
        {hasImage ? (
          <div className="feed-image-wrap">
            <img src={item.media_urls[0]} alt={item.title} className="feed-image" />
            <div className="feed-image-overlay">
              <p className="feed-snippet-over-image">{item.description}</p>
            </div>
          </div>
        ) : (
          <p className="feed-snippet-plain">{item.description}</p>
        )}
        <ActionBar />
      </div>
    </div>
  );
};

/* Recruitment Card */
const RecruitmentCard: React.FC<{ item: RecruitmentFeedItem; onClick: () => void }> = ({ item, onClick }) => {
  const hasImage = item.media_urls.length > 0;
  const isOpen = item.status === "Open";
  return (
    <div className="feed-group" onClick={onClick} style={{ cursor: "pointer" }}>
      <TeamPanel members={item.team_members} />
      <div className="feed-post">
        <PostHeader name={item.creator_name} otherCount={item.other_count} role={item.creator_role} institution={item.institution} timeAgo={item.time_ago} avatarUrl={item.creator_avatar_url} />
        <span className={`feed-status ${isOpen ? "open" : "closed"}`}>
          <span className="feed-status-dot" />{item.status}
        </span>
        <div className="feed-post-title">{item.title}</div>
        {hasImage ? (
          <div className="feed-image-wrap">
            <img src={item.media_urls[0]} alt={item.title} className="feed-image" />
            <div className="feed-image-overlay">
              <p className="feed-snippet-over-image">{item.description}</p>
            </div>
          </div>
        ) : (
          <p className="feed-snippet-plain">{item.description}</p>
        )}
        <ActionBar />
      </div>
    </div>
  );
};

/* Pagination Bar */
const PaginationBar: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const sequence = buildPageSequence(currentPage, totalPages);

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {sequence.map((item, i) =>
        item === "…" ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={item}
            className={`pagination__btn${item === currentPage ? " pagination__btn--active" : ""}`}
            onClick={() => onPageChange(item as number)}
          >
            {item}
          </button>
        )
      )}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

/* Loading Skeleton */
const FeedSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {[1, 2].map(row => (
      <div key={row} className="feed-row">
        {[1, 2].map(col => (
          <div key={col} className="feed-group" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
            <div style={{ width: 148, borderRight: "1px solid var(--border-color)", background: "var(--bg-card-header)" }} />
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ height: 14, borderRadius: 6, background: "var(--border-color)", width: "60%" }} />
              <div style={{ height: 12, borderRadius: 6, background: "var(--border-color)", width: "40%" }} />
              <div style={{ flex: 1, borderRadius: 8, background: "var(--border-color)" }} />
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

/* Icons */
const RecruitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ProjectIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

/* Main: HomePage */
type Tab = "project" | "recruitment";

const LIMIT = 10;

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("project");
  const router  = useRouter();
  const feedRef = useRef<HTMLDivElement>(null);

  // Each tab has its own independent state
  const [projects, setProjects]                         = useState<ProjectFeedItem[]>([]);
  const [projectsPage, setProjectsPage]                 = useState(1);
  const [projectsTotalPages, setProjectsTotalPages]     = useState(1);
  const [projectsLoading, setProjectsLoading]           = useState(false);
  const [projectsInitialized, setProjectsInitialized]   = useState(false);
  const [projectsError, setProjectsError]               = useState<string | null>(null);

  const [recruitments, setRecruitments]                         = useState<RecruitmentFeedItem[]>([]);
  const [recruitmentsPage, setRecruitmentsPage]                 = useState(1);
  const [recruitmentsTotalPages, setRecruitmentsTotalPages]     = useState(1);
  const [recruitmentsLoading, setRecruitmentsLoading]           = useState(false);
  const [recruitmentsInitialized, setRecruitmentsInitialized]   = useState(false);
  const [recruitmentsError, setRecruitmentsError]               = useState<string | null>(null);

  // Fetch functions
  const fetchProjects = async (page: number) => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const skip = (page - 1) * LIMIT;
      const [raw, total] = await Promise.all([
        getAllProjects(skip, LIMIT),
        projectsInitialized ? Promise.resolve(null) : getProjectCount(),
      ]);
      setProjects(raw.map(mapProjectToFeedItem));
      setProjectsPage(page);
      if (total !== null) {
        setProjectsTotalPages(Math.max(1, Math.ceil(total / LIMIT)));
      }
      setProjectsInitialized(true);
    } catch (err: any) {
      if (err.message === "Unauthorized") { router.replace("/loginPage"); return; }
      setProjectsError("Failed to load projects. Please try again.");
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchRecruitments = async (page: number) => {
    setRecruitmentsLoading(true);
    setRecruitmentsError(null);
    try {
      const skip = (page - 1) * LIMIT;
      const [raw, total] = await Promise.all([
        getAllRecruitments(skip, LIMIT),
        recruitmentsInitialized ? Promise.resolve(null) : getRecruitmentCount(),
      ]);
      setRecruitments(raw.map(mapRecruitmentToFeedItem));
      setRecruitmentsPage(page);
      if (total !== null) {
        setRecruitmentsTotalPages(Math.max(1, Math.ceil(total / LIMIT)));
      }
      setRecruitmentsInitialized(true);
    } catch (err: any) {
      if (err.message === "Unauthorized") { router.replace("/loginPage"); return; }
      setRecruitmentsError("Failed to load recruitments. Please try again.");
    } finally {
      setRecruitmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, []);

  useEffect(() => {
    if (activeTab === "recruitment" && !recruitmentsInitialized) {
      fetchRecruitments(1);
    }
  }, [activeTab]);

  const handleProjectPageChange = (page: number) => {
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    fetchProjects(page);
  };

  const handleRecruitmentPageChange = (page: number) => {
    feedRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    fetchRecruitments(page);
  };

  // Render

  const projectRows     = chunkPairs(projects);
  const recruitmentRows = chunkPairs(recruitments);

  const isProjectTab  = activeTab === "project";
  const isRecruitTab  = activeTab === "recruitment";

  const showProjectSkeleton  = isProjectTab && !projectsInitialized  && projectsLoading;
  const showRecruitSkeleton  = isRecruitTab && !recruitmentsInitialized && recruitmentsLoading;
  const showProjectError     = isProjectTab && !!projectsError;
  const showRecruitError     = isRecruitTab && !!recruitmentsError;

  return (
    <div className="app-shell">
      <Header showEditProfile={false} />

      <div className="app-body">
        <Sidebar defaultActive="home" />

        <main className="home-main">
          {/* Tabs */}
          <div className="home-tabs">
            <button
              className={`home-tab${isRecruitTab ? " active" : ""}`}
              onClick={() => setActiveTab("recruitment")}
            >
              <RecruitIcon /> Recruitment
            </button>
            <button
              className={`home-tab${isProjectTab ? " active" : ""}`}
              onClick={() => setActiveTab("project")}
            >
              <ProjectIcon /> Project
            </button>
          </div>

          {/* Feed */}
          <div className="home-feed" ref={feedRef}>

            {/* Skeletons on first load */}
            {(showProjectSkeleton || showRecruitSkeleton) && <FeedSkeleton />}

            {/* Skeleton on page change (already initialized) */}
            {isProjectTab  && projectsInitialized  && projectsLoading  && <FeedSkeleton />}
            {isRecruitTab  && recruitmentsInitialized && recruitmentsLoading && <FeedSkeleton />}

            {/* Error states */}
            {showProjectError && (
              <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "20px 0", textAlign: "center" }}>
                {projectsError}
              </p>
            )}
            {showRecruitError && (
              <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "20px 0", textAlign: "center" }}>
                {recruitmentsError}
              </p>
            )}

            {/* Projects feed */}
            {isProjectTab && projectsInitialized && !projectsLoading && !projectsError && (
              projectRows.length === 0
                ? <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "20px 0" }}>No projects yet.</p>
                : projectRows.map((row, ri) => (
                    <div className="feed-row" key={ri}>
                      {row.map((p) => (
                        <ProjectCard key={p.id} item={p} onClick={() => router.push(`/projectPage?id=${p.id}`)} />
                      ))}
                    </div>
                  ))
            )}

            {/* Recruitments feed */}
            {isRecruitTab && recruitmentsInitialized && !recruitmentsLoading && !recruitmentsError && (
              recruitmentRows.length === 0
                ? <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "20px 0" }}>No recruitments yet.</p>
                : recruitmentRows.map((row, ri) => (
                    <div className="feed-row" key={ri}>
                      {row.map((r) => (
                        <RecruitmentCard key={r.id} item={r} onClick={() => router.push(`/recruitmentPage?id=${r.id}`)} />
                      ))}
                    </div>
                  ))
            )}

            {/* Pagination bars */}
            {isProjectTab && projectsInitialized && !projectsLoading && !projectsError && (
              <PaginationBar
                currentPage={projectsPage}
                totalPages={projectsTotalPages}
                onPageChange={handleProjectPageChange}
              />
            )}
            {isRecruitTab && recruitmentsInitialized && !recruitmentsLoading && !recruitmentsError && (
              <PaginationBar
                currentPage={recruitmentsPage}
                totalPages={recruitmentsTotalPages}
                onPageChange={handleRecruitmentPageChange}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;