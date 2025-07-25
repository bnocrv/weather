const apiKey = "d7954026fb77029c116b1ee21570b303";

const themeToggleBtn = document.getElementById("theme-toggle");
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const cityNameElem = document.getElementById("city-name");
const tempElem = document.getElementById("temperature");
const descElem = document.getElementById("description");
const errorElem = document.getElementById("error-message");

// Inicializa tema salvo no localStorage ou padrão
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggleBtn.textContent = savedTheme === "dark" ? "🌙" : "🌞";

// Alternar tema ao clicar
themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggleBtn.textContent = newTheme === "dark" ? "🌙" : "🌞";
});

// Mostrar erro
function showError(message) {
  errorElem.textContent = message;
  errorElem.hidden = false;
  weatherResult.hidden = true;
}

// Mostrar resultado
function showWeather(city, temp, desc) {
  cityNameElem.textContent = city;
  tempElem.textContent = `${temp.toFixed(1)} °C`;
  descElem.textContent = desc;
  weatherResult.hidden = false;
  errorElem.hidden = true;
}

// Buscar clima via API
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        showError("Cidade não encontrada.");
      } else {
        showError("Erro ao buscar o clima.");
      }
      return;
    }
    const data = await response.json();
    const cityName = `${data.name}, ${data.sys.country}`;
    const temp = data.main.temp;
    const description = data.weather[0].description;

    showWeather(cityName, temp, description);
  } catch (error) {
    console.error("Erro ao buscar o clima:", error);
    showError("Erro ao buscar o clima.");
  }
}

// Evento submit do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});
