# E-Wallet Backend --- Implementation Plan

## Project Context

-   **Project type:** Internal e-wallet backend with simulated deposits,
    withdrawals, and transfers.
-   **Stack:** Node.js, Express.js, JavaScript, PostgreSQL, Sequelize
    ORM, Docker.
-   **Current status:** Authentication is already implemented.
-   **Goal:** Implement wallet management, financial transactions,
    transaction history, integrity safeguards, tests, documentation, and
    deployment.

> Scope note: Deposits and withdrawals in this plan are simulated
> internal operations, not real bank or payment-provider integrations.

------------------------------------------------------------------------

## Implementation Roadmap

1.  Wallet Module
2.  Transaction Data Model
3.  Deposit
4.  Withdraw
5.  Transfer Engine
6.  Transaction History
7.  Financial Integrity and Security
8.  Testing
9.  Docker, Documentation, and Deployment

Implement and test each phase before moving to the next.

------------------------------------------------------------------------

## Phase 1 --- Wallet Module

### 1.1 Design the `Wallets` table

Suggested fields:

  Field         Suggested type                 Purpose
  ------------- ------------------------------ ---------------------------------------
  `id`          UUID                           Wallet identifier
  `userId`      UUID / matching user PK type   Owner of the wallet
  `balance`     BIGINT                         Balance in the smallest currency unit
  `currency`    VARCHAR(3)                     Currency code, e.g. `EGP`
  `status`      ENUM or constrained string     `ACTIVE` or `FROZEN`
  `createdAt`   TIMESTAMP                      Creation time
  `updatedAt`   TIMESTAMP                      Last update time

Design decisions:

-   Add a foreign key from `Wallets.userId` to the existing user table.
-   Add a unique constraint on `userId` if each user is allowed only one
    wallet.
-   Default the balance to zero.
-   Store money as an integer in the smallest currency unit (for
    example, piastres for EGP); do not use floating-point values for
    money.
-   Add indexes appropriate to the queries the application will run.

### 1.2 Create the Sequelize model and migration

-   Create the `Wallet` Sequelize model.
-   Create and run a migration for the `wallets` table.
-   Match the existing user table's primary-key type and naming
    conventions.
-   Avoid relying on automatic schema synchronization as a replacement
    for versioned migrations in a deployed environment.

### 1.3 Define the model association

``` js
User.hasOne(Wallet, {
  foreignKey: "userId",
});

Wallet.belongsTo(User, {
  foreignKey: "userId",
});
```

Adjust the association to match the existing model names and key
configuration.

### 1.4 Create the wallet for each user

If users should automatically receive a wallet:

-   Create the user and wallet in the same database transaction during
    registration, if this is not already implemented.
-   Ensure that a failure creating either record rolls back both
    records.
-   Do not create duplicate wallets for a user.

### 1.5 Implement wallet endpoints

  ------------------------------------------------------------------------------
  Method                  Endpoint                       Purpose
  ----------------------- ------------------------------ -----------------------
  `GET`                   `/api/v1/wallets/me`           Get the authenticated
                                                         user's wallet

  `GET`                   `/api/v1/wallets/me/balance`   Get the current balance

  `GET`                   `/api/v1/wallets/me/status`    Get wallet status, if a
                                                         separate endpoint is
                                                         useful
  ------------------------------------------------------------------------------

Security requirements:

-   Derive the user ID from the authenticated request, not from a
    client-supplied `userId`.
-   Do not expose an endpoint that lets users directly set or edit their
    balance.
-   Validate that the wallet exists and handle missing or frozen wallets
    consistently.

**Exit criteria:** An authenticated user can retrieve their own wallet
and balance, but cannot access another user's wallet or directly change
their balance.

------------------------------------------------------------------------

## Phase 2 --- Transaction Data Model

Create a `Transactions` table before implementing money movement.

