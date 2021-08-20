import "./App.css";
import { useState, useEffect } from "react";
import firestore from "./firestore";

const db = firestore.firestore();

function App() {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  const listArgonautes = data.map((argonaute, key) => (
    <div className="col-4" key={key}>
      <p className="text-center">
        {argonaute.name}
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => suppUser(argonaute.name)}
          style={{
            height: "4px",
            width: "4px",
            marginLeft: "0.3rem",
            paddingTop: "0.6rem",
          }}
        ></button>
      </p>
    </div>
  ));

  const suppUser = (name) => {
    db.collection("argonautes")
      .where("name", "==", name)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          db.collection("argonautes")
            .doc(doc.id)
            .delete()
            .then(() => {
              const count = reload + 1;
              console.log("Document successfully deleted!", name);
              setReload(count);
            })
            .catch((error) => {
              console.error("Error removing document: ", error);
            });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const addUser = (name) => {
    if (name.length > 3) {
      db.collection("argonautes").add({
        name: name,
      });
      setError(false);
    } else {
      setError(true);
    }
  };

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
  }, [name, reload]);

  return (
    <div>
      <header>
        <h1 className="w-100">
          <img
            src="https://www.wildcodeschool.com/assets/logo_main-e4f3f744c8e717f1b7df3858dce55a86c63d4766d5d9a7f454250145f097c2fe.png"
            alt="Wild Code School logo"
            className="w-100"
          />
          Les Argonautes
        </h1>
      </header>

      <main className="container" style={{ marginTop: "3rem" }}>
        <h2>Ajouter un(e) Argonaute</h2>
        <div className="new-member-form row">
          <div className="col-12">
            <label>Nom de l&apos;Argonaute</label>
          </div>
          <div className="col-12">
            <input
              className="form-control mx-auto"
              placeholder="Charalampos"
              aria-label="Charalampos"
              id="name"
              name="name"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ width: "200px" }}
            />
            {error ? <p>minimum 3 caractères</p> : <p></p>}
          </div>

          <button
            className="btn btn-primary mx-auto"
            style={{
              backgroundColor: "#f76c6c",
              borderColor: "#f76c6c",
              width: "100px",
            }}
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
        <div
          className="member-list row justify-content-start"
          style={{ marginTop: "5rem" }}
        >
          {listArgonautes}
        </div>
      </main>

      <footer className="fixed-bottom">
        <p>Réalisé par Jason et Quentin en Anthestérion de l'an 515 avant JC</p>
      </footer>
    </div>
  );
}

export default App;
