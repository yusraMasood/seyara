import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SOLID_COLORS, themeShadow } from '../../utils/appTheme';
import { vh, vw } from '../../utils/dimensions';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

const ColorPickerModal: React.FC<Props> = ({ visible, onClose, onSelectColor }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pick a Color</Text>

          {/* Solid colors */}
          <FlatList
            data={SOLID_COLORS}
            numColumns={7}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: item }]}
                onPress={() => onSelectColor(item)}
              />
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal;

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: "center",
    padding: 16,
    ...themeShadow,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  colorOption: {
    width: vw * 9,
    height: vw * 9,
    borderRadius: vw * 6,
    margin: vw * 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  gradientOption: {
    width: vw * 30,
    height: vh * 6,
    borderRadius: 8,
    margin: vw * 2,
  },
  closeBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: vh * 1.5,
    paddingHorizontal: vw * 4,
    marginTop: 12,
  },
  closeBtnText: { color: 'white', fontWeight: '600', textAlign: 'center' },
});
