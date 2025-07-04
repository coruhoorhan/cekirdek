import { z } from 'zod';

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, 'E-posta adresi gereklidir')
  .email('Geçerli bir e-posta adresi giriniz')
  .max(254, 'E-posta adresi çok uzun');

export const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .max(128, 'Şifre çok uzun')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
  .regex(/\d/, 'Şifre en az bir rakam içermelidir')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Şifre en az bir özel karakter içermelidir');

export const phoneSchema = z
  .string()
  .min(1, 'Telefon numarası gereklidir')
  .regex(/^(\+90|0)?[5][0-9]{9}$/, 'Geçerli bir Türkiye telefon numarası giriniz');

export const nameSchema = z
  .string()
  .min(2, 'Ad en az 2 karakter olmalıdır')
  .max(50, 'Ad çok uzun')
  .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad sadece harf ve boşluk içerebilir');

export const tcNoSchema = z
  .string()
  .length(11, 'TC Kimlik No 11 haneli olmalıdır')
  .regex(/^\d+$/, 'TC Kimlik No sadece rakam içerebilir')
  .refine((tc) => {
    // TC Kimlik No algoritması
    if (tc.length !== 11) return false;
    
    const digits = tc.split('').map(Number);
    
    // İlk hane 0 olamaz
    if (digits[0] === 0) return false;
    
    // 10. hane kontrolü
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    const check1 = ((sum1 * 7) - sum2) % 10;
    
    if (check1 !== digits[9]) return false;
    
    // 11. hane kontrolü
    const sum3 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    const check2 = sum3 % 10;
    
    return check2 === digits[10];
  }, 'Geçersiz TC Kimlik No');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Şifre gereklidir'),
});

export const signUpSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

// Child information schemas
export const emergencyContactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  relation: z.string().min(1, 'Yakınlık derecesi gereklidir'),
});

export const medicationSchema = z.object({
  name: z.string().min(1, 'İlaç adı gereklidir').max(100, 'İlaç adı çok uzun'),
  dose: z.string().max(50, 'Doz bilgisi çok uzun').optional(),
  usage_note: z.string().max(200, 'Kullanım notu çok uzun').optional(),
});

export const childSchema = z.object({
  name: nameSchema,
  birthdate: z.string().min(1, 'Doğum tarihi gereklidir').refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 6;
  }, 'Çocuk 0-6 yaş aralığında olmalıdır'),
  gender: z.enum(['erkek', 'kız'], {
    errorMap: () => ({ message: 'Cinsiyet seçimi gereklidir' }),
  }),
  allergy: z.string().max(500, 'Alerji bilgisi çok uzun').optional(),
  note: z.string().max(1000, 'Not çok uzun').optional(),
  emergencyContacts: z.array(emergencyContactSchema).min(1, 'En az bir acil durum kişisi gereklidir'),
  medications: z.array(medicationSchema).optional(),
});

export const applicationSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  children: z.array(childSchema).min(1, 'En az bir çocuk bilgisi gereklidir'),
});

// Admin schemas
export const userManagementSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: z.enum(['admin', 'teacher', 'parent'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' }),
  }),
  phone: phoneSchema.optional(),
});

export const classSchema = z.object({
  name: z.string().min(1, 'Sınıf adı gereklidir').max(50, 'Sınıf adı çok uzun'),
  ageGroup: z.string().min(1, 'Yaş grubu gereklidir'),
  capacity: z.number().min(1, 'Kontenjan en az 1 olmalıdır').max(30, 'Kontenjan en fazla 30 olabilir'),
  teacherId: z.string().uuid('Geçersiz öğretmen ID').optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').max(200, 'Başlık çok uzun'),
  content: z.string().min(1, 'İçerik gereklidir').max(5000, 'İçerik çok uzun'),
  targetAudience: z.enum(['all', 'teachers', 'parents', 'specific_class'], {
    errorMap: () => ({ message: 'Hedef kitle seçimi gereklidir' }),
  }),
  classIds: z.array(z.string().uuid()).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

// Daily report schemas
export const dailyReportSchema = z.object({
  childId: z.string().uuid('Geçersiz çocuk ID'),
  date: z.string().min(1, 'Tarih gereklidir'),
  breakfast: z.enum(['yedi', 'az_yedi', 'yemedi'], {
    errorMap: () => ({ message: 'Kahvaltı durumu seçimi gereklidir' }),
  }),
  lunch: z.enum(['yedi', 'az_yedi', 'yemedi'], {
    errorMap: () => ({ message: 'Öğle yemeği durumu seçimi gereklidir' }),
  }),
  snack: z.enum(['yedi', 'az_yedi', 'yemedi'], {
    errorMap: () => ({ message: 'Ara öğün durumu seçimi gereklidir' }),
  }),
  sleep: z.enum(['uyudu', 'az_uyudu', 'uyumadi'], {
    errorMap: () => ({ message: 'Uyku durumu seçimi gereklidir' }),
  }),
  toilet: z.enum(['basarili', 'kaza_oldu', 'bez_degisti'], {
    errorMap: () => ({ message: 'Tuvalet durumu seçimi gereklidir' }),
  }),
  mood: z.enum(['mutlu', 'normal', 'uzgun', 'huysuz'], {
    errorMap: () => ({ message: 'Genel ruh hali seçimi gereklidir' }),
  }),
  teacherNote: z.string().max(1000, 'Öğretmen notu çok uzun').optional(),
});

// Message schemas
export const messageSchema = z.object({
  recipientId: z.string().uuid('Geçersiz alıcı ID'),
  subject: z.string().min(1, 'Konu gereklidir').max(200, 'Konu çok uzun'),
  content: z.string().min(1, 'Mesaj içeriği gereklidir').max(2000, 'Mesaj çok uzun'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Geçerli bir dosya seçiniz' }),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
}).refine((data) => data.file.size <= data.maxSize, {
  message: 'Dosya boyutu çok büyük',
}).refine((data) => data.allowedTypes.includes(data.file.type), {
  message: 'Desteklenmeyen dosya türü',
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type ChildFormData = z.infer<typeof childSchema>;
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type UserManagementFormData = z.infer<typeof userManagementSchema>;
export type ClassFormData = z.infer<typeof classSchema>;
export type AnnouncementFormData = z.infer<typeof announcementSchema>;
export type DailyReportFormData = z.infer<typeof dailyReportSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
