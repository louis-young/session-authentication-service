# Session Authentication Service

A session-based authentication service written in Node/Express with Knex and Postgres.

## Description

A hand rolled authentication service with a basic client included built in React which interfaces with the service that features registration, login and change password forms as well as protected routes.

## Motivation

This was a project to learn more about authentication and security. Please note that I understand and appreciate the concerns of rolling your own authentication service; I wouldn't consider using this in a real project.

## Features

- Cryptographic password hashing algorithm (via Argon2).
- Password strength estimation (via zxcvbn).
- Password reset (over SMTP via SendGrid).
- Database sessions (in Postgres).
- Cross-Site Request Forgery protection (CSRF).
- Cross-Origin Resource Sharing protection (CORS).
- HTTP header security (via Helmet).

## Technology Stack

- Node
- Express
- Postgres
- Knex

## Dependencies

- `argon2`
- `express-session`
- `connect-session-knex`
- `csurf`
- `zxcvbn`
- `helmet`
- `cors`
- `crypto`
- `@sendgrid/mail`
