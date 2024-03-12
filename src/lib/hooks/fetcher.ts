import useSWR from "swr";
import type { readSupplementSchema } from "../schemas/supplement";
import type { z } from "zod";

const fetcher = (url: string) =>
  fetch(url, { method: "GET" }).then((res) => res.json());

export function useSupplements(activated?: boolean) {
  const url = "/api/supplements" + (activated ? "?activate=true" : "");

  const { data, error, isLoading } = useSWR<
    z.infer<typeof readSupplementSchema>[],
    Error
  >(url, fetcher);

  return {
    supplements: data,
    isError: error,
    isLoading,
  };
}
