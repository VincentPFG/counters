import {
  Form,
  useLoaderData,
} from '@remix-run/react'
import type { Counter } from '@prisma/client'
import type {
  ActionFunction,
  LoaderFunction,
} from '@remix-run/node'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export const loader: LoaderFunction = async () =>
  await db.counter.findMany()

export const action: ActionFunction = async ({
  request,
}) => {
  const formData = await request.formData()
  const id = Number(formData.get('id'))
  const increment = Number(formData.get('value'))

  if (id) {
    if (increment) {
      await db.counter.update({
        where: {
          id,
        },
        data: {
          count: {
            increment,
          },
        },
      })
    } else {
      await db.counter.delete({
        where: {
          id,
        },
      })
    }
  } else {
    await db.counter.create({
      data: {
        name: String(formData.get('name')),
      },
    })
  }

  return null
}

const Button = ({
  text,
  value = 1,
  id,
}: {
  text?: string
  value?: number
  id: number
}) => (
  <Form method='post'>
    <input
      hidden
      readOnly
      name='value'
      value={value}
    />
    <input hidden readOnly name='id' value={id} />
    <button
      className='btn btn-primary'
      type='submit'
    >
      {value}
    </button>
  </Form>
)

export default function Index() {
  const lData = useLoaderData()

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
      }}
    >
      <Form method='post'>
        <input name='name' />
      </Form>
      {lData.map(
        ({ id, name, count }: Counter) => (
          <div key={id}>
            <p>
              {name} – {count}
            </p>
            <Button id={id} />
            <Button id={id} value={-1} />
            <Form method='delete'>
              <input
                hidden
                readOnly
                name='id'
                value={id}
              />
              <button
                className='btn btn-danger'
                type='submit'
              >
                ×
              </button>
            </Form>
          </div>
        )
      )}
    </div>
  )
}

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css',
    },
  ]
}
