The app that lets you see your wellbeing

What apps measure your wellbeing? I see habit tracks and calorie intake systems to track what you are doing. What about if what you are doing is actually working for you? There is weight trackers but what about a mental health tracker where you can receive feedback from yourself over a week, month, quarter, yearly. And to have an AI tap into your data to give you appropriate metrics and insights of what is working and what is not.

Everyone wants to live a better life and change themselves, but how do they know if what they are doing to better themselves, what they are changing about themselves is actually working to help their well being? There mental health, physical health, and fulfillment in life. I want people to lead more fulfilling lives and know what they are doing and how it is impacting them!

Consequence, know what affects you.

Supplement tracking for physical and mental health. Future updates turn it into a essential nutrients tracker and macro tracker. Claim is Nutrients are one of the pillars of health for a healthy brain. Misinformation has been going on for too long. We need to help people get their lives together.

## Features

- [x] Users can look back on their history and edit days
- [ ] Users can see a calendar view of their inserted information
- [ ] Users can set goals.
- [ ] Users can see their progress with goals.
- [ ] Users can see their successfully goals/non successful goals
- [ ] Users can add as many habits as they want to track
- [ ] Users are presented with a dashboard view of their metrics ie data visualizations of mental health, physical health, gut health, workouts. Optional to the user
- [x] Users can add journal entries to their dashboard

- [x] Users can choose metrics for supplement intake
- [x] Users can choose between mg and mcg in supplements form [link](./TODO.md)

- [x] UX: Users can have configured supplement values to add instead of filling out a form every time
- [ ] Users can search a database of food/supplement to choose from and import their data along with it.

- [ ] Users are shown more attributes to choose from for symptoms/descriptions
- [ ] Users can create their own symptoms

- [x] Users can see which data they have submitted in the forms and update
- [x] Users are provided another "window" to view the data they submitted

#### Exercise tracking

- [ ] Choose which type of exercise you worked. ie chest, tri, bi, back, shoulders, legs
- [ ] Then track more specific details like workouts, workout types/categories

### AI Integration with application

- [ ] Users can take a picture of a food/ingredients label to import the data.
- [ ] Users will fill out an onboarding process and the AI will "build" their portfolio/dashboard according to the information they filled out.
- [ ] Users can take a picture of their dish/meal to have a model predict/equate the nutrients and foods.

#### RAG implementation / AI Coach

- [ ] Users can talk with a chat bot to get feedback on their lives
      What system would I have in play? I would need a overarching direction to guide the users in. This would allow them to give the best information for the best response of the life coach.
- [ ] Users can select predefined templates to prompt the chat bot.
- [ ] Chat bot is connected to all of the users data and only the users data.
      Data will never be collected to interfere with the users daily life.

### Stat Tracking (Gamification)

Users can view a spider graph of mental health, physical health, stress, and other categories that fi in the top 5 categories for life and wellness. They can also see micro/macro nutrients, weight, and activity level.

I would love to make this like a game and have a personal stat card to view for yourself and maybe show others? I don't know if showing other people would be beneficial/usable.

- [ ] Users can link third party applications/apis to integrate their data from other apps. (loom, apple health, etc)

### Form Day Creation

Required fields are sleep, stress, health. Optional fields are: exercise, supplements, misc, alcohol intake, gluten intake.

I want stress and health to have multiple entries. Maybe after the first entry add plus buttons to add more entries.

Maybe add plus buttons on the side of the form to include as separate forms.

You wont do all of it every day. Some days you'll exercise and some days you wont.

How would I connect all these forms together with one submit button?

I would need context and an optional/required schema. IE toggle the button and the form appears and the form is wrapped in the context. But maybe that form has a "picked" schema and a different submit process? How would it look for that? Where would I give/get access for that? To have multiple actions? Or do I need my own api system?

First step is to be able to toggle and submit these forms to a submit function. This will get highly dependable fast.

Use Different forms with different data steps that all work together. Use context to change state for submitting the forms?

