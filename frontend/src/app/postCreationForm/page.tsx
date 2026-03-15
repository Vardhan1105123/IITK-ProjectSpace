"use client";

import { useState, useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./postCreationForm.css";
import "../profilePage/ProfilePage.css"

type PostType = "Project" | "Recruitment";

interface Tag {
  id: string;
  label: string;
}

interface LinkEntry {
  id: string;
  value: string;
}

export default function PostCreationForm() {
  const [postType, setPostType] = useState<PostType>("Project");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Markdown" | "Plain-Text">("Markdown");

  // Project fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [links, setLinks] = useState<LinkEntry[]>([{ id: "1", value: "" }]);
  const [teamMembers, setTeamMembers] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Recruitment-only fields
  const [prerequisites, setPrerequisites] = useState<Tag[]>([]);
  const [fellowRecruiters, setFellowRecruiters] = useState("");
  const [applicantCategories, setApplicantCategories] = useState<Tag[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeSelect = (type: PostType) => {
    setPostType(type);
    setDropdownOpen(false);
  };

  const addTag = () => {
    const label = prompt("Enter tag:");
    if (label?.trim())
      setTags((prev) => [...prev, { id: Date.now().toString(), label: label.trim() }]);
  };

  const removeTag = (id: string) => setTags((prev) => prev.filter((t) => t.id !== id));

  const addPrerequisite = () => {
    const label = prompt("Enter prerequisite:");
    if (label?.trim())
      setPrerequisites((prev) => [...prev, { id: Date.now().toString(), label: label.trim() }]);
  };

  const removePrerequisite = (id: string) =>
    setPrerequisites((prev) => prev.filter((t) => t.id !== id));

  const addCategory = () => {
    const label = prompt("Enter applicant category:");
    if (label?.trim())
      setApplicantCategories((prev) => [
        ...prev,
        { id: Date.now().toString(), label: label.trim() },
      ]);
  };

  const removeCategory = (id: string) =>
    setApplicantCategories((prev) => prev.filter((t) => t.id !== id));

  const addLink = () =>
    setLinks((prev) => [...prev, { id: Date.now().toString(), value: "" }]);

  const updateLink = (id: string, value: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, value } : l)));

  const removeLink = (id: string) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadedFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (index: number) =>
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="app-shell">
      <Header showEditProfile={false} />

      <div className="app-body">
        <Sidebar defaultActive="create" />

        <main className="pcf-main">
          <p className="pcf-faq-hint">
            In case of any query regarding post creation, please refer to the FAQs.
          </p>

          <div className="pcf-form-container">

            {/* ── Section 1 ── */}
            <section className="pcf-card">
              <div className="pcf-card-header">
                <div>
                  <p className="pcf-section-label">Section 1 of 3</p>
                  <h2 className="pcf-section-title">
                    {postType === "Project" ? "Project Details" : "Recruitment Details"}
                  </h2>
                </div>

                {/* Type dropdown */}
                <div className="pcf-dropdown-wrapper">
                  <button
                    className="pcf-dropdown-btn"
                    onClick={() => setDropdownOpen((v) => !v)}
                  >
                    <span>{postType}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      className={`pcf-chevron${dropdownOpen ? " pcf-chevron--open" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="pcf-dropdown-menu">
                      {(["Project", "Recruitment"] as PostType[]).map((type) => (
                        <button
                          key={type}
                          className={`pcf-dropdown-item${postType === type ? " pcf-dropdown-item--active" : ""}`}
                          onClick={() => handleTypeSelect(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="pcf-field">
                <label className="pcf-label">
                  Title
                  <span className="pcf-label-hint">
                    (This will be displayed everywhere, make sure it is catchy :))
                  </span>
                </label>
                <input
                  className="pcf-input"
                  placeholder="Eg. Generative AI for Healthcare Applications"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Summary – Project only */}
              {postType === "Project" && (
                <div className="pcf-field">
                  <label className="pcf-label">
                    Summary
                    <span className="pcf-label-hint">
                      (A concise summary of your work. This will be used on project posts on the
                      discover page and search results.)
                    </span>
                  </label>
                  <textarea
                    className="pcf-textarea pcf-textarea--short"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>
              )}

              {/* Details */}
              <div className="pcf-field">
                <label className="pcf-label">
                  Details
                  <span className="pcf-label-hint">
                    {postType === "Project"
                      ? "(A detailed description of your work. This will be displayed on the project page.)"
                      : "(A detailed description of recruitment requirements and criterion. This will be displayed on the recruitment page.)"}
                  </span>
                </label>
                <div className="pcf-tabs">
                  {(["Markdown", "Plain-Text"] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`pcf-tab${activeTab === tab ? " pcf-tab--active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <textarea
                  className="pcf-textarea pcf-textarea--tall"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    activeTab === "Markdown" ? "# Your markdown here..." : "Plain text details..."
                  }
                />
              </div>

              {/* Field and Domains */}
              <div className="pcf-field">
                <label className="pcf-label">
                  Field and Domains
                  <span className="pcf-label-hint">(Add Tags relevant to your project domain.)</span>
                </label>
                <div className="pcf-tags-row">
                  {tags.map((tag) => (
                    <span key={tag.id} className="pcf-tag">
                      {tag.label}
                      <button className="pcf-tag-remove" onClick={() => removeTag(tag.id)}>×</button>
                    </span>
                  ))}
                </div>
                <button className="pcf-add-btn" onClick={addTag}>
                  <span className="pcf-add-icon">+</span> Add Tags
                </button>
              </div>

              {/* Prerequisites – Recruitment only */}
              {postType === "Recruitment" && (
                <div className="pcf-field">
                  <label className="pcf-label">
                    Prerequisites
                    <span className="pcf-label-hint">
                      (Add prerequisites an applicant must have completed to be a part of your project.)
                    </span>
                  </label>
                  <div className="pcf-tags-row">
                    {prerequisites.map((p) => (
                      <span key={p.id} className="pcf-tag">
                        {p.label}
                        <button className="pcf-tag-remove" onClick={() => removePrerequisite(p.id)}>×</button>
                      </span>
                    ))}
                  </div>
                  <button className="pcf-add-btn" onClick={addPrerequisite}>
                    <span className="pcf-add-icon">+</span> Add Prerequisites
                  </button>
                </div>
              )}
            </section>

            {/* ── Section 2 ── */}
            <section className="pcf-card">
              <div className="pcf-card-header">
                <div>
                  <p className="pcf-section-label">Section 2 of 3</p>
                  <h2 className="pcf-section-title">
                    {postType === "Project" ? "Project Media and Links" : "Recruitment Media and Links"}
                  </h2>
                </div>
              </div>

              {/* Upload media */}
              <div className="pcf-field">
                <label className="pcf-label">
                  Upload media
                  <span className="pcf-label-hint">
                    {postType === "Project"
                      ? "(Add media relevant to your project.)"
                      : "(Add media relevant to your recruitment.)"}
                  </span>
                </label>
                <div
                  className="pcf-upload-zone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="pcf-upload-title">Upload Files from your Computer</span>
                  <span className="pcf-upload-hint">
                    Upload images, videos or PDFs related to your{" "}
                    {postType === "Project" ? "work" : "recruitment"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf"
                    style={{ display: "none" }}
                    onChange={handleFileInput}
                  />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="pcf-file-list">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="pcf-file-item">
                        <span className="pcf-file-name">{f.name}</span>
                        <button className="pcf-file-remove" onClick={() => removeFile(i)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Relevant Links */}
              <div className="pcf-field">
                <label className="pcf-label">
                  Relevant Links
                  <span className="pcf-label-hint">
                    {postType === "Project"
                      ? "(Add links to material, publications or code repositories.)"
                      : "(Add links to material, publications or recruitment tasks.)"}
                  </span>
                </label>
                {links.map((link) => (
                  <div key={link.id} className="pcf-link-row">
                    <div className="pcf-link-input-wrapper">
                      <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        className="pcf-link-icon"
                      >
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                      </svg>
                      <input
                        className="pcf-input pcf-input--link"
                        placeholder="https://"
                        value={link.value}
                        onChange={(e) => updateLink(link.id, e.target.value)}
                      />
                    </div>
                    {links.length > 1 && (
                      <button className="pcf-link-remove" onClick={() => removeLink(link.id)}>×</button>
                    )}
                  </div>
                ))}
                <button className="pcf-add-btn" onClick={addLink}>
                  <span className="pcf-add-icon">+</span> Add Link
                </button>
              </div>
            </section>

            {/* ── Section 3 ── */}
            <section className="pcf-card">
              <div className="pcf-card-header">
                <div>
                  <p className="pcf-section-label">Section 3 of 3</p>
                  <h2 className="pcf-section-title">
                    {postType === "Project" ? "Project Team" : "Recruitment Specifications and Team"}
                  </h2>
                </div>
              </div>

              {/* Team Members / Fellow Recruiters */}
              <div className="pcf-field">
                <label className="pcf-label">
                  {postType === "Project" ? "Add Team Members" : "Add Fellow Recruiters"}
                  <span className="pcf-label-hint">
                    (Verification request will be sent to users you add. Only users who verify will be
                    displayed on the {postType === "Project" ? "project" : "recruitment"} page.{" "}
                    {postType === "Project"
                      ? "Project post will also be added on verified user's profile."
                      : "Recruitment post will also be added on verified user's profile."})
                  </span>
                </label>
                <div className="pcf-search-input-wrapper">
                  <span className="pcf-at-icon">@</span>
                  <input
                    className="pcf-input pcf-input--search"
                    placeholder={
                      postType === "Project"
                        ? "Search for your team members"
                        : "Search for fellow recruiters"
                    }
                    value={postType === "Project" ? teamMembers : fellowRecruiters}
                    onChange={(e) =>
                      postType === "Project"
                        ? setTeamMembers(e.target.value)
                        : setFellowRecruiters(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Applicant Category – Recruitment only */}
              {postType === "Recruitment" && (
                <div className="pcf-field">
                  <label className="pcf-label">
                    Specify Applicant Category
                    <span className="pcf-label-hint">
                      (Only users of the specified categories will be able to apply to the projects.)
                    </span>
                  </label>
                  <div className="pcf-tags-row">
                    {applicantCategories.map((c) => (
                      <span key={c.id} className="pcf-tag">
                        {c.label}
                        <button className="pcf-tag-remove" onClick={() => removeCategory(c.id)}>×</button>
                      </span>
                    ))}
                  </div>
                  <button className="pcf-add-btn" onClick={addCategory}>
                    <span className="pcf-add-icon">+</span> Add Category
                  </button>
                </div>
              )}
            </section>

            {/* Submit */}
            <div className="pcf-submit-row">
              <button className="pcf-submit-btn">
                Publish {postType}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}