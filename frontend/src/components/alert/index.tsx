import { CircleCheck } from "lucide-react";

interface AlertProps {
  message: string;
  title?: string; // permite customizar o título
  onClose: () => void;
  onConfirm?: () => void; // usado quando for confirmação
  confirmText?: string;
  cancelText?: string;
}

const Alert = ({
  message,
  title = "Mensagem de Alerta",
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: AlertProps) => {
  const isConfirm = Boolean(onConfirm); // se tiver onConfirm, é confirmação

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[25vw] max-w-[400px] shadow-lg border-l-4 border-gray-300">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Ícone */}
          <CircleCheck className="h-10 w-10 text-primary" />

          {/* Título */}
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

          {/* Mensagem */}
          <span className="text-gray-600">{message}</span>

          {/* Botões */}
          <div className="flex gap-3 mt-4">
            {isConfirm ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
