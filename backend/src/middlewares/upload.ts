import multer from "multer";
import path from "path";

const storage = multer.memoryStorage(); // ou diskStorage se quiser salvar no disco

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // até 10MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".pdf", ".txt", ".docx", ".xlsx"];
    if (!allowed.includes(ext)) {
      return cb(new Error("Tipo de arquivo não permitido"));
    }
    cb(null, true);
  },
});
