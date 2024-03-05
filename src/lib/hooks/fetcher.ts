import useSWR from "swr";
import type { readSupplementSchema } from "../schemas/supplement";
import type { z } from "zod";

const fetcher = (url: string) =>
  fetch(url, { method: "GET" }).then((res) => res.json());

export function useSupplements() {
  const { data, error, isLoading } = useSWR<
    z.infer<typeof readSupplementSchema>[],
    Error
  >("/api/supplements", fetcher);

  return {
    supplements: data,
    isError: error,
    isLoading,
  };
}
