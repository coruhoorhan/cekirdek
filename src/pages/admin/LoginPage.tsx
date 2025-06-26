import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Shadcn/ui button
import { Input } from '@/components/ui/input';   // Shadcn/ui input
import { Label } from '@/components/ui/label';   // Shadcn/ui label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn/ui card
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Gerçek kimlik doğrulama burada yapılabilir.
    // Şimdilik direkt dashboard'a yönlendiriyoruz.
    console.log('Giriş denemesi yapıldı.');
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-orange-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground rounded-full p-3">
              <LogIn size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Admin Girişi</CardTitle>
          <CardDescription>
            Lütfen devam etmek için giriş yapın.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-medium text-gray-700">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                placeholder="kullanici_adi"
                defaultValue="admin" // Demo için varsayılan
                className="text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password"className="text-base font-medium text-gray-700">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                defaultValue="password" // Demo için varsayılan
                className="text-base"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90">
              <LogIn className="mr-2 h-5 w-5" /> Giriş Yap
            </Button>
            <p className="mt-4 text-xs text-center text-gray-500">
              Bu panel sadece yetkili kullanıcılar içindir.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
