# Session Authentication Service

A session-based authentication service built with Node/Express and Knex/Postgres.

## Description

A hand rolled authentication service with a client, built in React, that interfaces with the service. It features protected routes and the registration, change password and login forms.

## Motivation

This was a project to learn more about authentication and security. Please note that I understand and appreciate the concerns related rolling your own authentication service and wouldn't consider using this.

## Features

- Cryptographic password hashing algorithm (via Argon2).
- Password strength estimation (via zxcvbn).
- Password reset (over SMTP via SendGrid).
- Database sessions (in Postgres).
- Cross-Site Request Forgery protection (CSRF).
- Cross-Origin Resource Sharing protection (CORS).
- HTTP header security (via Helmet).

## Technologies

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
