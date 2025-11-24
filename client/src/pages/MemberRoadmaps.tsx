import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, MapPin, User, ChevronRight } from "lucide-react";
import { Redirect, useLocation } from "wouter";
import { getCurrentPeriod, periodToString } from "@shared/periodUtils";
import { PeriodSelector } from "@/components/PeriodSelector";
import { useState } from "react";

export default function MemberRoadmaps() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // デモ環境ではデモユーザーを使用
  const demoUser = {
    id: 1,
    username: "demo-user1",
    name: "デモユーザー1",
    role: "manager" as const,
    loginMethod: "local" as const
  };
  
  const displayUser = user || demoUser;
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriod());

  const usersQuery = trpc.evaluation.getAllUsers.useQuery(undefined, {
    enabled: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // if (!isAuthenticated || !user) {
  //   return <Redirect to="/login" />;
  // }

  // if (user.role !== 'admin' && user.role !== 'manager') {
  //   return <Redirect to="/dashboard" />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                <MapPin className="h-6 w-6 text-orange-500" />
                メンバーのキャリアマップ
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">メンバーのロードマップを確認</p>
            </div>
          </div>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {usersQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersQuery.data?.filter(u => u.id !== user.id).map((member) => (
              <Card
                key={member.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-500/50 group"
                onClick={() => setLocation(`/member-roadmap/${member.id}?period=${periodToString(selectedPeriod)}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>
                          {member.role === 'admin' ? '管理者' : member.role === 'manager' ? '上長' : 'メンバー'}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {periodToString(selectedPeriod)} のロードマップを確認
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {usersQuery.data && usersQuery.data.filter(u => u.id !== user.id).length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">メンバーが登録されていません</p>
          </div>
        )}
      </div>
    </div>
  );
}
