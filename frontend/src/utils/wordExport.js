import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from 'docx';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from 'axios';

// Hàm tạo biên bản Word cho handover
export const generateHandoverWord = (handover, deviceCheckData = []) => {
  // Tạo document mới
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Tiêu đề chính
          new Paragraph({
            text: 'BIÊN BẢN BÀN GIAO CA',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 200,
              after: 400,
            },
          }),

          // Thông tin cơ bản
          new Paragraph({
            children: [
              new TextRun({
                text: 'Thông tin bàn giao:',
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: 200,
              after: 200,
            },
          }),

          // Bảng thông tin cơ bản
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Trạng thái' })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text:
                          handover.status === 'draft'
                            ? 'Đang làm việc'
                            : handover.status === 'pending'
                              ? 'Chờ xác nhận'
                              : handover.status === 'completed'
                                ? 'Đã bàn giao'
                                : handover.status === 'rejected'
                                  ? 'Đã từ chối'
                                  : 'Không xác định',
                      }),
                    ],
                    width: { size: 70, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Địa điểm làm việc' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: handover.FromShift?.name || 'Không xác định' }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Ca làm việc' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: `${handover.FromShift?.code || 'N/A'} - ${format(new Date(handover.FromShift?.date), 'dd/MM/yyyy', { locale: vi })}`,
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Thời điểm cập nhật' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: handover.updatedAt
                          ? format(new Date(handover.updatedAt), 'HH:mm dd/MM/yyyy', { locale: vi })
                          : 'Chưa cập nhật',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Thông tin người giao/nhận ca
          new Paragraph({
            children: [
              new TextRun({
                text: 'Thông tin người giao/nhận ca:',
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: 400,
              after: 200,
            },
          }),

          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Bên giao ca' })],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: 'E6F3FF' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Bên nhận ca' })],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: 'E6F3FF' },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Người giao:' }),
                      ...(handover.FromUsers || []).map(
                        user =>
                          new Paragraph({
                            text: `• ${user.fullname || user.fullName}`,
                            spacing: { before: 100 },
                          })
                      ),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: 'Người nhận:' }),
                      ...(handover.ToUsers || []).map(
                        user =>
                          new Paragraph({
                            text: `• ${user.fullname || user.fullName}`,
                            spacing: { before: 100 },
                          })
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Nội dung bàn giao
          new Paragraph({
            children: [
              new TextRun({
                text: 'Nội dung bàn giao:',
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: 400,
              after: 200,
            },
          }),

          // 1. Công cụ, tài liệu
          new Paragraph({
            children: [
              new TextRun({
                text: '1. Công cụ, tài liệu làm việc',
                bold: true,
                size: 22,
              }),
            ],
            spacing: { before: 200 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Tình trạng' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: handover.handoverForm?.tools?.status === 'complete' ? 'Đủ' : 'Thiếu',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 2. Vệ sinh môi trường
          new Paragraph({
            children: [
              new TextRun({
                text: '2. Vệ sinh môi trường trong các phòng chức năng',
                bold: true,
                size: 22,
              }),
            ],
            spacing: { before: 300 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Hiện trạng' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: handover.handoverForm?.environment?.status ? 'Tốt' : 'Chưa tốt',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 3. Tình trạng thiết bị
          new Paragraph({
            children: [
              new TextRun({
                text: '3. Tình trạng các hệ thống hạ tầng TTDL',
                bold: true,
                size: 22,
              }),
            ],
            spacing: { before: 300 },
          }),

          // Bảng thiết bị
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'STT' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Thiết bị' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Trạng thái' })],
                    shading: { fill: 'F2F2F2' },
                  }),
                ],
              }),
              ...defaultDevices.map((device, index) => {
                const deviceErrors =
                  handover.devices?.filter(
                    d => d.deviceId === device.id && d.status === 'Có lỗi'
                  ) || [];

                return new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: (index + 1).toString() })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: device.name })],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          text: deviceErrors.length === 0 ? '✓ Bình thường' : '⚠ Có lỗi',
                        }),
                        ...deviceErrors.map(
                          error =>
                            new Paragraph({
                              text: `• ${error.subDeviceName || 'Không xác định'}: ${error.errorCode || 'Không có mã lỗi'}`,
                              spacing: { before: 100 },
                            })
                        ),
                      ],
                    }),
                  ],
                });
              }),
            ],
          }),

          // 4. Công việc tồn đọng
          new Paragraph({
            children: [
              new TextRun({
                text: '4. Các công việc đang thực hiện',
                bold: true,
                size: 22,
              }),
            ],
            spacing: { before: 300 },
          }),

          ...(handover.Tasks && handover.Tasks.length > 0
            ? [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ text: 'Mã' })],
                          shading: { fill: 'F2F2F2' },
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: 'Tiêu đề' })],
                          shading: { fill: 'F2F2F2' },
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: 'Người thực hiện' })],
                          shading: { fill: 'F2F2F2' },
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: 'Trạng thái' })],
                          shading: { fill: 'F2F2F2' },
                        }),
                      ],
                    }),
                    ...handover.Tasks.map(
                      task =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: `CV${task.taskId}` })],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ text: task.taskTitle || 'Không có tiêu đề' }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ text: task.fullName || 'Chưa phân công' }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  text:
                                    task.status === 'in_progress'
                                      ? 'Đang thực hiện'
                                      : task.status === 'waiting'
                                        ? 'Chờ xử lý'
                                        : task.status === 'completed'
                                          ? 'Đã hoàn thành'
                                          : task.status === 'cancelled'
                                            ? 'Đã hủy'
                                            : 'Không xác định',
                                }),
                              ],
                            }),
                          ],
                        })
                    ),
                  ],
                }),
              ]
            : [
                new Paragraph({
                  text: '✓ Không có công việc tồn đọng',
                  spacing: { before: 200 },
                }),
              ]),

          // 5. Nội dung bàn giao
          new Paragraph({
            children: [
              new TextRun({
                text: '5. Nội dung bàn giao',
                bold: true,
                size: 22,
              }),
            ],
            spacing: { before: 300 },
          }),

          new Paragraph({
            text: handover.content || 'Không có nội dung bàn giao',
            spacing: { before: 200 },
          }),

          // 6. Biên bản kiểm tra thiết bị
          ...(deviceCheckData && deviceCheckData.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '6. Biên bản kiểm tra thiết bị',
                      bold: true,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 300 },
                }),

                ...deviceCheckData
                  .map((checkForm, formIndex) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Biên bản kiểm tra ${formIndex + 1}`,
                          bold: true,
                          size: 20,
                        }),
                      ],
                      spacing: { before: 200 },
                    }),

                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      rows: [
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: 'Thông tin' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: 'Chi tiết' })],
                            }),
                          ],
                        }),
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: 'Địa điểm kiểm tra' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: checkForm.location || 'Không có' })],
                            }),
                          ],
                        }),
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: 'Thời gian kiểm tra' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  text: checkForm.checkedAt
                                    ? format(new Date(checkForm.checkedAt), 'HH:mm dd/MM/yyyy', {
                                        locale: vi,
                                      })
                                    : 'Không có',
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: 'Người kiểm tra' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({ text: checkForm.checkerName || 'Không có' }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),

                    // Bảng thiết bị kiểm tra
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: 'Danh sách thiết bị kiểm tra:',
                          bold: true,
                          size: 18,
                        }),
                      ],
                      spacing: { before: 200 },
                    }),

                    new Table({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      rows: [
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph({ text: 'STT' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: 'Thiết bị' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: 'Trạng thái' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                            new TableCell({
                              children: [new Paragraph({ text: 'Chi tiết lỗi' })],
                              shading: { fill: 'F2F2F2' },
                            }),
                          ],
                        }),
                        ...(checkForm.items || []).map(
                          (item, itemIndex) =>
                            new TableRow({
                              children: [
                                new TableCell({
                                  children: [new Paragraph({ text: (itemIndex + 1).toString() })],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      text: item.deviceNameSnapshot || `Thiết bị ${item.deviceId}`,
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      text: item.status === 'Error' ? 'Có lỗi' : 'Bình thường',
                                    }),
                                  ],
                                }),
                                new TableCell({
                                  children: [
                                    new Paragraph({
                                      text:
                                        item.status === 'Error'
                                          ? `Tên thiết bị: ${item.subDeviceName || 'Không có'}\n` +
                                            `Serial: ${item.serialNumber || 'Không có'}\n` +
                                            `Mã lỗi: ${item.errorCode || 'Không có'}\n` +
                                            `Nguyên nhân: ${item.errorCause || 'Không có'}\n` +
                                            `Giải pháp: ${item.solution || 'Không có'}`
                                          : 'Không có lỗi',
                                    }),
                                  ],
                                }),
                              ],
                            })
                        ),
                      ],
                    }),

                    // Ghi chú kiểm tra
                    ...(checkForm.notes
                      ? [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: 'Ghi chú kiểm tra:',
                                bold: true,
                                size: 18,
                              }),
                            ],
                            spacing: { before: 200 },
                          }),
                          new Paragraph({
                            text: checkForm.notes,
                            spacing: { before: 100 },
                          }),
                        ]
                      : []),
                  ])
                  .flat(),
              ]
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: '6. Biên bản kiểm tra thiết bị',
                      bold: true,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 300 },
                }),
                new Paragraph({
                  text: '✓ Không có biên bản kiểm tra thiết bị',
                  spacing: { before: 200 },
                }),
              ]),

          // Ghi chú xác nhận/từ chối
          ...(handover.confirmNote
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Ghi chú xác nhận:',
                      bold: true,
                      size: 22,
                    }),
                  ],
                  spacing: { before: 300 },
                }),
                new Paragraph({
                  text: handover.confirmNote,
                  spacing: { before: 200 },
                }),
              ]
            : []),

          ...(handover.rejectNote
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Lý do từ chối:',
                      bold: true,
                      size: 22,
                      color: 'FF0000',
                    }),
                  ],
                  spacing: { before: 300 },
                }),
                new Paragraph({
                  text: handover.rejectNote,
                  spacing: { before: 200 },
                }),
              ]
            : []),

          // Thông tin thời gian
          new Paragraph({
            children: [
              new TextRun({
                text: 'Thông tin thời gian:',
                bold: true,
                size: 22,
              }),
            ],
            spacing: { before: 400 },
          }),

          ...(handover.confirmedAt
            ? [
                new Paragraph({
                  text: `Thời gian xác nhận: ${format(new Date(handover.confirmedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}`,
                  spacing: { before: 200 },
                }),
              ]
            : []),

          ...(deviceCheckData && deviceCheckData.length > 0
            ? [
                new Paragraph({
                  text: `Số biên bản kiểm tra thiết bị: ${deviceCheckData.length}`,
                  spacing: { before: 200 },
                }),
                ...deviceCheckData.map(
                  (checkForm, index) =>
                    new Paragraph({
                      text: `Biên bản ${index + 1}: ${format(new Date(checkForm.checkedAt), 'HH:mm dd/MM/yyyy', { locale: vi })} - ${checkForm.checkerName || 'Không xác định'}`,
                      spacing: { before: 100 },
                    })
                ),
              ]
            : []),

          // Footer
          new Paragraph({
            text: `Tài liệu được tạo tự động vào lúc: ${format(new Date(), 'HH:mm dd/MM/yyyy', { locale: vi })}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
          }),
        ],
      },
    ],
  });

  return doc;
};

