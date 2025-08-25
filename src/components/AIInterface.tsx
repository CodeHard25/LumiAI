import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Sparkles, LogOut, User } from 'lucide-react';
import { AISidebar } from './AISidebar';
import { ChatOutput } from './ChatOutput';
import { PromptEditor } from './PromptEditor';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAI } from '@/contexts/AIContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import aiLogo from '@/assets/ai-logo.png';

export function AIInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedModel } = useAI();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="ai-interface-wrapper min-h-screen bg-gradient-hero flex flex-col lg:flex-row relative overflow-hidden">
      {/* Sidebar - toggled on both desktop and mobile */}
      {/* Sidebar menu button (always visible on desktop, top left) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 lg:flex hover:bg-accent/20"
        style={{ display: sidebarOpen ? 'none' : undefined }}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {/* Sidebar drawer for all screens */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-ai-sidebar border-r border-ai-sidebar-border shadow-xl">
            <AISidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-ai-sidebar-border bg-red-200 dark:bg-stone-800 backdrop-blur-lg sticky top-0 z-10 creative-glow"
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden hover:bg-accent/20"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="hidden lg:flex items-center pl-11 space-x-3">
              <img 
                src={aiLogo} 
                alt="LumiAI" 
                className="w-8 h-8 rounded-full shadow-red-600 shadow-glow"
              />
              <span className="font-bold text-lg bg-gradient-secondary bg-clip-text text-transparent">
                LumiAI
              </span>
            </div>
            {selectedModel && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-ai-assistant-bubble/50 rounded-full border border-ai-sidebar-border creative-glow"
              >
                <div className="w-2 h-2 rounded-full bg-success neon-pulse" />
                <span className="text-sm font-medium text-foreground">
                  {selectedModel.name}
                </span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {user && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-card/50 rounded-full border border-border">
                <User className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground hidden sm:inline">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            )}
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </motion.header>
        {/* Main Layout */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <ChatOutput />
          </div>
          {/* Prompt Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-96 border-l border-border bg-card/30 backdrop-blur-sm"
          >
            <div className="h-full p-4">
              <PromptEditor />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}