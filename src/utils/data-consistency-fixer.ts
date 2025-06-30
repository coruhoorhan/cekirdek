import { supabase } from '@/lib/supabaseClient';

interface DataInconsistency {
  type: string;
  email: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  fixable: boolean;
}

interface FixResult {
  success: boolean;
  message: string;
  details?: any;
}

export class DataConsistencyFixer {
  
  /**
   * Veri tutarsızlıklarını tespit et
   */
  static async detectInconsistencies(): Promise<DataInconsistency[]> {
    const inconsistencies: DataInconsistency[] = [];

    try {
      // 1. Applications tablosundaki tüm kayıtları al
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('*');

      if (appError) {
        console.error('Applications sorgu hatası:', appError);
        return inconsistencies;
      }

      // 2. Auth users tablosundaki tüm kullanıcıları al
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email, email_confirmed_at, raw_user_meta_data');

      if (authError) {
        console.error('Auth users sorgu hatası:', authError);
        return inconsistencies;
      }

      // 3. Profiles tablosundaki tüm profilleri al
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) {
        console.error('Profiles sorgu hatası:', profileError);
        return inconsistencies;
      }

      // 4. Tutarsızlıkları tespit et
      for (const app of applications || []) {
        const authUser = authUsers?.find(u => u.email === app.email);
        const profile = profiles?.find(p => p.id === authUser?.id);

        // Onaylanmış ama kullanıcı yok
        if (app.status === 'approved' && !authUser) {
          inconsistencies.push({
            type: 'approved_no_user',
            email: app.email,
            description: `Başvuru onaylanmış ama kullanıcı oluşturulmamış`,
            severity: 'high',
            fixable: true
          });
        }

        // Kullanıcı var ama başvuru pending
        if (app.status === 'pending' && authUser) {
          inconsistencies.push({
            type: 'user_exists_pending',
            email: app.email,
            description: `Kullanıcı mevcut ama başvuru hala beklemede`,
            severity: 'medium',
            fixable: true
          });
        }

        // E-posta doğrulaması yapılmamış
        if (authUser && !authUser.email_confirmed_at) {
          inconsistencies.push({
            type: 'email_not_confirmed',
            email: app.email,
            description: `E-posta doğrulaması yapılmamış`,
            severity: 'medium',
            fixable: false // Manuel müdahale gerekli
          });
        }

        // Profile name eksik
        if (authUser && profile && !profile.name) {
          inconsistencies.push({
            type: 'missing_profile_name',
            email: app.email,
            description: `Profile'da isim eksik`,
            severity: 'low',
            fixable: true
          });
        }

        // Geçersiz e-posta formatı
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(app.email)) {
          inconsistencies.push({
            type: 'invalid_email_format',
            email: app.email,
            description: `Geçersiz e-posta formatı`,
            severity: 'high',
            fixable: false // Manuel düzeltme gerekli
          });
        }
      }

