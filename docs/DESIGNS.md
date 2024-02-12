# Day Form(s)

My initial idea was to have one form on the day and you can add and subtract things to the form as needed. I am slowly learning this will not be the best case scenario. Ie user loses connection during form input and loses all the data. Form Updates to have appropriate metrics on vs off.

Structure would look like this per form

form => action => prisma query (GET, POST, PUT, DELETE?)

so each form would have 3 different queries?/ views? schemas for each table

This would make updating robust but it would clutter the workspace. Structure this well and make it easy to use as a developer.

Make the form templates modular to use keywords to create a form

Designs for the modularity would need a check to see if the day was even created yet. UX should they be required to enter certain info at a time or report when neeeded? How could I guide them to give themselves the best data?

## TechDebt

Make a single source of truth for the setup of the forms. Every form has the same 4 repeated processes that can be configged into their own function

1. Verifying user (Authorization)
2. Creating data format based on the schema (Harder to do)
3. Date Initializer for specified day (For the future)
4. To Find or Create the day based on search results of the date and user

# Database Schema future use cases

### Form misc

Values that dont neccesarly need time components yet

// Future use case
// model meditation {
// id String @id @default(uuid())
// date DateTime @default(now())
// duration Int
// time DateTime

// day day @relation(fields: [day_id], references: [id])
// day_id String
// }

// Future use case
// model intermittent_fasting {
// id String @id @default(uuid())
// date DateTime @default(now())
// start_time DateTime?
// end_time DateTime?
// duration Int?
// fasted Boolean @default(false)

// day day @relation(fields: [day_id], references: [id])
// day_id String @unique

// }
