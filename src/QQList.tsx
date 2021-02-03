import React, { useEffect, useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';

const QQItem: React.FC<{
  qq: string;
  onDelete?: () => void;
  selected: boolean;
  onSelect: (selected: boolean) => void;
}> = ({ qq, selected, onSelect, onDelete }) => {
  return (
    <ListGroup.Item
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        justifyItems: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', justifyItems: 'center' }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(!selected)}
        />
        <div>{qq}</div>
      </div>
      <Button size="sm" onClick={onDelete}>
        删除
      </Button>
    </ListGroup.Item>
  );
};

const QQList: React.FC<{
  onSelectQQList: (qqList: string[]) => void;
}> = ({ onSelectQQList }) => {
  const [qqList, setQQList] = useState<string[]>(
    JSON.parse(localStorage['qq-list'] || '[]')
  );

  const [selects, setSelects] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const selectedQQs = qqList.filter((qq) => selects[qq]);
    onSelectQQList(selectedQQs);
  }, [qqList, selects, onSelectQQList]);

  useEffect(() => {
    localStorage['qq-list'] = JSON.stringify(qqList);
  }, [qqList]);

  const [currentQQ, setCurrentQQ] = useState('');

  const onAdd = () => {
    if (!currentQQ) return;
    setQQList((list) => [...new Set([...list, currentQQ])]);
  };

  const onDelete = (qq: string) => {
    setQQList((qqList) => qqList.filter((_qq) => _qq !== qq));
  };

  return (
    <div>
      <div>
        <Form.Control
          type="text"
          placeholder="123456789"
          value={currentQQ}
          onChange={({ target: { value } }) => setCurrentQQ(value)}
        />
        <Button onClick={onAdd}>+</Button>
      </div>
      <ListGroup>
        {qqList.map((qq) => (
          <QQItem
            qq={qq}
            key={qq}
            onDelete={() => onDelete(qq)}
            selected={!!selects[qq]}
            onSelect={(selected) =>
              setSelects((s) => {
                return { ...s, [qq]: selected };
              })
            }
          />
        ))}
      </ListGroup>
    </div>
  );
};
export default React.memo(QQList);
