// model stacji
import PostModel from "../models/Post.js";

// wyciagniecie z monogDB wszystkie (Stacji)
export const getAll = async (req, res) => {
  try {
    // teraz wyciaga z mongoDB wszystkie (stacji)
    // zwiazalismy tablice Post.js usera
    // takze mozna wyciagnac z niego teraz wszystko, i go wsadzic w info o poscie
    // exec, wypelnia zapros na usera i zwraca wszystko
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something goes wrong...",
    });
  }
};

// wyciagniecie jednej stacji
export const getOne = async (req, res) => {
  try {
    // zeby wiciagnac (:id), dynamiczny variable
    // z requestu
    const postId = req.params.id;

    // znajdujemy po (id) jeden (stacju) i zmieniamy zawartosc
    PostModel.findOneAndUpdate(
      {
        // id po ktorym bedie szukany objekt
        _id: postId,
      },
      {
        // ukazujemy co dokladnie chce zwiekszyc
        $inc: {
          // ukazujemy pole i na ile chcemy zwiekszyc za raz
          viewsCount: 1,
        },
      },
      {
        // ukazujemy ze ma zwrocic spowrotem po zapisaniu dannych i nadpisac
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          // jesli byl error to ma informowac
          console.log(err);
          return res.status(500).json({
            message: "something goes wrong...",
          });
        }
        // sprawdzamy czy wogole jest taki dokument(ekxemplarz)
        if (!doc) {
          console.log(err);
          return res.status(404).json({
            message: "Cant find document...",
          });
        }

        res.json(doc);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Post not defined...",
    });
  }
};

// usuwa post (stacju)
export const remove = async (req, res) => {
  try {
    // zeby wiciagnac (:id), dynamiczny variable
    // z requestu
    const postId = req.params.id;

    // ma za pomoca mongoDB funkcji usunac ekzemplarz
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Cant delete post...",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Cant find post...",
          });
        }

        res.json({
          succes: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Post not defined...",
    });
  }
};

// Edytuje konkrenty ekzemplarz postu (stacji)
export const update = async (req, res) => {
  try {
    // zeby wiciagnac (:id), dynamiczny variable
    // z requestu
    // musimy wiedziec jaki post(stacju) chcemy obnowic
    const postId = req.params.id;

    await PostModel.updateOne(
      // jako pierwszy parametr, szukamy ekzemplarz
      {
        _id: postId,
      },
      // jako drugi, ukazujemy co chcemy nadpisac(zmienic)
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    // po tym jak zapisze nowe danne ekzemplaz(nadpisze danne)
    // informuje o zakonczeniu pomyslnie operacji
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Post does not edited...",
    });
  }
};

// tworzymy stacji
// bedzie mozna dodac, usunac, edytowac, i czytac (stacje)
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      avatarUrl: req.body.avatarUrl,
      tags: req.body.tags,
      // user id wyciagamy z (checkAuth) gdy uzywa funkcje getMe
      user: req.userId,
    });

    // gdy dokument bedzie gotowy, trzeba go stworzyc
    const post = await doc.save();

    // zwracamy odpowiedz
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something goes wrong...",
    });
  }
};
