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
  simplifiedExplanation: string;
  whatItMeans: string;
  whyItMatters: string;
  nextSteps: string;
}

const mockExplanations: ExplanationContent[] = [
  {
    medicalTerm: "Hypertension",
    simplifiedExplanation: "High blood pressure",
    whatItMeans: "Your blood is pushing too hard against the walls of your blood vessels. Think of it like water pressure in a hose that's too high.",
    whyItMatters: "If left untreated, high blood pressure can damage your heart, kidneys, and brain over time. It's important to manage it through lifestyle changes and medication if needed.",
    nextSteps: "Monitor your blood pressure regularly, reduce salt intake, exercise daily, manage stress, and take prescribed medications as directed.",
  },
  {
    medicalTerm: "Diabetes Type 2",
    simplifiedExplanation: "High blood sugar levels",
    whatItMeans: "Your body has trouble using or making insulin, a hormone that helps control blood sugar. This causes sugar to build up in your blood.",
    whyItMatters: "High blood sugar can damage your eyes, kidneys, nerves, and heart. Early detection and management can prevent serious complications.",
    nextSteps: "Maintain a healthy diet, exercise regularly, monitor blood sugar levels, take medications as prescribed, and attend regular check-ups.",
  },
  {
    medicalTerm: "Anemia",
    simplifiedExplanation: "Low red blood cell count",
    whatItMeans: "You don't have enough red blood cells or hemoglobin (the protein that carries oxygen). This means your body gets less oxygen than it needs.",
    whyItMatters: "Anemia can cause fatigue, weakness, and shortness of breath. Treating the underlying cause is important for your overall health.",
    nextSteps: "Eat iron-rich foods, take iron supplements if prescribed, treat underlying causes, and have regular blood tests to monitor your levels.",
  },
];

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
];

// Language selection logic...

