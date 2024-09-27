export interface PieChartData {
  name: string | number;
  value: number;
  extra?: { id?: number, city?: string };
}
