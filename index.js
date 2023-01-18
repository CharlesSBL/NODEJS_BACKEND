// jest to serwer
import express from "express";
// to pozwala szyfrowac danne
import jwt from "jsonwebtoken";
// odpowiada za prace z mongoDB
import mongoose from "mongoose";

// jest to nasz validator registracji usera
// w node.js trzeba zawsze na koncu ukazywac format dokumentu
import { registerValidator } from "./validations/auth.js";

// po validacji musimy obrobic danne na ten temat, czy sa poprawne czy nie
import { validationResult } from "express-validator";

// uzywamy template usera dla tworenia na jego podstawie objekty
import UserModel from "./models/User.js";

// library do szyfrowania hasla
import bcrypt from "bcrypt";

// podlaczamy sie do bazy dannych (MongoDB)
mongoose
  .connect(
    "mongodb+srv://TestMember:C2409900Karol@cluster0.vwkkanu.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB has been connected!!!"))
  .catch((err) => console.log("DB has failed", err));

//tworzenie express app serwer
const app = express();

// po wlaczeniu tej opcji, json files, tkore beda przychodzic na serwer,
// express bedzie w stanie ich czytac
app.use(express.json());

// ukazujemy, ze jesli przyjdzie na serwer get request
// to dajemy rozkaz zrobic jakis kod (funkcje)
app.get("/", (req, res) => {
  res.send("hello world");
});

// ukazujemy, to gdzie bedzie sie logowac klient i wysylac nam danne
app.post("/auth/login", (req, res) => {
  // w tym momencie szyfrujemy wybranne danne
  // za pomoca specjalnego klucza
  const token = jwt.sign(
    {
      email: req.body.email,
      name: "Vasa Pupkin",
    },
    "secret123"
  );

  res.json({
    success: true,
    token,
  });
});

// tutaj sprawdza, jesli przyszly danne, to najpierw ma przejsc przez validator
// jesli ok, to ma robic nastepna funkcje
app.post("/auth/register", registerValidator, async (req, res) => {
  // trzeba wszystko wyciagnac z requestu
  const errors = validationResult(req);

  // jesli sa errory
  if (!errors.isEmpty()) {
    // to ma zwrocic response(400)
    // ukazac ze wiadomosc jest nie prawidlowa(error)
    // ukazamy wszystkie errory ktore byly dokonane w requescie
    return res.status(400).json(errors.array());
  }

  // wyciagamy z body requestu (haslo)
  const password = req.body.password;
  // sol, jest to algorymt za pomoca ktorego bedziemy szyfrowac haslo usera
  const salt = await bcrypt.genSalt(10);
  // szyfrujemy za pomoca func haslo i algorytmu
  // ten sposob uzywa bardzo duzo firm
  // prawie nie mozliwe odszyfrowac password
  const passwordHash = await bcrypt.hash(password, salt);

  // przygotowanie dokumentu na stworzenie nowego usera
  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  });
  // zapisujemy nowego usera w bazie dannych
  // mongoDB zwroci odpowiedz
  const user = await doc.save();

  // jesli nie ma bledow
  res.json({
    success: true,
    user,
  });
});

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
