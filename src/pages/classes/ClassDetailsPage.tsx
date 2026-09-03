import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Users, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { getClassById, getTeachers, getAssignedTeachers, assignTeacherToClass, removeTeacherFromClass, Class, Teacher } from '@/lib/classService';

const ClassDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cls, setCls] = useState<Class | null>(null);
  const [assignedTeachers, setAssignedTeachers] = useState<Teacher[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshTeachersList = async () => {
    if (!id) return;
    try {
      const assigned = await getAssignedTeachers(id);
      const allTeachers = await getTeachers();

      setAssignedTeachers(assigned);

      // Filter out already assigned teachers from the available list
      const assignedIds = assigned.map(t => t.id);
      const available = allTeachers.filter(t => !assignedIds.includes(t.id));
      setAvailableTeachers(available);
    } catch (error) {
      console.error('Error refreshing teachers list:', error);
    }
  };

  const fetchClassData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const classData = await getClassById(id);
      if (classData) {
        setCls(classData);
        await refreshTeachersList();
      }
    } catch (error) {
      console.error('Error fetching class details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClassData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAssignTeacher = async () => {
    if (!id || !selectedTeacherId) return;
    setIsAssigning(true);
    try {
      await assignTeacherToClass(id, selectedTeacherId);
      await refreshTeachersList();
      setIsModalOpen(false);
      setSelectedTeacherId(null);
    } catch (error) {
      console.error('Error assigning teacher:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    if (!id) return;
    try {
      await removeTeacherFromClass(id, teacherId);
      await refreshTeachersList();
    } catch (error) {
      console.error('Error removing teacher:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="text-center p-8 text-gray-500">
        Sınıf bulunamadı.
        <br />
        <Button variant="link" onClick={() => navigate('/admin/classes')}>Sınıflar Listesine Dön</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/classes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{cls.name}</h1>
          <p className="text-muted-foreground">Yaş Grubu: {cls.age_group || (cls as any).ageGroup} | Kapasite: {cls.capacity}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              Sınıf Öğretmenleri
            </CardTitle>
            <CardDescription>
              Bu sınıfa atanmış öğretmenleri görüntüleyin ve yönetin.
            </CardDescription>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Öğretmen Ata
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Öğretmen Ata</DialogTitle>
                <DialogDescription>
                  Listeden bu sınıfa atamak istediğiniz öğretmeni seçin.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {availableTeachers.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {availableTeachers.map(teacher => (
                      <div
                        key={teacher.id}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedTeacherId(teacher.id);
                          }
                        }}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedTeacherId === teacher.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedTeacherId(teacher.id)}
                      >
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.role || 'Öğretmen'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">Atanabilecek yeni öğretmen bulunmuyor.</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
                <Button
                  onClick={handleAssignTeacher}
                  disabled={!selectedTeacherId || isAssigning}
                >
                  {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Ata
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {assignedTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedTeachers.map(teacher => (
                <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                  <div>
                    <div className="font-semibold">{teacher.name}</div>
                    <div className="text-sm text-gray-500">{teacher.role || 'Öğretmen'}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveTeacher(teacher.id)}
                    title="Öğretmeni Çıkar"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
              <p className="text-gray-500">Bu sınıfa henüz öğretmen atanmamış.</p>
              <Button variant="link" onClick={() => setIsModalOpen(true)}>Hemen Öğretmen Ata</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassDetailsPage;
