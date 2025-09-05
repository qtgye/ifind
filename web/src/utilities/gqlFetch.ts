import fetch from "cross-fetch";

// Disables SSL check in server
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

const gqlFetch: gqlFetchType = async (query, variables = {}) => {
  return fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_ROOT}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  })
    .then(async (res) => {
      if (res.status >= 400) {
        console.error(await res.json());
        throw `${res.status} ${res.statusText}`;
      }

      return res.json();
    })
    .then(({ data, errors }) => {
      if (errors) {
        console.error(errors[0]);
        throw new Error(errors[0]);
      }

      return data;
    })
    .catch((err) => {
      throw err;
    });
};

export default gqlFetch;
