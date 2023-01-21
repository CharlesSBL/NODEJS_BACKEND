// jest to serwer
import express from "express";

// odpowiada za prace z mongoDB
import mongoose from "mongoose";

// sluzy dla ladowania i zapisywanie obrazkow
import multer from "multer";

// jest to nasz validator registracji usera
// w node.js trzeba zawsze na koncu ukazywac format dokumentu
import {
  registerValidator,
  loginValidator,
  postCreateValidator,
} from "./validations/auth.js";

// ta func pozwala sprawdzic login
// import checkAuth from "./utils/checkAuth.js";
// sprawdza na errory
// import handleValidationErrors from "./utils/handleValidationErrors.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

// wyciagamy wszystkie zapisane func dla logowania, rejestracji i tp z mongoDB
// zapisujemy wszistkie export w jeden variable (UserController)
// import * as UserController from "./controllers/UserController.js";
// import * as PostController from "./controllers/PostController.js";
import { UserController, PostController } from "./controllers/index.js";

// ====================================================================================

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

// =======================================

// tworzymy (chraniliszie) gdzie beda zapisane nasze obrazki
const storage = multer.diskStorage({
  // ukazujemy gdzie w pamieci beda zapisywane nasze obrazki(img)
  // gdy bedzie sie tworzyc storage, ma odpalic sie funk (destination)
  // przyjmuje args(req, file, callback)
  destination: (_, __, cb) => {
    // ukazujemy funkcji, gdzie bedzie zapisywac
    // null ukazuje ze nie bedzie zadbych errorow
    cb(null, "uploads");
  },
  // ukazujemy nazwe file (obrazek), gdy bedzie zapisywac
  // bedzie dawac nazwe taka sama
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// To jest tak zwany (Rout)
// po wlaczeniu tej opcji, json files, tkore beda przychodzic na serwer,
// express bedzie w stanie ich czytac
app.use(express.json());

// ====================================================================================

// jesli przyjdzie get request na strone (/uploads/file.jpg) to przerzuci do folderu z obrazkami
// i ja ukarze na stronie
// jest to get request na dostanie statyczny file
app.use("/uploads", express.static("uploads"));

// zapisywanie obrazkow
// bedzie zapisywac i bedzie oczekiwac file pod nazwaniem (image)
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// ukazujemy, ze jesli przyjdzie na serwer get request
// to dajemy (rozkaz) zrobic wybranny kod (funkcje)
app.get("/", (req, res) => res.send("hello world"));

// tworzymy autoryzacje gdzie klient bedzie mogl sie (logowac)
// ukazujemy, to gdzie bedzie sie logowac klient i wysylac nam danne
app.post(
  "/auth/login",
  loginValidator, // napierw robi validacje
  handleValidationErrors, // tutaj sprawdza czy sa errory
  UserController.login
);

// funkcja dla mzliwosci regstracji nowego usera
// tutaj sprawdza, jesli przyszly danne, to najpierw ma przejsc przez validator
// jesli ok, to ma robic nastepna funkcje
app.post(
  "/auth/register",
  registerValidator, // napierw robi validacje
  handleValidationErrors, // tutaj sprawdza czy sa errory
  UserController.register
);

// sprawdzamy, czy wogole da sie dostac info o sobie
// podajem funkcje sprawdzenia autoryzjacji
app.get("/auth/me", checkAuth, UserController.getMe);

// ====================================================================================
// rest API (CRUD)
// Jest to funkcjonal dla redagowania dannych usera (staciej)
// Mozna zrobic w jednym router 4 (komandy) (get, post, patch, delete) => (CRUD)
// dostawac info o ppostach(stacjach) moze kazdy
// ale juz cos robic moze tylko autoryzowana osoba, jest zologowana i ma token

// ten bedzie wyciagac wszystkie napisane (stacji) wszystkich
app.get("/posts", PostController.getAll);

// tutaj bedziemy wyciagac jedna (stacju)
// (:id) jest to dynamiczny parametr
app.get("/posts/:id", PostController.getOne);

// tutaj bedziemy tworzyc nowa (stacje)
// najpierw robi werifikacje uzytkownika (dodaje do request (id)),
// weryfikacje posta, i zapisywanie go w mongoDB
app.post(
  "/posts",
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.create
);

// tutaj bedziemy usuwac (stacju)
// trzeba dawac token, zeby moc autoryzowac, sprawdzic usera
// wtedy moze usunac post (stacju)
app.delete("/posts/:id", checkAuth, PostController.remove);

// Edytowac (stacje)
// validacja usera i dannych ktore przesyla
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.update
);

// ====================================================================================

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

// time => 1: 57: 16
