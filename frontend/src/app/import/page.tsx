"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
  Info,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import Link from "next/link";

// Example data for reference
const EXAMPLE_CRM_A = [
  { deal_id: "A1", total: 5000, rep_name: "Ana Pérez", sold_at: "2024-03-01" },
  {
    deal_id: "A2",
    amount: 4500,
    rep_name: "Juan Gómez",
    created_on: "2024-03-02",
  },
];

const EXAMPLE_CRM_B = `opportunity_id,amount,seller,deal_date
B1,3000,Carlos García,2024/03/03
B2,4500,Maria García,2024/03/04`;

export default function ImportPage() {
  const [isLoadingCrmA, setIsLoadingCrmA] = useState(false);
  const [isLoadingCrmB, setIsLoadingCrmB] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showExampleA, setShowExampleA] = useState(false);
  const [showExampleB, setShowExampleB] = useState(false);

  const handleJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is JSON
      if (!file.name.toLowerCase().endsWith(".json")) {
        toast.error("Invalid file type", {
          description: "Please upload a JSON file (.json)",
        });
        e.target.value = "";
        return;
      }

      setJsonFile(file);
      // Clear the textarea when a file is selected
      setJsonData("");
      toast.info("File selected", {
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      });
    }
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is CSV
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error("Invalid file type", {
          description: "Please upload a CSV file (.csv)",
        });
        e.target.value = "";
        return;
      }

      setCsvFile(file);
      toast.info("File selected", {
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      });
    }
  };

  const validateCrmAData = (data: any[]): boolean => {
    // Basic validation for CRM A data structure
    for (const item of data) {
      // Check if each item has either deal_id or id
      if (!item.deal_id) {
        toast.error("Invalid data format", {
          description: "Each item must have a deal_id field",
        });
        return false;
      }

      // Check if each item has either total or amount
      if (item.total === undefined && item.amount === undefined) {
        toast.error("Invalid data format", {
          description: "Each item must have either a total or amount field",
        });
        return false;
      }

      // Check if each item has rep_name
      if (!item.rep_name) {
        toast.error("Invalid data format", {
          description: "Each item must have a rep_name field",
        });
        return false;
      }

      // Check if each item has either sold_at or created_on
      if (!item.sold_at && !item.created_on) {
        toast.error("Invalid data format", {
          description:
            "Each item must have either a sold_at or created_on field",
        });
        return false;
      }
    }

    return true;
  };

  const importCrmA = async () => {
    try {
      setIsLoadingCrmA(true);
      setError(null);
      setSuccess(null);

      let data: any[] = [];

      if (jsonFile) {
        // Read the JSON file
        const text = await jsonFile.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(
            "Invalid JSON file format. Please check the file contents."
          );
        }
      } else if (jsonData.trim()) {
        // Parse the JSON from textarea
        try {
          data = JSON.parse(jsonData);
        } catch (e) {
          throw new Error(
            "Invalid JSON format in the text area. Please check your input."
          );
        }
      } else {
        throw new Error("Please provide JSON data or upload a JSON file");
      }

      // Validate that data is an array
      if (!Array.isArray(data)) {
        throw new Error("Data must be an array of deals");
      }

      // Validate the data structure
      if (!validateCrmAData(data)) {
        throw new Error(
          "Invalid data structure. Please check the example format."
        );
      }

      // Send the data to the API
      const response = await fetch("http://localhost:3001/deals/import/crm-a", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message ||
            `Failed to import CRM A data: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      const count =
        typeof result === "number" ? result : result.count || "multiple";
      setSuccess(`Successfully imported ${count} deals from CRM A`);
      toast.success("Import Successful", {
        description: `Imported ${count} deals from CRM A`,
      });

      // Clear the form
      setJsonData("");
      setJsonFile(null);
      if (document.getElementById("json-file") as HTMLInputElement) {
        (document.getElementById("json-file") as HTMLInputElement).value = "";
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error("Import Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoadingCrmA(false);
    }
  };

  const importCrmB = async () => {
    try {
      setIsLoadingCrmB(true);
      setError(null);
      setSuccess(null);

      if (!csvFile) {
        throw new Error("Please select a CSV file to upload");
      }

      // Basic validation of CSV content
      const csvContent = await csvFile.text();
      if (
        !csvContent.includes("opportunity_id") ||
        !csvContent.includes("amount") ||
        !csvContent.includes("seller") ||
        !csvContent.includes("deal_date")
      ) {
        throw new Error(
          "CSV file must include headers: opportunity_id, amount, seller, deal_date"
        );
      }

      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await fetch("http://localhost:3001/deals/import/crm-b", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message ||
            `Failed to import CRM B data: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      const count =
        typeof result === "number" ? result : result.count || "multiple";
      setSuccess(`Successfully imported ${count} deals from CRM B`);
      toast.success("Import Successful", {
        description: `Imported ${count} deals from CRM B`,
      });

      // Clear the form
      setCsvFile(null);
      if (document.getElementById("csv-file") as HTMLInputElement) {
        (document.getElementById("csv-file") as HTMLInputElement).value = "";
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error("Import Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoadingCrmB(false);
    }
  };

  const fillExampleDataA = () => {
    setJsonData(JSON.stringify(EXAMPLE_CRM_A, null, 2));
    setJsonFile(null);
    if (document.getElementById("json-file") as HTMLInputElement) {
      (document.getElementById("json-file") as HTMLInputElement).value = "";
    }
    toast.info("Example data loaded", {
      description: "You can now import this example data or modify it",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold ">Import CRM Data</h1>
      </div>

      <Tabs defaultValue="crm-a" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="crm-a">CRM A Import</TabsTrigger>
          <TabsTrigger value="crm-b">CRM B Import</TabsTrigger>
        </TabsList>

        <TabsContent value="crm-a">
          <Card>
            <CardHeader>
              <CardTitle>Import CRM A Data</CardTitle>
              <CardDescription>
                Import deals from CRM A by providing JSON data or uploading a
                JSON file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Data Format</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExampleA(!showExampleA)}
                >
                  {showExampleA ? "Hide Example" : "Show Example"}
                </Button>
              </div>

              {showExampleA && (
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs">
                    {JSON.stringify(EXAMPLE_CRM_A, null, 2)}
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={fillExampleDataA}
                  >
                    Use This Example
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="json-file"
                  className="block text-sm font-medium"
                >
                  Upload JSON File
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="json-file"
                    type="file"
                    accept=".json"
                    onChange={handleJsonFileChange}
                    className="flex-1"
                  />
                  {jsonFile && (
                    <div className="text-sm text-muted-foreground">
                      {jsonFile.name} ({Math.round(jsonFile.size / 1024)} KB)
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="json-data"
                  className="block text-sm font-medium"
                >
                  Or Paste JSON Data
                </label>
                <Textarea
                  id="json-data"
                  placeholder='[{"deal_id": "A1", "total": 5000, "rep_name": "Ana Pérez", "sold_at": "2024-03-01"}, ...]'
                  rows={10}
                  value={jsonData}
                  onChange={(e) => {
                    setJsonData(e.target.value);
                    setJsonFile(null); // Clear file selection when typing in textarea
                    if (
                      document.getElementById("json-file") as HTMLInputElement
                    ) {
                      (
                        document.getElementById("json-file") as HTMLInputElement
                      ).value = "";
                    }
                  }}
                  className="font-mono"
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Required Fields</AlertTitle>
                <AlertDescription className="flex">
                  Each record must have:{" "}
                  <code className="bg-muted px-1 rounded">deal_id</code>,
                  <code className="bg-muted px-1 rounded">total</code> or{" "}
                  <code className="bg-muted px-1 rounded">amount</code>,
                  <code className="bg-muted px-1 rounded">rep_name</code>, and
                  <code className="bg-muted px-1 rounded">sold_at</code> or{" "}
                  <code className="bg-muted px-1 rounded">created_on</code>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                onClick={importCrmA}
                disabled={isLoadingCrmA || (!jsonData && !jsonFile)}
                className="w-full"
              >
                {isLoadingCrmA ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Importing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Import CRM A Data
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="crm-b">
          <Card>
            <CardHeader>
              <CardTitle>Import CRM B Data</CardTitle>
              <CardDescription>
                Import deals from CRM B by uploading a CSV file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">CSV Format</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExampleB(!showExampleB)}
                >
                  {showExampleB ? "Hide Example" : "Show Example"}
                </Button>
              </div>

              {showExampleB && (
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {EXAMPLE_CRM_B}
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      // Create and download example CSV file
                      const blob = new Blob([EXAMPLE_CRM_B], {
                        type: "text/csv",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "crm_b_example.csv";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);

                      toast.info("Example CSV downloaded", {
                        description: "You can modify this file and upload it",
                      });
                    }}
                  >
                    Download Example CSV
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="csv-file" className="block text-sm font-medium">
                  Upload CSV File
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="flex-1"
                  />
                  {csvFile && (
                    <div className="text-sm text-muted-foreground">
                      {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
                    </div>
                  )}
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>CSV Requirements</AlertTitle>
                <AlertDescription>
                  <p>The CSV file must include these headers:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>
                      <code className="bg-muted px-1 rounded">
                        opportunity_id
                      </code>{" "}
                      - Unique identifier for the deal
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">amount</code> -
                      Deal value
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">seller</code> -
                      Name of the sales representative
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">deal_date</code> -
                      Date in YYYY/MM/DD format
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                onClick={importCrmB}
                disabled={isLoadingCrmB || !csvFile}
                className="w-full"
              >
                {isLoadingCrmB ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Importing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Import CRM B Data
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <Toaster position="top-right" />
    </div>
  );
}
