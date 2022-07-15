import axios from "axios";

declare interface ResponseData {
  [key: string]: any;
}

export const scriptsServerUrl = (path = "/") =>
  [
    (ENV.SCRIPTS_SERVER_URL || "").replace(/\/+$/, ""),
    path.replace(/^\/+/, ""),
  ].join("/");

export const post = async <CustomResponseData>(
  path: string = "/",
  data: { [key: string]: any }
): Promise<CustomResponseData extends ResponseData ? any : any> => {
  return axios.post(scriptsServerUrl(path), data).then(
    (response) => {
      console.log("response -->", response.data);
      return response.data;
    },
    (error) => {
      throw (error);
    }
  );
};
