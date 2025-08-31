const handoverFormTemplate = {
  sections: [
    {
      type: 'tools',
      key: 'tools',
      title: 'Công cụ, tài liệu làm việc',
      label: 'Tình trạng công cụ tài liệu',
      required: true,
      options: [
        { value: 'complete', label: 'Đủ' },
        { value: 'incomplete', label: 'Thiếu' }
      ],
      conditionalFields: {
        incomplete: [
          {
            key: 'missing.items',
            type: 'select',
            mode: 'multiple',
            label: 'Danh sách công cụ tài liệu thiếu',
            required: true,
            placeholder: 'Chọn công cụ tài liệu thiếu',
            options: [
              { value: 'Máy tính', label: 'Máy tính' },
              { value: 'Điện thoại', label: 'Điện thoại' },
              { value: 'Chìa khóa', label: 'Chìa khóa' },
              { value: 'Khác', label: 'Khác' }
            ]
          },
          {
            key: 'missing.description',
            type: 'textarea',
            label: 'Mô tả nguyên nhân thiếu thiết bị',
            required: true,
            rows: 4,
            placeholder: 'Mô tả chi tiết nguyên nhân, thời điểm và tình trạng thiết bị thiếu'
          }
        ]
      }
    },
    {
      type: 'environment',
      key: 'environment',
      title: 'Vệ sinh môi trường trong các phòng chức năng',
      label: 'Hiện trạng vệ sinh môi trường',
      required: true,
      options: [
        { value: true, label: 'Tổt' },
        { value: false, label: 'Chưa tốt' }
      ],
      conditionalFields: {
        false: [
          {
            key: 'ongoingTasks',
            type: 'textarea',
            label: 'Công việc đang thực hiện ảnh hưởng tới môi trường',
            required: true,
            rows: 2,
            placeholder: 'Ghi rõ công việc đang thực hiện'
          },
          {
            key: 'progress',
            type: 'input',
            label: 'Tiến độ',
            required: true,
            placeholder: 'Triển khai đến đâu'
          },
          {
            key: 'estimatedCompletion',
            type: 'input',
            label: 'Dự kiến hoàn thành',
            required: true,
            placeholder: 'Dự kiến thời gian hoàn thành'
          }
        ]
      }
    },
    {
      type: 'infrastructure',
      key: 'infrastructure',
      title: 'Tình trạng các hệ thống hạ tầng TTDL',
      items: [
        {
          key: 'powerDistribution',
          label: '3.1. Hệ thống phân phối điện UPS',
          required: true
        },
        {
          key: 'ups',
          label: '3.2. Hệ thống UPS',
          required: true
        },
        {
          key: 'cooling',
          label: '3.3. Hệ thống làm mát',
          required: true
        },
        {
          key: 'cctv',
          label: '3.4. Hệ thống giám sát hình ảnh',
          required: true
        },
        {
          key: 'accessControl',
          label: '3.5. Hệ thống kiểm soát truy cập',
          required: true
        },
        {
          key: 'fireSystem',
          label: '3.6. Hệ thống PCCC trong phòng chức năng',
          required: true
        },
        {
          key: 'dcimSystem',
          label: '3.7. Hệ thống giám sát hạ tầng TTDL',
          required: true
        }
      ],
      options: [
        { value: 'normal', label: 'Bình thường' },
        { value: 'abnormal', label: 'Có lỗi' }
      ],
      conditionalFields: {
        abnormal: [
          {
            key: 'issues.deviceName',
            type: 'input',
            label: 'Tên thiết bị/hệ thống',
            required: true
          },
          {
            key: 'issues.serialNumber',
            type: 'input',
            label: 'Serial Number',
            required: true
          },
          {
            key: 'issues.location',
            type: 'input',
            label: 'Vị trí',
            required: true
          },
          {
            key: 'issues.issue',
            type: 'textarea',
            label: 'Tình trạng lỗi/Nguyên nhân lỗi',
            required: true,
            rows: 2
          },
          {
            key: 'issues.ongoingTasks',
            type: 'textarea',
            label: 'Công việc đang xử lý',
            required: true,
            rows: 2,
            placeholder: 'Đã phối hợp bộ phận/NCC thực hiện đến đâu, tình trạng thiết bị/hệ thống lúc bàn giao'
          }
        ]
      }
    },
    {
      type: 'ongoingTasks',
      key: 'ongoingTasks',
      title: 'Các công việc đang thực hiện',
      label: 'Công việc đang tồn đọng',
      required: true,
      options: [
        { value: true, label: 'Có' },
        { value: false, label: 'Không' }
      ],
      fields: [
        {
          key: 'taskInfo',
          type: 'textarea',
          label: 'Thông tin cập nhật',
          rows: 3,
          placeholder: 'Thông tin cập nhật (đã phối hợp với bộ phận nào, công việc đang thực hiện...)',
          required: true,
          requiredWhenHasTask: true,
          minLength: 5,
          rules: [
            {
              min: 5,
              message: 'Thông tin cập nhật phải có ít nhất 5 ký tự'
            }
          ]
        },
        {
          key: 'relatedTasks',
          type: 'textarea',
          label: 'Các công việc liên quan tiếp theo',
          rows: 2
        }
      ]
    }
  ]
};

export default handoverFormTemplate; 