import mongoose from "mongoose";

// tworzymy template usera
// za pomoca mangoose ukazujemy jakie danne ma w sobie zawierac
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      // ma byc to string znaczenie
      type: String,
      // ukazujemy ze to pole ma byc wymagane
      required: true,
    },
    email: {
      type: String,
      required: true,
      // poczta musi byc unikalna
      // w bazie dannych nie moga sie powtarzac email znaczenia
      unique: true,
    },
    // moze byc zapisana informacja o hasle
    // ale info musi byc zaszyfrowane
    passwordHash: {
      type: String,
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
export default mongoose.model("User", UserSchema);
