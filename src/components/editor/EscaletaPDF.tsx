import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { BloqueCalculado } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333333",
  },
  header: { marginBottom: 20, textAlign: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#111111" },
  subtitle: { fontSize: 11, color: "#666666", marginTop: 4 },
  metaContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    padding: 10,
    marginBottom: 20,
    borderRadius: 6,
  },
  metaColumn: { flex: 1, gap: 4 },
  metaText: { fontSize: 9, color: "#4b5563" },
  bold: { fontWeight: "bold", color: "#111111" },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableRowHeader: { flexDirection: "row", backgroundColor: "#f97316" }, // Naranja
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCellHeader: {
    margin: 6,
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 9,
  },
  tableCell: { margin: 6, fontSize: 9 },
  colNo: { width: "5%" },
  colHora: { width: "10%" },
  colDur: { width: "10%" },
  colActividad: { width: "25%" },
  colParticipante: { width: "25%" },
  colRecursos: { width: "25%" },
});

type EscaletaPDFProps = {
  escaleta: any; // Recibimos toda la escaleta para los títulos
  bloques: BloqueCalculado[];
};

export default function EscaletaPDF({ escaleta, bloques }: EscaletaPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {escaleta?.titulo_programa || "Programa sin título"}
          </Text>
          <Text style={styles.subtitle}>
            {escaleta?.nombre_iglesia || "Iglesia"}
          </Text>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaColumn}>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Inicio del Programa: </Text>{" "}
              {escaleta?.hora_inicio_programa} hrs
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Fecha: </Text>{" "}
              {escaleta?.fecha_programa || "---"}
            </Text>
          </View>
          <View style={styles.metaColumn}>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Estado: </Text>{" "}
              {escaleta?.estado || "Activo"}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text
              style={[
                styles.tableCellHeader,
                styles.colNo,
                { textAlign: "center" },
              ]}
            >
              No.
            </Text>
            <Text style={[styles.tableCellHeader, styles.colHora]}>Inicio</Text>
            <Text style={[styles.tableCellHeader, styles.colHora]}>Fin</Text>
            <Text
              style={[
                styles.tableCellHeader,
                styles.colDur,
                { textAlign: "center" },
              ]}
            >
              Dur
            </Text>
            <Text style={[styles.tableCellHeader, styles.colActividad]}>
              Actividad
            </Text>
            <Text style={[styles.tableCellHeader, styles.colParticipante]}>
              Participante
            </Text>
            <Text style={[styles.tableCellHeader, styles.colRecursos]}>
              Recursos / Notas
            </Text>
          </View>

          {bloques.map((bloque, index) => (
            <View key={bloque.id} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  styles.colNo,
                  { textAlign: "center", color: "#9ca3af" },
                ]}
              >
                {index + 1}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colHora,
                  { fontWeight: "bold" },
                ]}
              >
                {bloque.horaInicioFormat}
              </Text>
              <Text
                style={[styles.tableCell, styles.colHora, { color: "#4b5563" }]}
              >
                {bloque.horaFinFormat}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colDur,
                  { textAlign: "center" },
                ]}
              >
                {bloque.duracion} min
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colActividad,
                  { fontWeight: "bold" },
                ]}
              >
                {bloque.actividad || "---"}
              </Text>
              <Text style={[styles.tableCell, styles.colParticipante]}>
                {bloque.participante || "---"}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colRecursos,
                  { color: "#4b5563" },
                ]}
              >
                {bloque.recursos || "---"}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
