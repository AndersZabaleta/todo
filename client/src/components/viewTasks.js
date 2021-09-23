import { useState, useEffect } from "react";
import moment from "moment";

export const ViewTasks = ({ newTaskAdded }) => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (newTaskAdded) {
            setTasks([...tasks, newTaskAdded]);
        }
    }, [newTaskAdded]);

    useEffect(() => {
        setIsLoading(true);
        fetch("/todolist")
            .then((res) => res.json())
            .then((res) => {
                setTasks(res.results);
                setIsLoading(false);
            });
    }, []);

    const completeTask = (id, done) => {
        fetch("/completeTask", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, done: !done }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.error === false && res.results.modifiedCount === 1) {
                    const array = tasks.slice();
                    for (let i = 0; i < array.length; i++) {
                        if (array[i]._id === id) {
                            array[i].done = !done;
                        }
                    }
                    setTasks(array);
                }
            });
    };

    const deleteTask = (id) => {
        console.log(id);

        fetch("/deleteTask", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.error && res.results.deletedCount === 1) {
                    const array = tasks.filter((task) => task._id !== id);
                    console.log(array);
                    setTasks(array);
                }
            });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Starting Date</th>
                        <th>Finnishing Date</th>
                        <th>Remaining time</th>
                        <th>Done</th>
                        <th>Mark</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {
                        return (
                            <tr key={task._id}>
                                <td>{task.taskName}</td>
                                <td>{task.startingDate}</td>
                                <td>{task.finnishingDate}</td>
                                <td>{moment().to(task.finnishingDate)}</td>
                                <td>{task.done ? "✔️" : "❌"}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            completeTask(task._id, task.done)
                                        }>
                                        {task.done ? "Uncomplete" : "Complete"}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => deleteTask(task._id)}>
                                        Delete Task
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
