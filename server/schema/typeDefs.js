const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }
    
    type Book {
        _id: ID!
        authors: [String]!
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        getUser: User
    }

    type Mutation {
        userLogin(email: String!, password: String!): Auth
        createUser(username: String!, email: String!, password: String!): Auth
        addBook(bookData: BookInput!): User
        deleteBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;
