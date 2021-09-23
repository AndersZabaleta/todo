import { useState } from "react";
import { ViewTasks } from "./viewTasks";

export const NewItem = () => {
    const [startingDate, setStartingDate] = useState(null);
    const [finnishingDate, setFinnishingDate] = useState(null);
    const [taskName, setTaskName] = useState(null);
    const [newTaskAdded, setNewTaskAdded] = useState(null);
    const [reload, setReload] = useState(false);

    const addNewTask = () => {
        fetch("/newItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                startingDate,
                finnishingDate,
                taskName,
                done: false,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res.results);
                if (!res.error) {
                    setNewTaskAdded({
                        _id: res.results.insertedId,
                        startingDate,
                        finnishingDate,
                        taskName,
                        done: false,
                    });
                    /*  setReload(!reload); */
                }
            });
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <input
                    type='text'
                    placeholder='Task Name'
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <span>Starting date: </span>
                <input
                    type='date'
                    placeholder='Starting Date'
                    onChange={(e) => setStartingDate(e.target.value)}
                />
                <span>Finishing date: </span>
                <input
                    type='date'
                    placeholder='Finnishing Date'
                    onChange={(e) => setFinnishingDate(e.target.value)}
                />

                <button onClick={addNewTask}>Add</button>
            </div>
            <ViewTasks reload={reload} newTaskAdded={newTaskAdded} />
        </div>
    );
};
