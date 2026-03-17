import { authHeaders } from "@/lib/token";

const API = "http://127.0.0.1:8000/projects";

const extractError = (data: any, fallbackMsg: string): string => {
  if (!data || !data.detail) return fallbackMsg;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail[0]?.msg) {
    let msg = data.detail[0].msg;
    if (msg.startsWith("Value error, ")) msg = msg.replace("Value error, ", "");
    return msg;
  }
  return fallbackMsg;
};

// Types
export interface UserSummary {
  id: string;
  fullname: string;
  profile_picture_url?: string;
}

export interface ProjectCreate {
  title: string;
  summary: string;
  description: string;
  description_format: "markdown" | "plain-text";
  domains: string[];
  links: string[];
  media_urls: string[];
}

export interface ProjectUpdate {
  title?: string;
  summary?: string;
  description?: string;
  description_format?: "markdown" | "plain-text";
  domains?: string[];
  links?: string[];
  media_urls?: string[];
}

export interface ProjectPublic {
  id: string;
  title: string;
  summary: string;
  description: string;
  description_format: "markdown" | "plain-text";
  domains: string[];
  links: string[];
  media_urls: string[];
  created_at: string;
  updated_at: string;
  team_members: UserSummary[];

  creator_id: string;
  creator_name: string;
  creator_avatar_url?: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  summary: string;
  domains: string[];
  created_at: string;

  creator_id: string;
  creator_name: string;
  creator_avatar_url?: string;
}

// API Functions
export async function createProject(payload: ProjectCreate): Promise<ProjectPublic> {
  const res = await fetch(`${API}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(extractError(data, "Failed to create project"));
  return data;
}

export async function getProject(projectId: string): Promise<ProjectPublic> {
  const res = await fetch(`${API}/${projectId}`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(extractError(data, "Failed to fetch project"));
  return data;
}

export async function getAllProjects(skip = 0, limit = 10): Promise<ProjectSummary[]> {
  const res = await fetch(`${API}/?skip=${skip}&limit=${limit}`, {
    headers: { ...authHeaders() },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(extractError(data, "Failed to fetch projects"));
  return data;
}

export async function updateProject(projectId: string, payload: ProjectUpdate): Promise<ProjectPublic> {
  const res = await fetch(`${API}/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(extractError(data, "Failed to update project"));
  return data;
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await fetch(`${API}/${projectId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(extractError(data, "Failed to delete project"));
  }
}