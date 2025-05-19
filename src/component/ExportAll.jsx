import React from 'react';
import * as XLSX from 'xlsx';
import CustomButton from './CustomButton';

const ExportAll = ({
  data = [],
  fileName = 'exported-data',
  buttonText = 'Export to Excel',
  documentSubtitle = null,
  documentTitle = '',
  customHeaders = null,
  numericFieldsAsCheckmark = [],
  numericFieldsAsDash = [],
  dataFieldIndex = [] // <<<< เพิ่มกลับมาตรงนี้
}) => {
  const formatCellValue = (value, field) => {
    if (numericFieldsAsCheckmark.includes(field)) {
      if (+value === 1 || value === true) return '✓';
      if (+value === 0 || value === false) return '-';
    }
    if (numericFieldsAsDash.includes(field)) {
      if (+value === 0 || value === false || value === undefined) return '-';
    }
    return value;
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('ไม่มีข้อมูลที่จะส่งออก');
      return;
    }

    try {
      const wb = XLSX.utils.book_new();

      //   console.log('DATA', data);
      data.forEach((group) => {
        // const level = dataFieldIndex.level;
        // const room = dataFieldIndex.room;
        // const students = dataFieldIndex.students;
        const levelKey = dataFieldIndex[0]; // ตัวอย่างเช่น 0
        const roomKey = dataFieldIndex[1]; // ตัวอย่างเช่น 1
        const studentsKey = dataFieldIndex[2]; // ตัวอย่างเช่น 2

        const level = group[levelKey]; // เข้าถึงข้อมูลจาก group โดยใช้ดัชนีจาก dataFieldIndex
        const room = group[roomKey];
        const students = group[studentsKey];

        // console.log('level', level);
        // console.log('room', room);
        if (!students || students.length === 0) return;

        const ws = XLSX.utils.json_to_sheet([]);

        XLSX.utils.sheet_add_aoa(
          ws,
          [[`รายงานข้อมูล ${documentTitle}`], [`วันที่ ${documentSubtitle}`], [`ระดับชั้น ${level}/${room}`], []],
          {
            origin: 'A1'
          }
        );

        let fieldsToExport = [];
        let headerLabels = [];

        if (customHeaders && Array.isArray(customHeaders)) {
          customHeaders.forEach((header) => {
            const key = Object.keys(header)[0];
            const label = header[key];
            fieldsToExport.push(key);
            headerLabels.push(label);
          });
        } else {
          fieldsToExport = Object.keys(students[0]);
          headerLabels = fieldsToExport;
        }

        XLSX.utils.sheet_add_aoa(ws, [headerLabels], { origin: 'A5' });

        const dataRows = students.map((row) => fieldsToExport.map((field) => formatCellValue(row[field], field)));
        XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A6' });

        const columnWidths = headerLabels.map((header) => ({
          wch: Math.max(15, String(header).length + 2)
        }));
        ws['!cols'] = columnWidths;

        // เพิ่ม worksheet โดยตั้งชื่อว่า "ม.2/1", "ม.3/4" เป็นต้น
        // alert(`${level}-${room}`);
        XLSX.utils.book_append_sheet(wb, ws, `${level}-${room}`);
      });
      //   alert(wb.SheetNames.length);
      if (wb.SheetNames.length === 0) throw new Error('Workbook is empty');

      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  };

  return <CustomButton text={buttonText} onClick={handleExport} />;
};

export default ExportAll;