### Tech Debt/ Design Systems

Right now I have the read process routed through the url and load a "new" component on the page change with router.push(...). I think page state will be better for render quality. Then if the user wants to update/create they will be routed accordingly to day/[date]/create or edit
Need to look into some design patterns

## Brain Storm

I came across an app called Cronometer. Its doing very similar things to what I am creating. One Feature i really like from them is how they track all the micro-nutrients and macro nutrients, and weight. This would be highly beneficial for me but part of its paid. I think ill make it for myself.
They are using 3rd parts databases to pull in all their data. NCCDB, US Department of Agriculture, nutritionix.com, fooddb, etc.
This can feed the meals feature and show body weight, kcal, target kcal, micro-nutrients, macro-nutrients, and many more things.

I want a dashboard that I can customize for myself. To have all of it one location based off of my life. Robust and easy to use.

I want custom meals, supplements, and foods I regularly eat and use on the go so I can click and go. I do not want to enter in data all the time.

What if I could build a chatbot agent who I could talk to and it can add my "day" for me. A text to data feature. I feel like this would be game changing.

I want to track vitals. Anything that can be easily tracked by yourself

- Blood pressure
- Blood Glucose levels
- Heart rate
- ETC

I want to be able to import data from the doctors office

- Vitamins/nutrients
- Other testing features

I want to provide real facts from credible sources. There is a "normal" level for nutrients but that does not mean its right. The normal changes for ethnicity, body weight/muscle percentage and many other factors.

### Brain storm features

- [ ] Vitals tracking
- [ ] Data from doctors office
- [ ] Nutrient consumption tracking through supplements/food
- [ ] Customizable dashboard
- [ ] Real and credible information on a healthy lifestyle, supplements, eating, sleeping, relationships and fulfillment
- [ ] Custom made and configurable meals/supplements/etc
- [ ] Fasting window that is triggered by a click/schedule and can be automated by food entries or a click of a button
- [ ] Notification system for reminders/daily tips/ health awareness
- [ ] AI Chatbot to analyze correlations in your data and how you are feeling
- [ ] A generalized metric for tracking mental health and physical health
- [ ] Sleep tracker from an integrated electronic device and sleep quality from the perspective of the person, ie user input.

This application can be used along side doctors to help them help their patients by adding more data/information to their doctor visits. Not all patients are going to keep a track record of their symptoms unless it means the world to get themselves fixed. Digitize this service.

### Nutrient Ideas

Cronometer is dandy and all but the nutrients are not customizable to your body weight and exercise or ethnicity

I want to track all nutrients under the sun that are relevant to our humanly food intake. I want to create m

I want the forms to be modular and update on the same page they were created on
Top row is a list of main nutrients, ie fiber, protein, fat, sugar, carbs or the users highlighted nutrients
Underneath is shows the general, vitamins, carbohydrates, lipids, minerals, and proteins/amino acids

I want to be able to take vitals blood pressure, blood glucose, etc and biometrics
Track fasting with a timer.

### README Description Ideas

#### Idea 1

There are several mental health, nutrient and goal tracking apps on the web, but none of them were made by me all of them have horrible customer support and they're outdated. I didn't want to pay for them and I wanted my data on my own platform. I plan on giving a twist to this application with AI, not as the main component but as a way to leverage the data I have personally inputted into my own database.

My goal is to track my nutrients and symptoms and emotions along with journal queries to correlate with what I am consuming and how it is affecting my body and mental state. Consequences. Every action has a cause and an effect. These consequences are affecting my life. There have been too many days where my brain feels off because my stomach is not agreeing with something I ate.

My goal is to implement knowledge graph connections with llms to show the correlations of what is affecting me. I hope to get this tool to other peoples hands after I have made progress with it truly helping me. _remove this and the prior sentence_ I am interested in web development and AI. The utility that is coming from LLM is amazing and the future will hold truth to better outcomes and diagnosis of patients.
