import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import { presetPosts } from "./db/presetContent.js";
import { JSONFilePreset } from "lowdb/node";
import { BaseHTML } from "./components.js";

// Config For App
const app = new Elysia();
app.use(html());

// Setup Database
let db = await JSONFilePreset("db.json", presetPosts);
let allContent = db.data;
let users = allContent.users;
let allPosts = allContent.posts;

// Routes
// Homepage route
app.get("/", () => {
  return (
    <BaseHTML title="Home Page">
      <div class={""}></div>
    </BaseHTML>
  );
});

// Get all posts route
app.get("/posts", async () => {
  return (
    <BaseHTML title="Posts">
      <a class={"bg-zinc-500 w-screen fixed"} href="/CreatePost">
        [Create Post]
        <hr class={"border-slate-900"} />
      </a>
      <div class={"h-screen"}>
        <br />
        {allPosts.map((post) => (
          <a href={"/posts/" + (post.postId - 1)}>
            <hr class={"border-slate-900"} />
            <div class={"bg-grey-500"}>
              <h1 safe class={"text-4xl"}>
                {post.title.substring(0, 10)}...
              </h1>
              <p safe>
                {post.body.substring(0, 15)}(By{" "}
                {users[post.userId - 1].username})
              </p>
            </div>
          </a>
        ))}
        <hr class={"border-slate-900"} />
      </div>
    </BaseHTML>
  );
});

// Get a specfic post by id route
app.get("/posts/:postId", async ({ params: { postId } }) => {
  const post = allPosts[postId as unknown as number];
  return (
    <BaseHTML title={post.title.substring(0, 10)}>
      <h1 safe class={"w-screen flex justify-center text-4xl"}>
        {post.title as string}
      </h1>
      <p safe class={"w-screen flex justify-center text-md"}>
        {post.body as string}
      </p>
      <br />

      <h1>COMMENTS:</h1>
      <form hx-post="/createComment">
        <input
          id={"commentBody"}
          name={"commentBody"}
          placeholder={"Type Comment Here"}
        />
        <input value={postId} name={"postId"} id={"postId"} type={"hidden"} />
        <button class={"bg-white rounded-r-lg"}>SUBMIT</button>
      </form>
      <div class={"bg-slate-300"}>
        <hr class={"border-slate-900"} />
        {post.comments.map((comment) => (
          <div>
            <h1>{comment.commentBody as string}</h1>
            <hr class={"border-slate-900"} />
          </div>
        ))}
      </div>
    </BaseHTML>
  );
});

// Create a post route
app.get("/CreatePost", () => {
  return (
    <BaseHTML title={"Create Post"}>
      <form method="POST" action="/CreatePost">
        <input
          name={"title"}
          id={"title"}
          placeholder={"Type Post Title Heres"}
        />
        <input name={"body"} id={"body"} placeholder={"Type Post body Heres"} />
        <button>SUBMIT</button>
      </form>
    </BaseHTML>
  );
});

// Create New Post
app.post(
  "/CreatePost",
  async ({ body }: { body: { title: string; body: string } }) => {
    await db.update(({ posts }) =>
      posts.push({
        userId: 2,
        title: body.title,
        body: body.body,
        postId: posts.length + 1,
        comments: [
          {
            commentBody: "Please Be Nice This is a public forum",
            commentCreatedBy: 1,
          },
        ],
      }),
    );
    return (
      <BaseHTML title="XD">
        <h1>Go Back To The Post Page And See Your Post!</h1>
      </BaseHTML>
    );
  },
);

// Create a new Comment
app.post(
  "/createComment",
  async ({ body }: { body: { postId: number; commentBody: string } }) => {
    if (body.commentBody != "") {
      db.update(({ posts }) =>
        posts[body.postId].comments.push({
          commentBody: body.commentBody,
          commentCreatedBy: 2,
        }),
      );
    }
    return <h1>Reload to see your comment</h1>;
  },
);

// Run
app.listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
