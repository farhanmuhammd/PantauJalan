export type ReportSeverity = "ringan" | "sedang" | "berat";
export type TypeReport =
  | "jalan"
  | "lampu-jalan"
  | "trotoar"
  | "halte"
  | "taman"
  | "lainnya";

export interface CreateReportPayload {
  title: string;
  description: string;
  severity: ReportSeverity | "";
  latitude: number;
  longitude: number;
  type: TypeReport | "";
  images: File[];
}

export const initialPengaduanForm: CreateReportPayload = {
  title: "",
  description: "",
  severity: "",
  latitude: 3.587576,
  longitude: 98.642247,
  type: "",
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

export type ReportStatus =
  | "menunggu"
  | "diverifikasi"
  | "diproses"
  | "selesai"
  | "ditolak";

export interface ReportImage {
  _id: string;
  url: string;
  public_id: string;
  resource_type: string;
  format: string;
  original_filename: string;
}

export interface ReportItem {
  _id: string;
  title: string;
  description: string;
  address: string;
  severity: ReportSeverity;
  status: ReportStatus;
  type: string;
  images: ReportImage[];
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReportListResponse {
  success: boolean;
  message: string;
  data: ReportItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ReportSummaryItem {
  total: number;
  name: string;
}

type ReportTypeSummary = {
  type: string;
  total: number;
};

export interface ReportSummaryData {
  statusSummary: {
    total: number;
    status: ReportStatus;
  }[];
  typeSummary: ReportTypeSummary[];
  street: ReportSummaryItem[];
  village: ReportSummaryItem[];
  district: ReportSummaryItem[];
  regency: ReportSummaryItem[];
  province: ReportSummaryItem[];
}

export interface ReportSummaryResponse {
  success: boolean;
  message: string;
  data: ReportSummaryData;
  meta: {
    groupBy: string | null;
    totalReports: number;
  };
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  search?: string;
}

export interface GetReportSummaryParams {
  status?: ReportStatus;
}
