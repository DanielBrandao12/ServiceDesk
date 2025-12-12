import { useEffect, useState } from "react";

import { ChamadasTickets } from "../../services/endpoints/tickets";

import {
    Ticket,
    CheckCircle,
    Users,
    Clock,
    AlertTriangle,
    MessageCircle,
    HelpCircle,
    Hourglass,
} from "lucide-react";

const CardsInfo = () => {

    const [dados, setDados] = useState<any>(null);
    //const [categorias, setCategorias] = useState<any[]>([]);

    const [carregando, setCarregando] = useState<boolean>(false);

    useEffect(() => {
        const buscarDashboard = async () => {
            try {
                setCarregando(true);
                const res = await ChamadasTickets.listarCardsInfo();

                if (res) {
                    setDados(res);
                    //setCategorias(res.categorias ? Object.entries(res.categorias) : []);
                } else {
                    console.warn("Nenhum dado retornado do dashboard.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            } finally {
                setCarregando(false);
            }
        };

        buscarDashboard();
    }, []);

    const metricas = [
        { titulo: "Tickets abertos", valor: dados?.status.abertos, icone: <Ticket className="text-primary" /> },
        { titulo: "Tickets fechados", valor: dados?.status.fechados, icone: <CheckCircle className="text-primary" /> },
        { titulo: "Tickets atribuídos", valor: dados?.status.atribuidos, icone: <Users className="text-primary" /> },
        { titulo: "Tickets não atribuídos", valor: dados?.status.naoAtribuido, icone: <AlertTriangle className="text-primary" /> },
        { titulo: "Aguardando Classificação", valor: dados?.status.aguardandoClassificacao, icone: <HelpCircle className="text-primary" /> },
        { titulo: "Em atendimento", valor: dados?.status.emAtendimento, icone: <Clock className="text-primary" /> },
        { titulo: "Aguardando atendimento", valor: dados?.status.aguardando, icone: <Hourglass className="text-primary" /> },
        { titulo: "Pendente Resposta do Solicitante", valor: dados?.status.pendenteResposta, icone: <MessageCircle className="text-primary" /> },
        { titulo: "Total de Tickets", valor: dados?.total, icone: <Ticket className="text-primary" /> },
    ];

    const [indiceAtual, setIndiceAtual] = useState(0);

    /// Troca a cada 30 segundos, 4 cards por vez
    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndiceAtual((i) => {
                const proximo = i + 2;
                return proximo >= metricas.length ? 0 : proximo;
            });
        }, 15000);

        return () => clearInterval(intervalo);
    }, [metricas.length]);

    // Determina os 4 itens da página atual
    const cardsVisiveis = metricas.slice(indiceAtual, indiceAtual + 2);

    return (
        <div className="flex flex-row w-full h-[100vh]">
            <iframe
                src="https://10.68.96.5/public/mapshow.htm?id=2954&mapid=AF761232-767F-4DC0-A958-DE26C5F0B297"
                className="w-[85%] h-[100%]"

            ></iframe>
            {
                carregando ? (<p className="text-lg font-medium">Carregando dados do dashboard...</p>) :
                    (

                        <div className="flex flex-col m-5 gap-2 p-2 w-[15%] ">


                            {/* ====== MÉTRICAS ====== */}
                            <div className="flex flex-col gap-8">

                                {cardsVisiveis.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-center h-[430px] p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300"
                                    >
                                        <div className="mb-2">{item.icone}</div>
                                        <h3 className="text-xl font-medium text-gray-700 text-center mb-1">
                                            {item.titulo}
                                        </h3>
                                        <span className="text-6xl font-semibold text-gray-900">
                                            {item.valor}
                                        </span>
                                    </div>
                                ))}

                            </div>

                            {/* ====== CATEGORIAS ====== */}
                            {
                                /*
                
                
                            <div className="mt-10">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 px-2">
                                  Categorias com Mais Chamados
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                
                                  {categorias.length > 0 ? (categorias.map(([nome, quantidade], index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                                    >
                                      <h3 className="text-sm font-medium text-gray-700 text-center mb-1">
                                        {nome}
                                      </h3>
                                      <span className="text-4xl font-semibold text-gray-900">{quantidade}</span>
                                    </div>
                                  ))) :
                                    (<p className="text-center text-sm  font-medium ">Não existe categorias no momento</p>)
                
                                  }
                                </div>
                              </div>
                
                
                                 
                                 */
                            }

                        </div>
                    )
            }
        </div>
    );
};

export default CardsInfo;
