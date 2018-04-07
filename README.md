# PWRLIFTING

An application where a list of lifters is displayed. You can interact with the list and find out more about the people in the list, but you can also add, edit and delete lifters.

Check out the demo right [here](https://pwrlifting.herokuapp.com/).

![Screenshot of Website](https://github.com/Mimaaa/be-assessment-2/blob/master/readme_resources/screenshot.png)
## Assessment 2
This is the second - and last - assessment for the backend course in which we need to present our final project.

> This assessment focusses on all main goals of this course: Build web apps with Node and store data in a database.

## Database
One of the requirements for this assessment is to use a database. We have the choice between noSQL and SQL databases. In the past I've worked with mySQL and I use it for my [hobby project](https://pwrlifting.nl). I've also used mongoDB for a [project](https://github.com/dandevri/watt-now/tree/feature/user-database) once. However, I'm planning to change the setup of my hobby project from PHP & mySQL to Node & PostgreSQL because of new feature additions. Thus, the choice for PostgreSQL was an easy one.
## Views

There are several views I utilized.

- [Home view](https://pwrlifting.herokuapp.com/)
- [Detail view](https://pwrlifting.herokuapp.com/1)
- [Add lifter view](https://pwrlifting.herokuapp.com/add)
- [Edit lifter view](https://pwrlifting.herokuapp.com/edit/1)
- [Log-in view](https://pwrlifting.herokuapp.com/login)
- [Sign-up view](https://pwrlifting.herokuapp.com/signup)

## Deployment

I'm using [Heroku](https://www.heroku.com) to deploy my server in combination with the [Heroku PostgreSQL instance](https://www.heroku.com/postgres). 

This repo is connected to Heroku, so all changes are deployed instantly.
# Installation

1. **Database setup**

[Follow my guide](https://github.com/Mimaaa/be-assessment-2/blob/master/readme_resources/db.md)

2. **Clone the project**

```sh
$ git clone https://github.com/Mimaaa/be-assessment-2.git
```

3. **Remove Code**

In order to use the local database you need to remove two lines of code.

## Scripts

To start the server:
```sh
$ npm start
```

To watch file changes through nodemon:
```sh
$ npm run watch
```

To check your code on linting errors:
```sh
$ npm run lint
```
# To-do
Currently, there are still some things left to do. I've started with the log-in and sign-up flows, but it's not there yet. There is a commit with the working code right [here](https://github.com/Mimaaa/be-assessment-2/commit/094ff67ca5c714de05ef69f28240b8b3d026464a). 

- [ ] Login
- [ ] Signup
- [ ] Add competitions table with join to lifter table

# What did I learn?
I learned a lot of new things above the things I already knew.
## Things like...

### Status Codes & Error Handling
I got a better understanding on how important error handling actually is. It makes sense though. If you are visiting a website and something happens, but you don't get any feedback on what exactly happened then you get a bad user experience.
### EJS
When using Node I always reverted to [Handlebars](https://handlebarsjs.com/), but [EJS](http://ejs.co/) is pretty awesome because you can still use JS in the templates.
### PostgreSQL
I've never used PostgreSQL but I'm familiar with the SQL syntax; it doesn't differ that much from mySQL. However, I needed to find out how to make new databases, tables, filling the tables and which data types to use, because there is a small difference between the mySQL and PostgreSQL data types.
### Node Concepts
A better understanding of Nodes' core concepts. Of course we have access to amazing packages, but it's also important to know what Node has to offer at its core. By following the LearnYouNode tutorial I've had the opportunity to learn those concepts.
### JS
In general I can say that my JavaScript/programming knowledge has increased. Stuff like a callback was an abstract term, but because of the frequent use in JS land and during this course, I got a better understanding of how to write JavaScript.
## Did I enjoyed it?
Yes, I definitely did. When I start working on a project I forget time and go into tunnel vision mode where I keep coding and trying new things till my mind is exhausted. It's fun.
# Resources

I used some videos in [this playlist](https://www.youtube.com/watch?v=EnczCDsN0p0&list=PLLDNgndR69We8OLIvx2TwveoZvtPuMnCF) to learn how to use PostgreSQL in combination with Node and I also referenced the code we used during the course.

# Contributing
If you would like to [contribute](https://github.com/Mimaaa/be-assessment-2/blob/master/CONTRIBUTING.md), you are welcome to do so.

# License

[MIT](https://github.com/Mimaaa/be-assessment-2/blob/master/LICENSE.md) © [Mirza](mirza.lol)
