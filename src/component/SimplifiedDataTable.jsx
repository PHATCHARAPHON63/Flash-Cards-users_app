import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { baseUrlWithToken } from './function/register';

const rowDataOptions = [10, 25, 50];

const SimplifiedDataTable = ({
  tableHeader = [],
  rowsPerPage,
  page,
  onRowPerPageChange = () => {},
  onPageChange = () => {},
  data = [],
  tableAlertText = ''
}) => {
  const totalPages = Math.ceil(data?.length / rowsPerPage);

  const handlePrevPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  const renderedData = data?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box>
      <TableContainer sx={{ width: '100%', overflowX: 'auto', marginX: 'auto' }}>
        <Table aria-label="simplified-data-table" sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                ลำดับ
              </TableCell>
              {tableHeader?.map((header, index) => (
                <TableCell key={index} align={header.align || 'center'} sx={{ fontWeight: 'bold' }}>
                  {header.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell align="center">{page * rowsPerPage + rowIndex + 1}</TableCell>
                {tableHeader?.map((item, colIndex) => {
                  return (
                    <TableCell key={colIndex} align={item.align || 'center'}>
                      {(() => {
                        switch (true) {
                          case item.type === 'check':
                            return row[item.key] === '1' ? '✅' : '-';
                          case item.type === 'image':
                            const imageUrl = baseUrlWithToken.defaults.baseURL + row[item.key];
                            return imageUrl ? (
                              <img src={imageUrl} alt="img" style={{ width: '40px', height: '50px', objectFit: 'cover' }} />
                            ) : (
                              '-'
                            );
                          case item.type === 'date':
                            const date = new Date(row[item.key]);
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
                          default:
                            return row[item.key] ?? '-';
                        }
                      })()}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
        <Typography sx={{ fontSize: '12px', color: 'red', alignSelf: 'flex-start', marginLeft: '5px' }}>{tableAlertText}</Typography>
        {/* Pagination */}
        {renderedData?.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                gap: '8px'
              }}
            >
              <Typography sx={{ fontSize: '12px' }}>Rows per page:</Typography>
              <Select sx={{ fontSize: '12px', width: '60px', height: '25px' }} value={rowsPerPage} onChange={onRowPerPageChange}>
                {rowDataOptions.map((row) => (
                  <MenuItem key={row} value={row}>
                    {row}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ fontSize: '12px', paddingInline: '5px' }}>
                {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, data?.length)} of ${data?.length}`}
              </Typography>

              <IconButton onClick={handlePrevPage} disabled={page === 0}>
                <MdKeyboardArrowLeft color={page === 0 ? '#ccc' : '#495057'} />
              </IconButton>

              <IconButton onClick={handleNextPage} disabled={page >= totalPages - 1 || data?.length === 0}>
                <MdKeyboardArrowRight color={page >= totalPages - 1 || data?.length === 0 ? '#ccc' : '#495057'} />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SimplifiedDataTable;
