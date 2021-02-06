import { ipcRenderer } from 'electron';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import QQList from './QQList';
import ImagePicker from './ImagePicker';

const Hello = () => {
  const [directory, setDirectory] = useState<string>(
    localStorage['output-dir'] || null
  );
  const [qqList, setQQList] = useState<string[]>(null);
  const [images, setImages] = useState<string[]>(null);

  // save output-dir
  useEffect(() => {
    localStorage['output-dir'] = directory;
  }, [directory]);

  useEffect(() => {
    const handler = (_, arg: Electron.OpenDialogReturnValue) => {
      if (!arg.canceled) {
        setDirectory(arg.filePaths[0]);
      }
    };
    ipcRenderer.addListener('selectDirectory', handler);
    return () => {
      ipcRenderer.removeListener('selectDirectory', handler);
    };
  }, []);

  useEffect(() => {
    const handler = (_, arg: string[]) => {
      alert(`${arg}`);
    };
    ipcRenderer.addListener('watermark-added', handler);
    return () => {
      ipcRenderer.removeListener('watermark-added', handler);
    };
  }, []);

  const openSelectDirectoryDialog = () => {
    ipcRenderer.send('openSelectDirectoryDialog');
  };

  const handleSelectImages = useCallback((images: string[]) => {
    setImages(images);
  }, []);

  const handleSelectQQs = useCallback((qqList: string[]) => {
    setQQList(qqList);
  }, []);

  const addWatermark = () => {
    ipcRenderer.send('addWatermark', {
      images,
      qqList,
      directory,
    });
  };

  return (
    <Container>
      <h1>加隐形水印</h1>
      <Row>
        <Col>
          <span>输出文件夹：{directory}</span>
          <Button size="sm" onClick={openSelectDirectoryDialog}>
            选择
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={4} md={4}>
          <QQList onSelectQQList={handleSelectQQs} />
        </Col>
        <Col xs={8} md={8}>
          <ImagePicker onSelect={handleSelectImages} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            disabled={!directory || !qqList || !images}
            onClick={addWatermark}
          >
            Run!
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
