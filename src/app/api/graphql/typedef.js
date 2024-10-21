const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Mutations for sign up, login, and adding a super admin email
  type Mutation {
    signUp(signUpData: signUpInput): signUpResponse
    login(email: String!, password: String!): LoginResponse
    addSuperAdminEmail(email: String!): SuperAdminResponse
  }

  # Response types for login and sign up
  type LoginResponse {
    msg: String
    token: String
    user: String
    role: String
    userName: String
  }

  type signUpResponse {
    id: String
    msg: String
    role: String
  }

  # Response type for adding super admin email
  type SuperAdminResponse {
    msg: String
    email: String
  }

  # Input types for signup
  input signUpInput {
    userName: String!
    email: String!
    password: String!
  }
`;

module.exports = typeDefs;
