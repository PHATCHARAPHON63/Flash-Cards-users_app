import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  Chip,
  Divider,
  useTheme,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  CircularProgress
} from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { IconPlus, IconTrash, IconDeviceFloppy, IconEye, IconCards } from '@tabler/icons-react';
import MainCard from '../../ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { createCategory, createMultipleFlashcards } from '../../component/function/flashcard.service';

// สร้าง Schema สำหรับตรวจสอบข้อมูล
const flashcardSchema = Yup.object().shape({
  categoryName: Yup.string().required('กรุณากรอกชื่อหมวดหมู่'),
  description: Yup.string().required('กรุณากรอกคำอธิบาย'),
  isPublic: Yup.boolean(),
  cards: Yup.array()
    .of(
      Yup.object().shape({
        front: Yup.string().required('กรุณากรอกคำศัพท์'),
        back: Yup.string().required('กรุณากรอกคำแปล'),
        phonetic: Yup.string(),
        example: Yup.string()
      })
    )
    .min(1, 'ต้องมีการ์ดอย่างน้อย 1 ใบ')
});

// สร้างค่าเริ่มต้น
const initialValues = {
  categoryName: '',
  description: '',
  difficulty: 'medium',
  isPublic: true,
  icon: '📚',
  color: '#4CAF50',
  cards: [{ front: '', phonetic: '', back: '', example: '', difficulty: 'Medium' }]
};

