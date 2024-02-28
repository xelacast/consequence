"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { journal } from "@prisma/client";
import { Fragment, useState } from "react";
import {
  type UseFormReturn,
  useFieldArray,
  useForm,
  type UseFieldArrayUpdate,
} from "react-hook-form";
import type z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import {
  createJournalAction,
  updateJournalAction,
} from "~/lib/actions/journalAction";
import { journalSchema } from "~/lib/schemas/journal";

export function JournalContainer({ entries }: { entries: journal[] }) {
  const form = useForm<z.infer<typeof journalSchema>>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      date: new Date(),
      entries: entries.map((entry) => ({
        content: entry.content,
        time: entry.date,
        title: entry.title,
        id: entry.id,
      })),
    },
  });

  const { append, update } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const onSubmit = async (values: z.infer<typeof journalSchema>) => {
    append({
      content: values.content,
      time: new Date(),
      id: values.id,
      title: values.title,
    }); // make the user feel like the entry is added before adding it. Good ux practice.
    const val = values;
    // quick write to the db
    form.setValue("content", "");
    await createJournalAction(val);
  };
  return (
    <Fragment>
      <JournalEntries form={form} update={update} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit">
            Add Entry
          </Button>
        </form>
      </Form>
    </Fragment>
  );
}

// So far today I worked out at Vasa. I hit back, bi, shoulders and did dips to hit my triceps. My shoulders are a little tight but nothing to complain about. My body is looking good and its the biggest Ive been ever in my life. My stomach is feeling a bit bloated today but not compared to yesterday, it was bloated all day and my cognition felt off too. It was hard to concentrate and focus. Felt like my mind was working at 50%. I played Call of Duty and was doing subpar at best. So far ive worked on this application for 3 hours today. It feels good. I feel like I can make faster progress with the more time I spend building. My brain is fully wrapping itself around the problem and getting it to fruition. The day is not even half way over. Lets keep building.
/**
 *
 * @returns React.FC
 * @description this is where all journal entries are read for the client. This is where all journal entries are able to be updated on the client.
 */
const JournalEntries = ({
  form,
  update,
}: {
  form: UseFormReturn<z.infer<typeof journalSchema>>;
  update: UseFieldArrayUpdate<z.infer<typeof journalSchema>, "entries">;
}) => {
  const entries = form.watch("entries");

  //* probably a better way to do the below
  const [updateEntry, setUpdateEntry] = useState<{
    id: string | undefined;
    content: string | undefined;
    index: number | undefined;
    time: Date | string | undefined;
    title: string | undefined;
  }>({
    id: undefined,
    content: undefined,
    index: undefined,
    time: undefined,
    title: undefined,
  });

  const onUpdateEntry = async () => {
    const { id, content, index, time, title } = updateEntry;
    if (index == undefined || !content || !id) return;

    update(index, {
      content,
      time,
      id,
      title,
    });

    const values = { id, content, title };
    await updateJournalAction(values);

    setUpdateEntry({
      id: undefined,
      content: undefined,
      index: undefined,
      time: undefined,
      title: undefined,
    });
  };
  return (
    <div>
      {entries?.map((entry, index) => (
        <div
          className="my-4 rounded-lg border bg-rose-200 bg-opacity-50 p-4"
          key={index}
          onDoubleClick={() => {
            setUpdateEntry({
              id: entry.id,
              content: entry.content,
              index,
              time: entry.time,
              title: entry.title,
            });
          }}
        >
          <span>{entry?.time?.toLocaleString()}</span>
          {index === updateEntry.index ? (
            <div>
              <input
                type="hidden"
                name={`entries[${index}].id`}
                value={entry.id}
              />
              <Textarea
                name={`entries[${index}].entry`}
                defaultValue={entry.content}
                onChange={(e) =>
                  setUpdateEntry({ ...updateEntry, content: e.target.value })
                }
              />
              <div className="mt-4 flex gap-4">
                <Button onClick={onUpdateEntry} type="button">
                  Update
                </Button>
                <Button
                  onClick={() =>
                    setUpdateEntry({
                      id: undefined,
                      content: undefined,
                      index: undefined,
                      time: undefined,
                      title: undefined,
                    })
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p>{entry.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};
