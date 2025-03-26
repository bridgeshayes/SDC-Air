const registerBody = document.getElementById("registerBody");
const loginBody = document.getElementById("loginBody");

const baseURL = "http://localhost:3000";

const loginBtn = document.getElementById("btnLogin");
const registerBtn = document.getElementById("btnRegister");

loginBtn.addEventListener('click', () => {
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
});

const checkHost = document.getElementById("checkHost");

registerBtn.addEventListener('click',  () => {
  // variables  
  const firstNameInp = document.getElementById("txtFirstName");
  const lastNameInp = document.getElementById("txtLastName");
  const usernameInp = document.getElementById("txtUsernameRegister");
  const emailInp = document.getElementById("txtEmailRegister");
  const passwordInp = document.getElementById("txtPasswordRegister");
  const retypePassInp = document.getElementById("txtRetypePassword");
  let hostCheck;

  if(checkHost.checked)
  {
    hostCheck = 1;
  }
  else
  {
    hostCheck = 0;
  }



  console.log(checkHost);

  const responseRegister = fetch(baseURL + "/register", {
        method: "POST",
        body: {
            first_name: firstNameInp.value,
            last_name: lastNameInp.value,
            username: usernameInp.value,
            email: emailInp.value,
            password: passwordInp.value,
            is_host: hostCheck,
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