export const FormContainer = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <div className="m-0 flex flex-col gap-4 border p-4 shadow">{children}</div>
  );
};
