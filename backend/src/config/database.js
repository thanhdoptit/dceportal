import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME ,   // tên DB
  process.env.DB_USER ,       // user SQL Server
  process.env.DB_PASS ,  // pass SQL Server
  {
    host: process.env.DB_HOST ,
    port: process.env.DB_PORT || 1433,    // SQL Server mặc định 1433
    dialect: 'mssql',                      // SQL Server
    logging: false,
    timezone: '+07:00',
    dialectOptions: {
      options: {
        // instanceName: process.env.DB_INSTANCE, // Bỏ dòng này vì SQL Server Linux không có instance
        encrypt: false,       // nếu dùng nội bộ LAN (ko SSL), để false
        trustServerCertificate: true,
        enableArithAbort: true,
        // Cấu hình Unicode cho SQL Server
        charset: 'utf8',
        collation: 'SQL_Latin1_General_CP1_CI_AS', // Collation Unicode cho SQL Server
        // cho phép chứng chỉ tự ký
      }
    },
    pool: {
      max: 50,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
