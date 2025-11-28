

export const pegarIniciais = (nomeCompleto : string) =>{
    const nomes : string[] = nomeCompleto.split(" ");
    
    const iniciais = nomes.map((nome) =>nome.charAt(0));
    return iniciais.join('')
}

