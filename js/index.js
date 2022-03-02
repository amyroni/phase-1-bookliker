const currentUsername = "Amy";

document.addEventListener("DOMContentLoaded", function() {
  loadBooks();
});

function loadBooks() {
  fetch("http://localhost:3000/books")
  .then(response => response.json())
  .then(books => books.forEach(book => displayBook(book)));
}

function displayBook(book) {
  const li = document.createElement("li");
  li.textContent = book.title;
  li.style.cursor = "pointer";
  li.addEventListener("click", () => {
    // remove existing book details, if any
    if (document.querySelector("div#container")) {
      document.querySelector("div#container").remove();
    }
    // create new book detail elements
    const container = document.createElement("div");
    container.id = "container";
    const title = document.createElement("h4");
    title.textContent = book.title;
    const thumbnail = document.createElement("img");
    thumbnail.src = book.img_url;
    const description = document.createElement("p");
    description.textContent = book.description;
    const list = document.createElement("ul");
    list.id = "show-list";
    book.users.forEach(user => {
      const userName = document.createElement("li");
      userName.textContent = user.username;
      list.append(userName);
    })
    const btn = document.createElement("button");
    btn.textContent = "Like";
    // add like functionality
    btn.addEventListener("click", () => {
      // add new user to users list
      let userObj = {};
      fetch(`http://localhost:3000/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({username: currentUsername})
      })
      .then(response => response.json())
      .then(user => {
        console.log(user);
        userObj = {
          id: user.id,
          username: user.username
        }
        const newUsers = [...book.users, userObj ]
        // add new user to list of users who like the book
        fetch(`http://localhost:3000/books/${book.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ users: newUsers })
        })
        .then(response => response.json())
        .then(book => {
          const oldlist = document.querySelector("ul#show-list")
          oldlist.querySelectorAll("li").forEach(li => li.remove());
          book.users.forEach(user => {
            const userName = document.createElement("li");
            userName.textContent = user.username;
            oldlist.append(userName);
          })
        })
      })
    })
    // append book items
    container.append(title, thumbnail, description, list, btn)
    document.querySelector("div#show-panel").append(container)
  })
  document.querySelector("ul#list").append(li);
}
