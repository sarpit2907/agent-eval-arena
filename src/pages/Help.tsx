import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpCircle, FileText, Code, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Help() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
  };

  const sampleJsonl = `{"agent": "gpt-4", "prompt": "What is the capital of France?", "response": "The capital of France is Paris.", "reference": "Paris"}
{"agent": "claude-3", "prompt": "Explain photosynthesis", "response": "Photosynthesis is the process by which plants convert sunlight into energy.", "context": "Biology lesson"}
{"agent": "gemini", "prompt": "Solve: 2x + 5 = 11", "response": "x = 3", "reference": "x = 3", "domain": "mathematics"}`;

  const curlExample = `curl -X POST "http://127.0.0.1:8000/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "mode": "offline",
    "responses": [
      {
        "input": "What is the capital of France?",
        "actual_output": "The capital of France is Paris.",
        "expected_output": "Paris",
        "context": "",
        "agent": "gpt-4"
      }
    ]
  }'`;

  return (
    <Layout title="Help & Documentation">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Getting Started */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Getting Started</span>
            </CardTitle>
            <CardDescription>
              Quick guide to using the Agentic Evaluator Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h3 className="font-medium">Upload your data</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a JSONL or JSON file containing agent responses and evaluation data.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h3 className="font-medium">Select category and agents</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from QnA, Reasoning, or Summarizing categories, then select specific agents to evaluate.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h3 className="font-medium">Run evaluation</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Start Evaluation" to analyze your agents' performance across multiple dimensions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge className="mt-1">4</Badge>
                <div>
                  <h3 className="font-medium">Analyze results</h3>
                  <p className="text-sm text-muted-foreground">
                    View the dashboard with summary cards, leaderboard, and detailed agent analysis.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Format */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>File Format</span>
            </CardTitle>
            <CardDescription>
              Supported data formats and required fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Required Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline">Input Field</Badge>
                  <p className="text-sm text-muted-foreground">
                    <code>prompt</code> or <code>query</code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Output Field</Badge>
                  <p className="text-sm text-muted-foreground">
                    <code>response</code> or <code>output</code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Agent Field</Badge>
                  <p className="text-sm text-muted-foreground">
                    <code>agent</code> or <code>agent_name</code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Reference (Optional)</Badge>
                  <p className="text-sm text-muted-foreground">
                    <code>reference</code> or <code>gold</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Sample JSONL Format</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(sampleJsonl)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{sampleJsonl}</code>
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Optional Fields</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>context</code> - Additional context for evaluation (string or array)</li>
                <li><code>domain</code> - Domain classification for filtering</li>
                <li><code>reference</code>/<code>gold</code> - Expected/correct output for comparison</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>API Reference</span>
            </CardTitle>
            <CardDescription>
              Direct API usage examples for backend integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Evaluation Endpoint</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(curlExample)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy cURL
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <Badge variant="secondary" className="mb-2">POST /evaluate</Badge>
                <pre className="text-sm overflow-x-auto">
                  <code>{curlExample}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Other Endpoints</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Badge variant="outline">GET /leaderboard</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Returns HTML leaderboard report
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('http://127.0.0.1:8000/leaderboard', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <Badge variant="outline">GET /agent/{`{agent_id}`}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Returns HTML agent detail report
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Dimensions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Evaluation Dimensions</CardTitle>
            <CardDescription>
              Understanding the four key evaluation metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge className="bg-blue-500">Instruction Following</Badge>
                <p className="text-sm text-muted-foreground">
                  Measures how well the agent follows given instructions and prompts.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-purple-500">Hallucination Detection</Badge>
                <p className="text-sm text-muted-foreground">
                  Evaluates the agent's tendency to generate false or unsupported information.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-green-500">Assumption Control</Badge>
                <p className="text-sm text-muted-foreground">
                  Assesses how well the agent manages assumptions and acknowledges uncertainty.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-orange-500">Coherence & Accuracy</Badge>
                <p className="text-sm text-muted-foreground">
                  Measures the logical consistency and factual accuracy of responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>
              Common issues and solutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h3 className="font-medium text-destructive mb-1">Connection Failed</h3>
                <p className="text-sm text-muted-foreground">
                  Check that your FastAPI backend is running and accessible at the configured URL in Settings.
                </p>
              </div>
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <h3 className="font-medium text-warning mb-1">File Parse Error</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure your file is valid JSON or JSONL format with the required fields.
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="font-medium text-blue-600 mb-1">No Results Displayed</h3>
                <p className="text-sm text-muted-foreground">
                  Verify that your agent names in the data match the selected agents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}