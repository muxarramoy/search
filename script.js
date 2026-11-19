const themeToggle = document.getElementById("theme-toggle");
const themeText = document.getElementById("theme-text");
const iconSun = document.getElementById("icon-sun");
const iconMoon = document.getElementById("icon-moon");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const errorMsg = document.getElementById("error-msg");

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    themeText.textContent = "DARK";
    iconSun.style.display = "none";
    iconMoon.style.display = "block";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeText.textContent = "LIGHT";
    iconSun.style.display = "block";
    iconMoon.style.display = "none";
  }
});

async function fetchUser(username) {
  try {
    const res = await fetch(`https://github.com{username}`);
    if (!res.ok) {
      errorMsg.style.display = "inline";
      return;
    }
    errorMsg.style.display = "none";
    const data = await res.json();
    renderUser(data);
  } catch (err) {
    console.error("Xatolik:", err);
  }
}

function renderUser(user) {
  if (user.login.toLowerCase() === "octocat") {
    document.getElementById("name").textContent = "The Octocat";
  } else {
    document.getElementById("name").textContent = user.name || user.login;
  }

  const usernameEl = document.getElementById("username");
  usernameEl.textContent = `@${user.login}`;
  usernameEl.href = user.html_url;

  const date = new Date(user.created_at);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  document.getElementById("joined-date").textContent =
    `Joined ${formattedDate}`;

  const bioEl = document.getElementById("bio");
  bioEl.textContent = user.bio || "This profile has no bio";
  bioEl.style.opacity = user.bio ? "1" : "0.75";

  document.getElementById("repos").textContent = user.public_repos;
  document.getElementById("followers").textContent = user.followers;
  document.getElementById("following").textContent = user.following;

  updateLink("location", "location-box", user.location);
  updateLink(
    "twitter",
    "twitter-box",
    user.twitter_username,
    `https://twitter.com{user.twitter_username}`,
  );
  updateLink("blog", "blog-box", user.blog, user.blog);
  updateLink("company", "company-box", user.company);
}

function updateLink(elId, boxId, value, url = null) {
  const el = document.getElementById(elId);
  const box = document.getElementById(boxId);

  if (value) {
    el.textContent = value;
    box.classList.remove("not-available");
    if (url && el.tagName === "A") {
      el.href = url.startsWith("http") ? url : `https://${url}`;
    }
  } else {
    el.textContent = "Not Available";
    box.classList.add("not-available");
    if (el.tagName === "A") {
      el.removeAttribute("href");
    }
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchUser(query);
  }
});
