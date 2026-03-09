import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Volume2, Copy, Check, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

/**
 * Design Philosophy: Empathetic Healthcare Minimalism
 * - Progressive information disclosure
 * - Multiple language support
 * - Audio narration for accessibility
 * - Calming, reassuring presentation
 */

interface ExplanationContent {
  medicalTerm: string;
  severity: 'Stable' | 'Attention' | 'Critical';
  simplifiedExplanation: string;
  whatItMeans: string;
  whyItMatters: string;
  nextSteps: string;
}

interface AnalysisResponse {
  holisticSummary: string;
  overallSeverity: 'Stable' | 'Attention' | 'Critical';
  terms: ExplanationContent[];
  consolidatedNextSteps: string[];
}

const mockAnalysis: AnalysisResponse = {
  holisticSummary: "Your report shows signs of Type 2 Diabetes that requires active management, particularly regarding your eye health and sugar levels.",
  overallSeverity: "Attention",
  terms: [
    {
      medicalTerm: "HbA1c level",
      severity: "Attention",
      simplifiedExplanation: "3-month average blood sugar",
      whatItMeans: "This test shows your average blood sugar over the last few months. Your level (8.2%) is higher than the healthy target of 7%.",
      whyItMatters: "Consistently high sugar can damage your small blood vessels over time.",
      nextSteps: "Work with your doctor to adjust your diet and medication."
    },
    {
      medicalTerm: "Microaneurysms",
      severity: "Critical",
      simplifiedExplanation: "Small weak spots in eye vessels",
      whatItMeans: "Extremely small swellings in the blood vessels of your retina (the back of your eye).",
      whyItMatters: "If not monitored, these can leak and affect your vision (Retinopathy).",
      nextSteps: "Schedule an urgent follow-up with an ophthalmologist."
    }
  ],
  consolidatedNextSteps: [
    "Schedule a diabetic eye screening (Fundus exam)",
    "Monitor blood sugar twice daily",
    "Reduce daily carbohydrate intake",
    "Bring this report to your follow-up appointment"
  ]
};

