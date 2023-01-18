// jest to serwer
import express from "express";

// odpowiada za prace z mongoDB
import mongoose from "mongoose";

// jest to nasz validator registracji usera
// w node.js trzeba zawsze na koncu ukazywac format dokumentu
import { registerValidator } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

// wyciagamy wszystkie zapisane func dla logowania, rejestracji i tp z mongoDB
// zapisujemy wszistkie export w jeden variable (UserController)
import * as UserController from "./controllers/UserController.js";

// podlaczamy sie do bazy dannych (MongoDB)
mongoose
  // ukazujemy (/blog?)- ze nie poprostu podlaczamy sie do nasego serwera a konkretnie do bazy dannych
  .connect(
    "mongodb+srv://TestMember:C2409900Karol@cluster0.vwkkanu.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB has been connected!!!"))
  .catch((err) => console.log("DB has failed", err));

//tworzenie express app serwer
const app = express();

// po wlaczeniu tej opcji, json files, tkore beda przychodzic na serwer,
// express bedzie w stanie ich czytac
app.use(express.json());

// ukazujemy, ze jesli przyjdzie na serwer get request
// to dajemy (rozkaz) zrobic wybranny kod (funkcje)
app.get("/", (req, res) => {
  res.send("hello world");
});

// tworzymy autoryzacje gdzie klient bedzie mogl sie (logowac)
// ukazujemy, to gdzie bedzie sie logowac klient i wysylac nam danne
app.post("/auth/login", UserController.login);

// funkcja dla mzliwosci regstracji nowego usera
// tutaj sprawdza, jesli przyszly danne, to najpierw ma przejsc przez validator
// jesli ok, to ma robic nastepna funkcje
app.post("/auth/register", registerValidator, UserController.register);

// sprawdzamy, czy wogole da sie dostac info o sobie
// podajem funkcje sprawdzenia autoryzjacji
app.get("/auth/me", checkAuth, UserController.getMe);

// odpalamy serwer i ukazujemy port (4444)
// u ukazujemy co ma robic przy odpaleniu sie
// gdy napsizem ten kod mozna pisac (node index.js) i mamy swoj serwer
// localhost4444
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("server ok");
});
