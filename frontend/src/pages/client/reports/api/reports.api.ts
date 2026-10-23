import { api } from "../../../../config/api.ts";
import type {
  CreateReportPayload,
  CreateReportResponse,
} from "../types/reports.types.ts";

export const createReport = async (
  payload: CreateReportPayload,
): Promise<CreateReportResponse> => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("severity", payload.severity);
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));

  payload.images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await api.post<CreateReportResponse>("/reports", formData);

  return response.data;
};
