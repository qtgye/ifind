import React, { useEffect, useState } from "react";
import { Button } from "@buffetjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@buffetjs/core";

import {post} from '../../helpers/scripts-server/request';

function Limit(props) {
  const [parallel, setParallalValue] = useState("");
  const [val, setValue] = useState(props.parallel);

  useEffect(() => {
    setValue(props.parallel);
  });

  const handleUpdate = (event) => {
    let body = {
      parallel: parallel,
    };
    post("/update/parallel", body).then(
      (data) => {
        console.log("response data -->", data);
      },
    ).catch((error) => {
      console.log(error);
    });
  };
  return (
    <div style={{ whiteSpace: "no-wrap" }}>
      <Text
        textTransform="capitalize"
        color="black"
        // lineHeight={6}
        fontWeight="bold"
        fontSize="sm"
        ellipsis
        style={{ display: "inline-block" }}
      >
        Parallel Run Value : {val}
      </Text>

      <div style={{ float: "right", width: "400px" }}>
        <input
          // className={hello}
          name="input"
          onChange={({ target: { value } }) => {
            if (value > 4) {
              value = 4;
            }
            if (value < 1) {
              value = 1;
            }
            setParallalValue(value);
          }}
          placeholder="Update Parallel Run"
          type="number"
          max={50}
          value={parallel}
          style={{
            display: "inline-block",
            width: "50%",
            border: "1px solid black",
            marginRight: "30px",
          }}
        />
        <Button
          color="success"
          icon={<FontAwesomeIcon icon={faPlus} />}
          label="Save"
          style={{
            display: "inline-block",
          }}
          onClick={handleUpdate}
        />
      </div>
    </div>
  );
}

export default Limit;
