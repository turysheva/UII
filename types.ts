
export interface Source {
  title: string;
  uri: string;
}

export interface TrendAnalysis {
  insight: string;
  sources: Source[];
  post: string;
}