Suggested fields:

  -----------------------------------------------------------------------
  Field                               Purpose
  ----------------------------------- -----------------------------------
  `id`                                Unique transaction identifier

  `type`                              `DEPOSIT`, `WITHDRAW`, or
                                      `TRANSFER`

  `status`                            For example, `COMPLETED` or
                                      `FAILED`; add `PENDING` only if the
                                      workflow needs it

  `amount`                            Positive integer in the smallest
                                      currency unit

  `currency`                          Currency code

  `sourceWalletId`                    Source wallet; nullable for a
                                      simulated deposit

  `destinationWalletId`               Destination wallet; nullable for a
                                      simulated withdrawal

  `idempotencyKey`                    Key used to prevent duplicate
                                      execution

  `createdAt`                         Creation time

  `updatedAt`                         Last update time, if needed
  -----------------------------------------------------------------------

Implementation notes:

-   Add foreign keys for wallet references.
-   Add indexes for transaction lookups by wallet and creation time.
-   Enforce a unique idempotency key in the appropriate scope, such as
    per user or operation.
-   Validate that the amount is a positive integer and within configured
    limits.
-   Decide on a consistent transaction-status lifecycle before
    implementing the services.

------------------------------------------------------------------------

## Phase 3 --- Deposit (Simulated)

Implement a service that credits a wallet and records the deposit
atomically.

### Suggested endpoint

`POST /api/v1/wallets/deposit`

### Workflow

1.  Authenticate the user.
2.  Validate the amount and request fields.
3.  Load and validate the user's wallet.
4.  Confirm the wallet is active.
5.  Start a Sequelize database transaction.
6.  Apply the balance increase using the transaction.
7.  Create the corresponding transaction record.
8.  Commit the database transaction.
9.  Return the transaction result and updated balance.

If any database step fails, roll back the balance change and transaction
record together.

**Important:** A simulated deposit needs an explicit trusted rule for
the source of funds. Do not expose an unrestricted public endpoint that
allows arbitrary balance creation in a real-money system.

------------------------------------------------------------------------

## Phase 4 --- Withdraw (Simulated)

Implement a service that debits a wallet only when the wallet has
sufficient funds.

### Suggested endpoint

`POST /api/v1/wallets/withdraw`

### Workflow

1.  Authenticate the user.
2.  Validate the amount and request fields.
3.  Load and validate the user's wallet.
4.  Confirm the wallet is active.
5.  Start a Sequelize database transaction.
6.  Perform a conditional debit that succeeds only if the balance is
    sufficient.
7.  Confirm that exactly one wallet row was updated.
8.  Create the transaction record.
9.  Commit the transaction and return the result.

If the balance is insufficient, reject the request without changing the
balance.

Do not rely only on reading the balance and then updating it in a
separate query. Concurrent requests can otherwise spend the same funds.
Use a conditional update or appropriate row locking and transaction
isolation for the chosen database workflow.

------------------------------------------------------------------------

## Phase 5 --- Transfer Engine

This is the most sensitive part of the project because two wallet
balances must remain consistent.

### Suggested endpoint

`POST /api/v1/transfers`

### Workflow

1.  Authenticate the sender.
2.  Validate the destination wallet, amount, currency, and idempotency
    key.
3.  Reject invalid transfers, including self-transfers if the product
    rules prohibit them.
4.  Start a Sequelize database transaction.
5.  Validate that both wallets exist and are active.
6.  Debit the sender with a conditional update that prevents a negative
    balance.
7.  Credit the receiver.
8.  Create the transfer record.
9.  Commit all changes together.
10. Return the transfer result.

If any step fails, roll back all changes. The sender must not be debited
unless the receiver is credited and the transaction record is
successfully persisted.

### Concurrency and idempotency requirements

-   Use a database transaction for the complete transfer.
-   Use conditional updates or row locks to prevent overspending.
-   If locking multiple wallet rows, acquire locks in a consistent order
    to reduce deadlock risk.
-   Enforce idempotency at the database level as well as in application
    logic.
-   If the same idempotency key is retried, return the existing result
    when the request matches; reject reuse with a different payload.
-   Ensure every query participating in the operation uses the same
    Sequelize transaction.

### Transfer acceptance criteria

-   A successful transfer decreases the sender's balance by the transfer
    amount and increases the receiver's balance by the same amount.
-   An insufficient-balance transfer changes neither balance.
-   A failure during the operation rolls back all related database
    changes.
-   Concurrent requests cannot spend the same funds twice.
-   A retried request with the same idempotency key does not execute
    twice.

------------------------------------------------------------------------

## Phase 6 --- Transaction History

