ROUTES

/api/users/...
GET.../
Retrieve all users

POST../signup
Create new user + log user in

POST ../login
Log user in

/api/places/...
GET .../user/:uid
Retrive list of all places for a given user id(uid)

POST .../
Create a new place

PATCH .../:pid
Update a place by id (pid)

Delete .../:pid
Delete a place by id (pid)

1) INSTALL DEPENDECIES
DEPENDECIES
npm i --save express body-parser
npm i --save-dev nodemon
npm i --save uuid
npm i --save express-validator //for form validation purpose
npm i --save axios //make requests to the google api

2)IMLEMENTING BASIC ROUTING
*places-routes
*users-routes

3) ERROR CHECK ON WHEN NO ITEM'S ID IS FOUND
*Adding Error module and passing the 404 code
