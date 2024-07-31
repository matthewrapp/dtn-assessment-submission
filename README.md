# DTN Frontend/Fullstack Development Assessment

- Completed by <b>Matthew Rapp</b>
- Completed on July 30, 2024
- [Watch video presentation of the working application](https://www.loom.com/share/be8a31ea2d9e4d16897ff9a36884a5de?sid=8c2662c7-3b3e-495a-9319-13edc08449d4)

## Getting Started

- Command: `npm install`
  - Install all the packages associated to this application.
- Navigate to `/server/db/mongodb.js` to change out the mongodb connection ENV, if necessary.
- Command: `npm run dev`
  - Once installed, should be able to get the application (client & server) up and running.
- Navigate in the browser to http://localhost:3000/students to see the changes.

## Features Completed

- Show a list of students, displaying their first name, last name, email, age, and grade
- The user can create/add a new student
- The user can edit an existing student
- The user can delete a student
  - Before the user can be deleted, a confirmation dialog displays making sure the user really wants to delete the student
- The student list allows for pagination
- The student list allows for sorting
- The student list allows for filtering
- Client-side form validation
  - First name and last name fields are required
  - The email field must be a valid email
  - The age field must be 0 or greater
  - Will display errors on the form on submission if the form is incorrect

## Tools and Technologies I Used and Implemented

- Typescript
- Javascript
- React
- Node / Express
- Tailwind
- Jest
- Mongodb / Mongoose
- Webpack (build tool)

### Other packages

- nodemon (https://www.npmjs.com/package/nodemon)
- dotenv (https://www.npmjs.com/package/dotenv)

## Notable commands

- `npm run dev`
  - Command used to run the application in development, using 'nodemon' for automatic server restarts whenever the file(s) change.
- `npm run tailwind:watch`.
  - Due to difficulties getting Tailwind to work using PostCSS in this repository, I decided to just use Tailwind's CLI to scan the files for classes and build out an output css file.
  - You can see both the input.css file and the output.css file here: `/app/tw-styles`.
- `npm run test:student`
  - I built a command to only test my changes and the features I added to this repository.
  - You can view my test code here: `/app/containers/StudentsPage/tests`.
  - I mainly wrote tests to make sure the api was working correctly with the client.

## Notes

- Ran into some difficulties getting the repo started initally.
  - I was running Node version 20.16.0, but had to downgrade to Node version 16.20.2 to get it started.
  - If the application won't start for you, try running Node version 16 if not already.
- Once I got the application started, I realized some of the type errors I was getting was due to an older version of Typescript. So I upgrade Typescript and some of its' related packages.
  - Package `typescript` from "3.8.2" to "4.8"
  - Package `typescript-plugin-styled-components` from "1.4.4" to "3.0.0"
  - Package `eslint-plugin-import` from "2.20.1" to "2.22.1"
- From there, development seemed to go super smooth up until trying to automate some tests with "Jest" and running the `npm run test` command.
- Due to not being able to get the boilerplate tests (`npm run test`) without throwing errors, I created another command, (`npm run test:student`) to demonstrate my knowledge for writing and implement tests. Run that command to test all of the features and work I added to this repository.
