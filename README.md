# Phi Skills GraphQL Client for JavaScript

| **Homepage** | [https://phiskills.com][0]        |
| ------------ | --------------------------------- | 
| **GitHub**   | [https://github.com/phiskills][1] |

## Overview

This project contains the JavaScript package to create a **GraphQL Client**.  

## Installation

```bash
npm i @phiskills/graphql-client
```

## Creating the client

```javascript
import { build } from "@phiskills/graphql-client"

const client = build({ host: 'localhost', port: 80, token: '...zH34sk00wK...' })

const executeQuery = client.buidQuery(queryString)
const data = await executeQuery(variables)

const executeMutation = client.buildMutation(mutationString)
const result = await executeMutation(variables)
```
For more details, see [GraphQL Clients][10].

[0]: https://phiskills.com
[1]: https://github.com/phiskills
[10]: https://graphql.org/graphql-js/graphql-clients/
