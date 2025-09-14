import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload as UploadIcon, FileText, AlertCircle, Zap, Sparkles, XCircle } from 'lucide-react';
import { useEvaluationStore } from '@/store/useEvaluationStore';
import { parseJsonFile, normalizeResponse } from '@/lib/dataUtils';
import { createApiClient } from '@/lib/api';
import { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/dashboard-hero.jpg';

export default function Upload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    settings,
    selectedCategory,
    selectedAgents,
    agents,
    setSelectedCategory,
    setSelectedAgents,
    setLoading,
    setEvaluationResult,
    setError,
  } = useEvaluationStore();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    
    try {
      const content = await file.text();
      const parsed = parseJsonFile(content);
      setParsedData(parsed);
      toast({
        title: "File uploaded successfully",
        description: `Parsed ${parsed.length} responses from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error parsing file",
        description: "Please check your file format and try again.",
        variant: "destructive",
      });
      setUploadedFile(null);
      setParsedData(null);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json', '.jsonl'],
      'text/plain': ['.jsonl'],
    },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!parsedData || !selectedCategory || selectedAgents.length === 0) {
      toast({
        title: "Missing information",
        description: "Please upload a file, select a category, and choose agents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const apiClient = createApiClient(settings.baseUrl);
      const normalizedResponses = parsedData.map(normalizeResponse);
      
      // Filter responses based on selected agents
      const filteredResponses = normalizedResponses.filter(response => 
        selectedAgents.includes(response.agent)
      );

      const result = await apiClient.evaluate(settings.mode, filteredResponses);
      setEvaluationResult(result);
      navigate('/dashboard');
      
      toast({
        title: "Evaluation completed",
        description: `Successfully evaluated ${result.evaluation_summary.total_agents} agents`,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: "Evaluation failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    }
  };

  const availableAgents = agents.filter(agent => agent.category === selectedCategory);

  return (
    <Layout title="Upload Data">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero shadow-glow">
          <div className="absolute inset-0 bg-black/20" />
          <img 
            src={heroImage} 
            alt="AI Evaluation Dashboard" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 px-8 py-12 text-center text-white">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Agentic Evaluator Dashboard</h1>
            </div>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Comprehensive AI agent evaluation with multi-dimensional analysis, 
              performance insights, and detailed reporting.
            </p>
          </div>
        </div>
        {/* Upload Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>Upload Evaluation Data</span>
            </CardTitle>
            <CardDescription>
              Upload your JSONL or JSON file containing agent responses for evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-smooth
                ${isDragActive 
                  ? 'border-primary bg-primary/5 shadow-glow' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium text-primary">Drop your file here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">
                    Supports .json and .jsonl files
                  </p>
                  <Button variant="outline" className="mt-4">
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            
            {uploadedFile && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-success" />
                    <span className="font-medium">{uploadedFile.name}</span>
                    <Badge variant="secondary">
                      {parsedData?.length || 0} responses
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category & Agent Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Configure Evaluation</CardTitle>
            <CardDescription>
              Select the category and agents you want to evaluate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory || ""}
                onValueChange={(value) => setSelectedCategory(value as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QnA">Question & Answer</SelectItem>
                  <SelectItem value="Reasoning">Reasoning</SelectItem>
                  <SelectItem value="Summarizing">Summarizing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Agents</label>
                <div className="border rounded-lg p-4 space-y-3">
                  {availableAgents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No agents available for this category</p>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 mb-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAgents(availableAgents.map(a => a.id))}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAgents([])}
                        >
                          Clear All
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {selectedAgents.length} selected
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {availableAgents.map((agent) => (
                          <div key={agent.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={agent.id}
                              checked={selectedAgents.includes(agent.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAgents([...selectedAgents, agent.id]);
                                } else {
                                  setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                                }
                              }}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-2"
                            />
                            <label 
                              htmlFor={agent.id}
                              className="text-sm font-medium cursor-pointer flex-1"
                            >
                              {agent.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {selectedAgents.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAgents.map((agentId) => {
                      const agent = agents.find(a => a.id === agentId);
                      return agent ? (
                        <Badge key={agentId} variant="secondary" className="flex items-center space-x-1">
                          <span>{agent.name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedAgents(selectedAgents.filter(id => id !== agentId))}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Evaluation Mode</label>
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">{settings.mode === 'offline' ? 'Offline Mode' : 'LLM Mode'}</span>
                <Badge variant="outline">
                  {settings.mode === 'offline' ? 'Fast & Local' : 'AI-Powered'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Ready to evaluate {selectedAgents.length} agents with {parsedData?.length || 0} test cases
                </span>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!parsedData || !selectedCategory || selectedAgents.length === 0}
                className="shadow-elegant"
              >
                <Zap className="mr-2 h-4 w-4" />
                Start Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}