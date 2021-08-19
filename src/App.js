import "./App.css";
import { useState, useEffect } from "react";
import firestore from "./firestore";

const db = firestore.firestore();

const addUser = (name) =>
  name.length > 3
    ? db.collection("argonautes").add({
        name: name,
      })
    : console.log("minimum 3 caractères");

function App() {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const listArgonautes = data.map((argonaute, key) => (
    <div className="col-4" key={key}>
      <p className="text-center">{argonaute.name}</p>
    </div>
  ));

  useEffect(() => {
    const collecRef = db.collection("argonautes");
    collecRef
      .orderBy("name")
      .get()
      .then((response) => {
        const fetchedArgonautes = [];
        response.docs.forEach((document) => {
          const fetchedArgonaute = {
            ...document.data(),
          };
          fetchedArgonautes.push(fetchedArgonaute);
        });
        setData(fetchedArgonautes);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [name]);

  return (
    <div>
      <header>
        <h1>
          <img
            src="https://www.wildcodeschool.com/assets/logo_main-e4f3f744c8e717f1b7df3858dce55a86c63d4766d5d9a7f454250145f097c2fe.png"
            alt="Wild Code School logo"
          />
          Les Argonautes
        </h1>
      </header>

      <main className="container">
        <h2>Ajouter un(e) Argonaute</h2>
        <div className="new-member-form">
          <label>Nom de l&apos;Argonaute</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Charalampos"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            onClick={() => {
              setName(value);
              addUser(value);
              setValue("");
            }}
          >
            Envoyer
          </button>
        </div>

        <h2>Membres de l'équipage</h2>
        <div className="member-list row justify-content-start">
          {listArgonautes}
        </div>
      </main>

      <footer className="fixed-bottom">
        <p>Réalisé par Quentin en Anthestérion de l'an 515 avant JC</p>
      </footer>
    </div>
  );
}

export default App;
