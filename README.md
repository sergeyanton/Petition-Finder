# SENG365 Assignment 2


## Running locally

1. Use `npm install` to populate the `node_modules/` directory with up-to-date packages
2. Create a file called `.env`, following the instructions in the section below
3. Go to https://dbadmin.csse.canterbury.ac.nz and create a database with the name that you set in the `.env` file
2. Run `npm run start` or `npm run debug` to start the server
3. The server will be accessible on `localhost:4941`

### `.env` file

Create a `.env` file in the root directory of this project including the following information (note that you will need
to create the database first in phpMyAdmin):

```
SENG365_MYSQL_HOST=db2.csse.canterbury.ac.nz
SENG365_MYSQL_USER={your usercode}
SENG365_MYSQL_PASSWORD={your password}
SENG365_MYSQL_DATABASE={a database starting with your usercode then an underscore}
```

For example:

```
SENG365_MYSQL_HOST=db2.csse.canterbury.ac.nz
SENG365_MYSQL_USER=abc123
SENG365_MYSQL_PASSWORD=password
SENG365_MYSQL_DATABASE=abc123_s365
```

## Some notes about endpoint status codes

The api spec provides several status codes that each endpoint can return. Apart from the 500 'Internal Server Error'
each of these represents a flow that may be tested. Hopefully from the labs you have seen these status codes before and
have an understanding of what each represents. A brief overview is provided in the table below.

| Status Code | Status Message        | Description                                                                   | Example                                          |
|:------------|-----------------------|-------------------------------------------------------------------------------|--------------------------------------------------|
| 200         | OK                    | Request completed successfully                                                | Successfully get petitions                       |
| 201         | Created               | Resources created successfully                                                | Successfully create a petition                   |
| 400         | Bad Request           | The request failed due to client error                                        | Creating a petition without a request body       |
| 401         | Unauthorised          | The requested failed due invalid authorisation                                | Creating a petition without authorisation header |
| 403         | Forbidden             | The request is refused by the server                                          | Trying to delete someone else's petition         |
| 500         | Internal Server Error | The request causes an error and cannot be completed                           |                                                  |
| 501         | Not Implemented       | The request can not be completed because the functionality is not implemented |                                                  | 

Note: In some cases we will accept more than one status code as correct, the case for this is when a user asks to
complete a forbidden action on a resource that does not exist. This is because the response depends on the order of
operations, if you check the resource is missing first then a 404 makes sense, if you check whether a user is 'allowed'
to complete the action first a 403 makes sense. In a proper application, you may also think about which one of these
responses is better, and gives away the least information about the system to the client.

## How marking works

A Postman collection has been provided in the `postman` folder, you can easily import this (and the specific
environment variables) to test your assignment as you work on it. More information about the exact steps can be found in
Lab 2. **Note:** You will need to copy the images within the files folder to your Postman working directory.

This Postman collection is a subset of the tests your application will be marked against so passing these tests should
be your highest priority. You may wish to add to this collection yourself to have more tests to validate your work
against as you go.
**Note:** The collection provided accounts for about half of the total tests.

## Steps you should take before finishing

Before finalising your code, you should

1. Import a fresh copy of your project from Eng-Git
2. Create a `.env` file with only the fields discussed above
3. `run npm install`
4. `run npm run start`
5. Run the Postman collection provided and check that the tests are running as expected

These steps will help you find issues such as:

1. Required dependencies not included in your `package.json`
2. Use of other environment variables that will not be used during marking

## Final notes

We suggest that you do not modify the files within the `src/app/resources` folder as we may update these at any time if there is
an issue (such as updating the api spec). Whilst you are free to modify the Postman collection it may be safer to do
this through Postman only and not push the updated collection (or push your updated version under a different name).

Images within the `storage\default` folder should not be removed, when reloading the server these will be copied to
storage\images where the server can add, update or delete them when running.

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
