# Supplements Configuration Documents

Configure Supplements page
@has form for supplements configuration, configured supplements list, edit/update/create/delete button
@returns JSX.Element
@data can make this universal and pull supplements from a third party database or allow users to create there own. Or both?

## Data source

I am going to use a 3rd part data source from DSLD data a government api for supplying information on supplements
found a supplement data source. Ill have the users choose their supplements from the list and then they can add their own if they want. Also when they choose it will be added to a supplement_config list. Using a supplement database made by the government with all company info can potentially lead to good data use and analysis

## How to use

[DSLD REST API](https://dsld.od.nih.gov/api-guide)

## Plan of action and problems that might arise

I am wondering if I should insert all of this data into the database or use their api for now? Their api is rate limited at 1000 requests per minute and can be increased. This would not work for scale. But the users would take the load of the database if applicable. I don't think it would effect it that significantly.

- 1. What serving size did they take. Default to 1. Make this changeable
- 2. How am I going to link all the data? Insert all supplements into the database? Which is better?
- 3. Appropriate way to get the data and display it.
- 4. A fast search mechanism to find the supplements. Vectorize them?
- 4.1. Search by name, brand, doctor, type?
- 5. If a user can't find a supplement they want, they can add it to their list of supplements they are taking.
- 6. (Optional) Configure the supplements on what time they usually take them and send them a reminder to take them.
- 7. This is a lot bigger monster than I thought. This will need thorough planning.

I need to create a db schema template instead of using my brain.

### Limitations of DSLD API

Search feature does not have partial searches. Names must be exact for the api to find an appropriate value.
Information is not full and up to date.

## UI/UX Planning

The user can select a tab if they want to search by brand, name, product, ingredients. When they search it will be a .3 second delay after the last key stroke for the api to be called. This will mitigate the amount of calls per typed letter. To get an aggregated, filtered and easier search ill have a series of input boxes for the user. For example the user can type in their supplement and then if thats too broad they can type in the brand name or another search filter to find the product they are looking for. (This will be valuable only when I have a large amount of supplements/medications in the database)

When the user selects this product it will be put on a cache or in the database for the user to reuse in the future.

#### Feature

- [ ] Let the user take a picture of the bottle front and back and it will input the information. Let the users insert correct information and insert it into a supplements portion of the database.
      How to check if all of the information is correct? (!IMPORTANT) Need a standardized process for proper values for brand name, ingredients, supplements names etc.

- [x] when the user submits the supplement to be added it will remove all ingredients and reset the latest supplement name, brand name, and service size
- [x] When the user submits the supplement the supplements will be updated on the left hand side
- [x] Users can toggle which supplements that they are actively taking to lower the amount to choose from on the main form.
- [ ] Users can edit their supplements they input incase of mistakes
- [ ] User can choose from a predefined supplement list when filling out their forms
- [ ] When users manually create supplements, they are given a list of predefined ingredients to abide to standards for data metrics
- [ ] When users manually create supplements, that are given a list of predefined brand names and list of products from those brand names.
- [ ] Users can select which supplements and how many capsules/servings they have taken on the day form.
- [ ] Users can take a picture of a food/ingredients label to import the data. (AI Computer Vision)
- [ ] There is a "type" on the supplements configuration to check for capsules/amount. User the measurement category and check for capsules vs mg/mg. OR let the user choose between serving size and amount taken? Then it can be calculated accordingly?

Issues: Data standards for micro-nutrients and macro-nutrients. Either cast a large net or have very specific values/names to go by.

UX: User comes to supplement configuration page. User can either search for the exact supplements they are using or if not found they can fill out a form to add to their profile and which adds to the database based on verification of data. We do not want dirty data. This has to be done right or it can interfere with the users experience.

I also want to do this for medications too.

### Building the UI/UX

What information do we need?
Brand Name
Supplement Name
Description
Amount Per Serving
Serving Size
Ingredients (Standard Ingredients for tracking)
Daily Value(optional)
Other Ingredients (Brand Name Ingredients)
Suggested Use
Warnings
Storage
Notes/Other information
Company and Manufacture

I want the first 6 properties to be required and the rest will be hidden in a drop down menu if the user wants to fill them out. If the user chooses to take a picture all of the information will be filled out.

Example:
Brand Name: Freshcap, Supplement Name: Lion's Mane, Description: Focus, Clarity, Mood, Serving Size: 2 Capsules, Serving Size: 1g, Ingredients: Organic Lion's Mane Extract(Standardized to contain 31% Beta Glucan) (Hericium erinaceus) (Fruiting Body), Other Ingredients: Pullulan Capsule, Suggested Use: As a dietary supplement, take 2 capsules per day or as recommended by a qualified healthcare practitioner, Warning: Keep out of reach of children, Consult a Physician..., Storage: Avoid excessive head, light, and moisture..., Notes: No added grain or filler, certified organic.

UX: User tries to find supp with the search mechanism. If not found then allow the user to make their own. When creating their own they will have a search for brand name. If no brand name then add the brand name.
We might need similarity search and a cleanup function for good un-duplicated data if were trusting the user for correct information.
They will also have a dosage/ amount used. This will default to 1 serving size.

### Building the backend and data pipeline

Skills to Improve: Data pipelines and db schemas.

Where is this data going to be living?
If the data is full and correct it will be inserted into the database? How can I get up to date information for supplements? Scrape the web? There might be a better api.
First iteration will be user input data. Second will be API/Database information control.
It can be connected to the supplement table for reference? The users supplement table is for time/supplements they take. We don't want types of supplements living there.
I will have a table with the following properties from the UI/UX as with date added, date updated,

What relationships is this table going to have? This is going to be a one to one?
Right now we have day that is one many for supplements so supplements to supplement will be one to one?
What if the user doesn't have configured supplements? They can still search?

Supplement Table will be the holy grail while the supplements table will be the user inputted information?

We can have a supplemented configuration table to show which supplements they user on regular basis and if they want them present for selection on their forms. Do this to disencumber the frontend selection.

Supplement will have a designated ingredient list to choose from.

## Customer/Business Value

Users can select specific supplements and do not have to configure their own. Its easy to use and simple.
Dynamic growing supplement database.
