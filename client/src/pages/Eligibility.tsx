import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, XCircle, ArrowRight, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface Scheme {
  id: string;
  name: string;
  authority: string;
  description: string;
  benefit: string;
  status: "Eligible" | "Partial Match" | "Not Eligible";
  reasons: string[];
}

export default function Eligibility() {
  const [, navigate] = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<Scheme[] | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    income: 8000,
    is_rural: true,
    occupation: "Manual Labor",
    age: 45,
    has_motor_vehicle: false,
    has_refrigerator: false,
    has_landline: false,
    has_pucca_house: false,
    is_sc_st: true,
    ration_card: "bpl"
  });

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResults(data.schemes);
      // Save only eligible/partial matches for the report
      const eligible = data.schemes.filter((s: any) => s.status === "Eligible" || s.status === "Partial Match");
      localStorage.setItem("eligible_schemes", JSON.stringify(eligible));
    } catch (error) {
      console.error("Eligibility check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Eligible":
        return "bg-secondary/10 border-secondary text-secondary";
      case "Partial Match":
        return "bg-yellow-100 border-yellow-300 text-yellow-700";
      case "Not Eligible":
        return "bg-muted border-border text-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/explanation")}
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            ← Back to Explanation
          </button>
          <h1 className="text-2xl font-bold text-foreground">Government Scheme Eligibility</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Form Card */}
          <Card className="p-8 mb-8 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Enter Your Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="income">Monthly Family Income (₹)</Label>
                <Input 
                  id="income" 
                  type="number" 
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>Geography</Label>
                <Select 
                  value={formData.is_rural ? "rural" : "urban"}
                  onValueChange={(val) => setFormData({...formData, is_rural: val === "rural"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select geography" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rural">Rural (Village)</SelectItem>
                    <SelectItem value="urban">Urban (City)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>Ration Card Type</Label>
                <Select 
                  value={formData.ration_card}
                  onValueChange={(val) => setFormData({...formData, ration_card: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bpl">BPL Card (Blue/Yellow)</SelectItem>
                    <SelectItem value="antyodaya">Antyodaya (AYY)</SelectItem>
                    <SelectItem value="apl">APL Card (White)</SelectItem>
                    <SelectItem value="none">No Ration Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={formData.is_sc_st ? "sc_st" : "general"}
                  onValueChange={(val) => setFormData({...formData, is_sc_st: val === "sc_st"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sc_st">Scheduled Caste / Tribe (SC/ST)</SelectItem>
                    <SelectItem value="general">General / OBC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input 
                  id="occupation" 
                  value={formData.occupation}
                  placeholder="e.g. Farmer, Construction Worker"
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Motor Vehicle?</Label>
                  <Select 
                    value={formData.has_motor_vehicle ? "yes" : "no"}
                    onValueChange={(val) => setFormData({...formData, has_motor_vehicle: val === "yes"})}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Refrigerator?</Label>
                  <Select 
                    value={formData.has_refrigerator ? "yes" : "no"}
                    onValueChange={(val) => setFormData({...formData, has_refrigerator: val === "yes"})}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Landline?</Label>
                  <Select 
                    value={formData.has_landline ? "yes" : "no"}
                    onValueChange={(val) => setFormData({...formData, has_landline: val === "yes"})}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Pucca House?</Label>
                  <Select 
                    value={formData.has_pucca_house ? "yes" : "no"}
                    onValueChange={(val) => setFormData({...formData, has_pucca_house: val === "yes"})}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes (+3 rooms)</SelectItem>
                      <SelectItem value="no">No / Kucha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={isChecking}
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-white h-12 text-lg"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Eligibility...
                </>
              ) : (
                "Check Scheme Matches"
              )}
            </Button>
          </Card>

          {/* Results Area */}
          {results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-foreground">Available Schemes for You</h2>
              {results.map((scheme, idx) => (
                <Card key={idx} className={`p-6 border-l-8 ${
                  scheme.status === "Eligible" ? "border-l-secondary" : 
                  scheme.status === "Partial Match" ? "border-l-yellow-400" : "border-l-muted"
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{scheme.name}</h3>
                      <p className="text-sm text-muted-foreground">{scheme.authority}</p>
                    </div>
                    <Badge className={getStatusColor(scheme.status)}>
                      {scheme.status}
                    </Badge>
                  </div>
                  
                  <p className="text-foreground mb-4">{scheme.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Maximum Benefit</p>
                      <p className="font-bold text-secondary text-lg">{scheme.benefit}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Analysis Reasons:</p>
                    {scheme.reasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {scheme.status === "Eligible" ? (
                          <CheckCircle className="w-4 h-4 text-secondary" />
                        ) : scheme.status === "Partial Match" ? (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        {reason}
                      </div>
                    ))}
                  </div>

                </Card>
              ))}

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={() => setResults(null)}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted py-6 text-lg"
                >
                  Modify Details
                </Button>
                <Button
                  onClick={() => navigate("/pdf")}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2 py-6 text-lg"
                >
                  Generate Claim Ready Report
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
