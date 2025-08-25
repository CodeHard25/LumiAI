import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Save, FolderOpen, Trash2, Plus, Sparkles, Edit } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function PromptEditor() {
  const {
    currentPrompt,
    setCurrentPrompt,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    addMessage,
    isLoading,
    setIsLoading,
    selectedModel
  } = useAI();
  const { toast } = useToast();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleSendMessage = async () => {
    if (!currentPrompt.trim() || isLoading) return;

    const userMessage = currentPrompt.trim();
    setCurrentPrompt('');
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      model: selectedModel?.id
    });

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your request. Let me help you with that. This is a simulated response from the AI interface demonstrating how the chat functionality works.",
        "That's an interesting question! In a real implementation, this would connect to the actual AI model you've selected. The parameters you've set would influence the response style and length.",
        "Perfect! I can see you're testing the AI interface. The design looks great with the sidebar for model selection and parameters, plus this clean chat area for conversations.",
        "Great prompt! This AI interface includes all the requested features: model selection, parameter controls, template management, and a responsive chat interface with theme switching capabilities.",
        "Excellent! The interface successfully demonstrates the key components: ModelSelector, ParametersPanel, PromptEditor, and ChatOutput with proper state management through React Context."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage({
        role: 'assistant',
        content: randomResponse,
        model: selectedModel?.id
      });
      
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCurrentPrompt(template.content);
      toast({
        title: "Template loaded",
        description: `"${template.name}" has been loaded into the editor.`
      });
    }
  };

  const handleSaveTemplate = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Template saved",
      description: `"${templateName}" has been saved successfully.`
    });
    setSaveDialogOpen(false);
    setTemplateName('');
    setTemplateDescription('');
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full space-y-4"
    >
      {/* Template Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2"
      >
        <Select onValueChange={handleLoadTemplate} open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <SelectTrigger className="flex-1 bg-card border-2 border-border hover:border-accent transition-all duration-300 creative-glow">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-warning" />
              <div className="flex flex-col items-start">
                <SelectValue placeholder="Load creative template..." />
              </div>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-card/90 backdrop-blur-lg border-2 border-border shadow-glow">
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id} className="hover:bg-accent/20">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{template.name}</span>
                  
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="shrink-0">
              <Save className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Save Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name..."
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="bg-input border-border"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                  Save Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {selectedTemplate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTemplate(null);
              setCurrentPrompt('');
            }}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </motion.div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">{selectedTemplate.name}</h4>
              <p className="text-xs text-muted-foreground">
                {selectedTemplate.category} • {selectedTemplate.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Prompt Editor */}
      <div className="flex-1 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="prompt" className="text-sm font-medium">
            Prompt
          </Label>
          <span className="text-xs text-muted-foreground">
            {currentPrompt.length} characters
          </span>
        </div>
        
        <Textarea
          id="prompt"
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder="✨ Enter your creative prompt here... Unleash your imagination!"
          className="flex-1 min-h-[200px] resize-none bg-card/50 backdrop-blur-sm border-2 border-border focus:border-accent focus:shadow-red transition-all duration-300"
        />
      </div>

      {/* Send Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSendMessage}
          disabled={!currentPrompt.trim() || isLoading}
          variant="creative"
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Creating Magic...</span>
            </div>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              <span>Send Message</span>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}