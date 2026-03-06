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
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
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
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663396054467/CWjZTMXfdzT9dWLcnjpQ8h/hero-banner-WC5zGe63ewAyRmjgL7crJd.webp"
                  alt="Healthcare consultation"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full blur-3xl"></div>
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
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> AWS S3 integration
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
                  <Check className="w-4 h-4 text-secondary" /> Multi-language support
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Amazon Bedrock AI
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
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> DynamoDB database
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
                  <Check className="w-4 h-4 text-secondary" /> Diagnosis summary
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> Treatment details
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-secondary" /> AWS S3 storage
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

      {/* Tech Stack Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built on AWS Technology
              </h2>
              <p className="text-lg text-muted-foreground">
                Leveraging enterprise-grade cloud services for reliability and scalability.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Platform Overview</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-1 bg-primary rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Frontend</h4>
                        <p className="text-muted-foreground">React.js with Tailwind CSS for a responsive, accessible user interface</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1 bg-secondary rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Backend Orchestration</h4>
                        <p className="text-muted-foreground">AWS Lambda for serverless computation and workflow management</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1 bg-accent rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">AI & Language Processing</h4>
                        <p className="text-muted-foreground">Amazon Bedrock for clinical data extraction and Amazon Translate for multi-language support</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1 bg-chart-5 rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Data Management</h4>
                        <p className="text-muted-foreground">Amazon DynamoDB for scheme eligibility database and Amazon S3 for document storage</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="architecture" className="space-y-4">
                <Card className="p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">System Architecture</h3>
                  <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm text-foreground overflow-x-auto">
                    <pre>{`React Frontend
    ↓
API Gateway
    ↓
AWS Lambda Functions
    ├── Data Processing
    ├── AI Analysis (Bedrock)
    └── Eligibility Engine
    ↓
Data Layer
    ├── DynamoDB (Schemes)
    ├── S3 (Documents)
    └── RDS (User Data)`}</pre>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card className="p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Security Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Encrypted Data Transfer</p>
                        <p className="text-sm text-muted-foreground">All data transmitted over HTTPS with TLS encryption</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">AWS IAM Access Control</p>
                        <p className="text-sm text-muted-foreground">Role-based access control for all AWS services</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Data Privacy Compliance</p>
                        <p className="text-sm text-muted-foreground">HIPAA-compliant data handling and storage</p>
                      </div>
                    </li>
                  </ul>
                </Card>
              </TabsContent>
            </Tabs>
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
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2">
            Get Started Today <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">MediCare</h4>
              <p className="text-sm text-gray-300">Making healthcare accessible to everyone.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2026 MediCare Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
