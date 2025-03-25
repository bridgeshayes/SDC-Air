const registerBody = document.getElementById("registerBody");
const loginBody = document.getElementById("loginBody");

const baseURL = "http://localhost:3000";

const loginBtn = document.getElementById("btnLogin");
const registerBtn = document.getElementById("btnRegister");

loginBtn.addEventListener('click', async (event) => {
    const username = document.getElementById('txtUsernameLogin').value
    const password = document.getElementById('txtPasswordLogin').value

    const responseLogin = fetch(baseURL + "/login", {
        method: "POST",
        body: {
            username: username,
            password: password
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
})

registerBtn.addEventListener('click', async (event) => {
    const responseRegister = fetch(baseURL + "/register", {
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
})