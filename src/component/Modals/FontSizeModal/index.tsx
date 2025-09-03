import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { colors } from "../../../utils/appTheme";
import { vw } from "../../../utils/dimensions";


const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

export default function FontSizePickerModal({ visible, onClose, onSelectSize }: any) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select Font Size</Text>
          <FlatList
            data={FONT_SIZES}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelectSize(item);
                  onClose();
                }}
              >
                <Text style={{ fontSize: item, color: colors.black }}>{item}px</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: colors.white }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: vw * 80,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: colors.black },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: colors.black,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
