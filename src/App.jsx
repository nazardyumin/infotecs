import "./App.css";
import { useEffect, useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";

export default function App() {
  const [users, setUsers] = useState([]);
  const [skip, setSkip] = useStateWithCallbackLazy(0);
  const [searchKey, setSearchKey] = useState("");
  const [firstNameOrder, setFirstNameOrder] = useState("asc");
  const [lastNameOrder, setLastNameOrder] = useState("asc");
  const [ageOrder, setAgeOrder] = useState("asc");
  const [genderOrder, setGenderOrder] = useState("asc");
  const [cityOrder, setCityOrder] = useState("asc");
  const [addressOrder, setAddressOrder] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  let listItems;
  let limit = 30;

  useEffect(() => {
    getUsers(skip);
  }, []);

  function forward() {
    setSkip(skip + 30, (skipUpdated) => {
      getUsers(skipUpdated);
    });
  }

  function backward() {
    setSkip(skip - 30, (skipUpdated) => {
      getUsers(skipUpdated);
    });
  }

  function goSearch() {
    var value = document.getElementById(searchKey).value;
    value = value.toLowerCase();
    if(searchKey === "firstName" || searchKey === "lastName" || searchKey === "address.city"){
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    limit = 0;
    setIsSearching(true);
    setSkip(0, (skipUpdated) => {
      getUsers(skipUpdated, `/filter?key=${searchKey}&value=${value}&`);
    });
  }

  function clearSearchInputs(skipInput) {
    let ids = ["id", "firstName", "lastName", "address.city", "gender", "age"];
    if (ids.indexOf(skipInput) > -1) {
      ids.splice(ids.indexOf(skipInput), 1);
      setSearchKey(skipInput);
    }
    setSkip(-1);
    ids.forEach((id) => {
      document.getElementById(id).value = "";
    });
  }

  function onRowClickHandler(id) {
    fetch(`https://dummyjson.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser(data);
      })
      .catch((err) => {
        console.log(err);
        setSelectedUser(null);
      });
    var myModal = new bootstrap.Modal(document.getElementById("userModal"), {
      keyboard: false,
    });
    myModal.show();
  }

  function orderUsers(key) {
    resetOrders(key);
    let order;
    switch (key) {
      case "firstName":
        order = firstNameOrder;
        break;
      case "lastName":
        order = lastNameOrder;
        break;
      case "age":
        order = ageOrder;
        break;
      case "gender":
        order = genderOrder;
        break;
      case "address.city":
        order = cityOrder;
        break;
      case "address.address":
        order = addressOrder;
        break;
    }
    if (order === "none"){
      setIsSearching(false);
      getUsers(0);
    } 
    else {
      setIsSearching(true);
      limit = 0;
      getUsers(0, `?sortBy=${key}&order=${order}&`);
    }
  }

  function resetOrders(key) {
    switch (key) {
      case "firstName":
        if (firstNameOrder === "asc") setFirstNameOrder("desc");
        if (firstNameOrder === "desc") setFirstNameOrder("none");
        if (firstNameOrder === "none") setFirstNameOrder("asc");
        setLastNameOrder("asc");
        setAgeOrder("asc");
        setGenderOrder("asc");
        setCityOrder("asc");
        setAddressOrder("asc");
        break;
      case "lastName":
        setFirstNameOrder("asc");
        if (lastNameOrder === "asc") setLastNameOrder("desc");
        if (lastNameOrder === "desc") setLastNameOrder("none");
        if (lastNameOrder === "none") setLastNameOrder("asc");
        setAgeOrder("asc");
        setGenderOrder("asc");
        setCityOrder("asc");
        setAddressOrder("asc");
        break;
      case "age":
        setFirstNameOrder("asc");
        setLastNameOrder("asc");
        if (ageOrder === "asc") setAgeOrder("desc");
        if (ageOrder === "desc") setAgeOrder("none");
        if (ageOrder === "none") setAgeOrder("asc");
        setGenderOrder("asc");
        setCityOrder("asc");
        setAddressOrder("asc");
        break;
      case "gender":
        setFirstNameOrder("asc");
        setLastNameOrder("asc");
        setAgeOrder("asc");
        if (genderOrder === "asc") setGenderOrder("desc");
        if (genderOrder === "desc") setGenderOrder("none");
        if (genderOrder === "none") setGenderOrder("asc");
        setCityOrder("asc");
        setAddressOrder("asc");
        break;
      case "address.city":
        setFirstNameOrder("asc");
        setLastNameOrder("asc");
        setAgeOrder("asc");
        setGenderOrder("asc");
        if (cityOrder === "asc") setCityOrder("desc");
        if (cityOrder === "desc") setCityOrder("none");
        if (cityOrder === "none") setCityOrder("asc");
        setAddressOrder("asc");
        break;
      case "address.address":
        setFirstNameOrder("asc");
        setLastNameOrder("asc");
        setAgeOrder("asc");
        setGenderOrder("asc");
        setCityOrder("asc");
        if (addressOrder === "asc") setAddressOrder("desc");
        if (addressOrder === "desc") setAddressOrder("none");
        if (addressOrder === "none") setAddressOrder("asc");
        break;
    }
  }

  function getUsers(skipValue, parameters = "?") {
    fetch(
      `https://dummyjson.com/users${parameters}select=firstName,lastName,gender,age,phone,address&skip=${skipValue}&limit=${limit}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
      })
      .catch((err) => {
        console.log(err);
        getUsers([]);
      });
  }

  listItems = users.map((user) => (
    <tr
      key={user.id}
      onClick={() => {
        onRowClickHandler(user.id);
      }}
    >
      <td>{user.id}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.age}</td>
      <td>{user.gender}</td>
      <td>{user.phone}</td>
      <td>{user.address.city}</td>
      <td>{user.address.address}</td>
    </tr>
  ));

  return (
    <main>
      <div
        className="modal fade"
        id="userModal"
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {selectedUser ? selectedUser.firstName : ""}{" "}
                {selectedUser ? selectedUser.lastName : ""}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Age: {selectedUser ? selectedUser.age : ""}</p>
              <p>
                Address: {selectedUser ? selectedUser.address.city : ""},{" "}
                {selectedUser ? selectedUser.address.address : ""}
              </p>
              <p>Height: {selectedUser ? selectedUser.height : ""}</p>
              <p>Weight: {selectedUser ? selectedUser.weight : ""}</p>
              <p>Phone: {selectedUser ? selectedUser.phone : ""}</p>
              <p>Email: {selectedUser ? selectedUser.email : ""}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h1 className="text-center mb-3">User table</h1>
        <div className="hstack gap-3 mb-3">
          <div className="btn-group mx-2" role="group">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={skip <= 0}
              onClick={() => {
                backward();
              }}
            >
              &lt; Prev
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={users.length == 0 || isSearching}
              onClick={() => {
                forward();
              }}
            >
              Next &gt;
            </button>
          </div>
          <div id="searchGroup" className="input-group input-group">
            <span className="input-group-text">Search by</span>
            <input
              id="id"
              type="number"
              className="form-control"
              placeholder="id"
              onChange={(e) => {
                clearSearchInputs(e.target.id);
              }}
            ></input>
            <input
              id="firstName"
              type="text"
              className="form-control"
              placeholder="first name"
              onChange={(e) => {
                clearSearchInputs(e.target.id);
              }}
            ></input>
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder="last name"
              onChange={(e) => {
                clearSearchInputs(e.target.id);
              }}
            ></input>
            <input
              id="address.city"
              type="text"
              className="form-control"
              placeholder="city"
              onChange={(e) => {
                clearSearchInputs(e.target.id);
              }}
            ></input>
            <input
              id="gender"
              type="text"
              className="form-control"
              placeholder="gender"
              onChange={(e) => {
                clearSearchInputs(e.target.id);
              }}
            ></input>
            <input
              id="age"
              type="number"
              className="form-control"
              placeholder="age"
              onChange={(e) => {
                clearSearchInputs(e.target.id);
              }}
            ></input>

            <button
              className="btn btn-outline-primary"
              type="button"
              disabled={!isSearching}
              onClick={() => {
                getUsers(skip);
                clearSearchInputs("");
                setIsSearching(false);
              }}
            >
              Reset
            </button>

            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                goSearch();
              }}
            >
              Go
            </button>
          </div>
        </div>

        <div id="list" className="overflow-auto">
          <table className="table table-striped">
            <thead id="tabHead" className="sticky-top">
              <tr>
                <td>
                  <button className="btn btn-light" disabled>
                    <b>ID</b>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => orderUsers("firstName")}
                  >
                    <b>First name</b>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => orderUsers("lastName")}
                  >
                    <b>Last name</b>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => orderUsers("age")}
                  >
                    <b>Age</b>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => orderUsers("gender")}
                  >
                    <b>Gender</b>
                  </button>
                </td>
                <td>
                  <button className="btn btn-light" disabled>
                    <b>Phone</b>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => orderUsers("address.city")}
                  >
                    <b>City</b>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-light"
                    onClick={() => orderUsers("address.address")}
                  >
                    <b>Street</b>
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>{listItems}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
