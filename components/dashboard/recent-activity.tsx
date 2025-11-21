/**
 * Recent Activity Timeline
 *
 * Displays recent actions and events in a timeline format
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  UserPlus,
  Check,
  X,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "invoice" | "quote" | "appointment" | "client" | "payment";
  title: string;
  description: string;
  timestamp: Date;
  status?: "success" | "error" | "pending";
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const activityIcons = {
  invoice: FileText,
  quote: FileSpreadsheet,
  appointment: Calendar,
  client: UserPlus,
  payment: Check,
};

const statusIcons = {
  success: Check,
  error: X,
  pending: Clock,
};

const statusColors = {
  success: "text-green-600 bg-green-100",
  error: "text-red-600 bg-red-100",
  pending: "text-yellow-600 bg-yellow-100",
};

export function RecentActivity({
  activities,
  maxItems = 10,
}: RecentActivityProps) {
  const displayedActivities = activities.slice(0, maxItems);

  if (displayedActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Aucune activité récente
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const StatusIcon = activity.status
              ? statusIcons[activity.status]
              : null;

            return (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline connector */}
                <div className="relative flex flex-col items-center">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 border-background",
                      activity.status
                        ? statusColors[activity.status]
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {StatusIcon ? (
                      <StatusIcon className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  {/* Line */}
                  {index < displayedActivities.length - 1 && (
                    <div className="h-full w-px flex-1 bg-border" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
