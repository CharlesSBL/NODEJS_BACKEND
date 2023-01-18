import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
