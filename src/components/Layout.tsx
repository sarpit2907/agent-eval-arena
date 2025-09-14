import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, BarChart3, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const navigation = [
  { name: 'Upload', href: '/', icon: Upload },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Layout({ children, title }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card shadow-card">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary shadow-glow"></div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Agentic Evaluator
                </h1>
              </div>
              {title && (
                <>
                  <div className="h-6 w-px bg-border"></div>
                  <h2 className="text-lg font-medium text-foreground">{title}</h2>
                </>
              )}
            </div>
            
            <nav className="flex space-x-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "transition-smooth",
                    location.pathname === item.href && "shadow-elegant"
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}