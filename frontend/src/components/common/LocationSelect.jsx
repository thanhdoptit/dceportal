import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const LocationSelect = ({
  value,
  onChange,
  placeholder = "Chọn địa điểm",
  style = { width: '100%' },
  disabled = false,
  allowClear = true,
  showSearch = true,
  activeOnly = false,
  multiple = false,
  loading = false,
  locations = [],
  locationsLoading = false,
  locationsError = null,
  onError = null,
  onSuccess = null,
  showAllOption = false,
  allOptionLabel = "Tất cả",
  ...props
}) => {
  // console.log('LocationSelect render:', { value, locations: locations.length, locationsLoading }); // Tắt debug log

  // Xử lý lỗi nếu có
  React.useEffect(() => {
    if (locationsError && onError) {
      onError(locationsError);
    }
  }, [locationsError, onError]);

  // Lọc locations theo activeOnly nếu cần
  const filteredLocations = activeOnly ? locations.filter(loc => loc.isActive) : locations;

  // Sắp xếp locations theo tên
  const sortedLocations = [...filteredLocations].sort((a, b) =>
    a.name.localeCompare(b.name, 'vi')
  );

  const handleChange = (newValue) => {
    // console.log('LocationSelect onChange:', newValue); // Tắt debug log
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      style={style}
      disabled={disabled || locationsLoading}
      allowClear={allowClear}
      mode={multiple ? 'multiple' : undefined}
      loading={loading || locationsLoading}
      notFoundContent={
        locationsLoading ? (
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Spin size="small" />
          </div>
        ) : locationsError ? (
          <div style={{ textAlign: 'center', padding: '8px', color: '#ff4d4f' }}>
            Lỗi tải dữ liệu
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px', color: '#999' }}>
            Không có dữ liệu
          </div>
        )
      }
      {...props}
    >
      {showAllOption && (
        <Option value="Tất cả">
          {allOptionLabel}
        </Option>
      )}
      {sortedLocations.map(location => (
        <Option
          key={location.id}
          value={location.id}
        >
          {location.name}
        </Option>
      ))}
    </Select>
  );
};

LocationSelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  showSearch: PropTypes.bool,
  activeOnly: PropTypes.bool,
  multiple: PropTypes.bool,
  loading: PropTypes.bool,
  locations: PropTypes.array,
  locationsLoading: PropTypes.bool,
  locationsError: PropTypes.string,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
  showAllOption: PropTypes.bool,
  allOptionLabel: PropTypes.string
};

export default LocationSelect;
