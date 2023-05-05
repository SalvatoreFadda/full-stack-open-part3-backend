import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personsService from './services/persons';
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  const setNotificationMessage = function (message, type) {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      if (Array.isArray(initialPersons)) {
        setPersons(initialPersons)
      } else {
        console.error('API response is not an array:', initialPersons)
        setPersons([])
      }
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  //creation and update of person here
  const handleSubmit = (event) => {
    event.preventDefault()
  
    const existingPerson = persons.find((person) => person.name === newName);
  
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Replace the old number with a new one?`
        )
      ) {
        //update person
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName("")
            setNewNumber("")
            setNotificationMessage(`Updated "${existingPerson.name}" number`, 'success')
          })
          .catch((error) => {
            console.error("Error updating person:", error)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
  
      //create person
      personsService
        .create(newPerson)
        .then((data) => {
          setPersons(persons.concat(data));
          setNewName("")
          setNewNumber("")
          setNotificationMessage(`Added "${data.name}"`, 'success')
        })
        .catch((error) => {
          console.error("Error creating person:", error)
        })
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      personsService
        .delete_person(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setNotificationMessage(`Information of this person has already been removed from server`, 'error')
        })
    }
  }

  const filterPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      {notification && (
        <Notification message={notification.message} type={notification.type}/>
      )}

      <Filter value={search} onChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={handleSubmit}
        name={newName}
        onNameChange={handleNameChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons persons={filterPersons} onDelete={handleDelete} />
    </div>
  )
}

export default App