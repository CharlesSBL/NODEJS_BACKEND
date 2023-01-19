// walidacja na authoryzowanie
// inaczej mowiac sprawdza przy registracji czy danne sa poprawnie napisane
import { body } from "express-validator";

export const registerValidator = [
  // sprawdzamy czy jesli (email) jest poprawny
  // jesli (true) to przepuszczamy
  // sprawdza w body (w ciele wiadomosci dannych)
  body("email", "Wrong format of email").isEmail(),
  // ukazujemy jesli haslo bedzie miec min 5 znakow
  // to ma przepuszczac
  body("password", "Password need have min 5 chars").isLength({ min: 5 }),
  // to samo tylko ze dla imienia
  body("fullName", "fullName need have min 3 chars").isLength({ min: 3 }),
  // ma sprawdzic (opcjonalnie tzn jesli bedzie info) to ma sprawdzic
  // czy jest to URL adress
  body("avatarUrl", "Wrong format of URL").optional().isURL(),
];

// validacja dla logina
export const loginValidator = [
  body("email", "Wrong format of email").isEmail(),
  body("password", "Password need have min 5 chars").isLength({ min: 5 }),
];

// walidacja dla (staciej)
export const postCreateValidator = [
  // nazwa, error, wymagana dlugosc, wymagany format (string)
  body("title", "Wrong format of title").isLength({ min: 3 }).isString(),
  body("text", "Text need have min 5 chars").isLength({ min: 10 }).isString(),
  body("tags", "Wrong format of tags").optional().isString(),
  body("avatarUrl", "Wrong format of URL").optional().isString(),
];
