

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

export default App;
