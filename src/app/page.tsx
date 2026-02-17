import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export default async function Home() {
  await requireAuth();

  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt));

  async function addPost(formData: FormData) {
    "use server";
    await requireAuth();
    const content = formData.get("content") as string;
    if (!content?.trim()) return;
    await db.insert(posts).values({ title: content.trim(), content: content.trim() });
    revalidatePath("/");
  }

  return (
    <div>
      <p>ladies and gentlemen may i have your attention please!</p>
      <br />
      <form action={addPost}>
        <input type="text" name="content" placeholder="Add a post..." />
        <button type="submit">Add</button>
      </form>
      <br />
      <ul>
        {allPosts.map((post) => (
          <li key={post.id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
}