export default function Explanation() {
  const [, navigate] = useLocation();
  const [analysis, setAnalysis] = useState<AnalysisResponse>(mockAnalysis);
  const [selectedExplanation, setSelectedExplanation] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("medical_analysis");
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        if (parsed.holisticSummary) {
          setAnalysis(parsed);
        }
      } catch (err) {
        console.error("Failed to parse saved analysis:", err);
      }
    }
    // Fix: Jump to top on page load
    window.scrollTo(0, 0);
  }, []);

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getSeverityConfig = (severity: string) => {
    const s = severity?.toLowerCase() || "";
    if (s.includes("critical") || s.includes("danger") || s.includes("high")) {
      return {
        label: "Critical",
        border: "bg-red-600",
        badge: "bg-red-50 text-red-600 border-red-200",
        dot: "bg-red-500",
        detailBadge: "bg-red-600 text-white"
      };
    }
    if (s.includes("attention") || s.includes("elevated") || s.includes("warning") || s.includes("medium")) {
      return {
        label: "Attention",
        border: "bg-amber-500",
        badge: "bg-amber-50 text-amber-600 border-amber-200",
        dot: "bg-amber-500",
        detailBadge: "bg-amber-500 text-black"
      };
    }
    return {
      label: "Stable",
      border: "bg-green-600",
      badge: "bg-green-50 text-green-600 border-green-200",
      dot: "bg-green-500",
      detailBadge: "bg-green-600 text-white"
    };
  };

  const currentTerm = analysis.terms[selectedExplanation];
  const overallConfig = getSeverityConfig(analysis.overallSeverity);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/upload")}
              className="text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              ← Back to Upload
            </button>
            <h1 className="text-2xl font-bold text-foreground">Medical Explanation</h1>
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
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Explanation</h3>
                  <p className="text-sm text-muted-foreground">Current step</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Check Eligibility</h3>
                  <p className="text-sm text-muted-foreground">Next step</p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary transition-all duration-300"></div>
            </div>
          </div>

          {/* 1. THE HOLISTIC ROADMAP (THE 'WHY') */}
          <div className="space-y-8 mb-16">
            <section className="animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">Patient Wellness Roadmap</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              <Card className="p-10 border border-border shadow-sm relative overflow-hidden bg-white">
                <div className={`absolute top-0 left-0 w-2 h-full ${overallConfig.border}`} />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${overallConfig.badge}`}>
                      Overall Health Status: {analysis.overallSeverity}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-relaxed text-foreground max-w-3xl">
                    {analysis.holisticSummary}
                  </h2>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button 
                      onClick={() => handleSpeak(analysis.holisticSummary)}
                      variant="outline" 
                      className="rounded-full gap-2 px-6 border-primary text-primary hover:bg-primary/5"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen to Summary
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* 2. ACTION PLAN OVERVIEW */}
            <section className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Card className="p-8 border border-border shadow-sm hover:shadow-md transition-all bg-white">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  Immediate Action Plan
                </h3>
                <div className="space-y-4">
                  {analysis.consolidatedNextSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-foreground font-medium leading-relaxed text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8 border border-secondary/20 bg-secondary/5 relative flex flex-col min-h-[320px]">
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <Globe className="w-5 h-5 text-secondary" />
                    </div>
                    Financial Support
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    Based on your medical report, you may be eligible for specific government schemes and financial aid to help cover treatment costs.
                  </p>
                </div>
                <div className="pt-6">
                  <Button 
                    onClick={() => navigate("/eligibility")}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white py-6 rounded-xl font-bold transition-all hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Verify Eligibility
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </section>
          </div>

          {/* 3. DETAILED MEDICAL BREAKDOWN (RESTORED) */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">Technical Deep Dive</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Terms */}
              <aside className="w-full md:w-1/3">
                <Card className="p-4 border border-border bg-white shadow-sm">
                  <div className="space-y-2">
                    {analysis.terms.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedExplanation(idx)}
                        className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 border ${
                          selectedExplanation === idx 
                            ? "bg-primary text-white border-primary shadow-lg scale-[1.02] z-10" 
                            : "bg-transparent border-transparent text-foreground hover:bg-muted font-medium"
                        }`}
                      >
                        <div className="flex items-center justify-between pointer-events-none">
                          <span className="font-bold text-sm tracking-tight">{term.medicalTerm}</span>
                          <div className={`w-2 h-2 rounded-full ${getSeverityConfig(term.severity).dot} ${selectedExplanation === idx ? 'ring-2 ring-white/50' : ''}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </aside>

              {/* Detailed Card */}
              <main className="flex-1">
                {currentTerm && (
                  <Card className="p-10 border border-border bg-white shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">
                    <div className="space-y-8 flex-1">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${getSeverityConfig(currentTerm.severity).detailBadge}`}>
                            {currentTerm.severity} Severity
                          </span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-foreground mb-3 leading-tight tracking-tight">
                          {currentTerm.medicalTerm}
                        </h2>
                        <div className="inline-block px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold text-xl mb-6 shadow-sm border border-primary/10">
                          {currentTerm.simplifiedExplanation}
                        </div>
                      </div>

                      <div className="grid gap-8">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">What It Means</h4>
                          <p className="text-foreground leading-relaxed text-lg font-medium">{currentTerm.whatItMeans}</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Why It Matters</h4>
                          <p className="text-foreground leading-relaxed text-lg font-medium">{currentTerm.whyItMatters}</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Suggested Next Steps</h4>
                          <p className="text-foreground leading-relaxed text-lg font-medium">{currentTerm.nextSteps}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-border flex flex-wrap gap-4">
                      <Button
                        onClick={() => handleSpeak(`${currentTerm.medicalTerm}. ${currentTerm.simplifiedExplanation}. ${currentTerm.whatItMeans}`)}
                        variant="secondary"
                        className="rounded-full px-6 font-bold shadow-sm"
                      >
                        <Volume2 className="w-4 h-4 mr-2" /> Listen
                      </Button>
                      <Button
                        onClick={() => handleCopy(currentTerm.simplifiedExplanation, "term")}
                        variant="ghost"
                        className="rounded-full px-6 font-bold hover:bg-muted"
                      >
                        <Copy className="w-4 h-4 mr-2" /> 
                        {copiedSection === "term" ? "Copied!" : "Copy Explanation"}
                      </Button>
                    </div>
                  </Card>
                )}
              </main>
            </div>
          </section>

          {/* Information Card */}
          <Card className="mt-8 p-6 bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">Clinical Precision Statement</h3>
            <p className="text-sm text-foreground leading-relaxed">
              This report provides a simplified summary for patient awareness. For any medical intervention, always consult with your primary healthcare provider. 
              The technical deep-dive and action plans are maintained in English to ensure clinical accuracy across healthcare providers.
            </p>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12 pb-20">
            <Button
              onClick={() => navigate("/upload")}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted py-6 text-lg"
            >
              ← Back to Upload
            </Button>
            <Button
              onClick={() => navigate("/eligibility")}
              className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2 py-6 text-lg"
            >
              Check Financial Eligibility
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
