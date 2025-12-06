export interface RolloutMetadata {
  container_id: string;
  status: string;
  last_updated: string;
  start_time: number; // Unix timestamp
  files: Record<string, string>;
}

export interface HistoryResponse {
  active_id: string | null;
  history: Record<string, RolloutMetadata>;
}

// Helper type for the UI to handle the flattened list of runs
export interface RolloutWithId extends RolloutMetadata {
  rollout_id: string;
  isActive: boolean;
}