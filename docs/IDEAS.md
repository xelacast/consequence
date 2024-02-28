The app that lets you see your wellbeing

What apps measure your wellebeing? I see habit trackes and calorie intake systems to track what you are doing. What about if what you are doing is actually working for you? There is weight trackers but what about a mental health tracker where you can receive feedback from yourself over a week, month, quarter, yearly. And to have an AI tap into your data to give you appropriate metrics and insights of what is working and what is not.

Everyone wants to live a better life and change themselves, but how do they know if what they are doing to better themselves, what they are changing about themselves is actually working to help their well being? There mental health, physical health, and fullfillment in life. I want people to lead more fullfilling lives and know what they are doing and how it is impacting them!

Consequence, know what affects you.

Supplement tracking for physical and mental health. Future updates turn it into a essential nutrients tracker and macro tracker. Claim is Nutrients are one of the pillars of health for a healthy brain. Misinformation has been going on for too long. We need to help people get their livdes togother.

## Features

- [x] Users can look back on their history and edit days
- [ ] Users can see a calendar view of their application
- [ ] Users can set goals.
- [ ] Users can see their progress with goals.
- [ ] Users can see their successfully goals/non successful goals
- [ ] Users can add as many habits as they want to track
- [ ] Users are presented with a dashboard view of their metrics
- [ ] Users can add journal entries to their dashboard

- [x] Users can choose metrics for supplement intake
- [x] Users can choose between mg and mcg in supplements form [link](./TODO.md)

- [ ] UX: Users can have configured supplement values to add instead of filling out a form everytime

- [x] Users can see which data they have submitted in the forms and update
- [x] Users are provided another "window" to view the data they submitted

### Stat Tracking (Gamification)

Users can view a spider graph of mental health, physical health, stress, and other categories that fi in the top 5 categories for life and wellness

I would love to gamify this and have a personal stat card to view for yourself and maybe show others? I don't know if showing other people would be benficial/usable.

### Form Day Creation

Required fields are sleep, stress, health. Optional fields are: exercise, supplements, misc, alcohol intake, gluten intake.

I want stress and health to have multiple entries. Maybe after the first entry add plus buttons to add more entries.

Maybe add plus buttons on the side of the form to include as seperate forms.

You wont do all of it every day. Some days youll exercise and some days you wont.

How would I connect all these forms together with one submit button?

I would need context and an optional/required schema. IE toggle the button and the form appears and the form is wrapped in the context. But maybe that form has a "picked" schema and a different submit process? How would it look for that? Where would I give/get access for that? To have multiple actions? Or do I need my own api system?

First step is to be able to toggle and submit these forms to a submit function. This will get highly dependable fast.

Use Different forms with different data steps that all work together. Use context to change state for submiting the forms?

### Tech Debt/ Design Systems

Right now I have the read process routed through the url and load a "new" component on the page change with router.push(...). I think page state will be better for render quality. Then if the user wants to update/create they will be routed accordingly to day/[date]/create or edit
Need to look into some design patterns
