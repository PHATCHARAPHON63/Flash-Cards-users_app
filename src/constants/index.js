export const provinces = [
  'กรุงเทพมหานคร',
  'กระบี่',
  'กาญจนบุรี',
  'กาฬสินธุ์',
  'กำแพงเพชร',
  'ขอนแก่น',
  'จันทบุรี',
  'ฉะเชิงเทรา',
  'ชลบุรี',
  'ชัยนาท',
  'ชัยภูมิ',
  'ชุมพร',
  'เชียงราย',
  'เชียงใหม่',
  'ตรัง',
  'ตราด',
  'ตาก',
  'นครนายก',
  'นครปฐม',
  'นครพนม',
  'นครราชสีมา',
  'นครศรีธรรมราช',
  'นครสวรรค์',
  'นนทบุรี',
  'นราธิวาส',
  'น่าน',
  'บึงกาฬ',
  'บุรีรัมย์',
  'ปทุมธานี',
  'ประจวบคีรีขันธ์',
  'ปราจีนบุรี',
  'ปัตตานี',
  'พระนครศรีอยุธยา',
  'พังงา',
  'พัทลุง',
  'พิจิตร',
  'พิษณุโลก',
  'เพชรบุรี',
  'เพชรบูรณ์',
  'แพร่',
  'พะเยา',
  'ภูเก็ต',
  'มหาสารคาม',
  'มุกดาหาร',
  'แม่ฮ่องสอน',
  'ยโสธร',
  'ยะลา',
  'ร้อยเอ็ด',
  'ระนอง',
  'ระยอง',
  'ราชบุรี',
  'ลพบุรี',
  'ลำปาง',
  'ลำพูน',
  'เลย',
  'ศรีสะเกษ',
  'สกลนคร',
  'สงขลา',
  'สตูล',
  'สมุทรปราการ',
  'สมุทรสงคราม',
  'สมุทรสาคร',
  'สระแก้ว',
  'สระบุรี',
  'สิงห์บุรี',
  'สุโขทัย',
  'สุพรรณบุรี',
  'สุราษฎร์ธานี',
  'สุรินทร์',
  'หนองคาย',
  'หนองบัวลำภู',
  'อ่างทอง',
  'อุดรธานี',
  'อุทัยธานี',
  'อุตรดิตถ์',
  'อุบลราชธานี',
  'อำนาจเจริญ'
];

export const DONT_KNOW_DEPARTMENT = 'ไม่ทราบเขตพื้นที่การศึกษา';
export const OTHER_DEPARTMENT = 'หน่วยงานนอกเขตพื้นที่การศึกษา';

export const OTHER_DEPARTMENT_LIST = [
  'สำนักอาชีวะศึกษา',
  'สำนักงานการศึกษาตลอดชีวิต',
  'สช (สำนักการศึกษาเอกชน)',
  'สศศ (สำนักงานการศึกษาพิเศษ)'
];

export const REPORT_STATUS = {
  waitingForDepartmentAccept: 'รอสำนักงานเขตรับเรื่อง',
  departmentOperating: 'สำนักงานเขตกำลังดำเนินการ',

  waitingForCenterAccept: 'อยู่ระหว่างศูนย์ความปลอดภัยตรวจสอบ',

  waitingForVocationalAccept: 'รอสำนักอาชีวะศึกษารับเรื่อง',
  vocationalOperating: 'สำนักอาชีวะศึกษากำลังดำเนินการ',
  waitingForNonFormalEducationOfficeAccept: 'รอสำนักงานการศึกษาตลอดชีวิตรับเรื่อง',
  nonFormalEducationOfficeOperating: 'สำนักงานการศึกษาตลอดชีวิตกำลังดำเนินการ',
  waitingForPrivateEducationOfficeAccept: 'รอสำนักการศึกษาเอกชนรับเรื่อง',
  privateEducationOfficeOperating: 'สำนักการศึกษาเอกชนกำลังดำเนินการ',
  waitingForSpecialEducationOfficeAccept: 'รอสำนักงานการศึกษาพิเศษรับเรื่อง',
  specialEducationOfficeOperating: 'สำนักงานการศึกษาพิเศษกำลังดำเนินการ',

  success: 'ดำเนินการเรียบร้อย',
  failure: 'ไม่เรียบร้อย'
};

export const COMMENT_OWNER = {
  user: 'user',
  school: 'school',
  department: 'department',
  vocational: 'vocational',
  privateEducationOffice: 'privateEducationOffice',
  specialEducationOffice: 'specialEducationOffice',
  nonFormalEducationOffice: 'nonFormalEducationOffice',
  obec: 'obec'
};

export const APPEAL = 'อุทธรณ์';

export const APPEALINREJECT = {
  reject: '',
  rejectAppealStart: 'อุทธรณ์ครั้งที่1ไม่เรียบร้อย',
  rejectAppeal: 'อุทธรณ์ครั้งที่2ไม่เรียบร้อย',
  rejectAppealEnd: 'อุทธรณ์ครั้งที่3ไม่เรียบร้อย'
};
