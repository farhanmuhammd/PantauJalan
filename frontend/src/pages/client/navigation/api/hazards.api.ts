import type { RoadHazardsResponse } from "../types/hazards.types";
import { api } from "../../../../config/api";

export async function getRoadHazards(): Promise<RoadHazardsResponse> {
  const response = await api.get<RoadHazardsResponse>(
    "/routes/hazards?bbox=98.60,3.56,98.63,3.59",
  );

  return response.data;
}
