### NodeJs Server for Appointment bonking app

### [Which app using this server? ](https://medirtro.web.app/)

### `Brief`

The challenge is to building a NodeJs server for a Appointment booking app. Where authorized users can booked appointment on their desire date and time and track their appointment status via user dashboard. There also have to a admin dashboard for manage appointment and manipulate users

### `Collections and end points`

- login to save user info and generate access-token >>>
  app.put("/login/:email", function)
- // update user profile >>>
  app.put("/profile/:email", function)
- // get data for specific user >>>
  app.get("/profile/:email", function)
- // check admin >>>
  app.get("/isAdmin/:email", function)
- // get all users info for admin dashboard >>>
  app.get("/users/:email", function)
- // change appointment status [admin-route] >>>
  app.put("/appointment", function)
- // delete appointment by id [admin-route] >>>
  app.delete("/appointments/:id",function)
- // delete user info and appointment for [admin-route] >>>
  app.delete("/user/:email", function)
- // get appointment invoice by id >>>
  app.get("/invoice/:id", function)
- // book appointment >>>
  app.post("/appointment", function)
- // get all services >>>
  app.get("/services", function)
- // view service details by id >>>
  app.get("/service/:id", function)

### `Technologies`

- NodeJs
- ExpressJs
- Firebase Authentication
- jsonwebtoken
- Mongodb
- Cors

#### `Ask Suzan for More Details`

Email: asadsuzan7@gmail.com

Linkedin: [asadsuzan](https://www.linkedin.com/in/asadsuzan/)

Whatsapp: [+88 01614010594](https://wa.me/message/46YDVA5OUV5RC1)
