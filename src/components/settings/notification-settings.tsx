import { Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NotificationSettingsProps {
  enabled: boolean;
  minutesBefore: number;
  isSupported: boolean;
  hasPermission: boolean;
  onRequestPermission: () => Promise<boolean>;
  onUpdateSettings: (settings: {
    enabled: boolean;
    minutesBefore: number;
  }) => void;
}

export function NotificationSettings({
  enabled,
  minutesBefore,
  isSupported,
  hasPermission,
  onRequestPermission,
  onUpdateSettings,
}: NotificationSettingsProps) {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(minutesBefore);

  const handleToggle = async () => {
    if (enabled || hasPermission) {
      onUpdateSettings({ enabled: !enabled, minutesBefore: minutes });
    } else {
      const granted = await onRequestPermission();
      if (granted) {
        onUpdateSettings({ enabled: true, minutesBefore: minutes });
      }
    }
  };

  const handleSaveMinutes = () => {
    onUpdateSettings({ enabled, minutesBefore: minutes });
    setOpen(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          {enabled ? (
            <Bell className="size-4" />
          ) : (
            <BellOff className="size-4" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações de Notificações</DialogTitle>
          <DialogDescription>
            Receba alertas quando suas tarefas estiverem próximas do vencimento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications-toggle">
              {enabled ? "Notificações Ativadas" : "Notificações Desativadas"}
            </Label>
            <Button
              id="notifications-toggle"
              onClick={handleToggle}
              size="sm"
              variant={enabled ? "default" : "outline"}
            >
              {enabled ? (
                <Bell className="size-4" />
              ) : (
                <BellOff className="size-4" />
              )}
              {enabled ? "Desativar" : "Ativar"}
            </Button>
          </div>

          {enabled && (
            <div className="space-y-2">
              <Label htmlFor="minutes-before">
                Notificar quantos minutos antes?
              </Label>
              <Input
                id="minutes-before"
                max="1440"
                min="5"
                onChange={(e) => setMinutes(Number(e.target.value))}
                type="number"
                value={minutes}
              />
              <p className="text-muted-foreground text-xs">
                Você será notificado {minutes} minuto{minutes !== 1 ? "s" : ""}{" "}
                antes do vencimento
              </p>
              <Button className="w-full" onClick={handleSaveMinutes} size="sm">
                Salvar
              </Button>
            </div>
          )}

          {!hasPermission && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400">
              <p className="font-medium">Permissão necessária</p>
              <p className="mt-1 text-xs">
                Você precisa permitir notificações do navegador para receber
                alertas.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
