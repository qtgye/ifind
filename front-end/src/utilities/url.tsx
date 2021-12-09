import { ADMIN_API_ROOT } from "@config/adminApi";
import { useLocation } from "react-router-dom";

/**
 *
 * @param {String} relativeURL - the relative pathname
 * @returns {String}
 */
export const toAdminURL = (relativeURL = "") =>
  ADMIN_API_ROOT.split(/\//g).slice(0, 3).join("/") +
  relativeURL.replace(/^\/+/, "/");

export const addURLParams = (
  url = "",
  paramsObject: { [key: string]: any }
) => {
  const [baseURL, searchParams = ""] = url.split("?");
  const searchParamsObject = searchParams
    .split("&")
    .filter(Boolean)
    .reduce((all: { [key: string]: any }, keyValue) => {
      const [key, value] = keyValue.split("=");
      all[key] = value;
      return all;
    }, {});
  const newParams = {
    ...searchParamsObject,
    ...paramsObject,
  };
  const newParamsString = Object.entries(newParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return baseURL + "?" + newParamsString;
};

export const useSearchParams = (): { [key: string]: any } => {
  const { search } = useLocation();
  const paramsObject = search
    .substr(1)
    .split("&")
    .reduce((all: { [key: string]: string }, paramString: string) => {
      const [key, value] = paramString.split("=");

      if (key && value) {
        all[key] = value;
      }

      return all;
    }, {});

  return paramsObject;
};
