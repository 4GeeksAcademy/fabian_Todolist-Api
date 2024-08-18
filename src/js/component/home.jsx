import React, { useEffect, useState } from "react";

const Home = () => {
    const [tarea, setTarea] = useState("");
    const [tareas, setTareas] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const apiURL = 'https://playground.4geeks.com/todo';

   
    const createUser = () => {
        fetch(`${apiURL}/users/Fabian`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Error al crear usuario');
            return res.json();
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
        fetch(`${apiURL}/users/Fabian`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setTareas(data.todos); 
        })
        .catch(error => console.log(error));
        createUser();
    }, []);

   
    const agregarTarea = () => {
        if (tarea.trim()) {
            fetch(`${apiURL}/todos/Fabian`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: tarea,
                    is_done: false
                })
            })
            .then(res => res.json())
            .then(data => {
                setTareas([...tareas, data]); 
                setTarea("");
            })
            .catch(error => console.log(error));
        }
    };

    
    const eliminarTarea = (id) => {
        fetch(`${apiURL}/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.ok) {
                const nuevasTareas = tareas.filter(t => t.id !== id);
                setTareas(nuevasTareas);
            }
        })
        .catch(error => console.log(error));
    };

  
    const limpiarTareas = () => {
        fetch(`${apiURL}/users/Fabian`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.ok) {
                setTareas([]);
            }
        })
        .catch(error => console.log(error));
    };

    const handleKeyDown = (evento) => {
        if (evento.key === "Enter") {
            agregarTarea();
        }
    };

    return (
        <div className="list">
            <h1 className="title">ToDo List</h1>
            <div className="card">
                <input
                    className="input"
                    type="text"
                    value={tarea}
                    onChange={(evento) => setTarea(evento.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What needs to be done?"
                />

                <ul className="task-list">
                    {tareas.map((tarea, index) => (
                        <li
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="task-item"
                        >
                            {tarea.label}
                            {hoveredIndex === index && (
                                <button className="delete" onClick={() => eliminarTarea(tarea.id)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="footer">
                    <button className="clear-all" onClick={limpiarTareas}>Clear All Tasks</button>
                    <div>{tareas.length} {tareas.length === 1 ? "item" : "items"} left</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
