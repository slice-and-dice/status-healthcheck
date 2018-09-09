const fetch = require("node-fetch");
require("colors");

const frontEndUrls = {
  dev: "https://dev-register-a-food-business.azurewebsites.net",
  // test: "https://test-register-a-food-business.azurewebsites.net",
  // staging: "https://staging-register-a-food-business.azurewebsites.net",
  prod: "https://register.food.gov.uk"
};

const backEndUrls = {
  dev: "https://dev-register-a-food-business-service.azurewebsites.net",
  // test: "https://test-register-a-food-business-service.azurewebsites.net",
  // staging: "https://staging-register-a-food-business-service.azurewebsites.net",
  prod: "https://prod-register-a-food-business-service.azurewebsites.net"
};

const healthcheckPathFrontEnd = "/status/healthcheck";
const healthcheckPathBackEnd = "/api/status/healthcheck";

const statusPathFrontEnd = "/status/all";
const statusPathBackEnd = "/api/status/all";

const getHealthcheck = async () => {
  for (let environment in frontEndUrls) {
    const frontEndHealthcheck = await fetch(
      frontEndUrls[environment] + healthcheckPathFrontEnd
    );

    console.log(
      `FRONT END HEALTHCHECK REPORT: `.bgCyan.bold.white +
        `(${environment})`.bgMagenta.bold.white
    );

    if (frontEndHealthcheck.status === 200) {
      const frontEndHealthcheckText = await frontEndHealthcheck.text();
      console.log(frontEndHealthcheckText.green);
    } else {
      console.log(
        `FAILED. Front end in environment "${environment}" is DOWN. Responded with status: ${
          frontEndHealthcheck.status
        }`.red
      );
    }
    console.log(`
    `);
  }

  for (let environment in backEndUrls) {
    const backEndHealthcheck = await fetch(
      backEndUrls[environment] + healthcheckPathBackEnd
    );

    console.log(
      `BACK END HEALTHCHECK REPORT: `.bgCyan.bold.white +
        `(${environment})`.bgMagenta.bold.white
    );

    if (backEndHealthcheck.status === 200) {
      const backEndHealthcheckText = await backEndHealthcheck.text();
      console.log(backEndHealthcheckText.green);
    } else {
      console.log(
        `FAILED. Back end in environment "${environment}" is DOWN. Responded with status: ${
          backEndHealthcheck.status
        }`.red
      );
    }
    console.log(`
    `);
  }
};

const getStatus = async () => {
  for (let environment in frontEndUrls) {
    const frontEndStatus = await fetch(
      frontEndUrls[environment] + statusPathFrontEnd
    );

    console.log(
      `FRONT END STATUS REPORT: `.bgCyan.bold.white +
        `(${environment})`.bgMagenta.bold.white
    );

    if (frontEndStatus.status === 200) {
      const frontEndStatusJson = await frontEndStatus.json();
      for (let statusName in frontEndStatusJson) {
        if (frontEndStatusJson[statusName] === false) {
          // Indicates that a service failed the last time it was called
          console.log(
            statusName.bgRed.white +
              ": " +
              `${frontEndStatusJson[statusName]}`.bgRed.white
          );
        } else if (
          statusName.includes("Failed") &&
          Number.isInteger(frontEndStatusJson[statusName]) &&
          frontEndStatusJson[statusName] > 0
        ) {
          // Indicates that a service has failed at least once
          console.log(
            statusName.red + ": " + `${frontEndStatusJson[statusName]}`.red
          );
        } else {
          // Indicates that a service is currently working or worked the most recent time it was called.
          console.log(
            statusName.green + ": " + `${frontEndStatusJson[statusName]}`.green
          );
        }
      }
    } else {
      console.log(
        `FAILED. Front end in environment "${environment}" responded with status: ${
          frontEndStatus.status
        }`.red
      );
    }
    console.log(`
    `);
  }

  for (let environment in backEndUrls) {
    const backEndStatus = await fetch(
      backEndUrls[environment] + statusPathBackEnd
    );

    console.log(
      `BACK END STATUS REPORT: `.bgCyan.bold.white +
        `(${environment})`.bgMagenta.bold.white
    );

    if (backEndStatus.status === 200) {
      const backEndStatusJson = await backEndStatus.json();

      for (let statusName in backEndStatusJson) {
        if (backEndStatusJson[statusName] === false) {
          // Indicates that a service failed the last time it was called
          console.log(
            statusName.bgRed.white +
              ": " +
              `${backEndStatusJson[statusName]}`.bgRed.white
          );
        } else if (
          statusName.includes("Failed") &&
          Number.isInteger(backEndStatusJson[statusName]) &&
          backEndStatusJson[statusName] > 0
        ) {
          // Indicates that a service has failed at least once
          console.log(
            statusName.red + ": " + `${backEndStatusJson[statusName]}`.red
          );
        } else {
          // Indicates that a service is currently working or worked the most recent time it was called.
          console.log(
            statusName.green + ": " + `${backEndStatusJson[statusName]}`.green
          );
        }
      }
    } else {
      console.log(
        `FAILED. Back end in environment "${environment}" responded with status: ${
          backEndStatus.status
        }`.red
      );
    }
    console.log(`
    `);
  }
};

getHealthcheck();
getStatus();

setInterval(getHealthcheck, 2000);
setInterval(getStatus, 2000);
