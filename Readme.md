# Api Endpoint Simulator
---
This little tool is a node js app that uses express to build a rest api service for you that will
quickly create a little test REST api for you.

---
What we use:
- Node JS
    - Exress
    - LowDB
- Angular
- YAML configurations

---
## How to build your custom api endpoints
All you need to do is to create a yaml file where you define the endpoints and models and it will automatically build 
all the endpoints for you.


- Create a yaml file as defined below
- run the command "npm start"
- Use something like postman and try and call the rest api endpoints.
- There is a UI for the frontend and the address to view your endpoints and test them through the browser is: [http://localhost:5000/api] (http://localhost:5000/api)
---
## Example of yaml configuration file
 ```yaml
 setup:
    host: 127.0.0.1
    port: 5000
models:
  user: &user
    id:
      type: int
      fake: number
    name:
      type: string
      required: true
      fake: name
    email:
      type: string
      required: true
      fake: email
    _config:
        fake_records: 2

endpoints:
  "/users":
      get:        
        model:
          name: user
          schema: *user
      post:
        model:
          name: user
          schema: *user
  "/users/:id":
      get:
        params:
          - name: id
            type: int
            required: true
        model:
          name: user
          schema: *user
      put:
        params:
            - name: id
              type: int
              required: true
        model:
          name: user
          schema: *user

      delete:
        params:
            - name: id
              type: int
              required: true
        model:
          name: user
          schema: *user
            
 ```
