# Session Authentication

A session-based authentication system written in Node/Express with Knex and Postgres.

## Description

This is a from-scratch back-end authentication system written in Node/Express with Knex and Postgres which offers generally secure session-based authentication.

It uses the Argon2 password hashing algorithm, HTTP only cookies, database sessions, Helmet for HTTP header security, zxcvbn password validation and features Cross-Site Request Forgery and Cross-Origin Resource Sharing protection.

Password reset emails are sent over SMTP via SendGrid.

Included is a basic client built in React which interfaces with the server and features protected routes and all of the required forms.

## Motivation

I built this application to learn more about authentication and security, and to serve as a boilerplate for use in future projects.

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
- `helmet`
- `cors`
- `crypto`
- `@sendgrid/mail`
