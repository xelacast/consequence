import { useEffect, useId, useState } from "react";
import Select, {
  type GroupBase,
  type Props as SelectProps,
} from "react-select";
import type {} from "react-select/base";
import { Skeleton } from "~/components/ui/skeleton";

interface Options {
  value: string | number;
  label: string;
}

interface ReusableSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<SelectProps<Option, IsMulti, Group>, "options" | "isMulti"> {
  options: readonly (Options | Group)[];
  isMulti: IsMulti;
}

/**
 * @params same as the Select from react-select
 * @description there were rendering errors when using this component with nextjs. I had to use a workaround and wrap this component so it would toggle errors in the client. Read The comments on the components for more details
 */
export const ReusableSelect = <
  Option,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  ...props
}: ReusableSelectProps<Option, IsMulti, Group>) => {
  // Fixes: 'ids do not match up' error on console (Nextjs specific error)
  const id = useId();

  // workaround from https://github.com/JedWatson/react-select/issues/5459#issuecomment-1458451734
  // Must be deleted once
  // https://github.com/JedWatson/react-select/issues/5459 is fixed.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //@ts-expect-error - React-Select ts documents are not clear on their type declarations
  // could not fully understand. options is causing an error
  return isMounted ? <Select {...props} instanceId={id} /> : <InputSkeleton />;
};

export const InputSkeleton = () => {
  return <Skeleton className="h-[38px] w-full rounded-md" />;
};
