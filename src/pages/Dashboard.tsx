import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Search,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useEvaluationStore } from '@/store/useEvaluationStore';
import { formatScore, getUniqueValues } from '@/lib/dataUtils';
import { createApiClient } from '@/lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { evaluationResult, settings } = useEvaluationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreThreshold, setScoreThreshold] = useState([0]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const apiClient = createApiClient(settings.baseUrl);

  // Redirect to upload if no data
  if (!evaluationResult) {
    navigate('/');
    return null;
  }

  const { evaluation_summary, agent_results } = evaluationResult;

  // Get unique domains for filter
  const domains = useMemo(() => {
    const allDomains = getUniqueValues(agent_results, 'agent_name' as keyof typeof agent_results[0]);
    return ['all', ...allDomains] as string[];
  }, [agent_results]);

  // Filter and search agents
  const filteredAgents = useMemo(() => {
    return agent_results.filter(agent => {
      const matchesSearch = agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore = agent.overall_score >= scoreThreshold[0] / 100;
      const matchesDomain = selectedDomain === 'all'; // Simplified for now
      
      return matchesSearch && matchesScore && matchesDomain;
    });
  }, [agent_results, searchTerm, scoreThreshold, selectedDomain]);

  // Sort agents by overall score
  const sortedAgents = [...filteredAgents].sort((a, b) => b.overall_score - a.overall_score);

  // Chart data
  const chartData = sortedAgents.slice(0, 10).map(agent => ({
    name: agent.agent_name,
    score: Math.round(agent.overall_score * 100),
  }));

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{evaluation_summary.total_agents}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatScore(evaluation_summary.average_score)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {evaluation_summary.successful_evaluations}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {evaluation_summary.failed_evaluations}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performer */}
        {evaluation_summary.top_performer && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Top Performer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{evaluation_summary.top_performer}</h3>
                  <p className="text-sm text-muted-foreground">
                    Highest overall score with {formatScore(sortedAgents[0]?.overall_score || 0)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/agent/${sortedAgents[0]?.agent_id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Overall scores comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domains.slice(1).map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Minimum Score: {scoreThreshold[0]}%
              </label>
              <Slider
                value={scoreThreshold}
                onValueChange={setScoreThreshold}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Table */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                Showing {filteredAgents.length} of {agent_results.length} agents
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(apiClient.getLeaderboardUrl(), '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View HTML Report
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Instruction Following</TableHead>
                  <TableHead>Hallucination Detection</TableHead>
                  <TableHead>Assumption Control</TableHead>
                  <TableHead>Coherence & Accuracy</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAgents.map((agent, index) => (
                  <TableRow key={agent.agent_id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{agent.agent_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {agent.test_cases_processed} test cases
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatScore(agent.overall_score)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={agent.passed ? "default" : "destructive"}>
                        {agent.passed ? "PASS" : "FAIL"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatScore(agent.scores["Instruction Following"])}</TableCell>
                    <TableCell>{formatScore(agent.scores["Hallucination Detection"])}</TableCell>
                    <TableCell>{formatScore(agent.scores["Assumption Control"])}</TableCell>
                    <TableCell>{formatScore(agent.scores["Coherence & Accuracy"])}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/agent/${agent.agent_id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(apiClient.getAgentUrl(agent.agent_id), '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}