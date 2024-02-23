"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export const CreateDayButton = ({
  dayId,
  date,
}: {
  dayId: string | undefined;
  date: string;
}) => {
  const router = useRouter();
  const handleCreate = () => {
    router.push(`/dashboard/day/${date}/create`);
  };
  const handleEdit = () => {
    router.push(`/dashboard/day/${date}/edit`);
  };
  // edit feature
  if (dayId) {
    return (
      <div>
        <Button onClick={handleEdit}>Edit Day</Button>
      </div>
    );
  }
  // create feature
  return (
    <div>
      <Button onClick={handleCreate}>Create Day</Button>
    </div>
  );
};
