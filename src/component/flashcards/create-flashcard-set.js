import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, 
  DialogTitle, TextField, FormControl, InputLabel, 
  Select, MenuItem, FormHelperText, Grid, IconButton, Typography,
  Chip, Divider, useTheme
} from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { IconPlus, IconTrash, IconLanguage, IconBook, IconVocabulary } from '@tabler/icons-react';

// สร้าง Schema สำหรับตรวจสอบข้อมูล
const flashcardSchema = Yup.object().shape({
  categoryName: Yup.string().required('กรุณากรอกชื่อหมวดหมู่'),
  description: Yup.string().required('กรุณากรอกคำอธิบาย'),
  cards: Yup.array().of(
    Yup.object().shape({
      front: Yup.string().required('กรุณากรอกคำศัพท์'),
      back: Yup.string().required('กรุณากรอกคำแปล'),
      example: Yup.string()
    })
  ).min(1, 'ต้องมีการ์ดอย่างน้อย 1 ใบ')
});

// สร้างค่าเริ่มต้น
const initialValues = {
  categoryName: '',
  description: '',
  difficulty: 'medium',
  cards: [
    { front: '', phonetic: '', back: '', example: '' }
  ]
};

const CreateFlashcardSet = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // เปิดกล่องโต้ตอบ
  const handleClickOpen = () => {
    setOpen(true);
  };

  // ปิดกล่องโต้ตอบ
  const handleClose = () => {
    setOpen(false);
  };

  // แสดงตัวอย่าง
  const handlePreview = (values) => {
    setPreviewData(values);
  };

  // บันทึกข้อมูล
  const handleSubmit = (values, { resetForm }) => {
    console.log('บันทึกชุดคำศัพท์:', values);
    // ส่งข้อมูลไปยัง API
    // ...
    resetForm();
    handleClose();
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<IconPlus />}
        onClick={handleClickOpen}
      >
        สร้างชุดคำศัพท์ใหม่
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>สร้างชุดคำศัพท์ใหม่</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={flashcardSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      name="categoryName"
                      label="ชื่อหมวดหมู่"
                      value={values.categoryName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.categoryName && Boolean(errors.categoryName)}
                      helperText={touched.categoryName && errors.categoryName}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth 
                      margin="normal"
                      error={touched.difficulty && Boolean(errors.difficulty)}
                    >
                      <InputLabel>ระดับความยาก</InputLabel>
                      <Select
                        name="difficulty"
                        value={values.difficulty}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="ระดับความยาก"
                      >
                        <MenuItem value="easy">ง่าย</MenuItem>
                        <MenuItem value="medium">ปานกลาง</MenuItem>
                        <MenuItem value="hard">ยาก</MenuItem>
                      </Select>
                      <FormHelperText>
                        {touched.difficulty && errors.difficulty}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="คำอธิบาย"
                      multiline
                      rows={2}
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ my: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    การ์ดคำศัพท์
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <FieldArray name="cards">
                    {({ remove, push }) => (
                      <Box>
                        {values.cards.map((card, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              mb: 3, 
                              p: 2, 
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              position: 'relative'
                            }}
                          >
                            <Chip 
                              label={`#${index + 1}`}
                              size="small"
                              sx={{ 
                                position: 'absolute',
                                top: -10,
                                left: 10,
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.primary.main}`,
                                color: theme.palette.primary.main
                              }}
                            />
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name={`cards.${index}.front`}
                                  label="คำศัพท์ (ภาษาอังกฤษ)"
                                  value={card.front}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.cards?.[index]?.front && 
                                    Boolean(errors.cards?.[index]?.front)
                                  }
                                  helperText={
                                    touched.cards?.[index]?.front && 
                                    errors.cards?.[index]?.front
                                  }
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name={`cards.${index}.back`}
                                  label="คำแปล (ภาษาไทย)"
                                  value={card.back}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.cards?.[index]?.back && 
                                    Boolean(errors.cards?.[index]?.back)
                                  }
                                  helperText={
                                    touched.cards?.[index]?.back && 
                                    errors.cards?.[index]?.back
                                  }
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name={`cards.${index}.phonetic`}
                                  label="คำอ่าน (ออกเสียง)"
                                  value={card.phonetic}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  placeholder="เช่น /ˈæp.əl/"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  name={`cards.${index}.example`}
                                  label="ตัวอย่างประโยค"
                                  value={card.example}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                />
                              </Grid>
                              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                {values.cards.length > 1 && (
                                  <IconButton 
                                    onClick={() => remove(index)}
                                    color="error"
                                  >
                                    <IconTrash size={20} />
                                  </IconButton>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<IconPlus />}
                          onClick={() => push({ front: '', phonetic: '', back: '', example: '' })}
                          sx={{ mt: 1 }}
                        >
                          เพิ่มการ์ดคำศัพท์
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                </Box>
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="inherit">
                  ยกเลิก
                </Button>
                <Button 
                  type="button"
                  color="info"
                  onClick={() => handlePreview(values)}
                  disabled={Object.keys(errors).length > 0}
                >
                  ดูตัวอย่าง
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  บันทึก
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* กล่องแสดงตัวอย่าง */}
      <Dialog
        open={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ตัวอย่างชุดคำศัพท์</DialogTitle>
        <DialogContent>
          {previewData && (
            <Box>
              <Typography variant="h6">{previewData.categoryName}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {previewData.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  label={
                    previewData.difficulty === 'easy' ? 'ง่าย' : 
                    previewData.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'
                  }
                  color={
                    previewData.difficulty === 'easy' ? 'success' : 
                    previewData.difficulty === 'medium' ? 'primary' : 'error'
                  }
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {previewData.cards.length} คำศัพท์
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                ตัวอย่างคำศัพท์:
              </Typography>
              
              {previewData.cards.slice(0, 3).map((card, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: theme.palette.background.neutral || theme.palette.grey[100], borderRadius: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={5}>
                      <Typography variant="subtitle2">คำศัพท์:</Typography>
                      <Typography variant="body2">{card.front || '(ไม่ได้ระบุ)'}</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="subtitle2">คำแปล:</Typography>
                      <Typography variant="body2">{card.back || '(ไม่ได้ระบุ)'}</Typography>
                    </Grid>
                    {card.phonetic && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">คำอ่าน:</Typography>
                        <Typography variant="body2">{card.phonetic}</Typography>
                      </Grid>
                    )}
                    {card.example && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">ตัวอย่างประโยค:</Typography>
                        <Typography variant="body2">{card.example}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ))}
              
              {previewData.cards.length > 3 && (
                <Typography variant="body2" color="textSecondary" align="center">
                  และอีก {previewData.cards.length - 3} คำศัพท์...
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewData(null)}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateFlashcardSet;