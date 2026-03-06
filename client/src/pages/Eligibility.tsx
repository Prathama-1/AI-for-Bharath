import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

/**
 * Design Philosophy: Empathetic Healthcare Minimalism
 * - Color-coded eligibility status (green for eligible, yellow for partial, gray for ineligible)
 * - Clear visual hierarchy for scheme information
 * - Reassuring presentation of financial aid opportunities
 */

interface Scheme {
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

const mockSchemes: Scheme[] = [
  {
    id: "1",
    name: "Ayushman Bharat - PMJAY",
    provider: "Government of India",
    type: "government",
    eligibilityStatus: "eligible",
    maxBenefit: "₹5,00,000 per year",
    description: "National health protection scheme providing cashless hospitalization benefits to eligible families.",
    requirements: ["Annual family income below ₹5 lakhs", "Registered under SECC database", "Valid Aadhaar card"],
    applicationProcess: "Visit nearest PMJAY enrollment center or apply through state health portal",
    contactInfo: "1800-180-1104 (Toll-free)",
  },
  {
    id: "2",
    name: "Rajiv Gandhi Jeevandayee Arogya Yojana",
    provider: "Maharashtra State",
    type: "state",
    eligibilityStatus: "eligible",
    maxBenefit: "₹1,50,000 per year",
    description: "State-level scheme providing free treatment for serious illnesses at empaneled hospitals.",
    requirements: ["Annual family income below ₹1 lakh", "Registered under BPL category", "Valid ration card"],
    applicationProcess: "Apply at district health office with required documents",
    contactInfo: "022-2345-6789",
  },
  {
    id: "3",
    name: "Rashtriya Swasthya Bima Yojana",
    provider: "Government of India",
    type: "government",
    eligibilityStatus: "partial",
    maxBenefit: "₹30,000 per family",
    description: "Health insurance scheme for unorganized sector workers providing cashless treatment.",
    requirements: ["Unorganized sector worker", "Annual income below ₹2.5 lakhs", "Valid employment proof"],
    applicationProcess: "Enroll through employer or labor department",
    contactInfo: "1800-2000-1234",
  },
  {
    id: "4",
    name: "Health for All Foundation",
    provider: "NGO",
    type: "ngo",
    eligibilityStatus: "eligible",
    maxBenefit: "₹2,00,000 for critical cases",
    description: "NGO providing financial assistance for critical illnesses and emergency medical treatment.",
    requirements: ["Below poverty line", "Medical emergency certification", "Income proof"],
    applicationProcess: "Submit application with medical documents to foundation office",
    contactInfo: "healthforall@ngo.org | 9876-543-210",
  },
  {
    id: "5",
    name: "Chief Minister Relief Fund",
    provider: "State Government",
    type: "state",
    eligibilityStatus: "ineligible",
    maxBenefit: "Variable",
    description: "Emergency relief fund for citizens facing severe financial hardship due to medical emergencies.",
    requirements: ["Extreme financial hardship", "Medical emergency", "State residency"],
    applicationProcess: "Apply through district collector's office",
    contactInfo: "District Collector Office",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "eligible":
      return "bg-secondary/10 border-secondary text-secondary";
    case "partial":
      return "bg-yellow-100 border-yellow-300 text-yellow-700";
    case "ineligible":
      return "bg-muted border-border text-muted-foreground";
    default:
      return "";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "eligible":
      return <CheckCircle className="w-5 h-5 text-secondary" />;
    case "partial":
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    case "ineligible":
      return <XCircle className="w-5 h-5 text-muted-foreground" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "eligible":
      return "Eligible";
    case "partial":
      return "Partially Eligible";
    case "ineligible":
      return "Not Eligible";
    default:
      return "";
  }
};

export default function Eligibility() {
  const [, navigate] = useLocation();
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  const eligibleSchemes = mockSchemes.filter((s) => s.eligibilityStatus === "eligible");
  const partialSchemes = mockSchemes.filter((s) => s.eligibilityStatus === "partial");
  const ineligibleSchemes = mockSchemes.filter((s) => s.eligibilityStatus === "ineligible");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}\n      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/explanation")}
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            ← Back to Explanation
          </button>
          <h1 className="text-2xl font-bold text-foreground">Financial Eligibility</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
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
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Check Eligibility</h3>
                  <p className="text-sm text-muted-foreground">Current step</p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-full bg-primary transition-all duration-300"></div>
            </div>
          </div>

