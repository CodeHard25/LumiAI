import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings, FileText, X, Zap } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ParametersPanel } from './ParametersPanel';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAI } from '@/contexts/AIContext';
import aiLogo from '@/assets/ai-logo.png';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  setModelDropdownOpen?: (open: boolean) => void;
}

export function AISidebar({ isOpen, onClose, setModelDropdownOpen }: AISidebarProps) {
  const { selectedModel } = useAI();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`
          fixed left-0 top-0 h-full w-80 bg-red-300 dark:bg-stone-900 border-r border-ai-sidebar-border z-50
          lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-80 lg:z-20
          flex flex-col
          max-w-full
        `}
        style={{
          maxHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ai-sidebar-border bg-gradient-primary/5">
          <div className="flex items-center space-x-3">
            <img 
              src={aiLogo} 
              alt="LumiAI" 
              className="w-10 h-10 rounded-full creative-float shadow-glow"
            />
            <div>
              <h1 className="font-bold text-lg bg-gradient-secondary bg-clip-text text-transparent">LumiAI</h1>
              <p className="text-xs text-muted-foreground">
                {selectedModel ? selectedModel.name : 'Select Model'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-9 h-9 p-0 lg:hidden hover:bg-destructive/20 hover:text-destructive"
              data-sidebar-close
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto relative">
          <Tabs defaultValue="model" className="h-full">
            <TabsList className="grid grid-cols-2 mx-4 mt-4 bg-card/50 border-2 border-border creative-glow">
              <TabsTrigger value="model" className="flex items-center space-x-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-medium">Model</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2 data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
                <Settings className="h-3 w-3" />
                <span className="text-xs font-medium">Settings</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="model" className="mt-0 space-y-6">
                <ModelSelector setDropdownOpen={setModelDropdownOpen} />
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-secondary/10 rounded-lg border-2 border-warning/20 creative-glow"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="h-4 w-4 text-white text-warning neon-pulse" />
                    <h4 className="text-sm text-white font-semibold">Quick Start</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Try these creative prompts:
                  </p>
                  <div className="space-y-2">
                    {[
                      '🔮 Explain quantum computing simply',
                      '✨ Write a creative sci-fi story',
                      '🐛 Debug this complex code',
                      '🏖️ Plan an amazing vacation'
                    ].map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="w-full text-left p-3 text-xs bg-card hover:bg-accent/20 rounded-lg border border-border transition-all duration-300 hover:scale-105 hover:shadow-yellow"
                        onClick={() => {
                          console.log('Set prompt:', prompt);
                        }}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <ParametersPanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-ai-sidebar-border bg-gradient-primary/5"
        >
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-3 h-3 text-accent creative-float" />
              <span className="font-semibold">LumiAI v1.0</span>
            </div>
            <p>Creative AI Interface</p>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}