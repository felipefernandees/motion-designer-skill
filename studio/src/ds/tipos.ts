// Contrato de um branding de motion. A linguagem de movimento é fixa (ds/movimento.ts);
// o branding só troca a pele: cor, fonte, raio, sombra, material.
export type Branding = {
  nome: string;
  cor: {
    fundo: string; // fundo das cenas de texto e do palco
    superficie: string; // tela do app
    superficieAgrupada: string; // fundo agrupado (estilo lista do iOS)
    tinta: string; // texto principal
    tintaSecundaria: string;
    separador: string;
    destaque: string; // a cor da marca
    destaqueEscuro: string;
    sucesso: string;
    sobreDestaque: string; // texto em cima do destaque
  };
  fonte: {texto: string; display: string};
  raio: {tela: number; card: number; controle: number; celula: number};
  sombra: {aparelho: string; card: string; flutuante: string};
  vidro: {claro: React.CSSProperties; escuro: React.CSSProperties};
  marca: {palavra: string; ponto: boolean; frase: string};
};
