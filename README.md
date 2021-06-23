# lotr-employee-db

*This project is a work in progress.*

Nonetheless&mdash;if you are looking to manage a team of employees on your voyage across Middle Earth, then this is the app for you!

I used this project as a practice exercise in setting up a REST service with CRUD functionality.  The back end is written in Java and built using Spring Data REST.  Front end is built with React. Front end and back end are packaged together by Maven using Maven-frontend-plugin.  (I spent a long time working to get Maven and React to play well together in one package&mdash;it was quite challenging.)

For now, the app displays the list of employees, allows for changes to page size, and allows the user to add a new employee.  More functionality to come, including ability to edit and delete employees, plus profile authentication.

I built this project from scratch by following the Spring tutorial guide [here](https://spring.io/guides/tutorials/react-and-spring-data-rest/).