export default function Explanation() {
  const [, navigate] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [explanations, setExplanations] = useState<ExplanationContent[]>(mockExplanations);
  const [translatedExplanations, setTranslatedExplanations] = useState<Record<string, ExplanationContent[]>>({});
  const [selectedExplanation, setSelectedExplanation] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    // Load analysis from localStorage
    const savedAnalysis = localStorage.getItem("medical_analysis");
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExplanations(parsed);
        }
      } catch (err) {
        console.error("Failed to parse saved analysis:", err);
      }
    }
  }, []);

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === "en" || translatedExplanations[lang]) return;

    setIsTranslating(true);
    try {
      const translatedItems = await Promise.all(
        explanations.map(async (exp) => {
          const fieldsToTranslate = [
            { key: "medicalTerm", text: exp.medicalTerm },
            { key: "simplifiedExplanation", text: exp.simplifiedExplanation },
            { key: "whatItMeans", text: exp.whatItMeans },
            { key: "whyItMatters", text: exp.whyItMatters },
            { key: "nextSteps", text: exp.nextSteps },
          ];

          const translatedObj: any = {};
          for (const field of fieldsToTranslate) {
            const res = await fetch("http://localhost:5000/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: field.text, target_lang: lang }),
            });
            const data = await res.json();
            translatedObj[field.key] = data.translatedText;
          }
          return translatedObj as ExplanationContent;
        })
      );

      setTranslatedExplanations(prev => ({ ...prev, [lang]: translatedItems }));
    } catch (error) {
      console.error("Translation Error:", error);
      alert("Translation failed. Please try again later.");
      setSelectedLanguage("en");
    } finally {
      setIsTranslating(false);
    }
  };

  const currentExplanations = selectedLanguage === "en" 
    ? explanations 
    : translatedExplanations[selectedLanguage] || explanations;

  const currentExplanation = currentExplanations[selectedExplanation];
  const languageName = languages.find((l) => l.code === selectedLanguage)?.name || "English";

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

          {/* Language Selection */}
          <Card className="p-6 mb-8 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Language Preference</h3>
                  <p className="text-sm text-muted-foreground">Select your preferred language for explanations</p>
                </div>
              </div>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange} disabled={isTranslating}>
                <SelectTrigger className="w-40 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isTranslating && (
              <div className="mt-4 flex items-center gap-2 text-primary font-medium animate-pulse">
                <Globe className="w-4 h-4 animate-spin" />
                Translating to {languageName}...
              </div>
            )}
          </Card>

          {/* Explanation Layout */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / List of Terms */}
            <aside className="w-full md:w-1/3 lg:w-1/4">
              <Card className="p-4 border border-border sticky top-24">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2 mb-4">Terms to Understand</h3>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {currentExplanations.map((exp, idx) => (
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
                        <span className="truncate">{exp.medicalTerm}</span>
                        {selectedExplanation === idx && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </aside>

            {/* Content Area */}
            <main className="flex-1 space-y-6">
              {currentExplanation && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  {/* Main Explanation Card */}
                  <Card className="p-8 border border-border bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="space-y-6 relative z-10">
                      {/* Medical Term */}
                      <div>
                        <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-2">
                          <Check className="w-4 h-4" /> Medical Term Analysis
                        </p>
                        <h2 className="text-4xl font-extrabold text-foreground mb-2 leading-tight">
                          {currentExplanation.medicalTerm}
                        </h2>
                        <div className="inline-block px-3 py-1 bg-secondary/20 rounded-lg text-secondary font-bold text-lg mb-4">
                          {currentExplanation.simplifiedExplanation}
                        </div>
                      </div>

                      {/* Audio Control */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleSpeak(`${currentExplanation.medicalTerm}. ${currentExplanation.simplifiedExplanation}. ${currentExplanation.whatItMeans}`)}
                          variant="outline"
                          className="gap-2 border-primary text-primary hover:bg-primary/10 rounded-full px-6"
                        >
                          <Volume2 className="w-4 h-4" />
                          {isSpeaking ? "Stop" : "Listen Explanation"}
                        </Button>
                        <Button
                          onClick={() => handleCopy(currentExplanation.simplifiedExplanation, "term")}
                          variant="ghost"
                          className="gap-2 text-muted-foreground hover:bg-muted"
                        >
                          {copiedSection === "term" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          Copy Info
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Detailed Explanations Grid */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* What It Means */}
                    <Card className="p-6 border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                        <h3 className="text-xl font-bold text-foreground">What It Means</h3>
                      </div>
                      <p className="text-foreground leading-relaxed mb-6 text-lg">{currentExplanation.whatItMeans}</p>
                      <Button
                        onClick={() => handleCopy(currentExplanation.whatItMeans, "meaning")}
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:bg-primary/10 gap-2 w-full justify-start"
                      >
                        {copiedSection === "meaning" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedSection === "meaning" ? "Copied to Clipboard" : "Copy Description"}
                      </Button>
                    </Card>

                    {/* Why It Matters */}
                    <Card className="p-6 border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold">2</div>
                        <h3 className="text-xl font-bold text-foreground">Why It Matters</h3>
                      </div>
                      <p className="text-foreground leading-relaxed mb-6 text-lg">{currentExplanation.whyItMatters}</p>
                      <Button
                        onClick={() => handleCopy(currentExplanation.whyItMatters, "importance")}
                        size="sm"
                        variant="ghost"
                        className="text-secondary hover:bg-secondary/10 gap-2 w-full justify-start"
                      >
                        {copiedSection === "importance" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedSection === "importance" ? "Copied" : "Copy Importance"}
                      </Button>
                    </Card>
                  </div>

                  {/* Next Steps */}
                  <Card className="p-8 border border-secondary/20 bg-secondary/5 relative overflow-hidden group">
                    <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-32 h-32 -mr-8 -mb-8" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">3</div>
                        Recommended Next Steps
                      </h3>
                      <p className="text-foreground leading-relaxed mb-6 text-lg font-medium">{currentExplanation.nextSteps}</p>
                      <Button
                        onClick={() => handleCopy(currentExplanation.nextSteps, "steps")}
                        size="sm"
                        variant="secondary"
                        className="gap-2 px-8 rounded-full"
                      >
                        {copiedSection === "steps" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedSection === "steps" ? "Copied" : "Copy Next Steps"}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </main>
          </div>

          {/* Information Card */}
          <Card className="mt-8 p-6 bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-2">Translation Powered by AWS</h3>
            <p className="text-sm text-foreground">
              These explanations are automatically translated using Amazon Translate. The simplified language is generated by Amazon Bedrock AI to ensure clarity and accuracy.
            </p>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            <Button
              onClick={() => navigate("/upload")}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              ← Back to Upload
            </Button>
            <Button
              onClick={() => navigate("/eligibility")}
              className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
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
