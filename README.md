# Node.js To-Do REST API
A to-do REST API. Deployed to Heroku, uses Express, MongoDB, JWTs, Crypto-js

## API description:
**POST /users => {"email": "n.o.n.e1@some.ca", "password": 123456} -** creates a new user, assigns JWT for authentication

**GET /users/me -** if JWT is provided, returns user id & email

**POST /users/login => {"email": "n.o.n.e1@some.ca", "password": 123456} -** logs in the existing user by assigning a new JWT

**DELETE /users/me/token -** logs out the user


**GET /todos -** returns all todos created by currently logged in user

**GET /todos/:id -** returns a single todo

**POST /todos => {"text": "Postman POST message"} -** saves a new todo with a certain text.

**DELETE /todos/:id -** Deletes a single todo

**PATCH /todos/:id => {"text": "Postman POST message"[, "completed": true]} -** Updates a single todo. If "completed" parameter is provided and set to 'true', saves the time the task was completed. If "completed" is set to 'false', removes the completion time.
