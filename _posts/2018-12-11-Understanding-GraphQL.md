---
layout: post
title:  "GraphQL - Schema and Resolvers"
categories: blog
---

I have been working on an assignment for which I needed to implement GraphQL using Apollo and Express on the backend. 

I'm writing this post to clarify and summarize my understanding of how the different components of GraphQL - Schema, Query, Mutations, Resolvers connect to each other.

<br>

# What is GraphQL?

GraphQL is a query language that allows to fetch data from the backend. It has certain advantages over RESTful APIs by making querying for deeply nested data easier as well as avoiding overfetching of data.

A GraphQL query allows the client to specify exactly the data they want and receive no more from the backend.

<br>

# Components of a GraphQL setup on Backend

## Schema

![graphql-schema](/assets/graphql-schema.svg)

The schema is defined as a string using the [GraphQL Schema Definition Language](https://graphql.org/learn/schema/#type-language). 

The schema is used to define

1. What kind of queries can be made from the frontend to fetch data? (A query is the equivalent of a GET request and is used to fetch data from the backend)

   ```javascript
   {
       type todo(id: String): ToDo
   }
   ```

   This defines a query type `todo` which will take an `id` of type `String` and return data of type `ToDo`. The data type `ToDo` is defined later in the article. This is like a function signature of the query that can be made from the frontend to fetch data.

2. What kind of mutations can be made from the frontend to manipulate data? (A mutation is the equivalent of a POST, PUT or DELETE request and is used to modify data on the backend)

   ```javascript
   {
       type add_todo(id: String, title: String, completed: Boolean): ToDo
   }
   ```

   The above defines a mutation type `add_todo` which will take `id`, `title` and `completed` variables and return data of type `ToDo`. This is like a function signature of a mutation that can be made from the frontend to modify data

3. What are the different data types that will be returned from the backend in response to the queries and the mutations?

   ```javascript
   {
       type ToDo {
           id: String,
           title: String,
           completed: Boolean
       }
   }
   ```

   The above defines a custom data type `ToDo` which is referred in the query and mutation types as the return data type

<br>

## Resolvers

![graphql-resolvers](/assets/graphql-resolvers.svg)

While the Schema was used to define the function signatures for the queries and the mutations allowed from the frontend, the resolvers are used to define the functions themselves to query data from the source database.

Resolvers are used to define

1. Functions to execute the queries and mutations defined in the schema. The interaction with the database or the appropriate data store is defined in the resolvers

2. Functions to resolve fields within data types. For instance if a `ToDo` type refers to a `User` type

   ```javascript
   {
       type ToDo {
           id: String,
           title: String,
           completed: Boolean,
           user: String
       }

       type User {
           id: String,
           name: String
       }
   }
   ```

   Assuming that the `user` field in `ToDo` type stores an `id` for the User like a foreign key, when we query for `ToDo` we can also fetch the corresponding user. This is achieved by defining a resolver function for `user` field inside the `ToDo` data type.