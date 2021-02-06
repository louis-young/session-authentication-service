# Session Authentication

A session-based authentication system written in Node/Express with Knex and Postgres.

## Description

This is a from-scratch back-end authentication system written in Node/Express with Knex and Postgres which offers generally secure session-based authentication. It uses the Argon2 password hashing algorithm, HTTP only cookies, database sessions and includes Cross-Site Request Forgery protection.

## Motivation

I built this application to learn more about authentication and security, and to provide a boilerplate to use for future projects. 

## Stack

- Node
- Express
- Postgres
- Knex

## Packages

- `argon2`
- `express-session`
- `connect-session-knex`
- `csurf`
- `zxcvbn`
- `cors`