      return inconsistencies;

    } catch (error) {
      console.error('Tutarsızlık tespit hatası:', error);
      return inconsistencies;
    }
  }

  /**
   * Onaylanmış ama kullanıcı olmayan başvuruları düzelt
   */
  static async fixApprovedNoUser(email: string): Promise<FixResult> {
    try {
      // Başvuru bilgilerini al
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('email', email)
        .single();

      if (appError || !application) {
        return { success: false, message: 'Başvuru bulunamadı' };
      }

      // E-posta format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Geçersiz e-posta formatı' };
      }

      // Kullanıcı oluştur
      const tempPassword = Math.random().toString(36).slice(-8) + 'Temp123!';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: tempPassword,
        options: {
          data: {
            full_name: application.name,
            role: 'parent'
          }
        }
      });

      if (authError) {
        return { success: false, message: `Kullanıcı oluşturulamadı: ${authError.message}` };
      }

      // Profile name'i güncelle
      if (authData.user) {
        await supabase
          .from('profiles')
          .update({ name: application.name })
          .eq('id', authData.user.id);
      }

      return { 
        success: true, 
        message: 'Kullanıcı başarıyla oluşturuldu',
        details: { userId: authData.user?.id }
      };

    } catch (error) {
      return { success: false, message: `Hata: ${error}` };
    }
  }

  /**
   * Kullanıcı var ama başvuru pending olanları düzelt
   */
  static async fixUserExistsPending(email: string): Promise<FixResult> {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('email', email);

      if (error) {
        return { success: false, message: `Güncelleme hatası: ${error.message}` };
      }

      return { success: true, message: 'Başvuru durumu approved olarak güncellendi' };

    } catch (error) {
      return { success: false, message: `Hata: ${error}` };
    }
  }

  /**
   * Eksik profile name'leri düzelt
   */
  static async fixMissingProfileName(email: string): Promise<FixResult> {
    try {
      // Başvuru bilgilerini al
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('name')
        .eq('email', email)
        .single();

      if (appError || !application) {
        return { success: false, message: 'Başvuru bulunamadı' };
      }

      // Auth user'ı bul
      const { data: authUser, error: authError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();

      if (authError || !authUser) {
        return { success: false, message: 'Kullanıcı bulunamadı' };
      }

      // Profile name'i güncelle
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: application.name })
        .eq('id', authUser.id);

      if (updateError) {
        return { success: false, message: `Profile güncelleme hatası: ${updateError.message}` };
      }

      return { success: true, message: 'Profile name başarıyla güncellendi' };

    } catch (error) {
      return { success: false, message: `Hata: ${error}` };
    }
  }

  /**
   * Tüm düzeltilebilir sorunları otomatik düzelt
   */
  static async fixAllAutomatically(): Promise<{ fixed: number; failed: number; details: any[] }> {
    const inconsistencies = await this.detectInconsistencies();
    const fixableInconsistencies = inconsistencies.filter(inc => inc.fixable);
    
    let fixed = 0;
    let failed = 0;
    const details: any[] = [];

    for (const inconsistency of fixableInconsistencies) {
      let result: FixResult;

      switch (inconsistency.type) {
        case 'approved_no_user':
          result = await this.fixApprovedNoUser(inconsistency.email);
          break;
        case 'user_exists_pending':
          result = await this.fixUserExistsPending(inconsistency.email);
          break;
        case 'missing_profile_name':
          result = await this.fixMissingProfileName(inconsistency.email);
          break;
        default:
          result = { success: false, message: 'Bilinmeyen sorun türü' };
      }

      if (result.success) {
        fixed++;
      } else {
        failed++;
      }

      details.push({
        email: inconsistency.email,
        type: inconsistency.type,
        result: result
      });
    }

    return { fixed, failed, details };
  }

  /**
   * Veri tutarlılığı raporu oluştur
   */
  static async generateReport(): Promise<{
    totalApplications: number;
    totalAuthUsers: number;
    totalProfiles: number;
    inconsistencies: DataInconsistency[];
    summary: {
      high: number;
      medium: number;
      low: number;
      fixable: number;
    };
  }> {
    const inconsistencies = await this.detectInconsistencies();

    // İstatistikleri al
    const { data: applications } = await supabase.from('applications').select('id');
    const { data: authUsers } = await supabase.from('auth.users').select('id');
    const { data: profiles } = await supabase.from('profiles').select('id');

    const summary = {
      high: inconsistencies.filter(inc => inc.severity === 'high').length,
      medium: inconsistencies.filter(inc => inc.severity === 'medium').length,
      low: inconsistencies.filter(inc => inc.severity === 'low').length,
      fixable: inconsistencies.filter(inc => inc.fixable).length
    };

    return {
      totalApplications: applications?.length || 0,
      totalAuthUsers: authUsers?.length || 0,
      totalProfiles: profiles?.length || 0,
      inconsistencies,
      summary
    };
  }
}
