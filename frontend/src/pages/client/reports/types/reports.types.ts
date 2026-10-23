export type ReportSeverity = "ringan" | "sedang" | "berat";

export interface CreateReportPayload {
  title: string;
  description: string;
  severity: ReportSeverity | "";
  latitude: number;
  longitude: number;
  images: File[];
}

export const initialPengaduanForm: CreateReportPayload = {
  title: "",
  description: "",
  severity: "",
  latitude: 3.587576,
  longitude: 98.642247,
  images: [],
};

export interface CreateReportResponse {
  message?: string;
  data?: {
    id?: number | string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
