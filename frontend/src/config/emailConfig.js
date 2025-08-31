const emailConfig = {
  username: process.env.REACT_APP_EWS_USERNAME,
  password: process.env.REACT_APP_EWS_PASSWORD,
  ewsUrl: process.env.REACT_APP_EWS_URL,
  defaultFrom: process.env.REACT_APP_EMAIL_FROM,
  defaultTo: process.env.REACT_APP_EMAIL_TO
};

export default emailConfig; 