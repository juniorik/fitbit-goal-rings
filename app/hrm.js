import { me } from "appbit";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { BodyPresenceSensor } from "body-presence";

let hrm, checkInterval, bps;

let heartText = document.getElementById("hrm-data");

export function initialize() {
  if (me.permissions.granted("access_heart_rate")) {
    hrm = new HeartRateSensor();
    bps = new BodyPresenceSensor();
    heartRateSetup();
    startReading();
  } else {
    console.log("Heart Rate Permission was denied.");
    heartText.text = "N/A";
  }
}

function getReading() {
  const value = 0;
  if (bps.present) {
     value = hrm.heartRate ? hrm.heartRate : 0;
  }
  heartText.text = value;
}

function heartRateSetup() {
  display.addEventListener("change", function() {
    if (display.on) {
      startReading();
    } else {
      stopReading();
    }
  });
}

function startReading() {
  if (!checkInterval) {
    hrm.start();
    bps.start();
    getReading();
    checkInterval = setInterval(getReading, 1000);
  }
}

function stopReading() {
  hrm.stop();
  bps.stop();
  clearInterval(checkInterval);
  checkInterval = null;
}
