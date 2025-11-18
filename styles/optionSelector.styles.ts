/*-----------------------------------------------------------------------------------------------------
| @blocktype optionSelectorStyles
| @brief    StyleSheet definitions for OptionSelector component
| @param    --
| @return   --
-----------------------------------------------------------------------------------------------------*/

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  optionsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  optionButtonSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  optionTextSelected: {
    color: "#ffffff",
  },
});

export default styles;
