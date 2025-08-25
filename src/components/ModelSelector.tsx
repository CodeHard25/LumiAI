import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, Zap, Brain, Sparkles } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const providerIcons = {
  OpenAI: Zap,
  Anthropic: Brain,
  Google: Sparkles,
};

export function ModelSelector({ setDropdownOpen }: { setDropdownOpen?: (open: boolean) => void } = {}) {
  const { models, selectedModel, setSelectedModel } = useAI();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-white font-medium text-foreground">AI Model</h3>
      </div>
      
      <Select
        value={selectedModel?.id || ''}
        onValueChange={(value) => {
          const model = models.find(m => m.id === value);
          if (model) setSelectedModel(model);
        }}
      >
        <SelectTrigger className="w-full bg-card border-border hover:bg-muted/50 transition-colors">
          {/* Only show model name in the trigger */}
          <span className=" font-medium text-sm">
            {selectedModel ? selectedModel.name : 'Select a model'}
          </span>
          
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-ai">
          {models.map((model) => {
            const Icon = providerIcons[model.provider as keyof typeof providerIcons] || Zap;
            return (
              <SelectItem
                key={model.id}
                value={model.id}
                className="hover:bg-muted/50 focus:bg-muted/50"
              >
                <div className="flex items-start space-x-3 py-1">
                  <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{model.name}</span>
                      {selectedModel?.id === model.id && (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    {/* Show description and info only in dropdown */}
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {model.provider}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {model.maxTokens.toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </motion.div>
    );
}