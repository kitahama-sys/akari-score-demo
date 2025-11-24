import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Key, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function ChangePassword() {
  const { user, loading } = useAuth();
  
  // デモ環境ではデモユーザーを使用
  const demoUser = {
    id: 1,
    username: "demo-user1",
    name: "デモユーザー1",
    role: "user" as const,
    loginMethod: "local" as const
  };
  
  const displayUser = user || demoUser;
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordMutation = trpc.users.changePassword.useMutation({
    onSuccess: () => {
      toast.success("パスワードを変更しました！");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "パスワード変更に失敗しました");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // if (!user) {
  //   setLocation("/login");
  //   return null;
  // }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("全ての項目を入力してください");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("新しいパスワードは6文字以上で入力してください");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("新しいパスワードが一致しません");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            戻る
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              パスワード変更
            </h1>
            <p className="text-gray-600 mt-2">
              セキュリティのため、定期的にパスワードを変更してください
            </p>
          </div>
          <div className="w-24"></div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full">
                <Key className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>パスワードの変更</CardTitle>
                <CardDescription>
                  現在のパスワードと新しいパスワードを入力してください
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">現在のパスワード *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="現在のパスワードを入力"
                  disabled={changePasswordMutation.isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">新しいパスワード *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="6文字以上"
                  disabled={changePasswordMutation.isPending}
                  required
                />
                <p className="text-sm text-gray-500">
                  6文字以上で入力してください
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">新しいパスワード（確認） *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="新しいパスワードを再入力"
                  disabled={changePasswordMutation.isPending}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  disabled={changePasswordMutation.isPending}
                  className="flex-1"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      変更中...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      変更する
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">パスワードのヒント</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 6文字以上で設定してください</li>
            <li>• 英数字を組み合わせると安全です</li>
            <li>• 他のサービスと同じパスワードは避けてください</li>
            <li>• 定期的に変更することをおすすめします</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
