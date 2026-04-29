// Local data fetching service
export interface InsightData {
  turnout: string;
  turnout_trend: string;
  vote_margin: string;
  registered_voters: string;
  district: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  education: string;
  assets: string;
  criminal_records: string;
  verified: boolean;
}

export interface PollingBooth {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  wait_time_mins: number;
  accessibility_features: string[];
}

export async function getInsights(): Promise<InsightData> {
  const res = await fetch('/data/election_stats.json');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getCandidates(): Promise<Candidate[]> {
  const res = await fetch('/data/candidates.json');
  if (!res.ok) throw new Error('Failed to fetch candidates');
  return res.json();
}

export async function getPollingBooths(): Promise<PollingBooth[]> {
  const res = await fetch('/data/polling_booths.json');
  if (!res.ok) throw new Error('Failed to fetch polling booths');
  return res.json();
}
