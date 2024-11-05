export interface PumpData {
  id: string;
  name: string;
  maxHeight: number;
  maxFlow: number;
  minHeight?: number;
  minFlow?: number;
  color: string;
}