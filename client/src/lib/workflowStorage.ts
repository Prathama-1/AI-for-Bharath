import type { ExplanationItem, Scheme } from "@/lib/awsApi";

export interface WorkflowState {
  caseId?: string;
  patientName?: string;
  patientAge?: number;
  clinicalData?: string;
  explanations?: ExplanationItem[];
  schemes?: Scheme[];
  selectedLanguage?: string;
  pdfUrl?: string;
}

const STORAGE_KEY = "medical-workflow-state";

export function getWorkflowState(): WorkflowState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WorkflowState) : {};
  } catch {
    return {};
  }
}

export function setWorkflowState(next: Partial<WorkflowState>) {
  const prev = getWorkflowState();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prev, ...next }));
}
