export default async function Home() {
  // Need form action
  const createDay = async (formData: FormData) => {
    "use server";
    console.log(formData);
  };
  // Create a form

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <form action={createDay}>
        <div id="supplements"></div>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
