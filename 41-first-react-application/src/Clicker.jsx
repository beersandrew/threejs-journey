import { useEffect, useRef, useState } from "react";

export default function Clicker({keyName, textColor, incrementCount})
{
    const [count, setCount] = useState(parseInt(localStorage.getItem("count" + keyName) ?? 0));

    const buttonRef = useRef();
    useEffect(() => {
        buttonRef.current.style.backgroundColor = 'papayawhip';
        buttonRef.current.style.color = 'salmon';
        return () => {
            localStorage.removeItem("count" + keyName);
        }
    }, []);

    useEffect(() =>{
        localStorage.setItem("count" + keyName, count);
    }, [count]);

    const buttonClick = () => {
        setCount(count + 1);
        incrementCount()
    };



    return <div>
                <div style={{color: textColor}}>Click count: {count}</div>
                <button ref={buttonRef} onClick={buttonClick}>Click me</button>
            </div>
}