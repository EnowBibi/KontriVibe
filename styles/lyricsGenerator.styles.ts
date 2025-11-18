/*-----------------------------------------------------------------------------------------------------
| @blocktype lyricsGeneratorStyles
| @brief    StyleSheet definitions for LyricsGeneratorScreen component
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
    minHeight: 44,
  },
  largeInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
  generateButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  generateButtonDisabled: {
    backgroundColor: "#999",
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  errorContainer: {
    backgroundColor: "#fee",
    borderLeftWidth: 4,
    borderLeftColor: "#f66",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
  },
});

export default styles;
