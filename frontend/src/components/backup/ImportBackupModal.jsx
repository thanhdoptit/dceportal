import React, { useState } from 'react';
import { Modal, Upload, Button, message, Table, Space, Alert } from 'antd';
import { UploadOutlined, FileExcelOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const ImportBackupModal = ({ visible, onCancel, onImport }) => {
  const [fileList, setFileList] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Xử lý upload file
  const handleUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   file.type === 'application/vnd.ms-excel' ||
                   file.name.endsWith('.xlsx') ||
                   file.name.endsWith('.xls');
    
    if (!isExcel) {
      message.error('Chỉ chấp nhận file Excel (.xlsx, .xls)');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('File phải nhỏ hơn 2MB');
      return false;
    }

    // Đọc file Excel
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Lấy sheet đầu tiên
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Chuyển đổi thành JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Parse dữ liệu theo format
        const parsed = parseExcelData(jsonData);
        setParsedData(parsed);
        
        message.success('Đọc file Excel thành công');
      } catch (error) {
        console.error('Parse Excel error:', error);
        message.error('Lỗi khi đọc file Excel');
      }
    };
    
    reader.readAsArrayBuffer(file);
    
    setFileList([file]);
    return false; // Ngăn upload tự động
  };

  // Parse dữ liệu Excel
  const parseExcelData = (jsonData) => {
    const result = {
      goodsync: [],
      export_check: []
    };

    // Tìm header row
    let headerRow = 0;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row.some(cell => cell && cell.toString().includes('Clients'))) {
        headerRow = i;
        break;
      }
    }

    // Parse từ header row
    const headers = jsonData[headerRow];
    const dataRows = jsonData.slice(headerRow + 1);

    dataRows.forEach((row, index) => {
      if (row.length < 3) return; // Bỏ qua row rỗng

      const rowData = {};
      headers.forEach((header, colIndex) => {
        if (header && row[colIndex] !== undefined) {
          rowData[header.toString().trim()] = row[colIndex];
        }
      });

      // Phân loại dữ liệu
      if (rowData['Clients (IP)'] && rowData['Đường dẫn export (DBA)']) {
        // GoodSync data
        result.goodsync.push({
          client_ip: rowData['Clients (IP)'] || '',
          export_path: rowData['Đường dẫn export (DBA)'] || '',
          local_check_path: rowData['Đường dẫn kiểm tra local'] || '',
          export_files: rowData['Dữ liệu Export'] || '',
          schedule_info: rowData['Lịch Chạy Job'] || ''
        });
      } else if (rowData['Clients (IP)'] && rowData['Đường dẫn export (DBA)'] && rowData['END Time']) {
        // Export check data
        result.export_check.push({
          job_name: rowData['Clients (IP)'] || '',
          export_path: rowData['Đường dẫn export (DBA)'] || '',
          local_check_path: rowData['Đường dẫn kiểm tra local'] || '',
          tape_label: rowData['Backup to DISK - TAPE'] || '',
          end_time: rowData['END Time'] || '',
          backup_result: rowData['Kết quả'] || '',
          checked_by: rowData['Người kiểm tra'] || '',
          schedule_info: rowData['Lịch Chạy Job'] || ''
        });
      }
    });

    return result;
  };

  // Xử lý import
  const handleImport = async () => {
    if (!parsedData) {
      message.error('Vui lòng chọn file Excel trước');
      return;
    }

    setLoading(true);
    try {
      await onImport(parsedData);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    setFileList([]);
    setParsedData(null);
    onCancel();
  };

  // Cột cho bảng preview
  const goodsyncColumns = [
    {
      title: 'Client IP',
      dataIndex: 'client_ip',
      key: 'client_ip',
      width: 200
    },
    {
      title: 'Export Path',
      dataIndex: 'export_path',
      key: 'export_path',
      width: 300
    },
    {
      title: 'Local Check Path',
      dataIndex: 'local_check_path',
      key: 'local_check_path',
      width: 300
    },
    {
      title: 'Export Files',
      dataIndex: 'export_files',
      key: 'export_files',
      width: 150
    },
    {
      title: 'Schedule Info',
      dataIndex: 'schedule_info',
      key: 'schedule_info',
      width: 300
    }
  ];

  const exportCheckColumns = [
    {
      title: 'Job Name',
      dataIndex: 'job_name',
      key: 'job_name',
      width: 200
    },
    {
      title: 'Export Path',
      dataIndex: 'export_path',
      key: 'export_path',
      width: 300
    },
    {
      title: 'Tape Label',
      dataIndex: 'tape_label',
      key: 'tape_label',
      width: 120
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 100
    },
    {
      title: 'Result',
      dataIndex: 'backup_result',
      key: 'backup_result',
      width: 100
    },
    {
      title: 'Checked By',
      dataIndex: 'checked_by',
      key: 'checked_by',
      width: 120
    }
  ];

  return (
    <Modal
      title="Import dữ liệu Backup từ Excel"
      open={visible}
      onCancel={handleCancel}
      width={1200}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button 
          key="import" 
          type="primary" 
          loading={loading}
          disabled={!parsedData}
          onClick={handleImport}
        >
          Import
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Alert
          message="Hướng dẫn"
          description="Upload file Excel chứa dữ liệu backup jobs. File phải có cấu trúc với các cột: Clients (IP), Đường dẫn export (DBA), Đường dẫn kiểm tra local, v.v."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Upload
          beforeUpload={handleUpload}
          fileList={fileList}
          onRemove={() => {
            setFileList([]);
            setParsedData(null);
          }}
          accept=".xlsx,.xls"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            Chọn file Excel
          </Button>
        </Upload>
      </div>

      {parsedData && (
        <div>
          <h3>Preview dữ liệu</h3>
          
          {parsedData.goodsync.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h4>GoodSync Jobs ({parsedData.goodsync.length})</h4>
              <Table
                columns={goodsyncColumns}
                dataSource={parsedData.goodsync}
                size="small"
                scroll={{ x: 1200 }}
                pagination={false}
              />
            </div>
          )}
          
          {parsedData.export_check.length > 0 && (
            <div>
              <h4>Export Check Jobs ({parsedData.export_check.length})</h4>
              <Table
                columns={exportCheckColumns}
                dataSource={parsedData.export_check}
                size="small"
                scroll={{ x: 1200 }}
                pagination={false}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ImportBackupModal; 