import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Loader2, 
  Mail, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Send,
  AlertTriangle,
  Users
} from 'lucide-react';
import { EmailVerificationHelper } from '@/utils/email-verification-helper';
import { useToast } from '@/hooks/use-toast';

const EmailVerificationPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [bulkResending, setBulkResending] = useState(false);
  const { toast } = useToast();

  const loadReport = async () => {
    setLoading(true);
    try {
      const reportData = await EmailVerificationHelper.generateVerificationReport();
      setReport(reportData);
    } catch (error) {
      console.error('Rapor yükleme hatası:', error);
      toast({
        title: "Hata",
        description: "E-posta doğrulama raporu yüklenemedi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resendSingleEmail = async (email: string) => {
    setResending(email);
    try {
      const result = await EmailVerificationHelper.resendVerificationEmail(email);
      
      if (result.success) {
        toast({
          title: "E-posta Gönderildi",
          description: `${email} adresine doğrulama linki gönderildi.`,
        });
      } else {
        toast({
          title: "Hata",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "E-posta gönderilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setResending(null);
    }
  };

  const resendAllEmails = async () => {
    setBulkResending(true);
    try {
      const result = await EmailVerificationHelper.resendAllVerificationEmails();
      
      toast({
        title: "Toplu E-posta Gönderimi Tamamlandı",
        description: `${result.success} başarılı, ${result.failed} başarısız.`,
        variant: result.success > 0 ? "default" : "destructive"
      });

      // Raporu yenile
      await loadReport();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Toplu e-posta gönderimi sırasında bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setBulkResending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">E-posta doğrulama raporu yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">E-posta Doğrulama Yönetimi</h1>
        <div className="flex gap-2">
          <Button onClick={loadReport} variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          {report && report.unverified > 0 && (
            <Button onClick={resendAllEmails} disabled={bulkResending}>
              {bulkResending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Tümüne Gönder ({report.unverified})
            </Button>
          )}
        </div>
      </div>

      {report && (
        <>
          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Toplam Kullanıcı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Doğrulanmış
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{report.verified}</div>
                <div className="text-sm text-gray-600">
                  %{Math.round((report.verified / report.total) * 100)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-yellow-600" />
                  Doğrulanmamış
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{report.unverified}</div>
                <div className="text-sm text-gray-600">
                  %{Math.round((report.unverified / report.total) * 100)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Geçersiz Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{report.invalidFormat}</div>
                <div className="text-sm text-gray-600">
                  %{Math.round((report.invalidFormat / report.total) * 100)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doğrulanmamış Kullanıcılar */}
          {report.unverified > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-yellow-600" />
                  Doğrulanmamış E-postalar ({report.unverified})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-posta</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.details.unverified.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.profiles?.name || 'Belirlenmemiş'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.profiles?.role || 'Belirlenmemiş'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => resendSingleEmail(user.email)}
                            disabled={resending === user.email}
                          >
                            {resending === user.email ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Send className="h-3 w-3" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Geçersiz Format E-postalar */}
          {report.invalidFormat > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  Geçersiz E-posta Formatları ({report.invalidFormat})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Bu kullanıcılar geçersiz e-posta formatına sahip. Manuel inceleme gerekli.
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-posta</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.details.invalid.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-red-600">{user.email}</TableCell>
                        <TableCell>{user.profiles?.name || 'Belirlenmemiş'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.profiles?.role || 'Belirlenmemiş'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Geçersiz Format</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Doğrulanmış Kullanıcılar (Özet) */}
          {report.verified > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Doğrulanmış E-postalar ({report.verified})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  Bu kullanıcılar e-posta adreslerini başarıyla doğrulamış ve sisteme giriş yapabilir.
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-posta</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Doğrulama Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.details.verified.slice(0, 5).map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.profiles?.name || 'Belirlenmemiş'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.profiles?.role || 'Belirlenmemiş'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.email_confirmed_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {report.verified > 5 && (
                  <div className="text-center mt-4 text-sm text-gray-600">
                    ... ve {report.verified - 5} kullanıcı daha
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default EmailVerificationPage;
