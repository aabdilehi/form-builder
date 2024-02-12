# Simple form builder

This project consists of a Remix web application in which users can create and share questionnaires, and do very basic analysis of the responses. This web application uses an SQLite database managed using Prisma ORM for storage, Remix Auth with dev-xo's [TOTP strategy](https://github.com/dev-xo/remix-auth-totp) for authentication, and React and Tailwind for the front-end.

# Visit the site

The live version of the project is hosted [here](https://formbuilder.aabdilehi.com/). It is hosted on the free version of render.com so it might take a while to spin up on an initial visit. I will be looking into alternatives such as Deno Deploy but this works fine for now.

# What did I achieve?

The project was less about delivering a final product with a rich set of features and more about learning Remix. With that in mind, I am happy with the end result. I have no plans to do more with this project and I will take the skills I learned and apply them to new projects going forward. This was the first time I had used Remix, Prisma and Tailwind in any projects and both Tailwind and Remix are definitely things that I would like to learn more about. I did not utilise Tailwind effectively as I repeated code so often, and seemed to forget about practices related to CSS such as defining classes in favour of mindlessly creating long lists of Tailwind class names. I could have cut down on massive amounts of code by even extracting repeated elements into a component and defining the styling once instead. Remix is a much preferable method of having server-client interactions than a standard express server and serving files manually, and I will definitely use it in future projects where applicable. Prisma was a bit hit-or-miss, especially with SQLite having poorer support than other database types but features such as nested writes/reads, using models to represent the database, etc. definitely made things more intuitive. I do worry, with Prisma being pushed so hard for use in conjunction with Remix in many resources, that there may not be many other alternatives but that is something I will find out in time.

# What could I have done better?

As I have said, I am done with this project but that does not mean the product itself is finished and polished. There are clear areas I could have improved upon such as:

UI

- A clearer UI "rule-set" that creates a unified style page-to-page, compared to the confusing and inconsistent design currently in-place. A second pass on UI might have fixed this, though a thorough design plan to begin with would be ideal.
- A more responsive menu that changes to better fit smaller screens, e.g. having two menus, exclusive to smaller and bigger screens that hide and appear based on current screen size.
- Colours that clearly indicate the function of buttons, links, etc. rather than sticking to the colour scheme so strictly, e.g. delete buttons being red rather than purple.
- Higher contrast, especially in areas with light-purple backgrounds and white text. Definitely a mistake.

Features

- The response page is barely functional and the charts used to visualise the data is entirely pointless. Data analysis is not a field I am knowledgable in and, if this were a real product, I would do proper information gathering to know what features a user might want but, for this project, demonstrating that you can view responses is enough.
- Initially, I had an idea to create more in-depth analysis of the questionnaire responses by allowing users to freely define demographics based on potential answers to questions and filter responses using those demographics. I tried implementing this but I found that it was difficult to make it intuitive for the user and the code was excessive (something like 17000 lines of code). Once I changed the structure of the database to better incorporate other types of questions, I decided to scrap the feature rather than sink unimaginable hours into making it usable, especially when its usefulness is untested.
- More accessibility options such as dark mode, high-contrast mode, bigger text, making the page better for screen-readers, using more semantic tags where possible, etc.
- Partially implemented features such as profile images, setting visibility on questionnaires, setting whether responses are open or closed on questionnaires, shareable links, etc.

Security

- I tried my best to reduce the amount of sensitive information being stored about users and, with the TOTP implementation, it was reduced down to just an email. Using TOTP meant that I was leveraging the security of email providers rather than storing passwords, which would be bad as people tend to reuse passwords and anything getting leaked would have real consequences. However, the actual questionnaires themselves are not that secure and there is a real chance of sensitive information being stored within responses to questionnaires or the questionnaires themselves.

There are obviously many more areas that would need improvement if this were a real product but I cut my losses, added a disclaimer and decided to move on as I had learned a lot over the making of this project and that had tapered off massively.
