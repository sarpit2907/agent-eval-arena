import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useEvaluationStore } from '@/store/useEvaluationStore';
import { formatScore, formatDuration } from '@/lib/dataUtils';
import { createApiClient } from '@/lib/api';

export default function AgentDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { evaluationResult, settings } = useEvaluationStore();
  const [showFailuresOnly, setShowFailuresOnly] = useState(false);

  const apiClient = createApiClient(settings.baseUrl);

  // Redirect if no data
  if (!evaluationResult) {
    navigate('/');
    return null;
  }

  // Find the agent
  const agent = evaluationResult.agent_results.find(a => a.agent_id === agentId);
  
  if (!agent) {
    navigate('/dashboard');
    return null;
  }

  // Prepare radar chart data
  const radarData = [
    {
      dimension: 'Instruction Following',
      score: Math.round(agent.scores["Instruction Following"] * 100),
    },
    {
      dimension: 'Hallucination Detection',
      score: Math.round(agent.scores["Hallucination Detection"] * 100),
    },
    {
      dimension: 'Assumption Control',
      score: Math.round(agent.scores["Assumption Control"] * 100),
    },
    {
      dimension: 'Coherence & Accuracy',
      score: Math.round(agent.scores["Coherence & Accuracy"] * 100),
    },
  ];

  // Get issues from reasoning
  const allIssues = Object.entries(agent.reasoning).flatMap(([dimension, reasons]) =>
    reasons.map(reason => ({ dimension, reason }))
  );

  const failureIssues = allIssues.filter(issue => 
    issue.reason.toLowerCase().includes('fail') || 
    issue.reason.toLowerCase().includes('error') ||
    issue.reason.toLowerCase().includes('incorrect')
  );

  const displayedIssues = showFailuresOnly ? failureIssues : allIssues;

  return (
    <Layout title={`Agent Detail - ${agent.agent_name}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(apiClient.getAgentUrl(agent.agent_id), '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View HTML Report
          </Button>
        </div>

        {/* Agent Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{agent.agent_name}</CardTitle>
                <CardDescription>Agent ID: {agent.agent_id}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatScore(agent.overall_score)}</div>
                <Badge 
                  variant={agent.passed ? "default" : "destructive"}
                  className="mt-2"
                >
                  {agent.passed ? "PASS" : "FAIL"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Evaluation Time</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDuration(agent.evaluation_time)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Test Cases</div>
                  <div className="text-sm text-muted-foreground">
                    {agent.test_cases_processed} processed
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Errors</div>
                  <div className="text-sm text-muted-foreground">
                    {agent.errors_count} found
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Dimensions</CardTitle>
            <CardDescription>
              Radar chart showing performance across all evaluation dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="dimension" 
                    tick={{ fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(agent.scores).map(([dimension, score]) => (
            <Card key={dimension} className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{dimension}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatScore(score)}</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-smooth"
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Issues & Reasoning */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Issues & Reasoning</CardTitle>
                <CardDescription>
                  Detailed analysis and reasoning for evaluation decisions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="failures-only" className="text-sm font-medium">
                  Failures only
                </label>
                <Switch
                  id="failures-only"
                  checked={showFailuresOnly}
                  onCheckedChange={setShowFailuresOnly}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {displayedIssues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 mb-4" />
                <p>No issues found for this agent.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg"
                  >
                    {issue.reason.toLowerCase().includes('fail') ? (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {issue.dimension}
                        </Badge>
                      </div>
                      <p className="text-sm">{issue.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}