// Danh sách thiết bị mặc định
const defaultDevices = [
  { id: 1, name: 'Hệ thống phân phối điện UPS' },
  { id: 2, name: 'Hệ thống UPS' },
  { id: 3, name: 'Hệ thống làm mát' },
  { id: 4, name: 'Hệ thống giám sát hình ảnh' },
  { id: 5, name: 'Hệ thống kiểm soát truy cập' },
  { id: 6, name: 'PCCC' },
  { id: 7, name: 'Hệ thống giám sát hạ tầng TTDL' },
  { id: 8, name: 'Hệ thống khác' },
];

// Hàm lấy dữ liệu kiểm tra thiết bị
const fetchDeviceCheckData = async workShiftId => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shift-check/forms`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: { workShiftId },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching device check data:', error);
    return [];
  }
};

// Hàm xuất file Word
export const exportHandoverToWord = async handover => {
  try {
    // Lấy dữ liệu kiểm tra thiết bị
    const deviceCheckData = await fetchDeviceCheckData(handover.fromShiftId);

    // Tạo document với cả dữ liệu kiểm tra thiết bị
    const doc = generateHandoverWord(handover, deviceCheckData);

    // Tạo blob từ document
    const blob = await Packer.toBlob(doc);

    // Tạo tên file
    const fileName = `Bien_ban_ban_giao_ca_${handover.FromShift?.code}_${format(new Date(handover.FromShift?.date), 'ddMMyyyy', { locale: vi })}.docx`;

    // Tạo link download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error exporting to Word:', error);
    return { success: false, error: error.message };
  }
};
