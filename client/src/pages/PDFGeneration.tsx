import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, Loader2, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jsPDF } from "jspdf";

interface ExplanationContent {
  medicalTerm: string;
  severity: 'Stable' | 'Attention' | 'Critical';
  simplifiedExplanation: string;
  whatItMeans: string;
  whyItMatters: string;
  nextSteps: string;
}

interface Medication {
  name: string;
  dosage: string;
  why_prescribed: string;
}

interface AnalysisResponse {
  holisticSummary: string;
  overallSeverity: 'Stable' | 'Attention' | 'Critical';
  terms: ExplanationContent[];
  medications: Medication[];
  consolidatedNextSteps: string[];
}

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

const mockAnalysis: AnalysisResponse = {
  holisticSummary: "The patient has been diagnosed with Type 2 Diabetes Mellitus, which requires careful management of blood sugar levels through medication, diet, and regular exercise. Early intervention and consistent monitoring are crucial to prevent complications.",
  overallSeverity: "Attention",
  terms: [
    {
      medicalTerm: "Type 2 Diabetes Mellitus",
      severity: "Attention",
      simplifiedExplanation: "Your body isn't using insulin properly, leading to high blood sugar.",
      whatItMeans: "This is a chronic condition where your body either doesn't produce enough insulin or resists insulin, causing glucose to build up in your blood.",
      whyItMatters: "High blood sugar can damage organs over time, leading to heart disease, kidney problems, nerve damage, and vision loss.",
      nextSteps: "Consult an endocrinologist, monitor blood sugar, follow dietary guidelines, and exercise regularly."
    },
    {
      medicalTerm: "Hypertension",
      severity: "Stable",
      simplifiedExplanation: "High blood pressure (Managed)",
      whatItMeans: "This means the force of your blood against your artery walls is consistently too high.",
      whyItMatters: "Uncontrolled high blood pressure increases the risk of heart attack, stroke, and kidney disease.",
      nextSteps: "Continue current medication and monitor blood pressure at home."
    }
  ],
  medications: [
    {
      name: "Metformin",
      dosage: "1000mg BID",
      why_prescribed: "Helps lower blood sugar levels by improving how your body handles insulin."
    },
    {
      name: "Sitagliptin",
      dosage: "100mg QD",
      why_prescribed: "Works by increasing the levels of natural substances that lower blood sugar when it is high."
    }
  ],
  consolidatedNextSteps: [
    "Schedule a diabetic eye screening",
    "Monitor blood sugar twice daily",
    "Reduce daily carbohydrate intake"
  ]
};

