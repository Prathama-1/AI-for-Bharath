import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Volume2, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
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
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
];

export default function Explanation() {
  const [, navigate] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedExplanation, setSelectedExplanation] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const currentExplanation = mockExplanations[selectedExplanation];
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
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
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
          </Card>

          {/* Explanation Tabs */}
          <Tabs value={selectedExplanation.toString()} onValueChange={(v) => setSelectedExplanation(parseInt(v))}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {mockExplanations.map((exp, idx) => (
                <TabsTrigger key={idx} value={idx.toString()}>
                  {exp.medicalTerm}
                </TabsTrigger>
              ))}
            </TabsList>

            {mockExplanations.map((explanation, idx) => (
              <TabsContent key={idx} value={idx.toString()} className="space-y-6">
                {/* Main Explanation Card */}
                <Card className="p-8 border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="space-y-6">
                    {/* Medical Term */}
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Medical Term</p>
                      <h2 className="text-4xl font-bold text-foreground mb-2">{explanation.medicalTerm}</h2>
                      <p className="text-lg text-secondary font-semibold">{explanation.simplifiedExplanation}</p>
                    </div>

                    {/* Audio Control */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSpeak(explanation.simplifiedExplanation)}
                        variant="outline"
                        className="gap-2 border-primary text-primary hover:bg-primary/10"
                      >
                        <Volume2 className="w-4 h-4" />
                        {isSpeaking ? "Stop" : "Listen"}
                      </Button>
                      <Button
                        onClick={() => handleCopy(explanation.simplifiedExplanation, "term")}
                        variant="outline"
                        className="gap-2 border-border text-foreground hover:bg-muted"
                      >
                        {copiedSection === "term" ? (
                          <>
                            <Check className="w-4 h-4" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Detailed Explanations */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* What It Means */}
                  <Card className="p-6 border border-border">
                    <h3 className="text-lg font-bold text-foreground mb-4">What It Means</h3>
                    <p className="text-foreground leading-relaxed mb-4">{explanation.whatItMeans}</p>
                    <Button
                      onClick={() => handleCopy(explanation.whatItMeans, "meaning")}
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:bg-primary/10 gap-2"
                    >
                      {copiedSection === "meaning" ? (
                        <>
                          <Check className="w-4 h-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy
                        </>
                      )}
                    </Button>
                  </Card>

                  {/* Why It Matters */}
                  <Card className="p-6 border border-border">
                    <h3 className="text-lg font-bold text-foreground mb-4">Why It Matters</h3>
                    <p className="text-foreground leading-relaxed mb-4">{explanation.whyItMatters}</p>
                    <Button
                      onClick={() => handleCopy(explanation.whyItMatters, "importance")}
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:bg-primary/10 gap-2"
                    >
                      {copiedSection === "importance" ? (
                        <>
                          <Check className="w-4 h-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy
                        </>
                      )}
                    </Button>
                  </Card>
                </div>

                {/* Next Steps */}
                <Card className="p-6 border border-border bg-secondary/5">
                  <h3 className="text-lg font-bold text-foreground mb-4">Recommended Next Steps</h3>
                  <p className="text-foreground leading-relaxed mb-4">{explanation.nextSteps}</p>
                  <Button
                    onClick={() => handleCopy(explanation.nextSteps, "steps")}
                    size="sm"
                    variant="ghost"
                    className="text-secondary hover:bg-secondary/10 gap-2"
                  >
                    {copiedSection === "steps" ? (
                      <>
                        <Check className="w-4 h-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy
                      </>
                    )}
                  </Button>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

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