### Suggested endpoints

  ----------------------------------------------------------------------------
  Method                  Endpoint                     Purpose
  ----------------------- ---------------------------- -----------------------
  `GET`                   `/api/v1/transactions`       List the authenticated
                                                       user's transactions

  `GET`                   `/api/v1/transactions/:id`   Get one transaction's
                                                       details
  ----------------------------------------------------------------------------

### Features

-   Pagination using `limit` and `offset`, or cursor pagination.
-   Filters by transaction type, status, and date range.
-   Stable sorting, normally newest first.
-   Validation of query parameters.
-   Authorization checks ensuring the user is associated with the
    relevant wallet or transaction.
-   Appropriate indexes to support common queries.

Do not trust a transaction ID alone as proof that the caller is allowed
to view it.

------------------------------------------------------------------------

## Phase 7 --- Financial Integrity and Security

Complete these safeguards before treating the project as finished.

### Required safeguards

-   Use integer minor units for money.
-   Enforce positive amounts and configured transaction limits.
-   Prevent negative balances with atomic database operations.
-   Use database transactions for multi-record financial operations.
-   Implement idempotency for operations that may be retried.
-   Prevent users from changing balances directly.
-   Verify wallet ownership and transaction access on every relevant
    endpoint.
-   Reject operations involving frozen wallets.
-   Keep credentials and secrets out of source control.
-   Use input validation, rate limiting, and safe error responses.
-   Record security-relevant events without logging passwords, tokens,
    or other secrets.

### Optional next step: Ledger

For stronger financial traceability, add a ledger with balanced entries
for each completed operation. Keep a clear audit trail and define
whether the ledger or wallet balance is the authoritative record. Do not
silently edit or delete completed financial records; use compensating
entries for corrections.

------------------------------------------------------------------------

## Phase 8 --- Testing

Use unit tests for service logic and integration tests against a
dedicated test database.

### Essential scenarios

-   A valid deposit increases the balance and records the transaction.
-   A valid withdrawal decreases the balance and records the
    transaction.
-   An insufficient-balance withdrawal is rejected with no balance
    change.
-   A successful transfer debits and credits the correct wallets.
-   A transfer failure midway through the workflow rolls back all
    changes.
-   Concurrent withdrawals or transfers cannot create a negative
    balance.
-   Retrying a request with the same idempotency key does not duplicate
    the operation.
-   A frozen wallet cannot send or receive funds according to the
    defined business rules.
-   A user cannot retrieve another user's wallet or transaction.
-   Invalid amounts, currencies, IDs, and request payloads are rejected.
-   Transaction history filters and pagination return the expected
    results.

### Test completion criteria

-   All critical financial and authorization tests pass.
-   Failed operations leave balances and transaction records consistent.
-   Tests run against a separate test database, never production data.

------------------------------------------------------------------------

## Phase 9 --- Docker, Documentation, and Deployment

Since Docker is part of the project, finish by making the development
and deployment workflow repeatable.

### Checklist

-   [ ] Configure the application and PostgreSQL with Docker Compose.
-   [ ] Keep secrets in environment variables or a suitable secret
    manager.
-   [ ] Run database migrations as an explicit deployment step.
-   [ ] Add a health-check endpoint.
-   [ ] Add structured logging and error monitoring.
-   [ ] Configure database backups and test recovery procedures.
-   [ ] Document environment variables and setup instructions.
-   [ ] Document endpoints, request bodies, responses, and error codes
    with Swagger/OpenAPI.
-   [ ] Run the integration test suite before deployment.
-   [ ] Verify that debug settings and test-only deposit behavior are
    disabled or protected in production.

------------------------------------------------------------------------

## Recommended Implementation Order

Use this order to keep the work manageable:

1.  Wallet model, migration, and associations.
2.  Create a wallet when a user registers, if not already implemented.
3.  Wallet details and balance endpoints.
4.  Transaction model and migration.
5.  Simulated deposit.
6.  Simulated withdrawal.
7.  Transfer service with atomicity and idempotency.
8.  Transaction history and filters.
9.  Security, concurrency, and integration tests.
10. Swagger documentation and Docker deployment.

**Do not start with the transfer engine.** First establish the wallet
model and balance rules, then implement and test the simpler money
operations. The transfer service can build on those foundations.
