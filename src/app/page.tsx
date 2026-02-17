import { db } from "@/db";
import { notes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export default async function Home() {
  await requireAuth();

  const allNotes = await db
    .select()
    .from(notes)
    .orderBy(desc(notes.createdAt));

  async function addNote(formData: FormData) {
    "use server";
    await requireAuth();
    const content = formData.get("content") as string;
    if (!content?.trim()) return;
    await db.insert(notes).values({ content: content.trim() });
    revalidatePath("/");
  }

  return (
    <div>
      <p>ladies and gentlemen may i have your attention please!</p>
      <br />
      <form action={addNote}>
        <input type="text" name="content" placeholder="Add a note..." />
        <button type="submit">Add</button>
      </form>
      <br />
      <ul>
        {allNotes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}
