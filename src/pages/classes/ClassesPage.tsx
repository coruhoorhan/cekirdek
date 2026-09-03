import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  ageGroup: string;
  capacity: number;
  studentCount: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    capacity: 10,
  });

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*');

      if (classesError) {
        if (classesError.code !== 'PGRST116' && !classesError.message.includes('does not exist')) {
          console.error("Classes fetch error:", classesError);
          toast.error("Sınıflar yüklenirken bir hata oluştu.");
        }
        setClasses([]);
        return;
      }

      const formattedClasses: ClassItem[] = await Promise.all((classesData || []).map(async (cls) => {
        let studentCount = 0;
        if (typeof cls.student_count === 'number') {
           studentCount = cls.student_count;
        } else {
           try {
             const { count, error: profileError } = await supabase
               .from('profiles')
               .select('*', { count: 'exact', head: true })
               .eq('class_id', cls.id);
             if (!profileError && count !== null) {
               studentCount = count;
             }
           } catch (e) {
             console.log("Could not fetch student count from profiles", e);
           }
        }
        return {
          id: cls.id,
          name: cls.name || '',
          ageGroup: cls.age_group || cls.ageGroup || '',
          capacity: cls.capacity || 0,
          studentCount
        };
      }));

      formattedClasses.sort((a, b) => a.name.localeCompare(b.name));
      setClasses(formattedClasses);
    } catch (err) {
      console.error("Fetch classes error:", err);
      toast.error("Sınıflar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleDelete = async (classId: string, studentCount: number) => {
    if (studentCount > 0) {
      toast.error("Dolu sınıf silinemez. Lütfen önce öğrencileri başka sınıfa aktarın.");
      return;
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm("Bu sınıfı silmek istediğinize emin misiniz?")) return;

    try {
      const { error } = await supabase.from('classes').delete().eq('id', classId);
      if (error) throw error;

      toast.success("Sınıf başarıyla silindi.");
      fetchClasses();
    } catch (err) {
      console.error("Delete class error:", err);
      toast.error("Sınıf silinirken bir hata oluştu.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.ageGroup || formData.capacity < 1) {
      toast.error("Lütfen tüm alanları geçerli şekilde doldurun.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        age_group: formData.ageGroup,
        capacity: formData.capacity
      };

      if (currentClass) {
        const { error } = await supabase
          .from('classes')
          .update(payload)
          .eq('id', currentClass.id);

        if (error) {
          if (error.message.includes('age_group')) {
             const { error: err2 } = await supabase
               .from('classes')
               .update({ name: payload.name, ageGroup: payload.age_group, capacity: payload.capacity })
               .eq('id', currentClass.id);
             if (err2) throw err2;
          } else {
             throw error;
          }
        }
        toast.success("Sınıf başarıyla güncellendi.");
      } else {
        const { error } = await supabase
          .from('classes')
          .insert([payload]);

        if (error) {
          if (error.message.includes('age_group')) {
             const { error: err2 } = await supabase
               .from('classes')
               .insert([{ name: payload.name, ageGroup: payload.age_group, capacity: payload.capacity }]);
             if (err2) throw err2;
          } else {
             throw error;
          }
        }
        toast.success("Yeni sınıf oluşturuldu.");
      }

      setIsDialogOpen(false);
      fetchClasses();
    } catch (err) {
      console.error("Save class error:", err);
      toast.error("Sınıf kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (cls: ClassItem) => {
    setCurrentClass(cls);
    setFormData({
      name: cls.name,
      ageGroup: cls.ageGroup,
      capacity: cls.capacity
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sınıf Yönetimi</h1>
        <Button onClick={() => { setIsDialogOpen(true); setCurrentClass(null); setFormData({ name: '', ageGroup: '', capacity: 10 }); }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Sınıf
        </Button>
      </div>

      <div className="bg-white rounded-md border">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : classes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Henüz sınıf bulunmamaktadır.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sınıf Adı</TableHead>
                <TableHead>Yaş Grubu</TableHead>
                <TableHead>Kontenjan</TableHead>
                <TableHead>Öğrenci Sayısı</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.ageGroup}</TableCell>
                  <TableCell>{cls.capacity}</TableCell>
                  <TableCell>
                    <span className={cls.studentCount >= cls.capacity ? 'text-red-600 font-semibold' : ''}>
                      {cls.studentCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(cls)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cls.id, cls.studentCount)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentClass ? 'Sınıfı Düzenle' : 'Yeni Sınıf Ekle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sınıf Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Örn: Papatyalar Sınıfı"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageGroup">Yaş Grubu</Label>
              <Input
                id="ageGroup"
                value={formData.ageGroup}
                onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                placeholder="Örn: 3-4 Yaş"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Kontenjan</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>İptal</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentClass ? 'Güncelle' : 'Kaydet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
