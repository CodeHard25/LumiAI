import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  maxTokens: number;
  pricing?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface AIParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface AIContextType {
  // Models
  models: AIModel[];
  selectedModel: AIModel | null;
  setSelectedModel: (model: AIModel) => void;

  // Templates
  templates: PromptTemplate[];
  selectedTemplate: PromptTemplate | null;
  setSelectedTemplate: (template: PromptTemplate | null) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Parameters
  parameters: AIParameters;
  updateParameters: (params: Partial<AIParameters>) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// Mock data
const mockModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, great for complex tasks',
    provider: 'OpenAI',
    maxTokens: 8192,
    pricing: '$0.03/1K tokens'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    provider: 'OpenAI',
    maxTokens: 4096,
    pricing: '$0.002/1K tokens'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Highly capable model for complex reasoning',
    provider: 'Anthropic',
    maxTokens: 4096,
    pricing: '$0.015/1K tokens'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    provider: 'Anthropic',
    maxTokens: 4096,
    pricing: '$0.003/1K tokens'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced language model',
    provider: 'Google',
    maxTokens: 2048,
    pricing: '$0.0005/1K tokens'
  }
];

const mockTemplates: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    content: 'Please review the following code and provide feedback on:\n\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance optimizations\n4. Security considerations\n\nCode:\n```\n{code}\n```',
    category: 'Development',
    description: 'Comprehensive code review template'
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    content: 'Write a creative {type} about {topic}. Make it engaging and original. Include:\n\n- Vivid descriptions\n- Compelling characters\n- An interesting plot\n- Emotional depth\n\nTarget audience: {audience}',
    category: 'Creative',
    description: 'Template for creative writing tasks'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    content: 'Analyze the following data and provide insights:\n\n{data}\n\nPlease provide:\n1. Key trends and patterns\n2. Statistical summary\n3. Actionable recommendations\n4. Potential areas for further investigation',
    category: 'Analysis',
    description: 'Data analysis and insights template'
  },
  {
    id: 'email-draft',
    name: 'Professional Email',
    content: 'Draft a professional email with the following details:\n\nTo: {recipient}\nSubject: {subject}\nPurpose: {purpose}\nTone: {tone}\n\nKey points to include:\n- {points}',
    category: 'Communication',
    description: 'Professional email drafting template'
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    content: 'Help me brainstorm ideas for {topic}. Please provide:\n\n1. 10-15 creative ideas\n2. Brief explanation for each\n3. Pros and cons\n4. Implementation difficulty (1-10)\n5. Your top 3 recommendations',
    category: 'Strategy',
    description: 'Structured brainstorming template'
  }
];

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [models] = useState<AIModel[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(mockModels[0]);
  const [templates] = useState<PromptTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [parameters, setParameters] = useState<AIParameters>({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-theme');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Apply theme on mount and changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('ai-theme', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const updateParameters = (params: Partial<AIParameters>) => {
    setParameters(prev => ({ ...prev, ...params }));
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value: AIContextType = {
    models,
    selectedModel,
    setSelectedModel,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    messages,
    addMessage,
    clearMessages,
    parameters,
    updateParameters,
    isLoading,
    setIsLoading,
    currentPrompt,
    setCurrentPrompt,
    isDarkMode,
    toggleTheme
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}