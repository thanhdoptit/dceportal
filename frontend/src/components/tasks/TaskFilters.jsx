import { Card, Col, DatePicker, Row, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { STATUS_LABELS } from '../../constants/taskStatus';
import LocationSelect from '../common/LocationSelect';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function TaskFilters({
  filters = {},
  setFilters,
  filterLoading = {},
  locations = [],
  locationsLoading = false,
  locationsError = null,
  onSearchChange,
  searchLoading = false,
}) {
  // console.log('TaskFilters render:', { filters, locations: locations.length, locationsLoading, locationsError }); // Tắt debug log

  const handleChange = useCallback(
    (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    e => {
      const searchText = e.target.value;
      // Sử dụng debounced search nếu có, ngược lại dùng handleChange
      if (onSearchChange) {
        onSearchChange(searchText);
      } else {
        handleChange('search', searchText);
      }
    },
    [onSearchChange, handleChange]
  );

  const handleSearchClear = useCallback(() => {
    // Xử lý khi click nút clear
    if (onSearchChange) {
      onSearchChange('');
    } else {
      handleChange('search', '');
    }
  }, [onSearchChange, handleChange]);

  const handleDateChange = dates => {
    if (dates && dates[0] && dates[1]) {
      const diffDays = dates[1].diff(dates[0], 'days');
      if (diffDays > 90) return;
    }
    handleChange('dateRange', dates);
  };

  // Use provided statusLabels or fallback to default
  const statusLabels = filters.statusLabels || STATUS_LABELS;

  return (
    <Card style={{ marginBottom: '24px' }}>
      <Row gutter={16} align='middle'>
        {/* <Col>
          <Text strong>Tìm kiếm:</Text>
        </Col>
        <Col>
          <Input
            placeholder="Tìm kiếm theo nội dung công việc..."
            prefix={searchLoading ? <LoadingOutlined /> : <SearchOutlined />}
            value={filters.search || ''}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            style={{ width: 250 }}
            allowClear
            loading={searchLoading || undefined}
          />
        </Col> */}
        <Col>
          <Text strong>Trạng thái:</Text>
        </Col>
        <Col>
          <Select
            style={{ width: 180 }}
            placeholder='Chọn trạng thái'
            value={filters.status || undefined}
            onChange={value => handleChange('status', value)}
            loading={filterLoading.status}
          >
            <Option value=''>Tất cả</Option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text strong>Địa điểm:</Text>
        </Col>
        <Col>
          <LocationSelect
            style={{ width: 180 }}
            placeholder='Chọn địa điểm'
            value={filters.location || undefined}
            onChange={value => {
              console.log('Location filter changed:', value);
              handleChange('location', value);
            }}
            onError={error => {
              console.error('Error loading locations in filter:', error);
            }}
            locations={locations}
            locationsLoading={locationsLoading}
            locationsError={locationsError}
          />
        </Col>
        <Col>
          <Text strong>Thời gian:</Text>
        </Col>
        <Col>
          <Select
            style={{ width: 180 }}
            placeholder='Chọn loại thời gian'
            value={filters.dateField || undefined}
            onChange={value => handleChange('dateField', value)}
            allowClear
          >
            <Option value='checkInTime'>Thời gian bắt đầu</Option>
            <Option value='checkOutTime'>Thời gian kết thúc</Option>
            <Option value='createdAt'>Ngày tạo</Option>
          </Select>
        </Col>
        <Col>
          <RangePicker
            format='DD/MM/YYYY'
            value={filters.dateRange}
            onChange={handleDateChange}
            disabledDate={current => current && current > dayjs().endOf('day')}
            placeholder={['Từ ngày', 'Đến ngày']}
            style={{ width: 300 }}
          />
        </Col>
      </Row>
    </Card>
  );
}

TaskFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string,
    dateField: PropTypes.string,
    dateRange: PropTypes.array,
    statusLabels: PropTypes.object,
    location: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    search: PropTypes.string,
  }),
  setFilters: PropTypes.func.isRequired,
  filterLoading: PropTypes.shape({
    status: PropTypes.bool,
  }),
  searchLoading: PropTypes.bool,
  locations: PropTypes.array,
  locationsLoading: PropTypes.bool,
  locationsError: PropTypes.string,
  onSearchChange: PropTypes.func,
};
