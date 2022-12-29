var userFullName = "";
var userKey = "";

window.addEventListener("load", showWelcome);
function showWelcome() {
  let html = "<h2>Bienvenido " + userFullName + "</h2>\n";
  html += `
          <p>El sistema fué desarrollado usando estas tecnologías:</p>
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>Perl</li>
            <li>MariaDB</li>
            <li>Javascript</li>
          </ul>`;
  document.getElementById("main").innerHTML = html;
}

function showMenuUserLogged() {
  let html =
    "<p onclick='showWelcome()'>Inicio</p>\n" +
    "<p onclick='doList()'>Lista de Páginas</p>\n" +
    "<p onclick='showNew()' class='rigthAlign'>Página Nueva</p>\n";
  document.getElementById("menu").innerHTML = html;
}

function showLogin() {
  let html = `<link rel="stylesheet" type="text/css" href="css/myStyle.css">
  <h1>Login</h1>
  <div class="form">
    <input placeholder="Usuario" type='text' id='user' name='user'>
    <input placeholder="Contraseña" type='password' id='password' name='password'>
    <br>
    <input type="submit" value="Ingresar" onclick="doLogin()">
  </div>
  <div class="card" id="error">
  </div>`;

  document.getElementById("main").innerHTML = html;
}

function doLogin() {
  let name = document.getElementById("user").value;
  let pass = document.getElementById("password").value;

  if (name && pass) {
    var url = "cgi-bin/login.pl?user=" + name + "&password=" + pass;
    var promise = fetch(url);
    promise
      .then((response) => response.text())
      .then((data) => {
        var xml = new window.DOMParser().parseFromString(data, "text/xml");
        loginResponse(xml);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  } else {
    document.getElementById("error").innerHTML =
      "<h1 style=color:#1ab188;background-color:red;padding:40px;>Ingrese los datos correctamente</h1>";
  }
}

function loginResponse(xml) {
  var list = xml.getElementsByTagName("user")[0];

  if (xml.getElementsByTagName("owner")[0]) {
    console.log(list);
    userFullName =
      xml.getElementsByTagName("firstName")[0].textContent +
      " " +
      xml.getElementsByTagName("lastName")[0].textContent;
    userKey = xml.getElementsByTagName("owner")[0].textContent;
    showLoggedIn();
  } else {
    document.getElementById("error").innerHTML =
      "<h1 style=color:#1ab188;background-color:red;padding:40px;>Datos erróneos</h1>";
  }
}

function showLoggedIn() {
  document.getElementById("userName").innerHTML = userFullName;
  showWelcome();
  showMenuUserLogged();
}

function showCreateAccount() {
  let html = `<link rel="stylesheet" type="text/css" href="css/myStyle.css">
  <h1>Registro</h1>
  <div class="form">
    <input placeholder="Usuario" type='text' id='user' name='user'>
    <input placeholder="Contraseña" type='password' id='password' name='password'>
    <input placeholder="Nombre" type='text' id='first' name='first'>
    <input placeholder="Apellido" type='text' id='last' name='last'>
    <input type='submit' value='Registrarse' onclick="doCreateAccount()">
  </div>
  <div class="card" id="error">
  </div>`;

  document.getElementById("main").innerHTML = html;
}

function doCreateAccount() {
  let user = document.getElementById("user").value;
  let passw = document.getElementById("password").value;
  let firstN = document.getElementById("first").value;
  let lastN = document.getElementById("last").value;

  if (user && passw && firstN && lastN) {
    var url =
      "cgi-bin/register.pl?user=" +
      user +
      "&password=" +
      passw +
      "&firstName=" +
      firstN +
      "&lastName=" +
      lastN;
    var promise = fetch(url);
    promise
      .then((response) => response.text())
      .then((data) => {
        var xml = new window.DOMParser().parseFromString(data, "text/xml");
        loginResponse(xml);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  } else {
    document.getElementById("error").innerHTML =
      "<h1 style=color:#1ab188;background-color:red;padding:40px;>Ingrese los datos correctamente</h1>";
  }
}

/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
function doList() {
  var url = "cgi-bin/list.pl?owner=" + userKey;
  var promise = fetch(url);
  promise
    .then((response) => response.text())
    .then((data) => {
      var xml = new window.DOMParser().parseFromString(data, "text/xml");
      showList(xml);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function showList(xml) {
  if (xml.getElementsByTagName("title")[0]) {
    console.log("Error");
    let title = xml.getElementsByTagName("title");
    let article = xml.getElementsByTagName("article");
    let owner = xml.getElementsByTagName("owner")[0].textContent;
    console.log(article);
    let html = "<h1>Lista de páginas</h1>";
    html += `<hr size="8px" color="black">`;
    for (let i = 0; i < article.length; i++) {
      if (xml.getElementsByTagName("title")[i].textContent) {
        console.log(title[i].textContent);
        html +=
          title[i].textContent +
          `
          <button class="buttonMini" onclick=doView("` +
          owner +
          `","` +
          title[i].textContent +
          `")>Ver contenido</button>
          <button class="buttonMini" onclick=doDelete("` +
          owner +
          `","` +
          title[i].textContent +
          `")>Borrar contenido</button>
          <button class="buttonMini" onclick=doEdit("` +
          owner +
          `","` +
          title[i].textContent +
          `")>Editar contenido</button>
          <br><br>`;
      }
    }
    document.getElementById("main").innerHTML = html;
  } else {
    document.getElementById("main").innerHTML =
      "<h1 style=color:red;>Este usuario no tiene páginas</h1>";
  }
}

function showNew() {
  let html =
    `<link rel="stylesheet" type="text/css" href="css/myStyle.css">
  <h1>Nueva página</h1>
  <div class="form">
    <h2>Usuario: ` +
    userKey +
    `</h2>
    <br>
    <input placeholder="Escribe el título..." type='text' id='title' name='title'>
    <br>
    <textarea placeholder="Escribe el texto..." type='text' id='text' name='text' style="margin: 0px; max-width: 280px; width: 280px; min-height: 267px;"></textarea>
    <br><br>
    <input type='submit' value='Crear Página' onclick="doNew()"style="font-size:15px;">
    <input type='submit' value='Cancelar' onclick="doList()">
  </div>
  <div class="card" id="error">
  </div>`;

  document.getElementById("main").innerHTML = html;
}

function doNew() {
  let title = document.getElementById("title").value;
  let text = document.getElementById("text").value;
  let encodedText = encodeURIComponent(text);

  if (text && title) {
    var url =
      "cgi-bin/new.pl?owner=" +
      userKey +
      "&title=" +
      title +
      "&text=" +
      encodedText;
    var promise = fetch(url);
    promise
      .then((response) => response.text())
      .then((data) => {
        var xml = new window.DOMParser().parseFromString(data, "text/xml");
        responseNew(xml);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  } else {
    document.getElementById("error").innerHTML =
      "<h1 style=color:#1ab188;background-color:red;padding:40px;>Ingrese los datos correctamente</h1>";
  }
}

function responseNew(response) {
  let title = response.getElementsByTagName("title")[0];
  let text = response.getElementsByTagName("text")[0];

  if (response.getElementsByTagName("title")) {
    let html = "<h1>" + title.textContent + "</h1><br>";
    html += "<h3>" + text.textContent + "</h3>";
    document.getElementById("main").innerHTML = html;
  } else {
    document.getElementById("error").innerHTML =
      "<h1 style=color:#1ab188;background-color:red;padding:40px;>Datos erróneos</h1>";
  }
}

function doView(owner, title) {
  var url = "cgi-bin/view.pl?owner=" + owner + "&title=" + title;
  var promise = fetch(url);
  promise
    .then((response) => response.text())
    .then((data) => {
      console.log(data + " data");
      responseView(data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function responseView(response) {
  let html = response;
  console.log(response + "response");
  if (response) {
    document.getElementById("main").innerHTML = html;
  } else {
    document.getElementById("main").innerHTML =
      "<h1 style=color:red;>Ocurrió un error inesperado</h1>";
  }
}

function doDelete(owner, title) {
  var url = "cgi-bin/delete.pl?owner=" + owner + "&title=" + title;
  var promise = fetch(url);
  promise
    .then((response) => response.text())
    .then((data) => {
      doList();
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function doEdit(owner, title) {
  var url = "cgi-bin/article.pl?owner=" + owner + "&title=" + title;
  var promise = fetch(url);
  promise
    .then((response) => response.text())
    .then((data) => {
      var xml = new window.DOMParser().parseFromString(data, "text/xml");
      console.log(xml);
      responseEdit(xml);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function responseEdit(xml) {
  let owner = xml.getElementsByTagName("owner")[0].textContent;
  let title = xml.getElementsByTagName("title")[0].textContent;
  let text = xml.getElementsByTagName("text")[0].textContent;

  let html =
    `<link rel="stylesheet" type="text/css" href="css/myStyle.css">
  <h1>Update</h1>
  <div class="form">
    <h2>Usuario: ` +
    owner +
    `</h2>
    <br>
    <h2>Título: ` +
    title +
    `</h2>
    <br>
    <textarea placeholder="Escribir" type='text' id='textUpdate' name='textUpdate' style="margin: 0px; width: 280px; max-width:280px; min-height: 267px;">` +
    text +
    `</textarea>
    <br><br>
    <input type='submit' value='Actualizar' onclick=doUpdate("` +
    title +
    `") style="font-size:15px;">
    <input type='submit' value='Cancelar' onclick="doList()">
  </div>
  <div class="card" id="error">
  </div>`;

  document.getElementById("main").innerHTML = html;
}

function doUpdate(title) {
  let text = textUpdate.value;
  console.log(text + " text");
  let encodedText = encodeURIComponent(text);

  var url =
    "cgi-bin/update.pl?owner=" +
    userKey +
    "&title=" +
    title +
    "&text=" +
    encodedText;
  var promise = fetch(url);
  promise
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      var html = new window.DOMParser().parseFromString(data, "text/html");
      console.log(html + "update");
      responseNew(html);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
