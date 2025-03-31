import { Document, Image, Page, PDFDownloadLink, PDFViewer, Text, View } from "@react-pdf/renderer";
import { styles } from "./style";

import logo from '../../imagens/logo.png'

type ItemType = {
    id: number;
    name: string;
    price: string;
};

export function Invoice() {
    // Definição dinâmica das colunas
    const columns = [
        { key: "id", label: "Tipo" },
        { key: "name", label: "Período de Contrato" },
        { key: "price", label: "Valor Mensal" },
    ];

    // Dados fictícios
    const data = [
        { id: 1, name: "6 meses", price: "R$ 50,00" },
        { id: 2, name: "12 meses", price: "R$ 50,00" },
        { id: 3, name: "24 meses", price: "R$ 50,00" },
        { id: 4, name: "36 meses", price: "R$ 50,00" },
    ];

    const InvoicePDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerPdf}>
                    <View style={styles.profileLogo}>
                        <Image src={logo} style={styles.logo} />
                        <Text>Relatório de preços</Text>
                    </View>
                    <View style={styles.spaceY}>
                        <Text style={styles.textBold}>Elo Serviços S.A.</Text>
                        <Text>Alameda Xingu, 512, 5° e 6º andares</Text>
                        <Text>Alphaville, Barueri, SP, 06.455-030</Text>
                    </View>
                </View>

                <View style={styles.spaceX}>
                    <Text style={styles.title}>Olá Aline</Text>
                    <Text>
                        Segue as informações em PDF do relatório referente aos
                        modulo selecionado na calculadora de preços da Elo.
                    </Text>
                </View>

                {/* Informação do módulo */}
                <View style={styles.spaceX}>
                    <Text style={[styles.billTo, styles.textBold]}>Detalhes:</Text>

                    <View style={styles.info}>
                        <Text>Módulo Selecionado:</Text>
                        <Text>Advice Stand In</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>Tipo e Tier:</Text>
                        <Text>Credenciador Tier 1</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>Inteligência Artificial:</Text>
                        <Text>Não</Text>
                    </View>

                    <View style={styles.info}>
                        <Text>Número de Customizações:</Text>
                        <Text>0</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>Quantidade de Usuários:</Text>
                        <Text>0</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>Datas Especiais:</Text>
                        <Text>0</Text>
                    </View>
                </View>

                {/* Render the table*/}
                <View style={styles.table}>
                    {/* Cabeçalho dinâmico */}
                    <View style={[styles.row, styles.header]}>
                        {columns.map((col) => (
                            <Text key={col.key} style={[styles.cell, styles.boldText]}>
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {/* Linhas da tabela */}
                    {data.map((item, index) => (
                        <View key={item.id} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.row]}>
                            {columns.map((col) => (
                                <Text key={col.key} style={styles.cell}>
                                    {item[col.key as keyof ItemType]}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Rodapé */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 Elo Serviços S.A.</Text>       
                </View>
            </Page>
        </Document>
    );
    return (
        <>
            <div style={{ width: "100%", height: "750px", display: 'flex' }}>
                <PDFViewer width="100%" height="100%">
                    <InvoicePDF />
                </PDFViewer>

                <PDFDownloadLink document={<InvoicePDF />} fileName="modulo_selecionado.pdf">
                    {({ loading }) => (loading ? "Gerando PDF..." : "Baixar PDF")}
                </PDFDownloadLink>
            </div>
        </>
    )
}