          {/* Summary Card */}
          <Card className="p-8 mb-8 border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Financial Aid Summary</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary mb-2">{eligibleSchemes.length}</p>
                <p className="text-foreground font-semibold">Eligible Schemes</p>
                <p className="text-sm text-muted-foreground">You qualify for these programs</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-600 mb-2">{partialSchemes.length}</p>
                <p className="text-foreground font-semibold">Partial Match</p>
                <p className="text-sm text-muted-foreground">May qualify with additional info</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-muted-foreground mb-2">{ineligibleSchemes.length}</p>
                <p className="text-foreground font-semibold">Not Eligible</p>
                <p className="text-sm text-muted-foreground">Don't meet current criteria</p>
              </div>
            </div>
          </Card>

          {/* Eligible Schemes */}
          {eligibleSchemes.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-secondary" />
                Schemes You Qualify For
              </h3>
              <div className="space-y-4">
                {eligibleSchemes.map((scheme) => (
                  <Card
                    key={scheme.id}
                    className="p-6 border border-secondary/30 bg-secondary/5 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-foreground">{scheme.name}</h4>
                          <Badge className="bg-secondary text-white">{getStatusLabel(scheme.eligibilityStatus)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{scheme.provider}</p>
                        <p className="text-foreground mb-3">{scheme.description}</p>
                        <p className="text-lg font-semibold text-secondary">Maximum Benefit: {scheme.maxBenefit}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
                    </div>

                    {expandedScheme === scheme.id && (
                      <div className="mt-6 pt-6 border-t border-secondary/20 space-y-4">
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Requirements:</h5>
                          <ul className="space-y-1">
                            {scheme.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                                <span className="text-secondary mt-1">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Application Process:</h5>
                          <p className="text-sm text-foreground">{scheme.applicationProcess}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Contact Information:</h5>
                          <p className="text-sm text-foreground">{scheme.contactInfo}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Partial Schemes */}
          {partialSchemes.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                Schemes You May Qualify For
              </h3>
              <div className="space-y-4">
                {partialSchemes.map((scheme) => (
                  <Card
                    key={scheme.id}
                    className="p-6 border border-yellow-300/30 bg-yellow-50/30 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setExpandedScheme(expandedScheme === scheme.id ? null : scheme.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-foreground">{scheme.name}</h4>
                          <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">
                            {getStatusLabel(scheme.eligibilityStatus)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{scheme.provider}</p>
                        <p className="text-foreground mb-3">{scheme.description}</p>
                        <p className="text-lg font-semibold text-yellow-700">Maximum Benefit: {scheme.maxBenefit}</p>
                      </div>
                      <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    </div>

                    {expandedScheme === scheme.id && (
                      <div className="mt-6 pt-6 border-t border-yellow-300/20 space-y-4">
                        <div>
                          <h5 className="font-semibold text-foreground mb-2">Requirements:</h5>
                          <ul className="space-y-1">
                            {scheme.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                                <span className="text-yellow-600 mt-1">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> You may qualify for this scheme if you meet additional criteria. Please verify your eligibility before applying.
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Information Card */}
          <Card className="p-6 bg-primary/5 border border-primary/20 mb-8">
            <div className="flex gap-4">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Database Powered by AWS DynamoDB</h3>
                <p className="text-sm text-foreground">
                  This eligibility matching is powered by AWS DynamoDB, which stores comprehensive data on government, state-level, and NGO financial aid schemes. The system uses custom rule-based logic to match your profile against available programs.
                </p>
              </div>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/explanation")}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              ← Back to Explanation
            </Button>
            <Button
              onClick={() => navigate("/pdf")}
              className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
            >
              Generate Claim PDF
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
