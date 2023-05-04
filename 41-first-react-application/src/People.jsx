import { useEffect, useState } from "react";

export default function People(){

    const [people, setPeople] = useState([
        {name: "John"},
        {name: "Jane"},
        {name: "Sudo"},
        {name: "Boy"}
    ]);

    const getPeople = async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const result = await response.json();
        setPeople(result);
    }

    useEffect(() => {
        getPeople()
    }, [])
    

    return <div>
        <h2>People</h2>
        <ul>
            {people.map((value, index) => {
                return <li key={index}>{value.name}</li>
            })}
        </ul>
        </div>
}