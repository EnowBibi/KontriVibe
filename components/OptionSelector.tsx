/*-----------------------------------------------------------------------------------------------------
| @blocktype optionSelector
| @brief    Reusable component for selecting options with pill-style buttons
| @param    label: string, options: array, selectedOption: string, onSelect: function
| @return   React Native component
-----------------------------------------------------------------------------------------------------*/

import styles from "@/styles/optionSelector.styles";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface OptionSelectorProps<T extends string> {
  label: string;
  options: T[];
  selectedOption: T | null;
  onSelect: (option: T) => void;
}

export default function OptionSelector<T extends string>({
  label,
  options,
  selectedOption,
  onSelect,
}: OptionSelectorProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.optionsScroll}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedOption === option && styles.optionButtonSelected,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.optionTextSelected,
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
