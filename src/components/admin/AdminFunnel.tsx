import { useEffect, useState } from "react";
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
import { Loader2, TrendingDown, Filter } from "lucide-react";

interface FunnelEvent {
  id: string;
  event_type: string;
  session_id: string | null;
  user_id: string | null;
  metadata: any;
  created_at: string;
}

const FUNNEL_STAGES = [
  { key: "test_started", label: "Test iniciado", color: "bg-blue-500" },
  { key: "test_completed", label: "Test completado", color: "bg-indigo-500" },
  { key: "results_viewed", label: "Resultados vistos", color: "bg-violet-500" },
  { key: "pricing_viewed", label: "Pricing visitado", color: "bg-purple-500" },
  { key: "account_created", label: "Cuenta creada", color: "bg-fuchsia-500" },
  { key: "checkout_started", label: "Checkout iniciado", color: "bg-pink-500" },
  { key: "payment_completed", label: "Pago completado", color: "bg-accent" },
];

export default function AdminFunnel() {
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewMode, setViewMode] = useState<"funnel" | "events">("funnel");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("funnel_events" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (!error && data) {
      setEvents(data as unknown as FunnelEvent[]);
    }
    setLoading(false);
  };

  const filteredEvents = events.filter((e) => {
    if (dateFrom && new Date(e.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(e.created_at) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  const stageCounts = FUNNEL_STAGES.map((stage) => {
    const count = filteredEvents.filter((e) => e.event_type === stage.key).length;
    // Count unique sessions for dedup
    const uniqueSessions = new Set(
      filteredEvents.filter((e) => e.event_type === stage.key).map((e) => e.session_id)
    ).size;
    return { ...stage, count, uniqueSessions };
  });

  const maxCount = Math.max(...stageCounts.map((s) => s.uniqueSessions), 1);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Desde:</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Hasta:</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setDateFrom(""); setDateTo(""); }}
        >
          Limpiar
        </Button>
        <div className="ml-auto flex gap-2">
          <Button
            variant={viewMode === "funnel" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("funnel")}
          >
            Embudo
          </Button>
          <Button
            variant={viewMode === "events" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("events")}
          >
            Eventos
          </Button>
        </div>
      </div>

      {viewMode === "funnel" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              Embudo de conversión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stageCounts.map((stage, i) => {
              const prevCount = i > 0 ? stageCounts[i - 1].uniqueSessions : stage.uniqueSessions;
              const dropRate = prevCount > 0 && i > 0
                ? Math.round(((prevCount - stage.uniqueSessions) / prevCount) * 100)
                : 0;
              const widthPct = maxCount > 0 ? Math.max((stage.uniqueSessions / maxCount) * 100, 4) : 4;

              return (
                <div key={stage.key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{stage.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">{stage.uniqueSessions}</span>
                      {i > 0 && dropRate > 0 && (
                        <Badge variant="outline" className="text-xs text-destructive border-destructive/30">
                          -{dropRate}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {/* Conversion summary */}
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversión total (test → pago)</span>
                <span className="font-bold text-accent">
                  {stageCounts[0].uniqueSessions > 0
                    ? `${Math.round((stageCounts[stageCounts.length - 1].uniqueSessions / stageCounts[0].uniqueSessions) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eventos recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.slice(0, 100).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {FUNNEL_STAGES.find((s) => s.key === event.event_type)?.label || event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {event.session_id?.substring(0, 8) || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {event.user_id?.substring(0, 8) || "anónimo"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(event.created_at).toLocaleString("es-ES")}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEvents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No hay eventos en este rango
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
