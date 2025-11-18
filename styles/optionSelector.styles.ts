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
    color: "#FFFFFF",
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
    backgroundColor: "#1a3a2a",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#FF6B35",
  },
  optionButtonSelected: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
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
