import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Eye,
  Shield,
  Loader2,
  ClipboardList,
  CreditCard,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  includes_addon: boolean | null;
}

interface TestAnswer {
  id: string;
  risk_level: string | null;
  profile_scores: any;
  main_factors: any;
  created_at: string;
}

interface UserPlan {
  id: string;
  status: string;
  created_at: string;
  plan_content: any;
  phases: any;
  habits: any;
  nutrition_tips: any;
  psychology_tips: any;
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [userTestAnswers, setUserTestAnswers] = useState<TestAnswer[]>([]);
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchProfiles();
  }, [isAdmin]);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error cargando usuarios");
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const openUserDetail = async (profile: UserProfile) => {
    setSelectedUser(profile);
    setDetailLoading(true);

    const [subsRes, testRes, plansRes] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false }),
      supabase
        .from("test_answers")
        .select("*")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false }),
      supabase
        .from("user_plans")
        .select("*")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false }),
    ]);

    setUserSubscriptions(subsRes.data || []);
    setUserTestAnswers(testRes.data || []);
    setUserPlans(plansRes.data || []);
    setDetailLoading(false);
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      (p.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.full_name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-accent/15 text-accent border-accent/30",
      cancelled: "bg-destructive/15 text-destructive border-destructive/30",
      expired: "bg-muted text-muted-foreground border-border",
    };
    return variants[status] || variants.expired;
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-sm text-muted-foreground">Gestiona usuarios y suscripciones</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{profiles.length}</p>
                <p className="text-sm text-muted-foreground">Usuarios totales</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <CreditCard className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-sm text-muted-foreground">Suscripciones activas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <ClipboardList className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-sm text-muted-foreground">Tests completados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Usuarios</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.full_name || "Sin nombre"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {profile.email || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openUserDetail(profile)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProfiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User Detail Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {selectedUser?.full_name || "Usuario"}
              </DialogTitle>
            </DialogHeader>

            {detailLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{selectedUser?.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registro</p>
                    <p className="font-medium text-foreground">
                      {selectedUser && new Date(selectedUser.created_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                {/* Subscriptions */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4" /> Suscripciones
                  </h3>
                  {userSubscriptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin suscripciones</p>
                  ) : (
                    <div className="space-y-2">
                      {userSubscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30"
                        >
                          <div>
                            <p className="font-medium text-foreground">{sub.plan_name}</p>
                            <p className="text-xs text-muted-foreground">
                              Desde {new Date(sub.start_date).toLocaleDateString("es-ES")}
                              {sub.end_date && ` hasta ${new Date(sub.end_date).toLocaleDateString("es-ES")}`}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(sub.status)} variant="outline">
                            {sub.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Answers */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <ClipboardList className="w-4 h-4" /> Resultados del Test
                  </h3>
                  {userTestAnswers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No ha completado el test</p>
                  ) : (
                    <div className="space-y-2">
                      {userTestAnswers.map((test) => (
                        <div
                          key={test.id}
                          className="p-3 rounded-lg border border-border bg-secondary/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{test.risk_level || "Sin nivel"}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(test.created_at).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                          {test.profile_scores && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(test.profile_scores as Record<string, number>).map(
                                ([key, val]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-muted-foreground capitalize">{key}</span>
                                    <span className="font-medium text-foreground">{String(val)}</span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Plans */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" /> Planes Generados
                  </h3>
                  {userPlans.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin planes generados</p>
                  ) : (
                    <div className="space-y-2">
                      {userPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="p-3 rounded-lg border border-border bg-secondary/30"
                        >
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusBadge(plan.status)} variant="outline">
                              {plan.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(plan.created_at).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                          {plan.phases && Array.isArray(plan.phases) && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {(plan.phases as any[]).length} fases configuradas
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
