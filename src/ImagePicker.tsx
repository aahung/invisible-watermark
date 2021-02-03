import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const ImagePicker: React.FC<{ onSelect: (images: string[]) => void }> = ({
  onSelect,
}) => {
  const [fileList, setFileList] = useState<string[]>([]);

  const openSelectFilesDialog = () => {
    ipcRenderer.send('openSelectFilesDialog');
  };

  useEffect(() => {
    const handler = (_, arg: Electron.OpenDialogReturnValue) => {
      if (!arg.canceled) {
        setFileList(arg.filePaths);
      }
    };
    ipcRenderer.addListener('selectImages', handler);
    return () => {
      ipcRenderer.removeListener('selectImages', handler);
    };
  }, []);

  useEffect(() => {
    onSelect(fileList);
  }, [onSelect, fileList]);

  return (
    <div>
      <div
        onClick={openSelectFilesDialog}
        style={{ width: '100%', minHeight: '30vh', border: 'dashed 2px grey' }}
      >
        {fileList.map((file) => (
          <div style={{ whiteSpace: 'nowrap' }} key={file}>
            {file}
          </div>
        ))}
      </div>
      <div>
        <small>点击上方加入图片</small>
      </div>
      <Button onClick={() => setFileList([])}>清空</Button>
    </div>
  );
};

export default React.memo(ImagePicker);
