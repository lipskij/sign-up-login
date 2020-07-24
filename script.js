const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const fields = { username, email, password, password2 };

function notEmpty(value) {
  return value.trim() !== "";
}

function isEmail(email) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function matches(value, key, schema) {
  return value === schema[key];
}

function length(min = 0, max = Infinity) {
  return function (value) {
    return value.length >= min && value.length < max;
  };
}

const schema = {
  username: [
    { validator: notEmpty, message: "Username cannot be empty" },
    {
      validator: length(4, 20),
      message: "Username should be at least 4 characters",
    },
  ],
  email: [
    { validator: notEmpty, message: "Email cannot be empty" },
    { validator: isEmail, message: "Email should be an email" },
  ],
  password: [
    { validator: notEmpty, message: "Password cannot be empty" },
    {
      validator: length(8, 30),
      message: "Password should be at least 8 characters",
    },
  ],
  password2: [{ validator: notEmpty, message: "Password cannot be empty" }],
};

function validate(schema, values) {
  const entries = Object.entries(schema).map(([propertyName, validators]) => [
    propertyName,
    validators
      .filter((validator) => !validator.validator(values[propertyName]))
      .map(({ message }) => message),
  ]);
  return Object.fromEntries(entries);
}

function getValuesObj(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function hasErrors(errors) {
  return Object.entries(errors).some(([key, value]) => value);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const errors = validate(schema, getValuesObj(e.target));

  renderErrors(errors);
  console.log(errors);
  console.log(hasErrors(errors));
  if (!hasErrors(errors)) {
    window.location = "/welcome.html";
  }
});

function renderErrors(errors) {
  if (errors.username.length) {
    setErrorFor(username, errors.username);
  } else {
    setSuccessFor(username);
  }

  if (errors.email.length) {
    setErrorFor(email, errors.email);
    // } else if (!isEmail(emailValue)) {
    // setErrorFor(email, "Email is not valid");
  } else {
    setSuccessFor(email);
  }

  if (errors.password.length) {
    setErrorFor(password, errors.password);
  } else {
    setSuccessFor(password);
  }

  if (errors.password2.length) {
    setErrorFor(password2, errors.password2);
    // } else if (passwordTwoValue !== passwordValue) {
    //   setErrorFor(password2, "Passwords do not match");
  } else {
    setSuccessFor(password2);
  }
}

function setErrorFor(input, message) {
  const firstMsg = message[0];
  // TODO: handle multiple error messages
  const formControl = input.parentElement; // .form-control
  const small = formControl.querySelector("small");
  // add error message inside small tag
  small.innerText = firstMsg;
  // add error class
  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function renderLiveUpdate(event) {
  const name = event.target.name;
  const errors = validate({[name]: schema[name]}, { [name]: event.target.value });
  if (errors[name].length) {
    setErrorFor(fields[name], errors[name]);
  } else {
    setSuccessFor(fields[name]);
  }
}

// live update UI
username.addEventListener("keyup", renderLiveUpdate);

password.addEventListener("keyup", renderLiveUpdate);
 
// TODO: add new add maches validator
password2.addEventListener("keyup", function (e) {
  e.target = password2.value;
  if (password2.value === "") {
    setErrorFor(password2, "Password cannot be empty");
  } else if (password.value !== password2.value) {
    setErrorFor(password2, "Passwords do not match");
  } else {
    setSuccessFor(password2);
  }
});

email.addEventListener("keyup", renderLiveUpdate);
