import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  tooltip: string;
}

function ParameterSlider({ label, value, onChange, min, max, step, tooltip }: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Label className="text-sm font-medium">{label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-popover border-border">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm text-muted-foreground font-mono">
          {value.toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

export function ParametersPanel() {
  const { parameters, updateParameters } = useAI();

  const parameterConfig = [
    {
      key: 'temperature' as const,
      label: 'Temperature',
      min: 0,
      max: 2,
      step: 0.1,
      tooltip: 'Controls randomness. Higher values make output more creative and unpredictable.'
    },
    {
      key: 'maxTokens' as const,
      label: 'Max Tokens',
      min: 100,
      max: 4096,
      step: 100,
      tooltip: 'Maximum number of tokens to generate in the response.'
    },
    {
      key: 'topP' as const,
      label: 'Top P',
      min: 0,
      max: 1,
      step: 0.1,
      tooltip: 'Controls diversity via nucleus sampling. Lower values focus on more likely tokens.'
    },
    {
      key: 'frequencyPenalty' as const,
      label: 'Frequency Penalty',
      min: -2,
      max: 2,
      step: 0.1,
      tooltip: 'Reduces repetition of tokens based on their frequency in the text.'
    },
    {
      key: 'presencePenalty' as const,
      label: 'Presence Penalty',
      min: -2,
      max: 2,
      step: 0.1,
      tooltip: 'Reduces repetition of tokens regardless of their frequency.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Parameters</h3>
        <button
          onClick={() => updateParameters({
            temperature: 0.7,
            maxTokens: 2048,
            topP: 1.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0
          })}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-5">
        {parameterConfig.map((config) => (
          <ParameterSlider
            key={config.key}
            label={config.label}
            value={parameters[config.key]}
            onChange={(value) => updateParameters({ [config.key]: value })}
            min={config.min}
            max={config.max}
            step={config.step}
            tooltip={config.tooltip}
          />
        ))}
      </div>

      <div className="p-3 bg-muted/50 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">Current Settings</div>
          <div className="space-y-0.5 font-mono">
            <div>temp: {parameters.temperature}</div>
            <div>tokens: {parameters.maxTokens}</div>
            <div>top_p: {parameters.topP}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}