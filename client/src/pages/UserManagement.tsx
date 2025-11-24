import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { UserPlus, Users, Shield, User, Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function UserManagement() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: "user" as "user" | "admin" | "manager",
    initialPassword: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    username: "",
    role: "user" as "user" | "admin" | "manager",
  });

  const { data: users, refetch } = trpc.users.getAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const createUserMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      toast.success("ユーザーを作成しました！");
      setIsDialogOpen(false);
      setFormData({
        username: "",
        name: "",
        role: "user",
        initialPassword: "",
      });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "ユーザー作成に失敗しました");
    },
  });

  const updateUserMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success("ユーザー情報を更新しました！");
      setIsEditDialogOpen(false);
      setEditingUser(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "ユーザー情報の更新に失敗しました");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">アクセス拒否</CardTitle>
            <CardDescription>
              この画面にアクセスする権限がありません
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")} className="w-full">
              ダッシュボードに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.name || !formData.initialPassword) {
      toast.error("必須項目を入力してください");
      return;
    }
    createUserMutation.mutate(formData);
  };

  const handleEditUser = (u: any) => {
    setEditingUser(u);
    setEditFormData({
      name: u.name || "",
      username: u.username || "",
      role: u.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.username || !editFormData.name) {
      toast.error("必須項目を入力してください");
      return;
    }
    updateUserMutation.mutate({
      id: editingUser.id,
      ...editFormData,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "manager":
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "管理者";
      case "manager":
        return "上長";
      default:
        return "メンバー";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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
              ユーザー管理
            </h1>
            <p className="text-gray-600 mt-2">
              アカウントの作成と管理
            </p>
          </div>
          <div className="w-24"></div>
        </div>
        <div className="flex justify-end mb-6">

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
                <UserPlus className="w-5 h-5 mr-2" />
                新規ユーザー作成
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>新規ユーザー作成</DialogTitle>
                  <DialogDescription>
                    新しいユーザーアカウントを作成します
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">ユーザー名 *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="ユーザー名（ログイン用）"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">氏名 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="山田 太郎"
                      required
                    />
                  </div>



                  <div className="space-y-2">
                    <Label htmlFor="role">ロール *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "user" | "admin" | "manager") =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">メンバー</SelectItem>
                        {user.role === "admin" && (
                          <>
                            <SelectItem value="manager">上長</SelectItem>
                            <SelectItem value="admin">管理者</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialPassword">初期パスワード *</Label>
                    <Input
                      id="initialPassword"
                      type="text"
                      value={formData.initialPassword}
                      onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                      placeholder="6文字以上"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      ユーザーに伝える初期パスワードです
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={createUserMutation.isPending}
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        作成中...
                      </>
                    ) : (
                      "作成"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ユーザー情報編集</DialogTitle>
                <DialogDescription>
                  ユーザーの名前・ユーザー名・権限を変更できます
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit}>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-username">ユーザー名 *</Label>
                    <Input
                      id="edit-username"
                      value={editFormData.username}
                      onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-name">氏名 *</Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-role">ロール *</Label>
                    <Select
                      value={editFormData.role}
                      onValueChange={(value) => setEditFormData({ ...editFormData, role: value as "user" | "admin" | "manager" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">メンバー</SelectItem>
                        <SelectItem value="manager">上長</SelectItem>
                        <SelectItem value="admin">管理者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={updateUserMutation.isPending}
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateUserMutation.isPending}
                    className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                  >
                    {updateUserMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        更新中...
                      </>
                    ) : (
                      "更新"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {user.role === "admin" && users && (
          <Card>
            <CardHeader>
              <CardTitle>登録ユーザー一覧</CardTitle>
              <CardDescription>
                全{users.length}名のユーザーが登録されています
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">ユーザー名</th>
                      <th className="text-left p-3">氏名</th>
                      <th className="text-left p-3">ロール</th>
                      <th className="text-left p-3">最終ログイン</th>
                      <th className="text-left p-3">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{u.username}</td>
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(u.role)}
                            <span>{getRoleLabel(u.role)}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          {u.lastSignedIn
                            ? new Date(u.lastSignedIn).toLocaleString("ja-JP")
                            : "-"}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(u)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            編集
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
