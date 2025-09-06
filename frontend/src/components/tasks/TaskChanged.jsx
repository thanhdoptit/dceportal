import { Tag, Typography } from 'antd';

import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getStatusText } from '../../constants/taskStatus';
import { processFileName } from '../../utils/VietnameseFile';
const { Title, Text } = Typography;

// Component hiển thị thay đổi trạng thái
export const StatusChangeContent = ({ change }) => {
  const parseValue = value => {
    try {
      return value ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Tag color='blue'>Trạng thái</Tag>
      <Text type='secondary'>•</Text>
      <Text>{getStatusText(parseValue(change.oldValue))}</Text>
      <Text type='secondary'>→</Text>
      <Text>{getStatusText(parseValue(change.newValue))}</Text>
    </div>
  );
};

// Component hiển thị thay đổi thời gian
export const TimeChangeContent = ({ change }) => {
  const formatTimeValue = value => {
    if (!value) return 'Chưa có';
    try {
      return dayjs(value).format('HH:mm DD/MM/YYYY');
    } catch {
      return value;
    }
  };

  const timeLabel =
    change.field === 'checkInTime'
      ? 'Thời gian bắt đầu'
      : change.field === 'checkOutTime'
        ? 'Thời gian kết thúc'
        : 'Thời gian';

  return (
    <div className='flex items-center gap-2'>
      <Tag color='green'>{timeLabel}</Tag>
      <Text type='secondary'>•</Text>
      <Text>{formatTimeValue(change.oldValue)}</Text>
      <Text type='secondary'>→</Text>
      <Text>{formatTimeValue(change.newValue)}</Text>
    </div>
  );
};

// Component hiển thị thay đổi nhân sự
export const WorkerChangeContent = ({ change }) => {
  // Parse mảng label từ oldValue/newValue, luôn trả về mảng
  const safeParseArray = value => {
    try {
      const arr = value ? JSON.parse(value) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const oldLabels = safeParseArray(change.oldValue);
  const newLabels = safeParseArray(change.newValue);

  // Nếu là xóa nhân sự (oldValue có, newValue null)
  if (oldLabels.length > 0 && !change.newValue) {
    return (
      <div className='flex flex-row gap-1'>
        <Tag color='purple'>Nhân sự</Tag>
        <span style={{ color: 'red' }}> Xóa: {oldLabels.join(', ')}</span>
      </div>
    );
  }

  // Nếu là thêm nhân sự (oldValue rỗng, newValue có)
  if ((!change.oldValue || oldLabels.length === 0) && newLabels.length > 0) {
    return (
      <div className='flex flex-row gap-1'>
        <Tag color='purple'>Nhân sự</Tag>
        <span style={{ color: 'green' }}>Thêm: {newLabels.join(', ')}</span>
      </div>
    );
  }

  // Nếu là cập nhật danh sách (cả hai đều là mảng)
  const added = newLabels.filter(x => !oldLabels.includes(x));
  const removed = oldLabels.filter(x => !newLabels.includes(x));

  return (
    <div className='flex flex-row gap-1'>
      <Tag color='purple'>Nhân sự</Tag>
      {added.length > 0 && (
        <div>
          <span style={{ color: 'green' }}>Thêm: {added.join(', ')}</span>
        </div>
      )}
      {removed.length > 0 && (
        <div>
          <span style={{ color: 'red' }}> Xóa: {removed.join(', ')}</span>
        </div>
      )}
      {added.length === 0 && removed.length === 0 && (
        <div>
          <span>Không thay đổi</span>
        </div>
      )}
    </div>
  );
};

// Component hiển thị thay đổi file đính kèm
export const AttachmentChangeContent = ({ change }) => {
  return (
    <div className='flex items-center gap-2'>
      <Tag color='orange'>File đính kèm</Tag>
      <Text type='secondary'>•</Text>
      {change.oldValue && (
        <Text type='danger'>
          <MinusCircleOutlined /> {processFileName(change.oldValue)}
        </Text>
      )}
      {change.newValue && (
        <Text type='success'>
          <PlusCircleOutlined /> {processFileName(change.newValue)}
        </Text>
      )}
    </div>
  );
};

// Component hiển thị thay đổi nội dung
/*const ContentChangeContent = ({ change }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Tag color="cyan">Nội dung</Tag>
      </div>
      <div className="pl-2 border-l-2 border-gray-200">
        <Text type="primary" className="text-sm">Từ: {change.oldValue || 'Không có'}</Text>
        <br />
        <Text type="primary" className="text-sm">Sang: {change.newValue || 'Không có'}</Text>
      </div>
    </div>
  );
};*/
