var tabela = document.getElementById("tabela");
var txt = document.getElementById("inp");
var lat;
var long;

function ikonica_smjera_vjetra(d) {
  var r = d - 90;
  return (
    '<img src="https://www.svgrepo.com/show/292064/right-arrow.svg"' +
    ' style="transform:rotate(' +
    r +
    'deg); height: 50px;">'
  );
}

function ikonica_brzina_vjetra(d) {
  return `<div class="ikonica" style="width: ${
    10 * d
  }px; background-color: rgb(0, 0, ${
    25 * d
  }); border-radius: 2px; height: 15px;"></div>`;
}

function vratiSlikicu(id, izlazak, zalazak) {
  let danIliNoc;
  const sunriseTime = new Date(izlazak * 1000);
  const sunsetTime = new Date(zalazak * 1000);
  const currentTime = new Date();
  if (currentTime >= sunriseTime && currentTime <= sunsetTime) {
    danIliNoc = "d";
  } else {
    danIliNoc = "n";
  }
  if (id >= 200 && id <= 232) {
    return `<img src="https://openweathermap.org/img/wn/11${danIliNoc}@2x.png">`;
  } else if ((id >= 300 && id <= 321) || (id >= 520 && id <= 532)) {
    return `<img src="https://openweathermap.org/img/wn/09${danIliNoc}@2x.png">`;
  } else if (id >= 500 && id <= 504) {
    return `<img src="https://openweathermap.org/img/wn/10${danIliNoc}@2x.png">`;
  } else if (id == 511 || (id >= 600 && id <= 622)) {
    return `<img src="https://openweathermap.org/img/wn/13${danIliNoc}@2x.png">`;
  } else if (id >= 701 && id <= 781) {
    return `<img src="https://openweathermap.org/img/wn/50${danIliNoc}@2x.png">`;
  } else if (id == 800) {
    return `<img src="https://openweathermap.org/img/wn/01${danIliNoc}@2x.png">`;
  } else if (id == 801) {
    return `<img src="https://openweathermap.org/img/wn/02${danIliNoc}@2x.png">`;
  } else if (id == 802) {
    return `<img src="https://openweathermap.org/img/wn/03${danIliNoc}@2x.png">`;
  } else if (id >= 803 && id <= 804) {
    return `<img src="https://openweathermap.org/img/wn/04${danIliNoc}@2x.png">`;
  }
}

function funkcija() {
  let grad = txt.value;
  if (grad.trim() === "") {
    // Check if the input is empty or only contains whitespace
    document.getElementById("error-message").style.display = "block"; // Display the error message
  } else {
    document.getElementById("error-message").style.display = "none"; // Hide the error message
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${grad}&appid=1a6a9f72c364c7bca1736752e5598924`
    )
      .then((r) => {
        if (r.status !== 200) {
          if (r.status === 404) alert("Unijeli ste nepostojeće mjesto!");
          else alert("Server javlja grešku: " + r.status);
          return;
        }

        r.json().then((t) => {
          let temperatura = t.main.temp - 272.15;
          let subjektivniOsjecaj = t.main.feels_like - 272.15;
          let opis = t.weather[0].description;
          let pritisak = t.main.pressure;
          let vlaznost = t.main.humidity;
          let brzina = t.wind.speed;
          let smjer = t.wind.deg;
          let idVremena = t.weather[0].id;
          lat = t.coord.lat;
          long = t.coord.lon;

          document.getElementsByClassName(
            "stepeni"
          )[0].innerHTML = `${temperatura.toFixed()}°`;

          document.getElementsByClassName(
            "slikica"
          )[0].innerHTML = `${vratiSlikicu(
            idVremena,
            t.sys.sunrise,
            t.sys.sunset
          )}`;

          document.getElementsByClassName(
            "subjektivniOsjecaji"
          )[0].innerHTML = `Subjektivni osjećaj: ${subjektivniOsjecaj.toFixed()}°`;

          document.getElementsByClassName(
            "opisi"
          )[0].innerHTML = `Opis: ${opis}`;

          document.getElementsByClassName(
            "pritisci"
          )[0].innerHTML = `Pritisak: ${pritisak}mbar`;

          document.getElementsByClassName(
            "vlaznosti"
          )[0].innerHTML = `Vlažnost: ${vlaznost}%`;

          document.getElementsByClassName(
            "speedContainer"
          )[0].innerHTML = `Brzina vjetra: ${brzina} m/s`;

          document.getElementsByClassName(
            "brzine"
          )[0].innerHTML = `${ikonica_brzina_vjetra(brzina)}`;

          document.getElementsByClassName(
            "smjerUgao"
          )[0].innerHTML = `Smjer vjetra: ${smjer}°`;

          document.getElementsByClassName(
            "smjerovi"
          )[0].innerHTML = `<p class="sides" id="north">N</p> <p class="sides" id="south">S</p> <p class="sides" id="east">E</p> <p class="sides" id="west">W</p> ${ikonica_smjera_vjetra(
            smjer
          )}`;

          var sunriseTimestamp = t.sys.sunrise;
          var sunsetTimestamp = t.sys.sunset;

          var sunriseTime = new Date(sunriseTimestamp * 1000);
          var sunsetTime = new Date(sunsetTimestamp * 1000);

          document.getElementsByClassName(
            "zalazakSunca"
          )[0].innerHTML = `Zalazak sunca: ${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`;

          document.getElementsByClassName(
            "izlazakSunca"
          )[0].innerHTML = `Izlazak sunca: ${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`;

          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=current,hourly,minutely,alerts&units=metric&appid=917b026a997320574cd4315b9bf4c73a`
          )
            .then((r) => {
              if (r.status !== 200) {
                alert("Server returned an error: " + r.status);
                return;
              }

              r.json().then((data) => {
                const nizPodataka = data.daily;

                tabela.innerHTML = "";

                nizPodataka.forEach((dailyData) => {
                  const datum = new Date(dailyData.dt * 1000);
                  const slikica = dailyData.weather[0].icon;
                  const temperaturaMax = dailyData.temp.max;
                  const temperaturaMin = dailyData.temp.min;

                  tabela.innerHTML += `
                    <tr>
                      <td>${datum.toDateString()}</td>
                      <td><img src="https://openweathermap.org/img/w/${slikica}.png" alt="Weather Icon"></td>
                      <td>${temperaturaMin.toFixed()} / ${temperaturaMax.toFixed()} °C</td>
                    </tr>`;
                });
              });
            })
            .catch((err) => {
              alert("Greška u komunikaciji sa serverom: " + err);
            });
        });
      })
      .catch((err) => {
        alert("Greška u komunikaciji sa serverom: " + err);
      });
  }
}

funkcija();

//https://api.openweathermap.org/data/2.5/onecall?lat=43.34337&lon=43.3433&exclude=current,hourly,minutely,alerts&units=metric&appid=917b026a997320574cd4315b9bf4c73a
