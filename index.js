const clock = document.querySelector(".clock");
const secondArrow = document.querySelector(".arrow_second");
const minuteArrow = document.querySelector(".arrow_minute");
const hourArrow = document.querySelector(".arrow_hour");

const tick = new Audio("tick.mp3");

for (let i = 0; i < 360; i += 6) {
  const indicator = document.createElement("div");
  indicator.classList.add("indicator");
  indicator.style.setProperty("--point-angle", `${i}deg`);

  const point = document.createElement("div");
  point.classList.add("point");

  if (i % 30 !== 0) {
    point.classList.add("point_small");
  }

  indicator.appendChild(point);

  clock.append(indicator);
}

setAngleVariables(getAngles(getTimeParts()));

let previousTimeParts = getTimeParts();

function syncClock() {
  requestAnimationFrame(() => {
    const timeParts = getTimeParts();
    const timePartsDiff = getTimePartsDiff(previousTimeParts);

    if (timePartsDiff.every((x) => x === 0)) {
      syncClock();
      return;
    }

    tick.play();

    previousTimeParts = timeParts;

    const newAngles = getUpdatedAngles(timePartsDiff);
    setAngleVariables(newAngles);

    syncClock();
  });
}

syncClock();

function getUpdatedAngles(timePartsDiff) {
  const anglesDiff = getAngles(timePartsDiff);
  const styleAngles = getAngleVariables();

  return styleAngles.map((x, i) => x + anglesDiff[i]);
}

function getAngleVariables() {
  return [
    secondArrow.style.getPropertyValue("--start-angle"),
    minuteArrow.style.getPropertyValue("--start-angle"),
    hourArrow.style.getPropertyValue("--start-angle"),
  ].map((x) => Number(x.replaceAll("deg", "")));
}

function setAngleVariables([seconds, minutes, hours]) {
  secondArrow.style.setProperty("--start-angle", `${seconds}deg`);
  minuteArrow.style.setProperty("--start-angle", `${minutes}deg`);
  hourArrow.style.setProperty("--start-angle", `${hours}deg`);
}

function getTimePartsDiff(previous) {
  const current = getTimeParts();

  let secondsDiff = Math.abs(current[0] - previous[0]);
  secondsDiff = secondsDiff >= 59 ? 1 : secondsDiff;

  let minutesDiff = Math.abs(current[1] - previous[1]);
  minutesDiff = minutesDiff >= 59 ? 1 : minutesDiff;

  let hoursDiff = Math.abs(current[2] - previous[2]);
  hoursDiff = hoursDiff >= 11 ? 1 : hoursDiff;

  return [secondsDiff, minutesDiff, hoursDiff];
}

function getTimeParts() {
  const date = new Date();
  return [date.getSeconds(), date.getMinutes(), date.getHours()];
}

function getAngles(timeParts) {
  const secondsAngle = (timeParts[0] / 60) * 360;
  const minutesAngle = (timeParts[1] / 60) * 360;
  const hourAngle = (timeParts[2] / 12) * 360;

  return [secondsAngle, minutesAngle, hourAngle];
}
