// Add / Update
const submitBtn = document.querySelector("form button");
// Input fields
const siteName = document.getElementById("siteName");
const siteURL = document.getElementById("siteUrl");
// Table content
const tableBody = document.querySelector("tbody");

const modal = document.querySelector(".custom-modal");
const overlay = document.querySelector(".overlay");
const rules = document.querySelector(".custom-modal__rules");

// Events
submitBtn.addEventListener("click", handleSubmit);
siteName.addEventListener("input", validateSiteName);
siteURL.addEventListener("input", validateSiteURL);
document.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    hideModal();
  }
});
document.addEventListener("click", (e) => {
  if (e.target === overlay || e.target.className.includes("custom-modal__close-btn")) {
    hideModal();
  }
});

// Validate URL
const UrlRegex = /^(https?:\/\/|[^w{3}\.]|w{3}\.)\w{3,}(\.\w{2,})+$/g;
const SiteNameRegex = /^([A-z]|[0-9]){3,}$/g;

let bookmarks = [];
let updatedId = null;

// Get data from local storage
(function () {
  const data = localStorage.getItem("bookmarks");

  if (data) {
    bookmarks = JSON.parse(data);
    displayData();
  }
})();

// Handle Add / Update
function handleSubmit(e) {
  e.preventDefault();

  if (!isValid()) {
    modal.classList.remove("custom-modal--hidden");
    overlay.classList.remove("overlay--hidden");
    return;
  }

  siteName.classList.remove('form__input--error')
  siteName.classList.remove('form__input--success')
  siteURL.classList.remove('form__input--success')
  siteURL.classList.remove('form__input--error')

  let protocolRegex = /^https?:\/\//g;

  const newSite = {
    name: siteName.value,
    url: protocolRegex.test(siteURL.value)
      ? siteURL.value
      : `http://${siteURL.value}`,
  };

  if (updatedId) {
    bookmarks = bookmarks.map((site) => {
      if (site.id === updatedId) {
        return { id: updatedId, ...newSite };
      }
      return site;
    });
    updatedId = null;
    submitBtn.innerHTML = "submit";
  } else {
    bookmarks.push({ id: Date.now(), ...newSite });
  }

  displayData();
  clearInputs();
  setLocalStorage();
}

function displayData() {
  let tableRow = "";

  bookmarks.forEach((site, index) => {
    tableRow += `
          <tr>
            <td>${index + 1}</td>
            <td>${site.name}</td>
            <td>
                <a href=${site.url} target=_blank class="btn btn-warning text-capitalize fw-bold">
                    visit
                </a>
            </td>
            <td>
                <button class="btn btn-info text-capitalize fw-bold" onclick="handleUpdate(${site.id
      })">Update</button>
            </td>
            <td>
                <button class="btn btn-danger text-capitalize fw-bold" onclick="handleDelete(${site.id
      })">Delete</button>
            </td>
          </tr>
        `;
  });

  tableBody.innerHTML = tableRow;
}

function handleDelete(id) {
  if (updatedId === id) {
    updatedId = null;
    clearInputs();
    submitBtn.innerHTML = "submit";
  }
  bookmarks = bookmarks.filter((site) => site.id !== id);
  setLocalStorage();
  displayData();
}

function handleUpdate(id) {
  siteName.focus();

  scroll({
    top: 0,
    behavior: "smooth",
  });

  updatedId = id;

  let site = bookmarks.find((site) => site.id === id);

  siteName.value = site.name;
  siteName.classList.remove("form__input--error");
  siteName.classList.remove("form__input--success");
  siteURL.value = site.url;
  siteURL.classList.remove("form__input--error");
  siteURL.classList.remove("form__input--success");
  submitBtn.innerHTML = "update";
}

function setLocalStorage() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function hideModal() {
  modal.classList.add("custom-modal--hidden");
  overlay.classList.add("overlay--hidden");
  rules.innerHTML = "";
}

// Validate on submit
function isValid() {
  let flag = true;

  if (!siteName.value.match(SiteNameRegex)) {
    let siteNameRule = document.createElement("li");
    siteName.classList.add("form__input--error");
    siteName.classList.remove("form__input--success");
    siteNameRule.innerHTML = "<i class='fa-solid fa-arrow-right custom-modal__rules__icon'></i>Site name must contain at least 3 characters";
    rules.appendChild(siteNameRule);
    flag = false;
  }

  if (!siteURL.value.match(UrlRegex)) {
    let siteUrlRule = document.createElement("li");
    siteURL.classList.add("form__input--error");
    siteURL.classList.remove("form__input--success");
    siteUrlRule.innerHTML = "<i class='fa-solid fa-arrow-right custom-modal__rules__icon'></i>Site URL not valid";
    rules.appendChild(siteUrlRule);
    flag = false;
  }
  return flag;
}

// Validate on input
function validateSiteName(e) {
  if (e.target.value.match(SiteNameRegex)) {
    e.target.classList.remove("form__input--error");
    e.target.classList.add("form__input--success");
  } else {
    e.target.classList.add("form__input--error");
    e.target.classList.remove("form__input--success");
  }
}

function validateSiteURL(e) {
  if (e.target.value.match(UrlRegex)) {
    siteURL.classList.remove("form__input--error");
    siteURL.classList.add("form__input--success");
  } else {
    siteURL.classList.add("form__input--error");
    siteURL.classList.remove("form__input--success");
  }
}

function clearInputs() {
  siteName.value = "";
  siteURL.value = "";
}
