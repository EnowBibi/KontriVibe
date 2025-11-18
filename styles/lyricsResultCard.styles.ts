/*-----------------------------------------------------------------------------------------------------
| @blocktype lyricsResultCardStyles
| @brief    StyleSheet definitions for LyricsResultCard component
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  metadataSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  metadataItem: {
    flex: 1,
    marginRight: 12,
  },
  metadataLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  lyricsContainer: {
    maxHeight: 300,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  lyricsText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    fontWeight: "400",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    marginTop: 4,
  },
});

export default styles;
