import mongoose from "mongoose";

// tworzymy template usera
// za pomoca mangoose ukazujemy jakie danne ma w sobie zawierac
const PostSchema = new mongoose.Schema(
  {
    title: {
      // ma byc to string znaczenie
      type: String,
      // ukazujemy ze to pole ma byc wymagane
      required: true,
    },
    text: {
      type: String,
      required: true,
      // poczta musi byc unikalna
      // w bazie dannych nie moga sie powtarzac email znaczenia
      unique: true,
    },
    // moze byc zapisana informacja o hasle
    // ale info musi byc zaszyfrowane
    tags: {
      type: Array,
      // jesli nie bedzie danny array
      // ma zapisac w niego pusty
      default: [],
    },
    // liczba wysfietlen
    viewsCount: {
      type: Number,
      default: 0,
    },
    // tutaj zapisujemy specjalnie ID usera
    // autora
    user: {
      // wyciagamy id ktorym bedziemy wyciagac usera z bazy dannych
      type: mongoose.Schema.Types.ObjectId,
      // bedzie sie ssylac na oddzielna model Usera
      ref: "User",
      required: true,
    },
    avatarUrl: String,
  },
  // ukazujemy ze przy tworzeniu nowego usera
  // maja byc dodatkowe danne na jego temat
  // np kiedy byl stworzony i jego aktulizacji
  {
    timestamps: true,
  }
);

// zapisujemy model usera
export default mongoose.model("Post", PostSchema);
