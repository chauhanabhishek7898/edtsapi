// export const sqlConnection = {
//     user: 'edtsuser',
//     password: 'edtsuser@123',
//     server: 'DESKTOP-S6187CH',
//     // port: 1433,
//     database: 'eDTS',
//     options: {
//         encrypt: true,
//         trustServerCertificate: true,
//         integratedSecurity: false, // Windows Authentication के लिए
//         // enableArithAbort: true,
//     },
// }
 

// export const sqlConnection = {
//     user: 'sle',
//     password: 'ciplsurvey@2019',
//     server: '40.127.190.1',
//     port: 1433,
//     database: 'EdtsDubai2024',
//     options: {
//         encrypt: false, // Enable this if using Azure SQL Database
//     },
// }

export const sqlConnection = {
  user: 'sle',
  password: 'ciplsurvey@2019',
  server: '40.127.190.1',
  port: 1433,
  database: 'EdtsDubai2024',
  options: {
    encrypt: true, // Azure के लिए true
    trustServerCertificate: true, // ✅ Self-signed certificate trust करने के लिए
    connectionTimeout: 3600000,
  },
};