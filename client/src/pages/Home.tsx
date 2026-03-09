import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Globe, Shield, FileText, Heart, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

/**
 * Design Philosophy: Empathetic Healthcare Minimalism
 * - Soft, calming colors (medical blue #0066CC, sage green #6B9E7F)
 * - Asymmetric layout with breathing room
 * - Progressive information disclosure
 * - Reassuring animations and micro-interactions
 */

import heroBanner from "@/assets/hero-banner.png";

export default function Home() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">MediCare</h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How It Works</a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => navigate("/upload")}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Healthcare Made <span className="text-primary">Simple</span> & <span className="text-secondary">Accessible</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Understand your medical condition in simple language, discover financial aid eligibility, and access support—all in one place.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={() => navigate("/upload")}>
                  Start Now <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="rounded-2xl overflow-hidden shadow-2xl max-w-[700px] border-4 border-white bg-white">
                <img
                  src={heroBanner}
                  alt="Healthcare consultation"
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Healthcare Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides four essential services to help you navigate healthcare with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1: Clinical Data Upload */}
            <Card className="p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663396054467/CWjZTMXfdzT9dWLcnjpQ8h/clinical-upload-icon-KhYgCgDZdE5YPjfYfVHA3m.webp"
                    alt="Clinical upload"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Clinical Data Upload</h3>
              <p className="text-muted-foreground mb-4">
                Easily upload patient medical records, test results, and clinical documents. Our system supports text uploads with plans to integrate forms and Excel imports.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Text document uploads
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Secure data handling
                </li>
              </ul>
            </Card>

            {/* Feature 2: Patient-Friendly Explanation */}
            <Card className="p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663396054467/CWjZTMXfdzT9dWLcnjpQ8h/language-translation-icon-6UFPXEHrPwjUAG498biiJc.webp"
                    alt="Language translation"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Patient-Friendly Explanation</h3>
              <p className="text-muted-foreground mb-4">
                Complex medical jargon converted into simple, understandable language. Translate explanations into regional languages for better comprehension.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Simplified medical terms
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Diagnosis summary
                </li>
              </ul>
            </Card>

            {/* Feature 3: Financial Eligibility */}
            <Card className="p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663396054467/CWjZTMXfdzT9dWLcnjpQ8h/financial-eligibility-icon-4D3ecnkHQmoQVimgFy3kuP.webp"
                    alt="Financial eligibility"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Financial Eligibility Matching</h3>
              <p className="text-muted-foreground mb-4">
                Automatically check eligibility for government, state-level, and NGO financial aid schemes to reduce out-of-pocket expenses.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Government schemes
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> NGO programs
                </li>
              </ul>
            </Card>

            {/* Feature 4: PDF Generation */}
            <Card className="p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663396054467/CWjZTMXfdzT9dWLcnjpQ8h/pdf-generation-icon-jrtuhEFaYszQJJqJM9u9Uc.webp"
                    alt="PDF generation"
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Claim Assistance PDF</h3>
              <p className="text-muted-foreground mb-4">
                Generate downloadable PDF documents containing diagnosis summary, treatment details, and scheme eligibility status for hospital submissions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Multi-language reports
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> All-in-one report (Diagnosis, medication, etc)
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our intuitive workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Upload Data", desc: "Submit your clinical documents securely" },
              { step: 2, title: "Get Explanation", desc: "Receive simplified medical information" },
              { step: 3, title: "Check Eligibility", desc: "Discover available financial aid schemes" },
              { step: 4, title: "Download PDF", desc: "Get your claim assistance document" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-lg p-6 border border-border text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 bg-primary rounded-full transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Simplify Your Healthcare Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients who are accessing better healthcare information and financial support.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={() => navigate("/upload")}>
            Get Started Today <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-8">
        <div className="container">
          <div className="text-center text-sm text-gray-300">
            <p>&copy; 2026 MediCare Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
