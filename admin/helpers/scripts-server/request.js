const axios = require('axios');

const scriptsServerUrl = (path = "/") =>
  [
    (ENV.SCRIPTS_SERVER_URL || "").replace(/\/+$/, ""),
    path.replace(/^\/+/, ""),
  ].join("/");

const post = async (path = "/", data = {}) => {
  return axios.post(scriptsServerUrl(path), data).then(
    (response) => {
      console.log("response -->", response.data);
      return response.data;
    },
    (error) => {
      throw error;
    }
  );
};

module.exports = {
  scriptsServerUrl,
  post,
};
