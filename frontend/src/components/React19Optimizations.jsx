// React 19 Optimizations Demo
import React, {
  useState,
  useId,
  useTransition,
  useDeferredValue,
  useMemo,
  useCallback,
} from 'react';
import { Button, Input, Card, Space, Typography, List, Spin } from 'antd';

const { Title, Text } = Typography;

// 1. React Compiler - Tự động tối ưu (không cần thay đổi code)
// React 19 sẽ tự động tối ưu các component này

// 2. useId Hook - Tạo unique ID
export const UseIdExample = () => {
  const id = useId();
  const emailId = useId();
  const passwordId = useId();

  return (
    <Card title='useId Hook Demo' style={{ marginBottom: 16 }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <div>
          <label htmlFor={emailId}>Email:</label>
          <Input id={emailId} placeholder='Enter email' />
        </div>
        <div>
          <label htmlFor={passwordId}>Password:</label>
          <Input.Password id={passwordId} placeholder='Enter password' />
        </div>
        <Text type='secondary'>Generated ID: {id}</Text>
      </Space>
    </Card>
  );
};

// 3. useTransition Hook - Xử lý non-urgent updates
export const UseTransitionExample = () => {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);

  const handleUpdate = () => {
    // Urgent update
    setCount(c => c + 1);

    // Non-urgent update (sẽ được transition)
    startTransition(() => {
      const newList = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);
      setList(newList);
    });
  };

  return (
    <Card title='useTransition Hook Demo' style={{ marginBottom: 16 }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Button onClick={handleUpdate} loading={isPending}>
          Update Count: {count}
        </Button>
        {isPending && <Spin size='small' />}
        <List
          size='small'
          dataSource={list.slice(0, 10)}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Space>
    </Card>
  );
};

// 4. useDeferredValue Hook - Defer non-urgent updates
export const UseDeferredValueExample = () => {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  // Expensive computation
  const expensiveList = useMemo(() => {
    return Array.from(
      { length: 1000 },
      (_, i) => `Filtered: ${deferredText} - Item ${i + 1}`
    ).filter(item => item.includes(deferredText));
  }, [deferredText]);

  return (
    <Card title='useDeferredValue Hook Demo' style={{ marginBottom: 16 }}>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Type to filter...'
        />
        <Text type='secondary'>
          Current: {text} | Deferred: {deferredText}
        </Text>
        <List
          size='small'
          dataSource={expensiveList.slice(0, 5)}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Space>
    </Card>
  );
};

// 5. Optimized Components với React 19
export const OptimizedComponent = React.memo(({ data, onUpdate }) => {
  const handleClick = useCallback(() => {
    onUpdate(data.id);
  }, [data.id, onUpdate]);

  return (
    <Card size='small' style={{ marginBottom: 8 }}>
      <Space>
        <Text>{data.name}</Text>
        <Button size='small' onClick={handleClick}>
          Update
        </Button>
      </Space>
    </Card>
  );
});

// 6. Main Demo Component
export const React19FeaturesDemo = () => {
  const [data, setData] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

  const handleUpdate = useCallback(id => {
    setData(prev =>
      prev.map(item => (item.id === id ? { ...item, name: `${item.name} (Updated)` } : item))
    );
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <Title level={2}>React 19 Features Demo</Title>

      <UseIdExample />
      <UseTransitionExample />
      <UseDeferredValueExample />

      <Card title='Optimized Components Demo'>
        <Space direction='vertical' style={{ width: '100%' }}>
          {data.map(item => (
            <OptimizedComponent key={item.id} data={item} onUpdate={handleUpdate} />
          ))}
        </Space>
      </Card>
    </div>
  );
};
