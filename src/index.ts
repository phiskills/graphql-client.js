import { build as buildHttp } from '@phiskills/http-client'

export interface Options {
  host: string,
  port: number,
  token: string,
  secured?: boolean,
  fetch?: typeof fetch
}

export interface Client {
  buildQuery: QueryBuilder
  buildMutation: MutationBuilder
}

export type QueryBuilder = (definition: string) => Query
export type Query = <A, B>(variables: A) => Promise<B>
export type MutationBuilder = (definition: string) => Mutation
export type Mutation = <A, B>(variables: A) => Promise<B>

export function build (config: Readonly<Options>): Readonly<Client> {
  const client = buildHttp(config)
  const target = 'graphql'

  return {
    buildQuery,
    buildMutation
  }

  function buildQuery (definition: string): Query {
    return async function <A, B>(variables: A): Promise<B> {
      return client.post<{data: B}>(target, {
        query: `query ${definition}`,
        variables
      }).then(({data}) => data)
    }
  }

  function buildMutation (definition: string): Mutation {
    return async function <A, B>(variables: A): Promise<B> {
      return client.post<{data : B}>(target, {
        query: `mutation ${definition}`,
        variables
      }).then(({data}) => data)
    }
  }
}
