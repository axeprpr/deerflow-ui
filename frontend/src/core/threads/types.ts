import type { Message, Thread } from "@langchain/langgraph-sdk";

import type { Todo } from "../todos";

export interface ThreadCheckpoint {
  checkpoint_id?: string;
  checkpoint_ns?: string;
  thread_id?: string;
}

export interface ThreadConfigurable extends Record<string, unknown> {
  model_name?: string;
  mode?: "flash" | "thinking" | "pro" | "ultra";
  reasoning_effort?: "minimal" | "low" | "medium" | "high";
  thinking_enabled?: boolean;
  is_plan_mode?: boolean;
  subagent_enabled?: boolean;
  agent_name?: string;
  agent_type?: string;
  temperature?: number | null;
  max_tokens?: number | null;
}

export interface AgentThreadState extends Record<string, unknown> {
  title?: string;
  messages: Message[];
  artifacts: string[];
  todos?: Todo[];
  sandbox?: Record<string, unknown> | null;
  thread_data?: Record<string, unknown> | null;
  uploaded_files?: Array<Record<string, unknown>>;
  viewed_images?: string[];
  config?: {
    configurable?: ThreadConfigurable;
  };
  metadata?: Record<string, unknown>;
  next?: string[];
  tasks?: Array<Record<string, unknown>>;
  interrupts?: Array<Record<string, unknown>>;
  checkpoint?: ThreadCheckpoint | null;
  parent_checkpoint?: ThreadCheckpoint | null;
  checkpoint_id?: string;
  parent_checkpoint_id?: string;
}

export interface AgentThread extends Thread<AgentThreadState> {
  title?: string;
  agent_name?: string;
  agent_type?: string;
  assistant_id?: string;
  graph_id?: string;
  run_id?: string;
  mode?: "flash" | "thinking" | "pro" | "ultra";
  model_name?: string;
  reasoning_effort?: "minimal" | "low" | "medium" | "high";
  thinking_enabled?: boolean;
  is_plan_mode?: boolean;
  subagent_enabled?: boolean;
  temperature?: number | null;
  max_tokens?: number | null;
  checkpoint_id?: string;
  parent_checkpoint_id?: string;
  checkpoint_ns?: string;
  parent_checkpoint_ns?: string;
  checkpoint_thread_id?: string;
  parent_checkpoint_thread_id?: string;
  checkpoint?: ThreadCheckpoint | null;
  parent_checkpoint?: ThreadCheckpoint | null;
  step?: number;
  next?: string[];
  tasks?: Array<Record<string, unknown>>;
  interrupts?: Array<Record<string, unknown>>;
}

export interface AgentThreadContext extends Record<string, unknown> {
  thread_id: string;
  model_name: string | undefined;
  thinking_enabled: boolean;
  is_plan_mode: boolean;
  subagent_enabled: boolean;
  reasoning_effort?: "minimal" | "low" | "medium" | "high";
  agent_name?: string;
}
