import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient'; // Supabase client'ı import ediyoruz
import { Loader2, UserPlus } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [children, setChildren] = useState([{
    name: '',
    birthdate: '',
    gender: '',
    allergy: '',
    note: '',
    emergencyContacts: [{ name: '', phone: '', relation: '' }],
    medications: [{ name: '', dose: '', usage_note: '' }],
    photo: null as File | null,
  }]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleChildFieldChange = (idx: number, field: string, value: any) => {
    setChildren((prev) => prev.map((child, i) => i === idx ? { ...child, [field]: value } : child));
  };

  const handleEmergencyContactChange = (childIdx: number, contactIdx: number, field: string, value: string) => {
    setChildren((prev) => prev.map((child, i) => i === childIdx ? {
      ...child,
      emergencyContacts: child.emergencyContacts.map((c, j) => j === contactIdx ? { ...c, [field]: value } : c)
    } : child));
  };

  const handleAddEmergencyContact = (childIdx: number) => {
    setChildren((prev) => prev.map((child, i) => i === childIdx ? {
      ...child,
      emergencyContacts: [...child.emergencyContacts, { name: '', phone: '', relation: '' }]
    } : child));
  };

  const handleRemoveEmergencyContact = (childIdx: number, contactIdx: number) => {
    setChildren((prev) => prev.map((child, i) => i === childIdx ? {
      ...child,
      emergencyContacts: child.emergencyContacts.filter((_, j) => j !== contactIdx)
    } : child));
  };

  const handleMedicationChange = (childIdx: number, medIdx: number, field: string, value: string) => {
    setChildren((prev) => prev.map((child, i) => i === childIdx ? {
      ...child,
      medications: child.medications.map((m, j) => j === medIdx ? { ...m, [field]: value } : m)
    } : child));
  };

  const handleAddMedication = (childIdx: number) => {
    setChildren((prev) => prev.map((child, i) => i === childIdx ? {
      ...child,
      medications: [...child.medications, { name: '', dose: '', usage_note: '' }],
    } : child));
  };

  const handleAddChild = () => {
    setChildren((prev) => [
      ...prev,
      {
        name: '',
        birthdate: '',
        gender: '',
        allergy: '',
        note: '',
        emergencyContacts: [{ name: '', phone: '', relation: '' }],
        medications: [{ name: '', dose: '', usage_note: '' }],
        photo: null,
      },
    ]);
  };

  const handleRemoveChild = (index: number) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      console.log("Başvuru gönderiliyor...");
      
      // Supabase URL ve anahtarını kontrol et
      console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Mevcut" : "Eksik");
      
      // 1. Ana başvuru kaydını ekle
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert([
          {
            email,
            name: fullName,
            phone,
            status: 'pending',
          },
        ])
        .select();

      if (appError) {
        console.error("Supabase application insert error:", appError);
        setLoading(false);
        setError(`Başvuru gönderilirken hata oluştu: ${appError.message}`);
        return;
      }
      
      if (!appData || appData.length === 0) {
        console.error("No application data returned");
        setLoading(false);
        setError('Başvuru kaydı oluşturulurken beklenmedik bir hata oluştu.');
        return;
      }

      const applicationId = appData[0].id;
      console.log("Application created with ID:", applicationId);

      // 2. Her çocuk için işlemler
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        
        if (child.name.trim() === '') continue;
        
        console.log(`Processing child ${i+1}:`, child.name);
        
        // a. Çocuk kaydını ekle - burada direkt supabase kullanmaya devam ediyoruz
        const { data: childData, error: childError } = await supabase
          .from('children')
          .insert([
            {
              application_id: applicationId,
              name: child.name,
              birthdate: child.birthdate || null,
              gender: child.gender || null,
              allergy: child.allergy || null,
              note: child.note || null,
            },
          ])
          .select();
          
        if (childError) {
          console.error(`Error inserting child ${i+1}:`, childError);
          setError(`${child.name} kaydı eklenirken hata oluştu: ${childError.message}`);
          continue;
        }
        
        if (!childData || !childData[0]) {
          console.error(`No data returned for child ${i+1}`);
          continue;
        }
        
        const childId = childData[0].id;
        console.log(`Child ${i+1} created with ID:`, childId);
        
        // b. Fotoğraf varsa yükle
        if (child.photo) {
          const fileExt = child.photo.name.split('.').pop();
          const fileName = `${childId}.${fileExt}`;
          const filePath = `child-photos/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('children-photos')
            .upload(filePath, child.photo);
            
          if (uploadError) {
            console.error(`Error uploading photo for child ${i+1}:`, uploadError);
          } else {
            // Fotoğraf yüklendiyse child kaydını güncelle
            const { data: { publicUrl } } = supabase.storage
              .from('children-photos')
              .getPublicUrl(filePath);
            await supabase
              .from('children')
              .update({ photo_url: publicUrl })
              .eq('id', childId);
          }
        }
        
        // c. Acil durum kişilerini ekle
        for (const contact of child.emergencyContacts) {
          if (contact.name.trim() === '' || contact.phone.trim() === '') continue;
          
          const { error: contactError } = await supabase
            .from('emergency_contacts')
            .insert([
              {
                child_id: childId,
                name: contact.name,
                phone: contact.phone,
                relation: contact.relation || null,
              },
            ]);
            
          if (contactError) {
            console.error(`Error inserting emergency contact for child ${i+1}:`, contactError);
          }
        }
        
        // d. İlaçları ekle
        for (const med of child.medications) {
          if (med.name.trim() === '') continue;
          
          const { error: medError } = await supabase
            .from('medications')
            .insert([
              {
                child_id: childId,
                name: med.name,
                dose: med.dose || null,
                usage_note: med.usage_note || null,
              },
            ]);
            
          if (medError) {
            console.error(`Error inserting medication for child ${i+1}:`, medError);
          }
        }
      }

      setLoading(false);
      setMessage('Başvurunuz alınmıştır. Yönetici onayından sonra bilgilendirileceksiniz.');
      // Formu temizle
      setFullName('');
      setEmail('');
      setPhone('');
      setChildren([
        {
          name: '',
          birthdate: '',
          gender: '',
          allergy: '',
          note: '',
          emergencyContacts: [{ name: '', phone: '', relation: '' }],
          medications: [{ name: '', dose: '', usage_note: '' }],
          photo: null,
        },
      ]);
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoading(false);
      setError('Beklenmeyen bir hata oluştu: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-orange-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <UserPlus size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Yeni Hesap Oluştur</CardTitle>
          <CardDescription>
            Okul yönetim sistemine kaydolun.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Adınız Soyadınız"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@eposta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="05xx xxx xx xx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Çocuk(lar)</Label>
              {children.map((child, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50 mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="mb-2">
                      <Input type="text" placeholder="Çocuk adı" value={child.name} onChange={e => handleChildFieldChange(idx, 'name', e.target.value)} required />
                    </div>
                    <div className="mb-2">
                      <Input type="date" value={child.birthdate} onChange={e => handleChildFieldChange(idx, 'birthdate', e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <select className="border rounded px-2 py-1 w-full" value={child.gender} onChange={e => handleChildFieldChange(idx, 'gender', e.target.value)} required>
                        <option value="">Cinsiyet</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kız</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <Input type="text" placeholder="Alerji (örn: Yok, Fıstık, Penisilin)" value={child.allergy} onChange={e => handleChildFieldChange(idx, 'allergy', e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <textarea className="border rounded px-2 py-1 w-full" placeholder="Not (isteğe bağlı)" value={child.note} onChange={e => handleChildFieldChange(idx, 'note', e.target.value)} rows={1} />
                    </div>
                    <div className="mb-2">
                      <input type="file" accept="image/*" onChange={e => handleChildFieldChange(idx, 'photo', e.target.files?.[0] || null)} />
                    </div>
                  </div>
                  {/* Emergency Contacts */}
                  <div className="bg-white p-2 rounded border mt-4">
                    <div className="font-semibold mb-2">Acil Durum Kişileri</div>
                    {child.emergencyContacts.map((contact, cIdx) => (
                      <div key={cIdx} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <Input type="text" placeholder="Ad Soyad" value={contact.name} onChange={e => handleEmergencyContactChange(idx, cIdx, 'name', e.target.value)} required />
                        <Input type="text" placeholder="Telefon" value={contact.phone} onChange={e => handleEmergencyContactChange(idx, cIdx, 'phone', e.target.value)} required />
                        <Input type="text" placeholder="Yakınlık (örn: Anne, Baba, Dede)" value={contact.relation} onChange={e => handleEmergencyContactChange(idx, cIdx, 'relation', e.target.value)} />
                        {child.emergencyContacts.length > 1 && <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveEmergencyContact(idx, cIdx)}>-</Button>}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => handleAddEmergencyContact(idx)}>+ Acil Kişi Ekle</Button>
                  </div>
                  {/* Medications */}
                  <div className="bg-white p-2 rounded border mt-4">
                    <div className="font-semibold mb-2">Kullanması Gereken İlaçlar</div>
                    {child.medications.map((med, mIdx) => (
                      <div key={mIdx} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <Input type="text" placeholder="İlaç Adı" value={med.name} onChange={e => handleMedicationChange(idx, mIdx, 'name', e.target.value)} required />
                        <Input type="text" placeholder="Doz" value={med.dose} onChange={e => handleMedicationChange(idx, mIdx, 'dose', e.target.value)} />
                        <Input type="text" placeholder="Kullanım Notu/Saati" value={med.usage_note} onChange={e => handleMedicationChange(idx, mIdx, 'usage_note', e.target.value)} />
                        {child.medications.length > 1 && <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveChild(idx)}>-</Button>}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => handleAddMedication(idx)}>+ İlaç Ekle</Button>
                  </div>
                  {children.length > 1 && <Button type="button" variant="destructive" size="sm" className="mt-4" onClick={() => handleRemoveChild(idx)}>- Çocuğu Sil</Button>}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mb-6" onClick={handleAddChild}>+ Çocuk Ekle</Button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Kayıt Ol
            </Button>
            <p className="text-xs text-center text-gray-500">
              Zaten bir hesabınız var mı?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
