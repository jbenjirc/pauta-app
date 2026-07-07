import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { BloqueCalculado } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333333",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: { flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", color: "#111111" },
  subtitle: { fontSize: 11, color: "#666666", marginTop: 4 },
  logo: { width: 50, height: 50, objectFit: "contain" }, // Ajusta el tamaño de tu logo
  logoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
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

  // Tablas y Celdas Flex
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableRowHeader: { flexDirection: "row", backgroundColor: "#457b9d" }, // Color por defecto si falla el de bd
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  tableCellHeader: {
    margin: 6,
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 9,
  },
  tableCell: { margin: 6, fontSize: 9 },

  // Anchos Fijos
  wNo: { width: 30, textAlign: "center" },
  wHora: { width: 40 },
  wDur: { width: 35, textAlign: "center" },

  // Flex expandible
  flex1: { flex: 1 },
  flex2: { flex: 2 },
});

type OpcionesPDF = {
  formato: string;
  horizontal: boolean;
  incluirLogo: boolean;
  modoSimple: boolean;
};

type EscaletaPDFProps = {
  escaleta: any;
  bloques: BloqueCalculado[];
  opciones: OpcionesPDF;
};

export default function EscaletaPDF({
  escaleta,
  bloques,
  opciones,
}: EscaletaPDFProps) {
  // Lógica para mostrar columnas extras (Solo si modoSimple es falso Y la columna está activa en los ajustes)
  const showResponsable =
    !opciones.modoSimple && escaleta?.mostrar_col_responsable;
  const showRecursos = !opciones.modoSimple && escaleta?.mostrar_col_recursos;
  const showComentarios =
    !opciones.modoSimple && escaleta?.mostrar_col_comentarios;

  return (
    <Document>
      <Page
        // @ts-ignore (Tipado de react-pdf acepta strings válidos)
        size={opciones.formato}
        orientation={opciones.horizontal ? "landscape" : "portrait"}
        style={styles.page}
      >
        {/* Cabecera y Logo */}
        <View style={styles.headerContainer}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {escaleta?.titulo_programa || "Programa sin título"}
            </Text>
            <Text style={styles.subtitle}>
              {escaleta?.nombre_iglesia || "Nombre de Iglesia"}
            </Text>
          </View>

          {opciones.incluirLogo &&
            (escaleta?.logo_url ? (
              <Image src={escaleta.logo_url} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={{ fontSize: 8, color: "#9ca3af" }}>LOGO</Text>
              </View>
            ))}
        </View>

        {/* Metadatos */}
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
              <Text style={styles.bold}>Director Técnico: </Text>{" "}
              {escaleta?.director_tecnico || "---"}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Floor Manager: </Text>{" "}
              {escaleta?.floor_manager || "---"}
            </Text>
          </View>
        </View>

        {/* Tabla Dinámica */}
        <View style={styles.table}>
          {/* Header Row */}
          <View
            style={[
              styles.tableRowHeader,
              { backgroundColor: escaleta?.color_escaleta || "#457b9d" },
            ]}
          >
            <Text style={[styles.tableCellHeader, styles.wNo]}>No.</Text>
            <Text style={[styles.tableCellHeader, styles.wHora]}>Inicio</Text>
            <Text style={[styles.tableCellHeader, styles.wHora]}>Fin</Text>
            <Text style={[styles.tableCellHeader, styles.wDur]}>Dur</Text>
            <Text style={[styles.tableCellHeader, styles.flex2]}>
              Actividad
            </Text>
            <Text style={[styles.tableCellHeader, styles.flex1]}>
              Participante
            </Text>
            <Text style={[styles.tableCellHeader, styles.flex1]}>Notas</Text>

            {showResponsable && (
              <Text style={[styles.tableCellHeader, styles.flex1]}>
                Técnico
              </Text>
            )}
            {showRecursos && (
              <Text style={[styles.tableCellHeader, styles.flex1]}>
                Recursos
              </Text>
            )}
            {showComentarios && (
              <Text style={[styles.tableCellHeader, styles.flex1]}>Cabina</Text>
            )}
          </View>

          {/* Rows */}
          {bloques.map((bloque, index) => (
            <View key={bloque.id} style={styles.tableRow}>
              <Text
                style={[styles.tableCell, styles.wNo, { color: "#9ca3af" }]}
              >
                {index + 1}
              </Text>
              <Text
                style={[styles.tableCell, styles.wHora, { fontWeight: "bold" }]}
              >
                {bloque.horaInicioFormat}
              </Text>
              <Text
                style={[styles.tableCell, styles.wHora, { color: "#4b5563" }]}
              >
                {bloque.horaFinFormat}
              </Text>
              <Text style={[styles.tableCell, styles.wDur]}>
                {bloque.duracion}m
              </Text>
              <Text
                style={[styles.tableCell, styles.flex2, { fontWeight: "bold" }]}
              >
                {bloque.actividad || "-"}
              </Text>
              <Text style={[styles.tableCell, styles.flex1]}>
                {bloque.participante || "-"}
              </Text>
              <Text
                style={[styles.tableCell, styles.flex1, { color: "#6b7280" }]}
              >
                {bloque.notas_bloque || "-"}
              </Text>

              {showResponsable && (
                <Text style={[styles.tableCell, styles.flex1]}>
                  {bloque.responsable_tecnico || "-"}
                </Text>
              )}
              {showRecursos && (
                <Text
                  style={[styles.tableCell, styles.flex1, { color: "#457b9d" }]}
                >
                  {bloque.recursos_drive_url || "-"}
                </Text>
              )}
              {showComentarios && (
                <Text
                  style={[styles.tableCell, styles.flex1, { color: "#e63946" }]}
                >
                  {bloque.comentarios_cabina || "-"}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
