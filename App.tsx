
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { requestStoragePermission } from './src/utils/helpers';
import RichTextEditorScreen from './src/component/TextEditor/ RichTextEditorScreen';

function App() {


  const getPermissions = async () => {
    await requestStoragePermission()

  }
  useEffect(() => {
    getPermissions()
  }, [])

  return (
    <RichTextEditorScreen />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
