import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Flame, Loader2, Search, Users } from "lucide-react";
import { useState } from "react";
import { Redirect, useLocation } from "wouter";

export default function ManagerEvaluation() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const usersQuery = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: !!user && (user.role === 'admin' || user.role === 'manager'),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/" />;
  }

  if (user.role !== 'admin' && user.role !== 'manager') {
    return <Redirect to="/dashboard" />;
  }

  const users = usersQuery.data || [];
  const filteredUsers = users.filter(u => 
    u.id !== user.id && // Exclude self
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <Users className="w-10 h-10 text-orange-500 animate-glow" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                上長評価
              </h1>
              <p className="text-sm text-gray-600">メンバーの成長を支援</p>
            </div>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Search */}
        <Card className="mb-6 border-orange-200 shadow-md">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="名前で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        {usersQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? "該当するユーザーが見つかりません" : "評価対象のユーザーがいません"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map(targetUser => (
              <Card 
                key={targetUser.id}
                className="border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-orange-300"
                onClick={() => setLocation(`/manager-evaluation/${targetUser.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                        {targetUser.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{targetUser.name || "名前未設定"}</CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-gradient-to-r from-orange-500 to-blue-500 text-white border-none hover:from-orange-600 hover:to-blue-600"
                    >
                      評価する
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Flame className="w-5 h-5" />
              評価のポイント
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-900">
              <li>• メンバーの成長を温かく見守る気持ちで評価しましょう</li>
              <li>• 具体的な行動や成果を思い出しながら評価してください</li>
              <li>• コメント欄には前向きなフィードバックを記入しましょう</li>
              <li>• 評価は本人の成長を支援するためのものです</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
