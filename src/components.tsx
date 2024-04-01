export function BaseHTML({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script src="https://unpkg.com/htmx.org@1.9.11"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <title>{title}</title>
        </head>
        <Nav />
        <body class={"bg-slate-400"}>{children}</body>
      </html>
    </>
  );
}

export function Nav() {
  return (
    <div class="bg-zinc-500 w-screen h-[10%] flex justify-between">
      <a href="/">[HomePage]</a>
      <a href="/posts">[All Posts]</a>
    </div>
  );
}
