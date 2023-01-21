// to pozwala szyfrowac danne
import jwt from "jsonwebtoken";
// library do szyfrowania hasla
import bcrypt from "bcrypt";

// po validacji musimy obrobic danne na ten temat, czy sa poprawne czy nie
import { validationResult } from "express-validator";

// uzywamy template usera dla tworenia na jego podstawie objekty
import UserModel from "../models/User.js";

// funkcja dla mzliwosci regstracji nowego usera
// tutaj sprawdza, jesli przyszly danne, to najpierw ma przejsc przez validator
// jesli ok, to ma robic nastepna funkcje
export const register = async (req, res) => {
  // za pomoca (try catch) bedzie obrabiac wszystkie dopuszczone errory
  try {
    // {
    //   // trzeba wszystko wyciagnac z requestu
    //   const errors = validationResult(req);

    //   // jesli sa errory
    //   if (!errors.isEmpty()) {
    //     // to ma zwrocic response(400)
    //     // ukazac ze wiadomosc jest nie prawidlowa(error)
    //     // ukazamy wszystkie errory ktore byly dokonane w requescie
    //     return res.status(400).json(errors.array());
    //   }
    // }

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

    // ukazujemy ze token bedzie nosic, zaszyfrowana informacje
    const token = jwt.sign(
      {
        // user id daje sie automatycznie w mongoDB
        // on wystarczy zeby rozumiec z jakim (userem) pracowac
        _id: user._id,
      },
      // ukazuje klucz ktorym szyfruje danne
      "secret123",
      // jako 3 parametr ukazuje sie ile czasu ma istniec (token)
      // minut, godzin i tp
      {
        // ukazuje ze bedzie (validny) 30 dni
        expiresIn: "30d",
      }
    );

    // w samym user obj jest wiecej info niz w dok
    // dlatego wyciagamy sam dokument w ktorym sa zawarte prywatne danne usera
    // wyciagamy z prywatnych dannych wybrannego usera hash
    // i wyjmujemy userData dla dalszej przesylki
    const { passwordHash: userHash, ...userData } = user._doc;

    // jesli nie ma bledow to ma wyslac spowrotem do klienta taki kod
    res.json({
      success: true,
      ...userData,
      token,
    });
  } catch (err) {
    // ukazujemy ze jesli error to ma wyslac odpowiedz klientu
    console.log(err);

    // tzreba pamiec ze serwer (express) nie moze 2 rozne responsy wyslac
    // tylko jeden za cala akcje
    res.status(500).json({
      massege: "Register has failed",
      err,
    });
  }
};

// tworzymy autoryzacje gdzie klient bedzie mogl sie (logowac)
// ukazujemy, to gdzie bedzie sie logowac klient i wysylac nam danne
export const login = async (req, res) => {
  try {
    // najpierw musimy znalesc czy user istnieje o wybrannych info w bazie dannych
    // szukamy tylko pojedynczy egzemplarz usera
    const user = await UserModel.findOne({
      // kazemy znalesc usera po email w mongoDB
      email: req.body.email,
    });

    // jesli nie ma takie usera, to ma zrobic to
    if (!user) {
      return res.status(404).json({
        // w prawdziwym projekcie nigdy nie informuj klienta co dokladnie poszlo nie tak
        // w taki sposob klient moze latwiej zhakowac nasza baze dannych
        message: "Wrong Name or Password",
      });
    }

    // sprawdzamy, jesli jest taki user, to czy haslo ktore nam wyslal sie zgadza z wybranym
    // ekzemplarem usera z mongoDB
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    // piszemy funk, jesli hasla sie nie zgadzaja to ma wyslac response
    if (!isValidPass) {
      return res.status(400).json({
        // w prawdziwym projekcie nigdy nie informuj klienta co dokladnie poszlo nie tak
        // w taki sposob klient moze latwiej zhakowac nasza baze dannych
        message: "Wrong Name or Password",
      });
    }

    // Jesli danne sie zgdzaja, tworzymy nowy zaszyfrowany token
    const token = jwt.sign(
      {
        // user id daje sie automatycznie w mongoDB
        // on wystarczy zeby rozumiec z jakim (userem) pracowac
        _id: user._id,
      },
      // ukazuje klucz ktorym szyfruje danne
      "secret123",
      // jako 3 parametr ukazuje sie ile czasu ma istniec (token)
      // minut, godzin i tp
      {
        // ukazuje ze bedzie (validny) 30 dni
        expiresIn: "30d",
      }
    );

    // w samym user obj jest wiecej info niz w dok
    // dlatego wyciagamy sam dokument w ktorym sa zawarte prywatne danne usera
    // wyciagamy z prywatnych dannych wybrannego usera hash
    // i wyjmujemy userData dla dalszej przesylki
    const { passwordHash: userHash, ...userData } = user._doc;

    // jesli nie ma bledow to ma wyslac spowrotem do klienta taki kod
    res.json({
      success: true,
      ...userData,
      token,
    });
  } catch (err) {
    // ukazujemy ze jesli error to ma wyslac odpowiedz klientu
    console.log(err);

    // tzreba pamiec ze serwer (express) nie moze 2 rozne responsy wyslac
    // tylko jeden za cala akcje
    res.status(500).json({
      massege: "Login has failed",
      err,
    });
  }
};

// sprawdzamy, czy wogole da sie dostac info o sobie
// podajem funkcje sprawdzenia autoryzjacji
export const getMe = async (req, res) => {
  // jesli wypelnila sie func (checkAuth) pomyslnie
  // to moze zrobic kod nizej podany
  try {
    // ma znalesc w bazie dannych Usera
    // token sie odszyfrowuje i wyciaga (ID)
    // jego ponizej podajemy, zeby mogl zlaesc po nim go
    const user = await UserModel.findById(req.userId);

    if (!user) {
      // jesli nie ma takiego usera, ma wyslac error do klienta
      return res.status(404).json({
        message: "Something goes wrong...",
      });
    }

    const { passwordHash: hash, ...userData } = user._doc;

    res.json({
      success: true,
      ...userData,
      hash,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Something goes wrong...",
    });
  }
};
