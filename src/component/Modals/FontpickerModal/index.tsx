import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { themeShadow } from '../../../utils/appTheme';
import { vh } from '../../../utils/dimensions';
import { fonts } from '../../../assets/fonts';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectFont: (fontName: string) => void;
}

// Custom fonts array for pell editor
const customFonts = [
  {
    fontName: fonts.asameer.regular,
    style: `@font-face {
      font-family: '${fonts.asameer.regular}';
      src: url('/assets/fonts/AA-Sameer-Almas-Regular.woff2') format('woff2'),
           url('/assets/fonts/AA-Sameer-Almas-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }`,
  },
  {
    fontName: fonts.alvi.regular,
    style: `@font-face {
      font-family: '${fonts.alvi.regular}';
      src: url('/assets/fonts/Alvi-Nastaleeq-Regular.woff2') format('woff2'),
           url('/assets/fonts/Alvi-Nastaleeq-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }`,
  },
  {
    fontName: fonts.faiz.regular,
    style: `@font-face {
      font-family: '${fonts.faiz.regular}';
      src: url('/assets/fonts/Faiz-Lahori-Nastaleeq-Regular.woff2') format('woff2'),
           url('/assets/fonts/Faiz-Lahori-Nastaleeq-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }`,
  },
  {
    fontName: fonts.jameel.regular,
    style: `@font-face {
      font-family: '${fonts.jameel.regular}';
      src: url('/assets/fonts/Jameel-Noori-Nastaleeq-Kasheeda.woff2') format('woff2'),
           url('/assets/fonts/Jameel-Noori-Nastaleeq-Kasheeda.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }`,
  },
  {
    fontName: fonts.nafees.regular,
    style: `@font-face {
      font-family: '${fonts.nafees.regular}';
      src: url('/assets/fonts/Nafees-Regular.woff2') format('woff2'),
           url('/assets/fonts/Nafees-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }`,
  },
  {
    fontName: fonts.pak.regular,
    style: `@font-face {
      font-family: '${fonts.pak.regular}';
      src: url('/assets/fonts/Pak-Nastaleeq-Regular.woff2') format('woff2'),
           url('/assets/fonts/Pak-Nastaleeq-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }`,
  },
];

export default function FontPickerModal({
  visible,
  onClose,
  onSelectFont,
}: Props) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Choose Font Family</Text>
          <ScrollView>
            {customFonts.map((font, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => {
                  onSelectFont(font.fontName);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, { fontFamily: font.fontName }]}>
                  {font.fontName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    maxHeight: vh * 60,
    ...themeShadow,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  option: {
    paddingVertical: vh * 1.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: { fontSize: 18 },
  closeBtn: { marginTop: 12, alignSelf: 'flex-end' },
  closeText: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
});
