import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { InputText } from '@buffetjs/core';
import { Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Flex, Text } from '@buffetjs/core';
import axios from 'axios';
function Limit(props) {
    const [limit, setLimit] = useState("");
    const [val, setValue] = useState(props.limit);

    useEffect(()=>{
        setValue(props.limit);
    })

    const handleUpdate = (event) =>{
        let body ={
            limit : limit
        }
        axios.post('https://script.ifindilu.de/update/limit', body)
        .then((response) =>{
            console.log("response -->", response.data);
        },
        (error) =>{
            console.log(error)
        })
    }
    return (
        <div
            style={{ whiteSpace: 'no-wrap' }}>
            <Text
                textTransform="capitalize"
                color="black"
                // lineHeight={6}
                fontWeight="bold"
                fontSize="sm"
                ellipsis
                style={{ display: 'inline-block' }}
            >
                Execution Queue Limit : {val}
            </Text>

            <div style={{float:'right', width:'400px'}}>
            <input
                // className={hello}
                name="input"
                onChange={({ target: { value } }) => {
                    if(value>50)
                    {value = 50;}
                    if(value<1)
                    {value = 1;}
                    setLimit(value);
                }}
                placeholder="Update Queue Limit"
                type="number"
                max={50}
                value={limit}
                style={{
                    display: 'inline-block',
                    width: '50%',
                    border:'1px solid black',
                    marginRight:"30px"
                }}
            />
            <Button
                color="success"
                icon={<FontAwesomeIcon icon={faPlus} />}
                label="Save"
                style={{
                    display: 'inline-block',
                }}
                onClick={handleUpdate}
            />
            </div>
        </div>
    );
};

export default Limit;