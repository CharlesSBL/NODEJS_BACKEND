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
