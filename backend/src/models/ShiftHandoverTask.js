import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ShiftHandoverTask = sequelize.define('ShiftHandoverTask', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    handoverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ShiftHandovers',
        key: 'id'
      },
      comment: 'ID của biên bản bàn giao'
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tasks',
        key: 'id'
      },
      comment: 'ID của công việc'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Vị trí công việc tại thời điểm bàn giao'
    },
    fullName: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Tên đầy đủ công việc tại thời điểm bàn giao'
    },
    taskTitle: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Tiêu đề công việc tại thời điểm bàn giao'
    },
    taskDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả công việc tại thời điểm bàn giao'
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Trạng thái công việc tại thời điểm bàn giao'
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'File đính kèm tại thời điểm bàn giao'
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian vào tại thời điểm bàn giao'
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian ra tại thời điểm bàn giao'
    },
    signature: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Chữ ký tại thời điểm bàn giao'
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời gian hoàn thành tại thời điểm bàn giao'
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Lý do hủy tại thời điểm bàn giao'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID người dùng được giao tại thời điểm bàn giao'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID người tạo tại thời điểm bàn giao'
    },
    completedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID người hoàn thành tại thời điểm bàn giao'
    },
    workSessionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID phiên làm việc tại thời điểm bàn giao'
    },
    workShiftId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID ca làm việc tại thời điểm bàn giao'
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Thứ tự hiển thị các task trong biên bản'
    }
  }, {
    tableName: 'ShiftHandoverTasks',
    timestamps: true,
    indexes: [
      {
        fields: ['handoverId']
      }
    ],
    getterMethods: {
      attachments() {
        const value = this.getDataValue('attachments');
        return value ? JSON.parse(value) : [];
      }
    },
    setterMethods: {
      attachments(value) {
        this.setDataValue('attachments', value ? JSON.stringify(value) : '[]');
      }
    }
  });

  // Thiết lập các mối quan hệ
  ShiftHandoverTask.associate = (models) => {
    // Quan hệ với biên bản bàn giao (1 biên bản có nhiều task)
    ShiftHandoverTask.belongsTo(models.ShiftHandover, {
      foreignKey: 'handoverId',
      as: 'handover'
    });

    // Quan hệ với công việc
    ShiftHandoverTask.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task'
    });

    // Quan hệ với người dùng được giao
    ShiftHandoverTask.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Quan hệ với người tạo
    ShiftHandoverTask.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });

    // Quan hệ với người hoàn thành
    ShiftHandoverTask.belongsTo(models.User, {
      foreignKey: 'completedBy',
      as: 'completer'
    });
  };

  return ShiftHandoverTask;
};
