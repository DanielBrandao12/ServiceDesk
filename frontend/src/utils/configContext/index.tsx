import  { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

// 1. Defina a interface para o contexto (ajuda no autocomplete)
interface ConfigContextData {
  config: string | null;
  setConfig: (value: string) => void;
}

const ConfigContext = createContext<ConfigContextData | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  // 2. Inicialização preguiçosa (Lazy Initializer)
  const [config, setConfig] = useState<string | null>(() => {
    return localStorage.getItem('qtdForPage') || "5"; // Valor padrão caso esteja vazio
  });

  // 3. Sincronização: Sempre que 'config' mudar, salva no localStorage
  useEffect(() => {
    if (config) {
      localStorage.setItem('qtdForPage', config);
    }
  }, [config]);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

// 4. Hook personalizado para facilitar o uso nas páginas
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig deve ser usado dentro de um ConfigProvider");
  return context;
};