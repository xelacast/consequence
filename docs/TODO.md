# Todo

Feb 10th, 2024

### Frontend

Make each form modular. Have the designs as schema/form => action => CRUD DB

- [x] Supplements
- [x] Exercise
  - [x] Exercise Action
  - [x] Exercise Modular Form
- [x] Sleep
- [x] Health
  - [x] Mental Health Descriptors for select drop down menu
- [x] Misc

  - [x] Make one large form for the misc. Its one off yes/no with time frames. (might not be worth it to remove only a few lines of code)

Feb 14th, 2024

- [ ] Coding design: Make the boiler plate for the input component reusable. This will save hundreds of lines of code and a lot of copy pasta
- Supplements
  - [x] Make amount type choosable with mcg and mg
  - [x] Make Time Taken a clock
- Stress
  - [x] Add stress as a category for measuring
    - Fields should be as followed
    - [x] Stress scale (1-10)
    - [x] Stress symptoms (select 5)
    - [x] Description of current state of mind/life/journal (optional for user)
    - [x] Actions for form
- Mental/Physical Health
  - [ ] Add descriptions/notes section (optional for user)
- Sleep
  - [ ] Add description section for sleep (optional for user)
- Meals

  - [ ] Add a meals category for when you ate/snacked/big meals
    - This will show how eating is impacting you (one to many relation)
    - [ ] Add when you ate
    - [ ] A field with healthy/non healthy for simplicity
    - [ ] How much you ate (relative calories)
    - [ ] Add a field for how much macros you are getting (optional field)
    - [ ] Add a section for a crash

- CRUD
- [x] I can look back in time and edit entries
- [x] I can see the journal/day entry based on the selected day
- [x] Health descriptors are not being saved correctly. Fix this asap
- [x] Zod Schema is hard to work with for the use case I want=
- [x] Users are required to fill out health, stress, and sleep. These are three things that anybody can describe at a given moment of the day.

- Features
  -- These components will be highly dependent of eachother. Exactly the same almost
- [ ] Users can have multiple entries for stress
- [ ] Users can have multiple entries for health

- [ ] Fix updateDay.tsx, schema.ts, and dayAction to accommodate multiple uploads for each.

- [x] fix exercise selection data insert
- [ ] Users will receive a success message after updating the day
- [ ] Users will receive a success message after creating a day

- [x] Fix logic for initial state for day provider context

March 1st

- [ ] UX: Users can have configured supplement values to add instead of filling out a form everytime

Users are shown more attributes to choose from for symptoms/descriptions

- [ ] Mental Health
- [ ] Physical Health
- [ ] Stress
- [ ] Sleep

- Mental/Physical Health
- [ ] Add descriptions/notes section (optional for user)
- Sleep
  - [ ] Add description section for sleep (optional for user)

#### Supplement configuration

- [x] when the user submits the supplement to be added it will remove all ingredients and reset the latest supplement name, brand name, and service size
- [x] When the user submits the supplement the supplements will be updated on the left hand side
- [x] Users can toggle which supplements that they are actively taking to lower the amount to choose from on the main form.
- [ ] Users can edit their supplements they input incase of mistakes
- [ ] User can choose from a predefined supplement list when filling out their forms
- [ ] When users manually create supplements, they are given a list of predefined ingredients to abide to standards for data metrics
- [ ] When users manually create supplements, that are given a list of predefined brand names and list of products from those brand names.
- [ ] Users can select which supplements and how many capsules/servings they have taken on the day form.

Security for supplementation configuration

- [ ] Rate limiting
- [x] Form validation and max lengths
- [ ] Script injections testing
- [ ] Component Testing

Issues: Data standards for micro-nutrients and macro-nutrients. Either cast a large net or have very specific values/names to go by.

### Testing

- [ ] test clerk user creation/deletion/update functionality
