import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { generatePdf } from "@/lib/awsApi";
import { getWorkflowState, setWorkflowState } from "@/lib/workflowStorage";

/**
 * Design Philosophy: Empathetic Healthcare Minimalism
 * - Clear document preview
 * - Reassuring download experience
 * - Professional document layout
 * - Celebration of successful completion
 */

interface PDFDocument {
  title: string;
  sections: {
    title: string;
    content: string[];
  }[];
}

const mockPDFContent: PDFDocument = {
  title: "Medical Assistance Claim Document",
  sections: [
    {
      title: "Patient Information",
      content: [
        "Name: John Doe",
        "Age: 45 years",
        "Date of Document: March 2, 2026",
        "Reference ID: MAD-2026-00123",
      ],
    },
    {
      title: "Diagnosis Summary",
      content: [
        "Primary Diagnosis: Hypertension (High Blood Pressure)",
        "Simplified Explanation: Your blood is pushing too hard against the walls of your blood vessels.",
        "Severity: Moderate",
        "Date of Diagnosis: February 15, 2026",
      ],
    },
    {
      title: "Treatment Details",
      content: [
        "Current Medications: Lisinopril 10mg daily, Amlodipine 5mg daily",
        "Recommended Lifestyle Changes: Reduce salt intake, exercise 30 minutes daily, manage stress",
        "Follow-up Schedule: Monthly blood pressure monitoring, quarterly doctor consultation",
        "Estimated Treatment Duration: Ongoing management",
      ],
    },
    {
      title: "Financial Eligibility Status",
      content: [
        "Eligible Schemes: 2",
        "1. Ayushman Bharat - PMJAY (₹5,00,000 per year)",
        "2. Health for All Foundation (₹2,00,000 for critical cases)",
        "Total Potential Financial Assistance: ₹7,00,000",
      ],
    },
    {
      title: "Next Steps",
      content: [
        "1. Visit nearest PMJAY enrollment center with Aadhaar card and ration card",
        "2. Complete enrollment process (typically 1-2 days)",
        "3. Receive PMJAY card and authorization",
        "4. Contact eligible hospitals for cashless treatment",
        "5. Keep this document for hospital submission",
      ],
    },
  ],
};

export default function PDFGeneration() {
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(getWorkflowState().pdfUrl || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    const workflow = getWorkflowState();
    try {
      if (!workflow.caseId || !workflow.patientName || !workflow.patientAge) {
        throw new Error("Missing patient context. Please restart from Clinical Upload.");
      }

      const response = await generatePdf({
        caseId: workflow.caseId,
        patientName: workflow.patientName,
        patientAge: workflow.patientAge,
        explanations: workflow.explanations || [],
        schemes: workflow.schemes || [],
      });

      setDownloadUrl(response.pdfUrl);
      setWorkflowState({ pdfUrl: response.pdfUrl });
      setIsGenerated(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to generate PDF from AWS.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8,Mock PDF Content");
    element.setAttribute("download", "medical-assistance-claim.pdf");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/eligibility")}
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            ← Back to Eligibility
          </button>
          <h1 className="text-2xl font-bold text-foreground">Claim Assistance Document</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Clinical Data</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Explanation</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Check Eligibility</h3>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Generate PDF</h3>
                  <p className="text-sm text-muted-foreground">Final step</p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-full bg-primary transition-all duration-300"></div>
            </div>
          </div>

          {!isGenerated ? (
            <>
              {errorMessage && (
                <Card className="p-4 mb-6 border border-yellow-300 bg-yellow-50">
                  <p className="text-sm text-yellow-800">{errorMessage}</p>
                </Card>
              )}

              {/* Document Preview */}
              <Card className="p-8 mb-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Document Preview</h2>
                <div className="bg-white border border-border rounded-lg p-8 space-y-6 max-h-96 overflow-y-auto">
                  <div className="text-center border-b border-border pb-6">
                    <h3 className="text-2xl font-bold text-foreground">{mockPDFContent.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">Reference ID: MAD-2026-00123</p>
                  </div>

                  {mockPDFContent.sections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="text-lg font-bold text-primary mb-3">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Information Card */}
              <Card className="p-6 bg-primary/5 border border-primary/20 mb-8">
                <h3 className="font-semibold text-foreground mb-2">What's Included in Your Document</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Patient information and diagnosis summary
                  </li>
                  <li className="text-sm text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Simplified medical explanation
                  </li>
                  <li className="text-sm text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Treatment details and recommendations
                  </li>
                  <li className="text-sm text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Financial eligibility status and scheme details
                  </li>
                  <li className="text-sm text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Next steps for claiming benefits
                  </li>
                </ul>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90 text-white gap-2 py-6 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate PDF Document
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-8">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center animate-breathing">
                    <CheckCircle className="w-12 h-12 text-secondary" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Document Generated Successfully!</h2>
                  <p className="text-lg text-muted-foreground">
                    Your claim assistance document is ready to download and share with hospitals.
                  </p>
                </div>

                <Card className="p-8 border border-secondary/30 bg-secondary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-12 h-12 text-primary" />
                      <div className="text-left">
                        <p className="font-semibold text-foreground">medical-assistance-claim.pdf</p>
                        <p className="text-sm text-muted-foreground">Generated on March 2, 2026</p>
                      </div>
                    </div>
                    <Badge className="bg-secondary text-white">Ready</Badge>
                  </div>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-primary hover:bg-primary/90 text-white gap-2 py-6 text-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted py-6 text-lg"
                  >
                    Back to Home
                  </Button>
                </div>

                {/* Next Steps Card */}
                <Card className="p-8 border border-border text-left">
                  <h3 className="text-lg font-bold text-foreground mb-4">What to Do Next</h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">1.</span>
                      <span className="text-foreground">
                        Download and save your PDF document to your device or cloud storage
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">2.</span>
                      <span className="text-foreground">
                        Visit the nearest enrollment center for the schemes you are eligible for
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">3.</span>
                      <span className="text-foreground">
                        Submit this document along with required identity and income proofs
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">4.</span>
                      <span className="text-foreground">
                        Share with your hospital to enable cashless treatment under eligible schemes
                      </span>
                    </li>
                  </ol>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
