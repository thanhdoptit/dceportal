import { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ShiftRow = memo(({ shift, style, onExpand, isExpanded }) => {
  const getStatusColor = status => {
    switch (status) {
      case 'doing':
        return 'bg-green-100 text-green-800';
      case 'handover':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'doing':
        return 'Đang làm việc';
      case 'handover':
        return 'Đang bàn giao';
      case 'done':
        return 'Đã kết thúc';
      default:
        return 'Chưa bắt đầu';
    }
  };

  const renderUsers = shift => {
    if (shift.status === 'done') {
      return shift.workedUsers?.length
        ? `Đã làm: ${shift.workedUsers.map(u => u.fullname).join(', ')}`
        : 'Không có thông tin';
    }
    return shift.Users?.length
      ? `Thành viên: ${shift.Users.map(u => u.fullname).join(', ')}`
      : 'Chưa có thành viên';
  };

  return (
    <div style={style} className='hover:bg-gray-50 border-b border-gray-200'>
      <div className='grid grid-cols-4 gap-4 p-4'>
        {/* Mã ca và ngày */}
        <div className='flex items-center space-x-2'>
          <span className='font-medium text-gray-900'>{shift.code}</span>
          <span className='text-gray-500'>-</span>
          <span className='text-gray-600'>
            {format(new Date(shift.date), 'dd/MM/yyyy', { locale: vi })}
          </span>
        </div>

        {/* Thành viên */}
        <div className='text-sm text-gray-600 truncate'>{renderUsers(shift)}</div>

        {/* Trạng thái */}
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}
          >
            {getStatusText(shift.status)}
          </span>
        </div>

        {/* Nội dung và nút mở rộng */}
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600 truncate pr-4'>
            {shift.description || 'Chưa có nội dung công việc'}
          </div>
          <button onClick={() => onExpand(shift.id)} className='text-blue-600 hover:text-blue-800'>
            <svg
              className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className='border-t border-gray-100 bg-gray-50 p-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='font-medium text-gray-700 mb-2'>Chi tiết công việc</h4>
              <p className='text-sm text-gray-600'>
                {shift.detailedDescription || 'Chưa có chi tiết công việc'}
              </p>
            </div>
            <div>
              <h4 className='font-medium text-gray-700 mb-2'>Lịch sử tham gia</h4>
              <div className='text-sm text-gray-600'>
                {(shift.workedUsers || []).map(user => user.fullname).join(', ') ||
                  'Chưa có lịch sử'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const VirtualizedShiftList = ({ shifts, hasMore, loadMore, expandedShift, onExpandShift }) => {
  const itemCount = hasMore ? shifts.length + 1 : shifts.length;
  const loadMoreItems = loading => {
    if (!loading) loadMore();
  };
  const isItemLoaded = index => !hasMore || index < shifts.length;

  const Row = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style} className='flex items-center justify-center p-4'>
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
        </div>
      );
    }

    const shift = shifts[index];
    return (
      <ShiftRow
        shift={shift}
        style={style}
        onExpand={onExpandShift}
        isExpanded={expandedShift === shift.id}
      />
    );
  };

  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
      {({ onItemsRendered, ref }) => (
        <List
          ref={ref}
          onItemsRendered={onItemsRendered}
          height={600}
          itemCount={itemCount}
          itemSize={100}
          width='100%'
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default memo(VirtualizedShiftList);
