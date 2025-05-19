import { CheckCircle, MoreVert } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Menu,
  Typography,
  Select,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from '@mui/material';
import { useState, useEffect } from 'react';
import { MdClose, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { baseUrlWithToken } from './function/register';
import { IconCheck } from '@tabler/icons-react';
import Tooltip from '@mui/material/Tooltip';

import { FiEdit } from 'react-icons/fi';
import { sliceText } from '../utils/format_text';

const rowDataOptions = [10, 25, 50];

const CustomDataTable = ({
  tableHeader = [],
  rowsPerPage,
  page,
  onRowPerPageChange = () => {},
  onPageChange = () => {},
  data = [],
  actions = [],
  tableAlertText = '',
  isMenu = true,
  noAction = false
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  //! view Image base64
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const handleOpenDialog = (image, faceimage) => {
    setSelectedImage({ image, faceimage });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage('');
  };
  ///! close
  const handleMenuOpen = (event, item) => {
    setSelectedItem(item);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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
  // console.log('Data', data);
  // console.log(selectedImage);
  const renderedData = data?.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  return (
    <Box>
      <TableContainer sx={{ width: '100%', overflowX: 'auto', marginX: 'auto' }}>
        <Table aria-label="custom-data-table" sx={{ width: '100%' }}>
          <TableHead sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                ลำดับ
              </TableCell>
              {tableHeader?.map((header, index) => (
                <TableCell key={index} align={header.headerAlign || 'center'} sx={{ fontWeight: 'bold' }}>
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
                    <TableCell
                      key={colIndex}
                      align={item?.align || 'center'}
                      sx={{ color: item.type === 'check' ? 'green' : 'black', minWidth: item.minWidth || 'auto' }}
                    >
                      {(() => {
                        switch (true) {
                          case colIndex === tableHeader.length - 1 && isMenu && item.type === 'customAction':
                            return (
                              <Box sx={{ minWidth: '120px' }}>
                                {actions.map(({ name, onClick, actionIcon, disabledActionIndex = [] }, index) => {
                                  return (
                                    <Tooltip
                                      key={name}
                                      title={name}
                                      placement="top"
                                      PopperProps={{
                                        modifiers: [
                                          {
                                            name: 'offset',
                                            options: {
                                              offset: [0, -5] // Optional, adjusts the tooltip's distance from the button
                                            }
                                          }
                                        ]
                                      }}
                                    >
                                      <IconButton
                                        key={index}
                                        size="small"
                                        onClick={() => {
                                          onClick(row);
                                          handleMenuClose();
                                        }}
                                        disabled={disabledActionIndex?.includes(rowsPerPage * page + rowIndex)}
                                      >
                                        {actionIcon}
                                      </IconButton>
                                    </Tooltip>
                                  );
                                })}
                              </Box>
                            );

                          case colIndex === tableHeader.length - 1 && isMenu && !noAction:
                            return (
                              <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                                <MoreVert />
                              </IconButton>
                            );
                          case item.type === 'check':
                            return row[item.key].toString() === '1' ? <IconCheck /> : '-';
                          case item.type === 'time':
                            return row[item.key] ? `${row[item.key]} น.` : '-';
                          case item.type === 'image':
                            const imageUrl = baseUrlWithToken.defaults.baseURL + row[item.key];

                            return imageUrl ? (
                              <img src={imageUrl} alt="img" style={{ width: '40px', height: '50px', objectFit: 'cover' }} />
                            ) : (
                              '-'
                            );
                          case item.type === 'faceImage': {
                            const cameraImage = row[item.key[0]]; // ใช้ `camera_image` ในคอลัมน์แรก
                            const registeredImage = row[item.key[1]]; // ใช้ `registered_image` ในคอลัมน์ที่สอง
                            return (
                              <>
                                {cameraImage && registeredImage ? (
                                  <Box
                                    sx={{
                                      position: 'relative', // ใช้เป็น reference สำหรับ absolute positioning
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '8px' // ระยะห่างระหว่างรูป
                                    }}
                                  >
                                    {/* รูปแรก */}

                                    <img
                                      src={cameraImage}
                                      alt="Camera"
                                      style={{ width: '40px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                                      onClick={() => handleOpenDialog(cameraImage, registeredImage)}
                                    />
                                    {/* ไอคอนทับระหว่างกลาง */}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        left: '50%', // อยู่กึ่งกลางระหว่างรูป
                                        transform: 'translateX(-50%)', // จัดให้ศูนย์กลางของไอคอนพอดีกับจุดกลาง
                                        backgroundColor: 'white', // ป้องกันไอคอนโปร่งใส
                                        borderRadius: '50%', // ทำให้เป็นวงกลม
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '24px', // ขนาดไอคอน
                                        height: '24px'
                                      }}
                                    >
                                      <CheckCircle sx={{ color: 'green', fontSize: '20px' }} />
                                    </Box>
                                    {/* รูปที่สอง */}
                                    <img
                                      src={registeredImage}
                                      alt="Registered"
                                      style={{ width: '40px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                                      onClick={() => handleOpenDialog(cameraImage, registeredImage)}
                                    />
                                  </Box>
                                ) : (
                                  '-'
                                )}
                              </>
                            );
                          }
                          case item.type === 'date':
                            console.log(row[item.key]);

                            const date = new Date(row[item.key]);
                            console.log(date);

                            return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear() + 543}`;
                          case item.type === 'datetime':
                            const formatDate = (d) =>
                              `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear() + 543}`;

                            if (Array.isArray(item.key)) {
                              const [startKey, endKey] = item.key;
                              const startDate = row[startKey] ? new Date(row[startKey]) : null;
                              const endDate = row[endKey] ? new Date(row[endKey]) : null;

                              if (startDate && endDate) {
                                return `${formatDate(startDate)} - ${formatDate(endDate)}`;
                              } else if (startDate) {
                                return `${formatDate(startDate)}`;
                              } else {
                                return ''; // ไม่มีวันที่เริ่มต้น ไม่แสดงอะไรเลย
                              }
                            } else {
                              const datetime = row[item.key] ? new Date(row[item.key]) : null;
                              return datetime ? formatDate(datetime) : '';
                            }
                          default:
                            const text = row[item.key] ? row[item.key] : '-';
                            const showText = item.sliceText ? <Tooltip title={text}>{sliceText(text, item.sliceText)}</Tooltip> : text;
                            return showText;
                          // return row[item.key] ? row[item.key] : parseInt(row[item.key]) > 0 ? row[item.key] : '-';
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

      {/* Action Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        {actions
          .filter((action) => {
            const shouldShow = !action.show || action.show(selectedItem);
            // console.log(`🔍 [${action.name}] show = ${shouldShow}`, selectedItem);
            return shouldShow;
          })
          .map(({ name, onClick }) => (
            <MenuItem
              key={name}
              onClick={() => {
                onClick(selectedItem);
                handleMenuClose();
              }}
            >
              {name}
            </MenuItem>
          ))}
      </Menu>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
        <Typography sx={{ fontSize: '12px', color: 'red', alignSelf: 'flex-start', marginLeft: '5px' }}>{tableAlertText}</Typography>
        {/* Pagination */}
        {renderedData?.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                // padding: '5px 10px',
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
      {/* Dialog สำหรับแสดงภาพขนาดใหญ่ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          {/* แสดงภาพ Camera ถ้ามี */}
          <Box
            sx={{
              position: 'relative', // ใช้เป็น reference สำหรับ absolute positioning
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px' // ระยะห่างระหว่างรูป
            }}
          >
            {/* รูปแรก */}
            {selectedImage?.image && selectedImage.image.startsWith('data:image/') && (
              <img
                src={selectedImage.image || ''}
                alt="Camera"
                style={{
                  width: '50%', // แบ่งครึ่งพื้นที่
                  height: '100%',
                  objectFit: 'cover' // ป้องกันการเหลือช่องว่าง
                }}
              />
            )}

            {/* ไอคอนทับระหว่างกลาง */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px', // ปรับให้ใหญ่ขึ้น
                height: '100px' // ปรับให้ใหญ่ขึ้น
              }}
            >
              <IconCheck color="green" size={80} stroke={2} />
            </Box>

            {/* รูปที่สอง */}
            {selectedImage?.faceimage && selectedImage.faceimage.startsWith('data:image/') && (
              <img
                src={selectedImage.faceimage || ''}
                alt="Registered"
                style={{
                  width: '50%', // แบ่งครึ่งพื้นที่
                  height: '100%',
                  objectFit: 'cover' // ป้องกันการเหลือช่องว่าง
                }}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {renderedData?.length === 0 && <Typography sx={{ textAlign: 'center', fontSize: '16px' }}>ไม่พบข้อมูล</Typography>}
    </Box>
  );
};

export default CustomDataTable;
