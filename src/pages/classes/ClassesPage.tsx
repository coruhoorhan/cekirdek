import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, Eye } from 'lucide-react';
import { getClasses, Class } from '@/lib/classService';
import { Loader2 } from 'lucide-react';

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sınıflar Yönetimi</h1>
          <p className="text-muted-foreground">Okuldaki sınıfları ve atanan öğretmenleri yönetin</p>
        </div>
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
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.age_group || (cls as any).ageGroup}</TableCell>
                    <TableCell>{cls.capacity}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/classes/${cls.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Detaylar
                      </Button>
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
    </div>
  );
};

export default ClassesPage;
