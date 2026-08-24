import authService from "./auth.service.js";

const result = await authService.login({
    email:"user1@gmail.com",
    password:'Rahul@1223'
})

console.log(result);
