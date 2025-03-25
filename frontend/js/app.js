const registerBody = document.getElementById("registerBody");
const loginBody = document.getElementById("loginBody");

const baseURL = "http://localhost:3000";

const loginBtn = document.getElementById("btnLogin");
const registerBtn = document.getElementById("btnRegister");

const responseRegister = fetch(baseURL, {
  method: "POST",
  body: {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_host: 0,

  },

});

if(responseRegister.ok) 
{
  console.log("YIPPEE IT SENT, WE GOT A STATUS 200, and EVERYTHING IS OKAY!");
}

else if(!responseRegister.ok) 
{
  throw new Error(`Response Status: ${responseRegister.status}`);
}


const responseLogin = fetch("http://localhost:3000/register", {
  method: "POST",
  body: {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_host: 0,

  },

});

if(responseLogin.ok) 
{
console.log("YIPPEE IT SENT, WE GOT A STATUS 200, and EVERYTHING IS OKAY!");
}

else if(!responseLogin.ok) 
{
throw new Error(`Response Status: ${responseLogin.status}`);
}