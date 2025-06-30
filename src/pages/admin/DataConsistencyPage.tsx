import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { DataConsistencyFixer } from '@/utils/data-consistency-fixer';
import { useToast } from '@/hooks/use-toast';

interface DataInconsistency {
  type: string;
  email: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  fixable: boolean;
}

interface Report {
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
}

const DataConsistencyPage: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const { toast } = useToast();

  const loadReport = async () => {
    setLoading(true);
    try {
      const reportData = await DataConsistencyFixer.generateReport();
      setReport(reportData);
    } catch (error) {
      console.error('Rapor yükleme hatası:', error);
      toast({
        title: "Hata",
        description: "Veri tutarlılığı raporu yüklenemedi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fixAllIssues = async () => {
    setFixing(true);
    try {
      const result = await DataConsistencyFixer.fixAllAutomatically();
      
      toast({
        title: "Otomatik Düzeltme Tamamlandı",
        description: `${result.fixed} sorun düzeltildi, ${result.failed} sorun düzeltilemedi.`,
        variant: result.fixed > 0 ? "default" : "destructive"
      });

      // Raporu yenile
      await loadReport();
    } catch (error) {
      console.error('Otomatik düzeltme hatası:', error);
      toast({
        title: "Hata",
        description: "Otomatik düzeltme sırasında bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setFixing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'approved_no_user': return 'Onaylanmış ama kullanıcı yok';
      case 'user_exists_pending': return 'Kullanıcı var ama başvuru beklemede';
      case 'email_not_confirmed': return 'E-posta doğrulaması yapılmamış';
      case 'missing_profile_name': return 'Profile ismi eksik';
      case 'invalid_email_format': return 'Geçersiz e-posta formatı';
      default: return type;
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Veri tutarlılığı analiz ediliyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Veri Tutarlılığı Yönetimi</h1>
        <div className="flex gap-2">
          <Button onClick={loadReport} variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          {report && report.summary.fixable > 0 && (
            <Button onClick={fixAllIssues} disabled={fixing}>
              {fixing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Otomatik Düzelt ({report.summary.fixable})
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
                <CardTitle className="text-sm font-medium">Toplam Başvuru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.totalApplications}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Auth Kullanıcıları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.totalAuthUsers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profiller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.totalProfiles}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tutarsızlık</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {report.inconsistencies.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutarsızlık Özeti */}
          <Card>
            <CardHeader>
              <CardTitle>Tutarsızlık Özeti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{report.summary.high}</div>
                  <div className="text-sm text-gray-600">Yüksek Öncelik</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{report.summary.medium}</div>
                  <div className="text-sm text-gray-600">Orta Öncelik</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{report.summary.low}</div>
                  <div className="text-sm text-gray-600">Düşük Öncelik</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{report.summary.fixable}</div>
                  <div className="text-sm text-gray-600">Düzeltilebilir</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutarsızlık Listesi */}
          {report.inconsistencies.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Tespit Edilen Tutarsızlıklar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.inconsistencies.map((inconsistency, index) => (
                    <Alert key={index}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getSeverityIcon(inconsistency.severity)}
                          <div>
                            <div className="font-medium">{inconsistency.email}</div>
                            <div className="text-sm text-gray-600">
                              {getTypeDescription(inconsistency.type)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inconsistency.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(inconsistency.severity)}>
                            {inconsistency.severity.toUpperCase()}
                          </Badge>
                          {inconsistency.fixable ? (
                            <Badge variant="outline" className="text-green-600">
                              Düzeltilebilir
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600">
                              Manuel Müdahale
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Tebrikler! Herhangi bir veri tutarsızlığı tespit edilmedi.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default DataConsistencyPage;
