const root = document.getElementById("root");

function createButton(text) {
  const button = document.createElement("button");
  button.classList.add(`${text}-btn`);
  button.id = text;
  button.textContent = text.toUpperCase();
  return button;
}

function showNavigation() {
  const navigation = document.createElement("nav");

  const charactersBtn = createButton("people");
  const planetsBtn = createButton("planets");
  const starshipsBtn = createButton("starships");

  navigation.appendChild(charactersBtn);
  navigation.appendChild(planetsBtn);
  navigation.appendChild(starshipsBtn);

  root.appendChild(navigation);
}

function showList() {
  const parent = document.createElement("div");

  const list = document.createElement("div");
  list.classList.add("items-list");

  const loadMore = createButton("load");
  loadMore.classList.add("load-btn");

  parent.appendChild(list);
  parent.appendChild(loadMore);
  root.appendChild(parent);
}

function clearContent() {
  const list = document.querySelector(".items-list");
  list.innerHTML = "";
}

function showItems(data, type) {
  const parent = document.querySelector(".items-list");

  data.forEach((item) => {
    const element = document.createElement("p");
    element.textContent = item.name;
    element.addEventListener("click", () => showPopup(item, type));
    parent.appendChild(element);
  });
}

function createDetailElement(label, value) {
  const detailElement = document.createElement("h5");
  detailElement.textContent = `${label}: ${value}`;
  return detailElement;
}

function getDetails(data, type) {
  if (type === "people") {
    return [
      { label: "Gender", value: data.gender },
      { label: "Height", value: data.height },
      { label: "Mass", value: data.mass },
      { label: "Birth Year", value: data.birth_year },
      { label: "Skin Color", value: data.skin_color },
      { label: "Hair Color", value: data.hair_color },
    ];
  } else if (type === "planets") {
    return [
      { label: "Population", value: data.population },
      { label: "Diameter", value: data.diameter },
      { label: "Rotation Period", value: data.rotation_period },
      { label: "Climate", value: data.climate },
      { label: "Terrain", value: data.terrain },
      { label: "Gravity", value: data.gravity },
      { label: "Surface Water", value: data.surface_water },
    ];
  } else if (type === "starships") {
    return [
      { label: "Model", value: data.model },
      { label: "Manufacturer", value: data.manufacturer },
      { label: "Passengers", value: data.passengers },
      { label: "Credits", value: data.cost_in_credits },
      { label: "Length", value: data.length },
      { label: "Starship Class", value: data.starship_class },
      { label: "Max Speed", value: data.max_atmosphering_speed },
    ];
  }
  return [];
}

function createDetailElement(label, value) {
  const detailContainer = document.createElement("div");
  detailContainer.classList.add("descript-item");

  const labelElement = document.createElement("h5");
  labelElement.textContent = `${label}:`;

  const valueElement = document.createElement("h4");
  valueElement.textContent = value;

  detailContainer.appendChild(labelElement);
  detailContainer.appendChild(valueElement);

  return detailContainer;
}

//   fetch(item.url)
//     .then((response) => response.json())
//     .then((data) => {
//       });
//     });
// }

async function showPopup(item, type) {
  const overlay = document.querySelector(".overlay");
  const blur = document.querySelector(".blur");
  const popup = document.querySelector(".popup");

  overlay.classList.add("active");
  blur.classList.add("active");
  popup.classList.add("active");

  popup.innerHTML = `<h2>${item.name}</h2>`;

  const response = await fetch(item.url);
  const data = await response.json();
  console.log(data);
  const details = getDetails(data, type);

  details.forEach(({ label, value }) => {
    const detailElement = createDetailElement(label, value);
    popup.appendChild(detailElement);
  });
}

function generateOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const blur = document.createElement("div");
  blur.classList.add("blur");

  const popup = document.createElement("div");
  popup.classList.add("popup");

  root.appendChild(blur);
  root.appendChild(overlay);
  root.appendChild(popup);

  overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
    blur.classList.remove("active");
    popup.classList.remove("active");
  });
}

//     fetch(itemUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         itemUrl = data.next;
//       });
//   };
// }

function showLoader() {
  const loader = document.createElement("div");
  loader.classList.add("loader");
  loader.classList.add("disable");
  root.appendChild(loader);
}

function createResponseApi(type) {
  let itemUrl = `https://swapi.dev/api/${type}`;

  return async function () {
    const loadBtn = document.querySelector(".load-btn");
    const loader = document.querySelector(".loader");
    const list = document.querySelector(".items-list");

    loader.classList.remove("disable");
    if (list.children.length > 0) {
      loader.classList.add("move");
    }
    loadBtn.classList.remove("show");

    const response = await fetch(itemUrl);
    const data = await response.json();
    itemUrl = data.next;

    if (data.next) {
      loadBtn.classList.add("show");
    } else {
      loadBtn.classList.remove("show");
    }

    showItems(data.results, type);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

    loader.classList.add("disable");
    loader.classList.remove("move");
  };
}

function showBg() {
  const bg = document.createElement("div");
  bg.classList.add("bg");
  root.appendChild(bg);
}

function showFooter() {
  const footer = document.createElement("footer");
  const shape = document.createElement("div");
  shape.classList.add("shape");
  footer.appendChild(shape);
  root.appendChild(footer);
}

document.addEventListener("DOMContentLoaded", () => {
  let currentResponseApi;

  showLoader();

  showNavigation();
  showBg();
  showList();
  showFooter();
  generateOverlay();

  document.addEventListener("click", (event) => {
    const selectedButton = document.querySelector(".selected");

    if (
      event.target.tagName === "DIV" &&
      event.target.parentElement.tagName === "FOOTER"
    ) {
      document.location.reload();
    }

    if (
      event.target.tagName === "BUTTON" &&
      event.target.parentElement.tagName === "NAV"
    ) {
      if (selectedButton) {
        selectedButton.classList.remove("selected");
      }
      event.target.classList.add("selected");
      currentResponseApi = createResponseApi(event.target.id);
      clearContent();
      currentResponseApi();

      const bg = document.querySelector(".bg");
      if (bg) {
        bg.classList.add("disable");
      }
    } else if (event.target.classList.contains("load-btn")) {
      if (currentResponseApi) {
        currentResponseApi();
      }
    }
  });
});
