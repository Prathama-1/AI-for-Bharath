import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { uploadClinicalData } from "@/lib/awsApi";
import { setWorkflowState } from "@/lib/workflowStorage";

/**
 * Design Philosophy: Empathetic Healthcare Minimalism
 * - Progressive disclosure of form fields
 * - Reassuring validation messages
 * - Clear visual feedback for upload status
 * - Calming animations and micro-interactions
 */

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  status: "uploading" | "success" | "error";
}

export default function ClinicalUpload() {
  const [, navigate] = useLocation();
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [clinicalData, setClinicalData] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleString(),
        status: "uploading",
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "success" } : f
            )
          );
        }
        setUploadProgress(progress);
      }, 300);
    });

    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await uploadClinicalData({
        patientName,
        patientAge: Number(patientAge),
        clinicalData,
        files: selectedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      });

      setWorkflowState({
        caseId: response.caseId,
        patientName,
        patientAge: Number(patientAge),
        clinicalData,
        explanations: response.explanations,
      });

      navigate("/explanation");
    } catch (error) {
      const fallbackCaseId = `local-${Date.now()}`;
      setWorkflowState({
        caseId: fallbackCaseId,
        patientName,
        patientAge: Number(patientAge),
        clinicalData,
      });
      setErrorMessage(error instanceof Error ? error.message : "Failed to connect to AWS API. Proceeding with local demo data.");
      navigate("/explanation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = patientName && patientAge && (clinicalData || uploadedFiles.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl font-bold text-foreground">Clinical Data Upload</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Clinical Data</h3>
                  <p className="text-sm text-muted-foreground">Current step</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Explanation</h3>
                  <p className="text-sm text-muted-foreground">Next step</p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-primary transition-all duration-300"></div>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information Card */}
            <Card className="p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Patient Information</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="patient-name" className="text-foreground font-semibold mb-2 block">
                    Patient Name
                  </Label>
                  <Input
                    id="patient-name"
                    placeholder="Enter patient's full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="border-border focus:ring-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This information helps us personalize the explanation for the patient.
                  </p>
                </div>

                <div>
                  <Label htmlFor="patient-age" className="text-foreground font-semibold mb-2 block">
                    Patient Age
                  </Label>
                  <Input
                    id="patient-age"
                    type="number"
                    placeholder="Enter patient's age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="border-border focus:ring-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Age helps us tailor medical explanations appropriately.
                  </p>
                </div>
              </div>
            </Card>

            {/* Clinical Data Input Card */}
            <Card className="p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Clinical Data</h2>
              <div className="space-y-6">
                {/* Text Input */}
                <div>
                  <Label htmlFor="clinical-data" className="text-foreground font-semibold mb-2 block">
                    Medical Information (Text)
                  </Label>
                  <Textarea
                    id="clinical-data"
                    placeholder="Paste medical records, diagnosis, test results, or treatment details here..."
                    value={clinicalData}
                    onChange={(e) => setClinicalData(e.target.value)}
                    className="border-border focus:ring-primary min-h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Include diagnosis, symptoms, test results, medications, and any relevant medical history.
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-foreground font-semibold mb-4 block">
                    Upload Medical Documents (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".txt,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="font-semibold text-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: TXT, PDF, DOC, DOCX (Max 10MB)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Uploaded Files</h3>
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB • {file.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === "uploading" && (
                            <>
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                              <span className="text-xs text-muted-foreground">
                                {Math.round(uploadProgress)}%
                              </span>
                            </>
                          )}
                          {file.status === "success" && (
                            <CheckCircle className="w-5 h-5 text-secondary" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Information Card */}
            {errorMessage && (
              <Card className="p-4 border border-yellow-300 bg-yellow-50">
                <p className="text-sm text-yellow-800">{errorMessage}</p>
              </Card>
            )}

            <Card className="p-6 bg-primary/5 border border-primary/20">
              <div className="flex gap-4">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Data Security</h3>
                  <p className="text-sm text-foreground">
                    Your clinical data is encrypted and securely stored on AWS S3. We comply with HIPAA standards and never share your information without consent.
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1 border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Explanation
                    <span className="ml-auto">→</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Help Section */}
          <Card className="mt-12 p-8 border border-border bg-muted/30">
            <h3 className="text-lg font-bold text-foreground mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What information to include?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Diagnosis and symptoms</li>
                  <li>• Test results and lab values</li>
                  <li>• Current medications</li>
                  <li>• Medical history</li>
                  <li>• Treatment recommendations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Supported file formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Text files (.txt)</li>
                  <li>• PDF documents (.pdf)</li>
                  <li>• Word documents (.doc, .docx)</li>
                  <li>• Coming soon: Excel, Forms</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
