import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, User, Bot, Check } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    model?: string;
  };
  isLatest: boolean;
}

function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const { toast } = useToast();
  const isUser = message.role === 'user';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsJson = () => {
    const data = {
      message: message.content,
      role: message.role,
      timestamp: message.timestamp.toISOString(),
      model: message.model
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-message-${message.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Message exported as JSON file."
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-primary text-white' 
              : 'bg-muted border border-border text-muted-foreground'
          }`}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col space-y-2`}>
          <div
            className={`p-4 rounded-xl ${
              isUser
                ? 'bg-gradient-primary text-white'
                : 'bg-card border border-border'
            } shadow-sm`}
          >
            <div className="prose prose-sm max-w-none">
              <p className={`m-0 whitespace-pre-wrap ${
                isUser ? 'text-white' : 'text-foreground'
              }`}>
                {message.content}
              </p>
            </div>
          </div>

          {/* Message Meta & Actions */}
          <div className={`flex items-center justify-between text-xs text-muted-foreground ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <div className="flex items-center space-x-2">
              <span>{message.timestamp.toLocaleTimeString()}</span>
              {message.model && (
                <span className="px-2 py-0.5 bg-muted rounded text-xs">
                  {message.model}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadAsJson}
                className="h-6 w-6 p-0 hover:bg-muted"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-4"
    >
      <div className="flex space-x-3">
        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
          <Bot className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ChatOutput() {
  const { messages, isLoading, clearMessages } = useAI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-lg creative-glow"
      >
        <div>
          <h2 className="text-lg font-bold bg-gradient-secondary bg-clip-text text-transparent">Creative Chat</h2>
          <p className="text-sm text-muted-foreground">
            {hasMessages ? `${messages.length} messages` : 'Start your AI conversation'}
          </p>
        </div>
        {hasMessages && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-destructive hover:border-destructive"
          >
            Clear Chat
          </Button>
        )}
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!hasMessages && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center creative-float shadow-glow">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                Welcome to LumiAI
              </h3>
              <p className="text-muted-foreground max-w-md text-lg">
                Your creative AI companion awaits. Select a model, set parameters, and let's create something amazing together.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Creative Writing', 'Code Analysis', 'Problem Solving', 'Brainstorming'].map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium border border-accent/30"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
          {isLoading && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}