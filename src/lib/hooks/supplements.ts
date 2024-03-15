import type { ReadSupplementsType } from "~/app/dashboard/configure/supplements/page";
import { useQuery } from "@tanstack/react-query";

export async function getSupplementsConfig(activated = true) {
  const url = "/api/supplements" + (activated ? "?activate=true" : "");
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json() as Promise<ReadSupplementsType>;
}

export function useSupplements(activated = true) {
  const response = useQuery({
    queryKey: ["supplements", activated],
    queryFn: async () => await getSupplementsConfig(activated),
    enabled: true,
  });

  return response;
}
