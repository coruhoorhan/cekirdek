import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, Eye, Plus, Pencil, Trash2 } from 'lucide-react';
import { getClasses, Class, createClass, updateClass, deleteClass, getStudentCount } from '@/lib/classService';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ClassWithCount extends Class {
  studentCount?: number;
}

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<Partial<Class>>({ name: '', age_group: '', capacity: 20 });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await getClasses();

      // Fetch student counts
      const classesWithCounts = await Promise.all(data.map(async (cls) => {
        const count = await getStudentCount(cls.id);
        return { ...cls, studentCount: count };
      }));

      setClasses(classesWithCounts);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Sınıflar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenModal = (cls?: Class) => {
    if (cls) {
      setIsEditing(true);
      setCurrentClass({ ...cls, age_group: cls.age_group || (cls as any).ageGroup });
    } else {
      setIsEditing(false);
      setCurrentClass({ name: '', age_group: '', capacity: 20 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentClass.name || !currentClass.age_group || !currentClass.capacity) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        name: currentClass.name,
        age_group: currentClass.age_group,
        capacity: Number(currentClass.capacity)
      };

      if (isEditing && currentClass.id) {
        await updateClass(currentClass.id, dataToSave);
        toast.success('Sınıf başarıyla güncellendi');
      } else {
        await createClass(dataToSave);
        toast.success('Sınıf başarıyla oluşturuldu');
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Sınıf kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeletingId(deleteConfirmId);
    try {
      await deleteClass(deleteConfirmId);
      toast.success('Sınıf başarıyla silindi');
      setDeleteConfirmId(null);
      fetchClasses();
    } catch (error: unknown) {
      console.error('Error deleting class:', error);
      toast.error(error instanceof Error ? error.message : 'Sınıf silinirken bir hata oluştu');
      setDeleteConfirmId(null);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sınıflar Yönetimi</h1>
          <p className="text-muted-foreground">Okuldaki sınıfları ve atanan öğretmenleri yönetin</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Sınıf Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Mevcut Sınıflar
          </CardTitle>
          <CardDescription>
            Sınıfların listesi ve detaylarına ulaşabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : classes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sınıf Adı</TableHead>
                  <TableHead>Yaş Grubu</TableHead>
                  <TableHead>Kapasite</TableHead>
                  <TableHead>Öğrenci Sayısı</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.age_group || (cls as any).ageGroup}</TableCell>
                    <TableCell>{cls.capacity}</TableCell>
                    <TableCell>{cls.studentCount || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(cls)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/classes/${cls.id}`)}
                          title="Detaylar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDelete(cls.id)}
                          disabled={isDeletingId === cls.id}
                        >
                          {isDeletingId === cls.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-gray-500">
              Kayıtlı sınıf bulunamadı.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Sınıfı Düzenle' : 'Yeni Sınıf Ekle'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Sınıf bilgilerini aşağıdan güncelleyebilirsiniz.' : 'Yeni sınıf oluşturmak için bilgileri doldurun.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sınıf Adı</Label>
              <Input
                id="name"
                value={currentClass.name || ''}
                onChange={(e) => setCurrentClass({ ...currentClass, name: e.target.value })}
                placeholder="Örn: Papatyalar Sınıfı"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age_group">Yaş Grubu</Label>
              <Input
                id="age_group"
                value={currentClass.age_group || ''}
                onChange={(e) => setCurrentClass({ ...currentClass, age_group: e.target.value })}
                placeholder="Örn: 3-4 Yaş"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Kontenjan (Kapasite)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={currentClass.capacity || ''}
                onChange={(e) => setCurrentClass({ ...currentClass, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isEditing ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sınıfı Sil</DialogTitle>
            <DialogDescription>
              Bu sınıfı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>İptal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={!!isDeletingId}>
              {isDeletingId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassesPage;
