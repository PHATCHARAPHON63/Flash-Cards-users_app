import React from 'react';
import * as XLSX from 'xlsx';
import CustomButton from './CustomButton';

// ExportLeavClass คือ component ที่ใช้สำหรับ export ข้อมูลเป็นไฟล์ Excel
const ExportClass = ({
  tableData,
  fileName = 'exported-data',
  buttonText = 'Export to Excel',
  documentTitle = 'รายงานข้อมูล',
  documentSubtitle = 'ข้อมูล ณ วันที่ ' + new Date().toLocaleDateString('th-TH'),
  additionalInfo = 'ออกรายงานโดย: ระบบรายงานอัตโนมัติ',
  customHeaders = null, // customHeaders ใช้สำหรับกำหนดฟิลด์ที่ต้องการและชื่อหัวคอลัมน์
  numericFieldsAsCheckmark = [], // ฟิลด์ตัวเลขที่ต้องการแสดงเป็นเครื่องหมายถูก (เช่น ['has_sick_leave', 'has_personal_leave'])
  numericFieldsAsDash = []
}) => {
  // ฟังก์ชันสำหรับแปลงค่าข้อมูล
  const formatCellValue = (value, field) => {
    // ถ้าเป็นฟิลด์ที่ต้องการแสดงเป็นเครื่องหมายถูกและค่าเป็นตัวเลข
    if (numericFieldsAsCheckmark.includes(field)) {
      // ถ้าค่าเป็น 1 หรือ true ให้แสดงเป็นเครื่องหมายถูก "✓"
      if (+value === 1 || value === true) {
        return '✓';
      }
      // ถ้าค่าเป็น 0 หรือ false ให้แสดงเป็นค่าว่าง
      else if (+value === 0 || value === false) {
        return '-';
      }
    }

    if (numericFieldsAsDash.includes(field)) {
      console.log('field', field, value);
      if (+value === 0 || value === false || value === undefined) {
        return '-';
      }
    }

    // กรณีอื่นๆ คืนค่าเดิม
    return value;
  };

  // ฟังก์ชัน handle การคลิกปุ่ม export
  const handleExport = () => {
    if (!tableData || tableData.length === 0) {
      alert('ไม่มีข้อมูลที่จะส่งออก');
      return;
    }

    try {
      // สร้าง workbook ใหม่
      const wb = XLSX.utils.book_new();

      // สร้าง worksheet จากข้อมูล
      const ws = XLSX.utils.json_to_sheet([]);

      // เพิ่มข้อมูลหัวเอกสาร (แถวที่ 1-3)
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [documentTitle], // แถวที่ 1 - ชื่อเอกสาร
          [documentSubtitle], // แถวที่ 2 - หัวข้อย่อย 1
          [additionalInfo], // แถวที่ 3 - หัวข้อย่อย 2
          [] // แถวว่างเพื่อเว้นระยะ
        ],
        { origin: 'A1' }
      );

      // สร้างส่วนหัวของตาราง และข้อมูล
      if (tableData.length > 0) {
        let fieldsToExport = [];
        let headerLabels = [];

        // ถ้ามีการกำหนด customHeaders
        if (customHeaders && Array.isArray(customHeaders)) {
          // สกัด field keys และ header labels จาก customHeaders
          customHeaders.forEach((header) => {
            const key = Object.keys(header)[0];
            const label = header[key];
            fieldsToExport.push(key);
            headerLabels.push(label);
          });
        } else {
          // ถ้าไม่มี customHeaders ใช้ทุก field ของข้อมูล
          fieldsToExport = Object.keys(tableData[0]);
          headerLabels = fieldsToExport;
        }

        // เพิ่มหัวตาราง
        XLSX.utils.sheet_add_aoa(ws, [headerLabels], { origin: 'A5' });

        // สร้างส่วนข้อมูลของตาราง (เฉพาะฟิลด์ที่เลือก)
        const dataRows = tableData.map((row) => {
          return fieldsToExport.map((field) => formatCellValue(row[field], field));
        });

        XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A6' });

        // กำหนดความกว้างของคอลัมน์
        const columnWidths = headerLabels.map((header) => ({
          wch: Math.max(15, String(header).length + 2)
        }));
        ws['!cols'] = columnWidths;
      }

      // เพิ่ม worksheet เข้าไปใน workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // แปลง workbook เป็น binary string
      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

      // ฟังก์ชันช่วยแปลง string เป็น ArrayBuffer
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
      }

      // สร้าง Blob จาก ArrayBuffer
      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

      // สร้าง URL สำหรับ blob
      const url = URL.createObjectURL(blob);

      // สร้าง element a สำหรับดาวน์โหลด
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.xlsx`);

      // เพิ่ม link เข้าไปใน DOM
      document.body.appendChild(link);

      // คลิก link เพื่อดาวน์โหลด
      link.click();

      // ลบ link ออกจาก DOM และ revoke URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  };

  return <CustomButton text={buttonText} onClick={handleExport} />;
};

export default ExportClass;
