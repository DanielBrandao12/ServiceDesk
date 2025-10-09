import { chamadasAnexo } from "../services/endpoints/anexo";

  export const downloadAnexo = async (id: number, nome : string) => {
    try {
      const response = await chamadasAnexo.listarAnexoId(id);
      const contentType = response.headers["content-type"] || "application/octet-stream";

      // tenta extrair o nome do arquivo do header
      let fileName = nome;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar anexo:", error);
    }
  };
