import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Copy, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

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

const UI_LABELS: Record<string, any> = {
  en: {
    back: "Back to Roadmap",
    title: "Clinical Vocabulary",
    subtitle: "Deep-dive into your medical report terms",
    terms_header: "Report Terms",
    analysis_tag: "Detailed Analysis",
    what_it_means: "What It Means",
    why_it_matters: "Why It Matters",
    next_steps: "Suggested Next Steps",
    listen: "Listen",
    copy: "Copy",
    loading: "Loading vocabulary..."
  },
  hi: {
    back: "रोडमैप पर वापस",
    title: "चिकित्सा शब्दावली",
    subtitle: "अपनी मेडिकल रिपोर्ट के शब्दों को गहराई से समझें",
    terms_header: "रिपोर्ट के शब्द",
    analysis_tag: "विस्तृत विश्लेषण",
    what_it_means: "इसका क्या मतलब है",
    why_it_matters: "यह क्यों महत्वपूर्ण है",
    next_steps: "सुझाए गए अगले कदम",
    listen: "सुनें",
    copy: "कॉपी करें",
    loading: "शब्दावली लोड हो रही है..."
  }
};

export default function Dictionary() {
  const [, navigate] = useLocation();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [translatedAnalysis, setTranslatedAnalysis] = useState<Record<string, AnalysisResponse>>({});
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedExplanation, setSelectedExplanation] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    const savedAnalysis = localStorage.getItem("medical_analysis");
    const savedTranslations = localStorage.getItem("translated_analysis");
    const savedLang = localStorage.getItem("selected_language") || "en";
    
    setSelectedLanguage(savedLang);

    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis));
      } catch (err) {
        console.error("Failed to parse saved analysis:", err);
      }
    }
    
    if (savedTranslations) {
      try {
        setTranslatedAnalysis(JSON.parse(savedTranslations));
      } catch (err) {
        console.error("Failed to parse saved translations:", err);
      }
    }
  }, []);

  const labels = UI_LABELS[selectedLanguage] || UI_LABELS.en;

  if (!analysis) return <div className="p-20 text-center">{labels.loading}</div>;

  const currentAnalysis = selectedLanguage === "en" 
    ? analysis 
    : translatedAnalysis[selectedLanguage] || analysis;

  const currentTerm = currentAnalysis.terms[selectedExplanation];

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

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/explanation")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {labels.back}
          </Button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-foreground">{labels.title}</h1>
            <p className="text-muted-foreground font-medium">{labels.subtitle}</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/3 lg:w-1/4">
            <Card className="p-4 border border-border sticky top-8">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2 mb-4">{labels.terms_header}</h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {currentAnalysis.terms.map((exp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedExplanation(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
                      selectedExplanation === idx 
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm" 
                        : "bg-transparent border-transparent text-foreground hover:bg-muted font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2">{exp.medicalTerm}</span>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        exp.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                        exp.severity === 'Attention' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} title={exp.severity} />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Content */}
          <main className="flex-1">
            {currentTerm && (
              <Card className="p-8 border border-border bg-white shadow-sm relative overflow-hidden">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-semibold text-primary uppercase tracking-wide">{labels.analysis_tag}</p>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                        currentTerm.severity === 'Critical' ? 'bg-red-600 text-white' :
                        currentTerm.severity === 'Attention' ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'
                      }`}>
                        {currentTerm.severity}
                      </div>
                    </div>
                    <h2 className="text-4xl font-extrabold text-foreground mb-2 leading-tight">
                      {currentTerm.medicalTerm}
                    </h2>
                    <div className="inline-block px-3 py-1 bg-secondary/20 rounded-lg text-secondary font-bold text-lg mb-4">
                      {currentTerm.simplifiedExplanation}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-1 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-muted-foreground uppercase">{labels.what_it_means}</h3>
                      <p className="text-foreground leading-relaxed text-lg">{currentTerm.whatItMeans}</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-muted-foreground uppercase">{labels.why_it_matters}</h3>
                      <p className="text-foreground leading-relaxed text-lg">{currentTerm.whyItMatters}</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-muted-foreground uppercase">{labels.next_steps}</h3>
                      <p className="text-foreground leading-relaxed text-lg">{currentTerm.nextSteps}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex flex-wrap gap-4">
                    <Button
                      onClick={() => handleSpeak(`${currentTerm.medicalTerm}. ${currentTerm.simplifiedExplanation}. ${currentTerm.whatItMeans}`)}
                      variant="outline"
                      className="rounded-full"
                    >
                      <Volume2 className="w-4 h-4 mr-2" /> {labels.listen}
                    </Button>
                    <Button
                      onClick={() => handleCopy(currentTerm.simplifiedExplanation, "term")}
                      variant="ghost"
                    >
                      <Copy className="w-4 h-4 mr-2" /> {labels.copy}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
