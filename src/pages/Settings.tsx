import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Server, Zap, ExternalLink } from 'lucide-react';
import { useEvaluationStore } from '@/store/useEvaluationStore';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const { settings, updateSettings } = useEvaluationStore();
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);

  const handleSave = () => {
    updateSettings({ baseUrl });
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleModeChange = (mode: "offline" | "llm") => {
    updateSettings({ mode });
    toast({
      title: "Mode updated",
      description: `Switched to ${mode} mode`,
    });
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${baseUrl}/docs`);
      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "Backend is reachable and responding.",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Could not reach backend",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Settings">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Backend Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Backend Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your FastAPI backend connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="baseUrl"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://127.0.0.1:8000"
                  className="flex-1"
                />
                <Button variant="outline" onClick={testConnection}>
                  Test Connection
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                The base URL of your FastAPI backend server
              </p>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="shadow-elegant">
                Save Configuration
              </Button>
              <Button
                variant="outline"
                onClick={() => setBaseUrl(settings.baseUrl)}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Mode */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Evaluation Mode</span>
            </CardTitle>
            <CardDescription>
              Choose between offline evaluation or LLM-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">Offline Mode</h3>
                    {settings.mode === 'offline' && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fast, rule-based evaluation using predefined metrics
                  </p>
                </div>
                <Button
                  variant={settings.mode === 'offline' ? 'default' : 'outline'}
                  onClick={() => handleModeChange('offline')}
                >
                  Select
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">LLM Mode</h3>
                    {settings.mode === 'llm' && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI-powered evaluation with detailed reasoning analysis
                  </p>
                </div>
                <Button
                  variant={settings.mode === 'llm' ? 'default' : 'outline'}
                  onClick={() => handleModeChange('llm')}
                >
                  Select
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Links */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>External Resources</CardTitle>
            <CardDescription>
              Quick access to backend-generated reports and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`${settings.baseUrl}/leaderboard`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Leaderboard (HTML)
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`${settings.baseUrl}/docs`, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                API Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Settings Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Backend URL</p>
                <p className="text-sm text-muted-foreground font-mono">{settings.baseUrl}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Evaluation Mode</p>
                <Badge variant="secondary">{settings.mode.toUpperCase()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}