const FlashcardCreate = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // แสดงตัวอย่าง
  const handlePreview = (values) => {
    setPreviewData(values);
  };

  // บันทึกข้อมูล
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // 1. สร้างหมวดหมู่ใหม่
      const categoryData = {
        title: values.categoryName,
        description: values.description,
        difficulty: values.difficulty,
        is_public: values.isPublic,
        icon: values.icon,
        color: values.color
      };

      const categoryResponse = await createCategory(categoryData);

      // 2. เตรียมข้อมูลคำศัพท์
      const cardsData = values.cards.map((card) => ({
        front: card.front,
        back: card.back,
        phonetic: card.phonetic || '',
        example: card.example || '',
        difficulty: card.difficulty || 'Medium'
      }));

      // 3. สร้างคำศัพท์ใหม่ในหมวดหมู่นี้
      await createMultipleFlashcards(categoryResponse.category._id, cardsData);

      // แสดงข้อความสำเร็จ
      setSubmitSuccess(true);
      resetForm();

      // ซ่อนข้อความสำเร็จหลังจาก 3 วินาที
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

      setIsSubmitting(false);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      setSubmitError(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);

      // ซ่อนข้อความผิดพลาดหลังจาก 5 วินาที
      setTimeout(() => {
        setSubmitError(null);
      }, 5000);
    }
  };

  // กลับไปหน้าหมวดหมู่
  const handleBackToCategories = () => {
    navigate('/student/flashcards/categories');
  };

  return (
    <MainCard title="สร้างชุดคำศัพท์ใหม่">
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={handleBackToCategories} sx={{ mb: 3 }}>
          กลับไปยังหมวดหมู่
        </Button>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            บันทึกชุดคำศัพท์สำเร็จ
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Formik initialValues={initialValues} validationSchema={flashcardSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    ข้อมูลหมวดหมู่
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

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
                      <FormControl fullWidth margin="normal" error={touched.difficulty && Boolean(errors.difficulty)}>
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
                        <FormHelperText>{touched.difficulty && errors.difficulty}</FormHelperText>
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
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <Typography variant="subtitle2" gutterBottom>
                          สิทธิ์การเข้าถึง:
                        </Typography>
                        <Select
                          name="isPublic"
                          value={values.isPublic}
                          onChange={handleChange}
                          displayEmpty
                          size="small"
                          sx={{ minWidth: 200 }}
                        >
                          <MenuItem value={true}>สาธารณะ (ทุกคนเข้าถึงได้)</MenuItem>
                          <MenuItem value={false}>ส่วนตัว (เฉพาะคุณเท่านั้น)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>
                      การ์ดคำศัพท์
                    </Typography>
                    <Chip label={`${values.cards.length} คำศัพท์`} color="primary" icon={<IconCards size={16} />} />
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <FieldArray name="cards">
                    {({ remove, push }) => (
                      <Box>
                        {values.cards.map((card, index) => (
                          <Box
                            key={index}
                            sx={{
                              mb: 4,
                              p: 3,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              position: 'relative',
                              bgcolor: theme.palette.background.neutral || theme.palette.grey[50]
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
                                  error={touched.cards?.[index]?.front && Boolean(errors.cards?.[index]?.front)}
                                  helperText={touched.cards?.[index]?.front && errors.cards?.[index]?.front}
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
                                  error={touched.cards?.[index]?.back && Boolean(errors.cards?.[index]?.back)}
                                  helperText={touched.cards?.[index]?.back && errors.cards?.[index]?.back}
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
                                  placeholder="เช่น I eat an apple every day."
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal">
                                  <InputLabel>ระดับความยาก</InputLabel>
                                  <Select
                                    name={`cards.${index}.difficulty`}
                                    value={card.difficulty || 'Medium'}
                                    onChange={handleChange}
                                    label="ระดับความยาก"
                                  >
                                    <MenuItem value="Easy">ง่าย</MenuItem>
                                    <MenuItem value="Medium">ปานกลาง</MenuItem>
                                    <MenuItem value="Hard">ยาก</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                {values.cards.length > 1 && (
                                  <IconButton
                                    onClick={() => remove(index)}
                                    color="error"
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.error.light,
                                      '&:hover': { bgcolor: theme.palette.error.main, color: '#fff' }
                                    }}
                                  >
                                    <IconTrash size={18} />
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
                          onClick={() => push({ front: '', phonetic: '', back: '', example: '', difficulty: 'Medium' })}
                          sx={{ mt: 1 }}
                        >
                          เพิ่มการ์ดคำศัพท์
                        </Button>
                      </Box>
                    )}
                  </FieldArray>

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="info"
                      startIcon={<IconEye />}
                      onClick={() => handlePreview(values)}
                      disabled={Object.keys(errors).length > 0}
                    >
                      ดูตัวอย่าง
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <IconDeviceFloppy />}
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                    >
                      {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกชุดคำศัพท์'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Form>
          )}
        </Formik>
      </Box>

      {/* กล่องแสดงตัวอย่าง */}
      <Dialog open={Boolean(previewData)} onClose={() => setPreviewData(null)} maxWidth="md" fullWidth>
        <DialogTitle>ตัวอย่างชุดคำศัพท์</DialogTitle>
        <DialogContent>
          {previewData && (
            <Box>
              <Typography variant="h3" gutterBottom>
                {previewData.categoryName}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {previewData.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Chip
                  label={previewData.difficulty === 'easy' ? 'ง่าย' : previewData.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                  color={previewData.difficulty === 'easy' ? 'success' : previewData.difficulty === 'medium' ? 'primary' : 'error'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip label={previewData.isPublic ? 'สาธารณะ' : 'ส่วนตัว'} variant="outlined" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  {previewData.cards.length} คำศัพท์
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                ตัวอย่างคำศัพท์:
              </Typography>

              {previewData.cards.map((card, index) => (
                <Card key={index} sx={{ mb: 2, bgcolor: theme.palette.background.neutral || theme.palette.grey[100] }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          คำศัพท์:
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                          {card.front || '(ไม่ได้ระบุ)'}
                        </Typography>
                        {card.phonetic && (
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {card.phonetic}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" gutterBottom>
                          คำแปล:
                        </Typography>
                        <Typography variant="h5">{card.back || '(ไม่ได้ระบุ)'}</Typography>
                      </Grid>
                      {card.example && (
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle1" gutterBottom>
                            ตัวอย่างประโยค:
                          </Typography>
                          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                            "{card.example}"
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewData(null)} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default FlashcardCreate;
