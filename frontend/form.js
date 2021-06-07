const serverUrl = "https://fifty-fifty-links.herokuapp.com";

document.addEventListener("DOMContentLoaded", () => {
  // set html references
  const buttonNewLink = document.getElementById("button-new-link"),
    buttonAddUrl = document.getElementById("button-add-url"),
    inputName = document.getElementById("input-name"),
    inputUrl = document.getElementById("input-url"),
    pMessage = document.getElementById("create-message"),
    listUrls = document.getElementById("list-urls"),
    listLinks = document.getElementById("list-links");

  // create new link
  buttonNewLink.addEventListener("click", () => {
    // collect data
    let name = inputName.value,
      urls = [];

    for (let li of document.getElementsByName("new-url"))
      urls.push(li.innerText);

    // send
    let xhr = new XMLHttpRequest();
    xhr.open("POST", serverUrl + "/new", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", () => {
      if (xhr.status === 201)
        pMessage.innerHTML =
          'Link successfully created. Access it with: <a href="' +
          serverUrl +
          "/link/" +
          name +
          '">' +
          serverUrl +
          "/link/" +
          name +
          "</a>";
      else pMessage.innerHTML = xhr.responseText;
    });
    xhr.send(
      JSON.stringify({
        name: name,
        urls: urls,
      })
    );
  });

  buttonAddUrl.addEventListener("click", () => {
    let li = document.createElement("li"),
      url = inputUrl.value;

    li.innerHTML = url;
    li.setAttribute("name", "new-url");
    li.setAttribute("class", "list-group-item");
    inputUrl.value = "";

    listUrls.appendChild(li);
  });

  let xhr = new XMLHttpRequest();
  xhr.open("GET", serverUrl + "/all", true);
  xhr.addEventListener("load", () => {
    if (xhr.status === 200)
      for (let link of JSON.parse(xhr.responseText)) {
        let li = document.createElement("li"),
          a = document.createElement("a");
        a.setAttribute("href", serverUrl + "/link/" + link.name);
        a.innerHTML = link.name;
        li.appendChild(a);
        li.setAttribute("class", "list-group-item");
        listLinks.appendChild(li);
      }
    else pMessage.innerHTML = xhr.responseText;
  });
  xhr.send();
});