export default function PDFGeneration() {
  const [, navigate] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");
  const [isTranslating, setIsTranslating] = useState(false);

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [translatedData, setTranslatedData] = useState<{
    title?: string;
    summary?: string;
    steps?: string[];
    schemeHeader?: string;
    nextStepsHeader?: string;
    rawNotes?: string;
    medications?: Medication[];
    sectionHeaders?: {
      diagnosis: string;
      medications: string;
      actions: string;
      verified: string;
      noSchemes: string;
      instruction: string;
    };
  } | null>(null);
  const [patientProfile, setPatientProfile] = useState<{ name: string, age: string, date: string, id: string } | null>(null);
  const [rawNotes, setRawNotes] = useState<string>("");

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("medical_analysis");
    if (savedAnalysis) {
      const parsed = JSON.parse(savedAnalysis);
      if (parsed && Object.keys(parsed).length > 0) setAnalysis(parsed);
    }

    const savedSchemes = localStorage.getItem("eligible_schemes");
    if (savedSchemes) setEligibleSchemes(JSON.parse(savedSchemes));

    const savedProfile = localStorage.getItem("patient_profile");
    if (savedProfile) setPatientProfile(JSON.parse(savedProfile));

    const savedNotes = localStorage.getItem("raw_clinical_notes");
    if (savedNotes) setRawNotes(savedNotes);
  }, []);

  const handleLanguageChange = async (lang: "en" | "hi") => {
    setSelectedLanguage(lang);
    if (lang === "en" || (translatedData && lang === "hi")) return;

    setIsTranslating(true);
    try {
      const currentAnalysis = (analysis && analysis.holisticSummary) ? analysis : mockAnalysis;
      const meds = currentAnalysis.medications || [];
      const clinicalNotes = rawNotes || "Patient reports occasional blurred vision and polyuria. HbA1c level is 8.2% (Target < 7.0%). Fundus examination shows minor microaneurysms in the left eye.";

      const stringsToTranslate = [
        "Medical Assistance Claim Document",
        currentAnalysis.holisticSummary || "",
        ...(currentAnalysis.consolidatedNextSteps || []),
        "Financial Eligibility Status",
        "Next Steps for Claiming Benefits",
        clinicalNotes,
        ...meds.map(m => m.name),
        ...meds.map(m => m.dosage),
        ...meds.map(m => m.why_prescribed),
        "Clinical Diagnosis",
        "Current Medications",
        "Recommended Actions",
        "Verified Eligible",
        "No schemes verified yet.",
        "Please carry your Aadhaar card and Ration card to the nearest enrollment center."
      ];

      const response = await fetch("http://localhost:5000/api/translate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: stringsToTranslate, target_lang: "hi" }),
      });

      const data = await response.json();
      const translations = data.translations; // Backend returns 'translations'

      if (!translations || translations.length === 0) throw new Error("No translations returned");

      let idx = 0;
      const title = translations[idx++];
      const summary = translations[idx++];
      const stepsCount = currentAnalysis.consolidatedNextSteps.length;
      const steps = translations.slice(idx, idx + stepsCount);
      idx += stepsCount;
      const schemeHeader = translations[idx++];
      const nextStepsHeader = translations[idx++];
      const translatedRawNotes = translations[idx++];

      const translatedMeds: Medication[] = meds.map((m, i) => ({
        name: translations[idx + i],
        dosage: translations[idx + meds.length + i],
        why_prescribed: translations[idx + (meds.length * 2) + i]
      }));
      idx += meds.length * 3;

      const diagnosisHeader = translations[idx++];
      const medicationsHeader = translations[idx++];
      const actionsHeader = translations[idx++];
      const verifiedLabel = translations[idx++];
      const noSchemesMsg = translations[idx++];
      const instructionText = translations[idx++];

      setTranslatedData({
        title,
        summary,
        steps,
        schemeHeader,
        nextStepsHeader,
        rawNotes: translatedRawNotes,
        medications: translatedMeds,
        sectionHeaders: {
          diagnosis: diagnosisHeader,
          medications: medicationsHeader,
          actions: actionsHeader,
          verified: verifiedLabel,
          noSchemes: noSchemesMsg,
          instruction: instructionText
        }
      });
    } catch (error) {
      console.error("Translation Error:", error);
      setSelectedLanguage("en");
    } finally {
      setIsTranslating(false);
    }
  };

  const previewContent = useMemo(() => {
    const isHi = selectedLanguage === "hi" && translatedData;
    const currentAnalysis = (analysis && analysis.holisticSummary) ? analysis : mockAnalysis;

    return {
      title: isHi ? translatedData?.title : "Clinical Assistance Record",
      summary: isHi ? translatedData?.summary : currentAnalysis.holisticSummary,
      steps: isHi ? translatedData?.steps : currentAnalysis.consolidatedNextSteps,
      medications: isHi ? translatedData?.medications : currentAnalysis.medications,
      rawNotes: (isHi ? translatedData?.rawNotes : rawNotes) || "Patient reports occasional blurred vision and polyuria. HbA1c level is 8.2% (Target < 7.0%). Fundus examination shows minor microaneurysms in the left eye.",
      schemeHeader: isHi ? translatedData?.schemeHeader : "Financial Eligibility Status",
      nextStepsHeader: isHi ? translatedData?.nextStepsHeader : "Next Steps for Claiming Benefits",
      headers: {
        diagnosis: isHi ? translatedData?.sectionHeaders?.diagnosis : "Clinical Diagnosis",
        medications: isHi ? translatedData?.sectionHeaders?.medications : "Current Medications",
        actions: isHi ? translatedData?.sectionHeaders?.actions : "Recommended Actions",
        verified: isHi ? translatedData?.sectionHeaders?.verified : "Verified Eligible",
        noSchemes: isHi ? translatedData?.sectionHeaders?.noSchemes : "No schemes verified yet.",
        instruction: isHi ? translatedData?.sectionHeaders?.instruction : "Please carry your Aadhaar card and Ration card to the nearest enrollment center."
      }
    };
  }, [selectedLanguage, translatedData, analysis]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    // Simulate PDF generation with AWS Lambda + S3
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const handleDownload = () => {
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        let yOffset = 20;
        const addText = (text: string, size: number, isBold: boolean, xOffset: number = 20, align: "left" | "center" = "left") => {
          doc.setFontSize(size);
          doc.setFont("helvetica", isBold ? "bold" : "normal");
          const lines = doc.splitTextToSize(text, 170);

          if (align === "center") {
            doc.text(lines, 105, yOffset, { align: "center" });
            yOffset += lines.length * 7 + 3;
          } else {
            if (yOffset + (lines.length * 7) > 280) {
              doc.addPage();
              yOffset = 20;
            }
            doc.text(lines, xOffset, yOffset);
            yOffset += lines.length * 7 + 3;
          }
        };

        const titleText = previewContent.title || "CLINICAL ASSISTANCE RECORD";
        addText(titleText.toUpperCase(), 18, true, 105, "center");
        yOffset += 5;
        
        const patientInfo = `Patient: ${patientProfile?.name || "System Record"}    Age: ${patientProfile?.age || "--"}`;
        addText(patientInfo, 12, false, 105, "center");
        yOffset += 5;

        const reportInfo = `Date: ${patientProfile?.date || "08 Mar 2026"}    ID: ${patientProfile?.id || "MAD-2026-X"}`;
        addText(reportInfo, 10, false, 105, "center");

        yOffset += 15;
        doc.line(20, yOffset - 5, 190, yOffset - 5);

        addText(previewContent.headers.diagnosis || "Clinical Diagnosis", 14, true);
        addText(previewContent.rawNotes || "See original upload for details.", 12, false, 20);
        yOffset += 10;

        addText(previewContent.headers.medications || "Current Medications", 14, true);
        if (previewContent.medications && previewContent.medications.length > 0) {
          previewContent.medications.forEach(m => {
            addText(`•  ${m.name} (${m.dosage})`, 12, true, 25);
            addText(`${m.why_prescribed}`, 11, false, 30);
            yOffset += 3;
          });
        } else {
          addText("No current medications.", 12, false, 25);
        }
        yOffset += 8;

        addText(previewContent.headers.actions || "Recommended Actions", 14, true);
        if (previewContent.steps && previewContent.steps.length > 0) {
          previewContent.steps.forEach(step => {
            addText(`•  ${step}`, 12, false, 25);
          });
        }
        yOffset += 10;

        addText(previewContent.schemeHeader || "Eligibility", 14, true);
        if (eligibleSchemes.length > 0) {
          eligibleSchemes.forEach(scheme => {
            addText(`•  ${scheme.name} - ${previewContent.headers.verified || "Verified Eligible"}`, 12, false, 25);
          });
        } else {
          addText(previewContent.headers.noSchemes || "No schemes", 12, false, 25);
        }
        yOffset += 10;

        addText(previewContent.nextStepsHeader || "Next Steps", 14, true);
        addText(previewContent.headers.instruction || "Consult provider.", 12, false, 20);

        doc.save(`Medical_Report_${patientProfile?.name || "Patient"}.pdf`);
      } catch (error) {
        console.error("PDF generation failed:", error);
      } finally {
        setIsGenerating(false);
        setIsGenerated(true);
      }
    }, 1000);
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
              {/* Language Selection */}
              <div className="flex justify-end mb-4 gap-2">
                <div className="flex items-center gap-3 bg-white border border-border px-4 py-2 rounded-xl shadow-sm">
                  <Globe className="w-4 h-4 text-primary" />
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value) => handleLanguageChange(value as "en" | "hi")}
                    disabled={isTranslating}
                  >
                    <SelectTrigger className="w-[180px] border-none shadow-none focus:ring-0 font-bold bg-transparent">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English Report</SelectItem>
                      <SelectItem value="hi">हिंदी रिपोर्ट</SelectItem>
                    </SelectContent>
                  </Select>
                  {isTranslating && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </div>
              </div>

              {/* Document Preview */}
              <Card className="p-8 mb-8 border border-border shadow-inner bg-muted/30">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Document Preview</h2>
                  <Badge variant="outline" className="bg-white">
                    Format: Official Medical Claim
                  </Badge>
                </div>

                <div className="bg-white border border-border rounded-lg p-10 space-y-8 shadow-sm max-h-[600px] overflow-y-auto relative">
                  {isTranslating && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center backdrop-blur-[1px]">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                      <p className="font-bold text-primary animate-pulse">Translating Report...</p>
                    </div>
                  )}
                  <div className="text-center border-b border-border pb-8">
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">{previewContent.title}</h3>
                    <div className="mt-4 flex flex-col items-center gap-1">
                      <p className="text-sm font-bold text-foreground font-mono">
                        Patient: {patientProfile?.name || "System Record"} • Age: {patientProfile?.age || "--"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Report Date: {patientProfile?.date || "08 Mar 2026"} • ID: {patientProfile?.id || `MAD-2026-${Math.floor(1000 + Math.random() * 9000)}`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{previewContent.headers.diagnosis}</h4>
                    <div className="text-sm font-medium text-foreground whitespace-pre-wrap">
                      {previewContent.rawNotes?.includes('\n') ? (
                        <ul className="list-disc list-inside space-y-1">
                          {previewContent.rawNotes.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                            <li key={i}>{line.trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        previewContent.rawNotes
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{previewContent.headers.medications}</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                      {previewContent.medications?.map((med, idx) => (
                        <li key={idx}>
                          <span className="font-bold">{med.name}</span> ({med.dosage}) - <span className="text-muted-foreground">{med.why_prescribed}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{previewContent.headers.actions}</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                      {previewContent.steps?.map((step, idx) => (
                        <li key={idx}>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{previewContent.schemeHeader}</h4>
                    <div className="bg-white text-sm">
                      {eligibleSchemes.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2">
                          {eligibleSchemes.map((scheme, idx) => (
                            <li key={idx} className="font-bold text-foreground">
                              {scheme.name} - <span className="text-secondary font-medium">{previewContent.headers.verified}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">{previewContent.headers.noSchemes}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border mt-8">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest">{previewContent.nextStepsHeader}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {previewContent.headers.instruction}
                    </p>
                  </div>
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
