"use client";

import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export const CreateDayButton = ({
  dayId,
  date,
}: {
  dayId: string | undefined;
  date: string;
}) => {
  const handleCreate = () => {
    redirect(`/dashboard/day/${date}/create`);
  };
  const handleEdit = () => {
    redirect(`/dashboard/day/${dayId}/edit`);
  };
  // edit feature
  if (dayId) {
    return (
      <div>
        <Button onClick={handleEdit}>Edit Day</Button>
      </div>
    );
  }
  // creat feature
  return (
    <div>
      <Button onClick={handleCreate}>Create Day</Button>
    </div>
  );
};
