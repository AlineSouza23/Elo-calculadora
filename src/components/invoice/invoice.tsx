import { useState } from "react";
import { jsPDF } from "jspdf";


const App = () => {
  // Estado para os valores selecionados nos campos
  const [modulo, setModulo] = useState<string>('0');
  const [tipoTier, setTipoTier] = useState<string>('Credenciador Tier 1');
  const [inteligenciaArtificial, setInteligenciaArtificial] = useState<string>('nao');
  const [numCustomizacoes, setNumCustomizacoes] = useState<string>('0');
  const [numUsuarios, setNumUsuarios] = useState<number>(0);
  const [dataEspecial, setDataEspecial] = useState<string>('0');
  const [nome, setNome] = useState<string>('');

  // Tabela de preços base
  const precosBase: { [key: string]: number[] } = {
    "Autorização": [7000, 14000, 21000, 28000, 35000, 42000, 49000],
    "Liquidação": [7000, 14000, 21000, 28000, 35000, 42000, 49000],
    "Fluxo de Disputa": [4000, 6000, 8000, 10000, 12000, 14000, 16000],
    "Autorizado Pendente de Liquidação": [4000, 6000, 8000, 10000, 12000, 14000, 16000],
    "Rejeições": [5000, 7000, 9000, 11000, 13000, 15000, 17000],
    "Fraude": [5000, 8000, 11000, 14000, 17000, 20000, 23000],
    "3DS": [1500, 3000, 4500, 6000, 7500, 9000, 10500],
    "Advice Stand In": [1500, 3000, 4500, 6000, 7500, 9000, 10500],
    "Stand In": [1500, 3000, 4500, 6000, 7500, 9000, 10500],
    "HUB QR Code": [1500, 3000, 4500, 6000, 7500, 9000, 10500]
  };

  const descontosFidelidade = { 6: 0.03, 12: 0.10, 24: 0.20, 36: 0.25 };
  const descontoDatasEspeciais = 0.35;
  const precosIA = [500, 750, 800, 1000, 1250, 1500, 1800];
  const valoresCustomizacao : Record<string, number[]> = {
    "Credenciador": [100, 150, 200, 250, 300, 350, 400],
    "Emissor": [200, 250, 300, 350, 400, 500, 550]
  };

  const fatoresMultiplicativos:  Record<string, number> = {
    "1": 1.25, "2-3": 1.5, "4-6": 1.75, "7": 2, "8": 2.25,
    "9": 2.5, "10": 2.75, "11": 3, "12": 3.25, "13": 3.5,
    "14": 3.75, "15": 4, "16": 4.25, "17": 4.5, "18": 4.75,
    "19": 5, "20": 5.25
  };

  // Estado para os valores de preço calculados
  const [preco6, setPreco6] = useState<string>('R$ 0,00');
  const [preco12, setPreco12] = useState<string>('R$ 0,00');
  const [preco24, setPreco24] = useState<string>('R$ 0,00');
  const [preco36, setPreco36] = useState<string>('R$ 0,00');

  const handleCalcularPreco = () => {
    const tipo = tipoTier.split(' ')[0]; // Credenciador ou Emissor
    const tier = parseInt(tipoTier.split(' ')[2]) || 1;

    if (!precosBase[modulo]) {
      alert("Módulo não encontrado");
      return;
    }

    if (tier < 1 || tier > 7) {
      alert("Por favor, selecione um Tier válido.");
      return;
    }

    let precoBase = precosBase[modulo][tier - 1] || 0; 
    let precoFinal = precoBase;

    if (inteligenciaArtificial === "sim") {
      precoFinal += precosIA[tier - 1] || 0; 
    }

    if (numUsuarios > 0) {
      precoFinal += (numUsuarios <= 5) ? 700 : 700 + (numUsuarios - 5) * 100;
    }

    if (numCustomizacoes !== "0" && valoresCustomizacao[tipo]) {
        const numCustomizacoesInt = parseInt(numCustomizacoes, 10);
        const tipoKey = tipo as keyof typeof valoresCustomizacao;
      
        if (valoresCustomizacao[tipoKey]) {
          let valorCustomizacao = valoresCustomizacao[tipoKey][tier - 1] || 0;
          let fatorMultiplicativo = fatoresMultiplicativos[numCustomizacoesInt.toString()] || 1;
          precoFinal += valorCustomizacao * fatorMultiplicativo;
        }
    }

    let precoComDesconto = precoFinal - (precoFinal * descontoDatasEspeciais);

    // Atualizar os estados com os preços calculados
    setPreco6(`R$ ${(precoComDesconto - (precoComDesconto * descontosFidelidade[6] || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setPreco12(`R$ ${(precoComDesconto - (precoComDesconto * descontosFidelidade[12] || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setPreco24(`R$ ${(precoComDesconto - (precoComDesconto * descontosFidelidade[24] || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setPreco36(`R$ ${(precoComDesconto - (precoComDesconto * descontosFidelidade[36] || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  };

  const handleGerarPDF = () => {
    if (nome === "") {
      alert("Por favor, digite um nome antes de gerar o PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("\nRelatório de Preços", 80, 2);
    doc.text(`Olá ${nome}\nSegue abaixo os valores relacionados ao módulo escolhido!`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Módulo Selecionado: ${modulo}`, 10, 50);
    doc.text(`Tipo e Tier: ${tipoTier}`, 10, 60);
    doc.text(`Inteligência Artificial: ${inteligenciaArtificial}`, 10, 70);
    doc.text(`Número de Customizações: ${numCustomizacoes}`, 10, 80);
    doc.text(`Quantidade de Usuários: ${numUsuarios}`, 10, 90);
    doc.text(`Datas Especiais: ${dataEspecial}`, 10, 100);

    const valores = [
      ["6 meses", preco6],
      ["12 meses", preco12],
      ["24 meses", preco24],
      ["36 meses", preco36]
    ];

    valores.forEach((valor, index) => {
      doc.text(`${valor[0]}: ${valor[1]}`, 10, 110 + (index * 10));
    });

    doc.save("calculo_preco.pdf");
  };

  return (
    <div className="container">
      <h1>Calculadora de Preços</h1>

      {/* Campos de seleção */}
      <label htmlFor="modulo">Módulo:</label>
      <select id="modulo" value={modulo} onChange={e => setModulo(e.target.value)}>
        <option value="0">Nenhum</option>
        <option value="3DS">3DS</option>
        <option value="Advice Stand In">Advice Stand In</option>
        {/* Outros módulos */}
      </select>

      <label htmlFor="tipoTier">Tipo e Tier:</label>
      <select id="tipoTier" value={tipoTier} onChange={e => setTipoTier(e.target.value)}>
        <option value="Credenciador Tier 1">Credenciador Tier 1</option>
        <option value="Credenciador Tier 2">Credenciador Tier 2</option>
        {/* Outros tipos */}
      </select>

      <label htmlFor="inteligenciaArtificial">Adicionar Inteligência Artificial:</label>
      <select id="inteligenciaArtificial" value={inteligenciaArtificial} onChange={e => setInteligenciaArtificial(e.target.value)}>
        <option value="nao">Não</option>
        <option value="sim">Sim</option>
      </select>

      <label htmlFor="numCustomizacoes">Número de Customizações:</label>
      <select id="numCustomizacoes" value={numCustomizacoes} onChange={e => setNumCustomizacoes(e.target.value)}>
        <option value="0">0</option>
        <option value="1">1</option>
        {/* Outros valores */}
      </select>

      <label htmlFor="numUsuarios">Quantidade de Usuários:</label>
      <select id="numUsuarios" value={numUsuarios} onChange={e => setNumUsuarios(parseInt(e.target.value))}>
        <option value="0">0</option>
        <option value="1">1</option>
        {/* Outros valores */}
      </select>

      <label htmlFor="dataEspecial">Datas Especiais:</label>
      <select id="dataEspecial" value={dataEspecial} onChange={e => setDataEspecial(e.target.value)}>
        <option value="0">Nenhuma</option>
        <option value="diaDasMaes">Semana do Dia das Mães</option>
        {/* Outros valores */}
      </select>

      {/* Tabela de resultados */}
      <table>
        <thead>
          <tr>
            <th>Período de Contrato</th>
            <th>Valor Mensal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>6 meses</td>
            <td>{preco6}</td>
          </tr>
          <tr>
            <td>12 meses</td>
            <td>{preco12}</td>
          </tr>
          <tr>
            <td>24 meses</td>
            <td>{preco24}</td>
          </tr>
          <tr>
            <td>36 meses</td>
            <td>{preco36}</td>
          </tr>
        </tbody>
      </table>

      <input
        type="text"
        id="nome"
        value={nome}
        placeholder="Digite o nome do parceiro"
        onChange={e => setNome(e.target.value)}
      />

      <button onClick={handleCalcularPreco}>Calcular Preço</button>
      <button onClick={handleGerarPDF}>Gerar PDF</button>
    </div>
  );
};

export default App;
