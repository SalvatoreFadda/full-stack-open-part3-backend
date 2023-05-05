import React from 'react'
import Person from "./Person";

const Persons = ({ persons, onDelete }) => (
  <ul>
    {persons.map((person, index) => (
      <Person key={index} person={person} onDelete={onDelete} />
    ))}
  </ul>
)

export default Persons