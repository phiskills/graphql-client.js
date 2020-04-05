import { Server } from 'http'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import fetch from 'node-fetch'

import { build, Client } from './index'

const host = 'localhost'
const port = 8888
const token = '123'

const source = `
type Query {
  item(id: Int!): Item,
  items: [Item]
}

type Mutation {
  push(id: Int!, name: String!): [Item]
}

type Item {
  id: Int,
  name: String
}
`

interface Item {
  id: number,
  name: string
}

const items: Array<Item> = [
  {id: 1, name: 'Item 1'},
  {id: 2, name: 'Item 2'},
  {id: 3, name: 'Item 3'}
]

const app = express()
app.use('/graphql', graphqlHTTP({
  schema: buildSchema(source),
  rootValue: {
    items: () => items,
    item: (o: Item) => items.find(i => i.id === o.id),
    push: (item: Item) => [...items, item]
  }
}))

let server: Server | null = null
let client: Client | null = null

beforeAll(() => {
  server = app.listen(port, () => undefined)
  // @ts-ignore
  client = build({host, port, token, fetch})

})

afterAll(() => {
  server?.close()
})

describe('Query items', () => {
  async function getItem(value: any) {
    const fn = client?.buildQuery(`GetItem($id: Int!) { item(id: $id) { name } }`)
    return fn?.(value)
  }
  async function listItems() {
    const fn = client?.buildQuery(`ListItems { items { id, name } }`)
    return fn?.({})
  }
  // @ts-ignore
  test('get existing item', () => expect(getItem({id: 2})).resolves.toEqual({ item: { name: 'Item 2' } }))
  // @ts-ignore
  test('get item not found', () => expect(getItem({id: 5})).resolves.toEqual({ item: null }))
  // @ts-ignore
  test('get item error', () => expect(getItem({})).rejects.toEqual(new Error()))
  // @ts-ignore
  test('list all items', () => expect(listItems()).resolves.toEqual({ items }))
})

describe('Push items', () => {
  async function pushItem(value: any) {
    const fn = client?.buildMutation(`PushItem($id: Int!, $name: String!) { push(id: $id, name: $name) { id, name } }`)
    return fn?.(value)
  }
  const item = { id: 4, name: 'Item 4' }
  const result = [...items, item]
  // @ts-ignore
  test('push item succeed', () => expect(pushItem(item)).resolves.toEqual({ push: result }))
  // @ts-ignore
  test('push item failed', () => expect(pushItem({})).rejects.toEqual(new Error()))
})
