const clock = document.querySelector(".clock");
const secondArrow = document.querySelector(".arrow_second");
const minuteArrow = document.querySelector(".arrow_minute");
const hourArrow = document.querySelector(".arrow_hour");
const soundButton = document.querySelector(".sound-button");
const gearsAudio = document.querySelector("#gears-sound");

createIndicators();

soundButton.addEventListener("click", enableSound, { once: true });

let previousTimeParts = getTimeParts();

setAngleVariables(getAngles(previousTimeParts));

syncClock();

function syncClock() {
  requestAnimationFrame(() => {
    const timeParts = getTimeParts();
    const timePartsDiff = getTimePartsDiff(previousTimeParts, timeParts);

    if (timePartsDiff.every((x) => x === 0)) {
      syncClock();

      return;
    }

    previousTimeParts = timeParts;

    const anglesDiff = getAngles(timePartsDiff);
    const updatedAngles = getAngleVariables().map((x, i) => x + anglesDiff[i]);

    setAngleVariables(updatedAngles);

    syncClock();
  });
}

function getAngleVariables() {
  return [secondArrow, minuteArrow, hourArrow]
    .map((el) =>
      el.style.getPropertyValue("--start-angle").replaceAll("deg", "")
    )
    .map(Number);
}

function setAngleVariables([seconds, minutes, hours]) {
  secondArrow.style.setProperty("--start-angle", `${seconds}deg`);
  minuteArrow.style.setProperty("--start-angle", `${minutes}deg`);
  hourArrow.style.setProperty("--start-angle", `${hours}deg`);
}

function getTimePartsDiff(previous, current) {
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

function enableSound() {
  soundButton.remove();
  gearsAudio.play();
}

function createIndicators() {
  const step = 6;

  for (let i = 0; i < 360; i += step) {
    const point = document.createElement("div");
    point.classList.add("point");
    if (i % 30 !== 0) {
      point.classList.add("point_small");
    }

    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    indicator.style.setProperty("--point-angle", `${i}deg`);

    indicator.append(point);

    clock.append(indicator);
  }
}
