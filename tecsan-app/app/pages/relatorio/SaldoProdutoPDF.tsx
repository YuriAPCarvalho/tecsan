import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

interface SaldoProdutoItem {
  produto: {
    nome: string;
  };
  categoria: {
    nome: string;
  };
  estoque: {
    nome: string;
  };
  fazenda: {
    nome: string;
  };
  saldo: number;
  updatedAt: string;
}

interface SaldoProdutoPDFProps {
  saldos: SaldoProdutoItem[];
  filters: {
    categoria?: string;
    fazenda?: string;
    estoque?: string;
    produto?: string;
  };
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontSize: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    textAlign: "center",
    fontSize: 8,
  },
  headerCell: {
    backgroundColor: "#f4f4f4",
    fontSize: 10,
    fontWeight: "bold",
  },
  cellProduto: {
    width: "30%",
  },
  cellEstoque: {
    width: "22%",
  },
  cellCategoria: {
    width: "22%",
  },
  cellFazenda: {
    width: "20%",
  },
  cellSaldo: {
    width: "10%",
  },
  cellAtualizacao: {
    width: "16%",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
  },
});

const SaldoProdutoPDF: React.FC<SaldoProdutoPDFProps> = ({
  saldos,
  filters,
}) => {
  const pages = Math.ceil(saldos.length / 20);

  return (
    <Document>
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <Page style={styles.page} key={pageIndex} size="A4">
          <View style={styles.header}>
            <Text style={styles.title}>STOK - Inventário</Text>
            <Text style={styles.headerText}>
              Relatório de Saldo de Produtos
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Filtros: Categoria: {filters.categoria || "Todos"}, Estoque:{" "}
              {filters.estoque || "Todos"}, Fazenda:{" "}
              {filters.fazenda || "Todas"}, Produto:{" "}
              {filters.produto || "Todos"}
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              Data e Hora da Impressão: {new Date().toLocaleString("pt-BR")}
            </Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.cellSaldo, styles.headerCell]}
              >
                QUANT
              </Text>
              <Text
                style={[styles.tableCell, styles.cellSaldo, styles.headerCell]}
              >
                EXIST
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellProduto,
                  styles.headerCell,
                ]}
              >
                MATERIAL
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellCategoria,
                  styles.headerCell,
                ]}
              >
                CATEGORIA
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellEstoque,
                  styles.headerCell,
                ]}
              >
                ESTOQUE
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellFazenda,
                  styles.headerCell,
                ]}
              >
                FAZENDA
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.cellAtualizacao,
                  styles.headerCell,
                ]}
              >
                DATA
              </Text>
            </View>
            {saldos
              .slice(pageIndex * 20, (pageIndex + 1) * 20)
              .map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={[styles.tableCell, styles.cellSaldo]}>
                    {item.saldo}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellSaldo]}>
                    {null}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellProduto]}>
                    {item.produto.nome}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellCategoria]}>
                    {item.categoria.nome}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellEstoque]}>
                    {item.estoque.nome}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellFazenda]}>
                    {item.fazenda.nome}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellAtualizacao]}>
                    {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
              ))}
          </View>
          <View style={styles.footer}>
            <Text>Quantidade de Páginas</Text>
            <Text>
              {pageIndex + 1} de {pages}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default SaldoProdutoPDF;
