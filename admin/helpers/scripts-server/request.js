const axios = require("axios");
const ENV = process.env;

const SCRIPTS_SERVER_URL =
  ENV.NODE_ENV === "development"
    ? (ENV.SCRIPTS_SERVER_URL || "").replace(
        /localhost/,
        "host.docker.internal"
      )
    : ENV.SCRIPTS_SERVER_URL;

const scriptsServerUrl = (path = "/") =>
  [
    (SCRIPTS_SERVER_URL || "").replace(/\/+$/, ""),
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

const get = async (path = "/") => {
  return axios.get(scriptsServerUrl(path)).then(
    ({ data }) => data.data,
    (error) => {
      throw error;
    }
  );
};

module.exports = {
  scriptsServerUrl,
  post,
  get,
};
