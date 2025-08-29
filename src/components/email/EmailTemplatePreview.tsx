"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Send,
  Eye,
  Code,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables?: string[];
}

interface PreviewData {
  template: EmailTemplate;
  processedVariables: Record<string, any>;
}

export function EmailTemplatePreview() {
  const [templates, setTemplates] = useState<
    Array<{ name: string; subject: string; variables: string[] }>
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/email/templates");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates);
          if (data.templates.length > 0) {
            setSelectedTemplate(data.templates[0].name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Load preview when template or variables change
  useEffect(() => {
    if (selectedTemplate) {
      loadPreview();
    }
  }, [selectedTemplate, variables]);

  const loadPreview = async () => {
    if (!selectedTemplate) return;

    setPreviewLoading(true);
    try {
      const response = await fetch("/api/email/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: selectedTemplate,
          variables,
          preview: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
      }
    } catch (error) {
      console.error("Failed to load preview:", error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!selectedTemplate) return;

    setSendingTest(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/email/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: selectedTemplate,
          variables,
          preview: false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: `Test email sent successfully to ${data.sentTo}`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "Failed to send test email",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Network error while sending test email",
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const currentTemplate = templates.find(t => t.name === selectedTemplate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Template Preview</h2>
          <p className="text-gray-600">Preview and test your email templates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline">{templates.length} templates</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection & Variables */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Select Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map(template => (
                  <div
                    key={template.name}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.name
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedTemplate(template.name)}
                  >
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                    {template.variables && template.variables.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map(variable => (
                            <Badge key={variable} variant="secondary" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Variables */}
          {currentTemplate && currentTemplate.variables && currentTemplate.variables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Template Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTemplate.variables.map(variable => (
                    <div key={variable}>
                      <Label htmlFor={variable} className="text-sm font-medium">
                        {variable.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <Input
                        id={variable}
                        value={variables[variable] || ""}
                        onChange={e => handleVariableChange(variable, e.target.value)}
                        placeholder={`Enter ${variable}`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={loadPreview}
                  variant="outline"
                  className="w-full"
                  disabled={previewLoading}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewLoading ? "Loading..." : "Refresh Preview"}
                </Button>

                <Button
                  onClick={sendTestEmail}
                  className="w-full"
                  disabled={sendingTest || !selectedTemplate}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendingTest ? "Sending..." : "Send Test Email"}
                </Button>

                {testResult && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      testResult.success
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {testResult.success ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 mr-2" />
                      )}
                      {testResult.message}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          {previewData ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Preview: {previewData.template.name}</span>
                  <Badge variant="outline">{previewData.template.subject}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html" className="h-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html">HTML Preview</TabsTrigger>
                    <TabsTrigger value="text">Text Version</TabsTrigger>
                  </TabsList>

                  <TabsContent value="html" className="mt-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b text-sm text-gray-600">
                        Subject: {previewData.template.subject}
                      </div>
                      <div className="bg-white">
                        <iframe
                          srcDoc={previewData.template.html}
                          className="w-full h-96 border-0"
                          title="Email Preview"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="mt-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b text-sm text-gray-600">
                        Text Version
                      </div>
                      <div className="p-4 bg-white">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                          {previewData.template.text || "No text version available"}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <div className="text-center text-gray-500">
                  {previewLoading ? (
                    <div className="flex flex-col items-center">
                      <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                      <p>Loading preview...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Eye className="h-8 w-8 mb-2" />
                      <p>Select a template to see preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
