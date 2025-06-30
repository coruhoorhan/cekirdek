import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { sendPasswordResetEmail } from '@/lib/passwordReset';

const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const result = await sendPasswordResetEmail(email);
      if (result.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(result.error || 'E-posta gönderilirken bir hata oluştu.');
      }
    } catch (err) {
      setError(`Beklenmeyen bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Mail className="w-6 h-6 mr-2 text-primary" />
            Şifre Sıfırlama
          </CardTitle>
          <CardDescription className="text-center">
            Şifre sıfırlama linki göndereceğimiz e-posta adresinizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertTitle>Başarılı!</AlertTitle>
              <AlertDescription>
                Şifre sıfırlama linki e-posta adresinize gönderildi. 
                Lütfen gelen kutunuzu kontrol edin ve gelen bağlantıya tıklayarak şifrenizi sıfırlayın.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || success}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  "Şifre Sıfırlama Linki Gönder"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            E-postanıza gelen linki tıklayarak yeni şifrenizi belirleyebilirsiniz.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordResetPage; 