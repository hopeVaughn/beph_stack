import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { html } from "@elysiajs/html";
import * as elements from "typed-html"
import { db } from "./db"
import { Todo, todos } from "./db/schema"
const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHTML>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHTML>
    ))
  .get("/todos", async () => {
    const data = await db.select().from(todos)
    return <TodoList todos={data} />
  })
  .post(
    "/todos/toggle/:id",
    async ({ params }) => {
      const oldTodo = await db.select().from(todos).where(eq(todos.id, params.id as any))
      console.log(oldTodo)
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
    }
  )
  .delete(
    "/todos/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id);
      if (todo) {
        db.splice(db.indexOf(todo), 1);
      }
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
    }
  )
  .post(
    "/todos",
    ({ body }) => {
      if (body.content.length === 0) {
        throw new Error("Content cannot be empty")
      }
      const newTodo = {
        id: db.length + 1,
        content: body.content,
        completed: false
      };
      db.push(newTodo);
      return <TodoItem {...newTodo} />
    },
    {
      body: t.Object({
        content: t.String()
      })
    }
  )
  .listen(3222);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const BaseHTML = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>BETH STACK</title>
    <script src="https://unpkg.com/htmx.org@1.9.3"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  ${children}
`
function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-swap="outerHTML"
        hx-target='closest div'
      />
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target='closest div'
      >X</button>
    </div>
  )
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map(todo =>
        <TodoItem {...todo} />
      )}
      <TodoForm />
    </div>
  )
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
    >
      <input
        type="text"
        name="content"
        class="border border-black"
      />
      <button
        type="submit"
      >
        Add
      </button>
    </form>
  )
}
