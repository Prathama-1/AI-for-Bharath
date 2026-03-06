export interface UploadPayload {
  patientName: string;
  patientAge: number;
  clinicalData?: string;
  files?: Array<{ name: string; size: number; type?: string }>;
}

export interface ExplanationItem {
  medicalTerm: string;
  simplifiedExplanation: string;
  whatItMeans: string;
  whyItMatters: string;
  nextSteps: string;
}

export interface Scheme {
  id: string;
  name: string;
  provider: string;
  type: "government" | "state" | "ngo";
  eligibilityStatus: "eligible" | "partial" | "ineligible";
  maxBenefit: string;
  description: string;
  requirements: string[];
  applicationProcess: string;
  contactInfo: string;
}

export interface UploadResponse {
  caseId: string;
  explanations?: ExplanationItem[];
}

export interface ExplanationResponse {
  caseId: string;
  language: string;
  explanations: ExplanationItem[];
}

export interface EligibilityResponse {
  caseId: string;
  schemes: Scheme[];
}

export interface PDFResponse {
  caseId: string;
  pdfUrl: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_KEY = import.meta.env.VITE_API_KEY;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (API_KEY) {
    headers.set("x-api-key", API_KEY);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function uploadClinicalData(payload: UploadPayload) {
  return request<UploadResponse>("/api/upload", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchExplanation(caseId: string, language: string) {
  return request<ExplanationResponse>(`/api/explanation/${encodeURIComponent(caseId)}?language=${encodeURIComponent(language)}`);
}

export function checkEligibility(payload: { caseId: string; patientProfile: { age: number; name?: string } }) {
  return request<EligibilityResponse>("/api/check-eligibility", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generatePdf(payload: {
  caseId: string;
  patientName: string;
  patientAge: number;
  explanations: ExplanationItem[];
  schemes: Scheme[];
}) {
  return request<PDFResponse>("/api/generate-pdf", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
