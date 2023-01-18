import jwt from "jsonwebtoken";

export default (req, res, next) => {
  // zapisuje szyfr w token, jesli go nie ma, to ma zapisac pusty string
  //i usunac slowo (Bearer)
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      // jesli jest token, trzeba go odszyfrowac
      // dajemy sam token, i klucz zeby go odszyfrowac
      const decoded = jwt.verify(token, "secret123");

      // wyciagamy z tokena (id) ktore jest zapisane w bazie dannych mongoDB
      req.userId = decoded._id;

      // jesli wszystko poprawnie
      // konczy funkcje, pozwala dalej robic kod
      next();

      // jesli sie nie dalo odszyfrowac token
    } catch (err) {
      return res.status(403).json({
        message: "cant enter",
      });
    }
  } else {
    // jesli token jest pusty, to ma zwrocic error
    return res.status(403).json({
      message: "cant enter",
    });
  }
};
