import { useState } from "react"
import Clicker from "./Clicker"
import People from "./People";

export default function App({clickersCount})
{

    const [ hasClicker, setHasClicker ] = useState(true);
    const [ count, setCount ] = useState(0);

    console.log(clickersCount)
    const toggleClicker = () => {
        setHasClicker(!hasClicker);
    }

    const incrementCount = () => {
        setCount(count + 1);
    }

    const result = [...Array(clickersCount)].map((value, index) => {
        return <Clicker incrementCount={incrementCount} 
        key={index}
        keyName={index} 
        textColor= {index % 2 == 0 ? "red" : "green"} /> 
    })

    return <>
                <h1>
                    My Application
                </h1>
                <People />
                <div> Total Count: {count}</div>
                <button onClick = {toggleClicker}>{hasClicker ? "Hide Clicker" : "Show Clicker"}</button>
                {hasClicker ? <>
                    {result}
                    </> : null }
            </>
}