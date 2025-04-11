
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHoursBlockProps {
  content: {
    hours: BusinessHour[];
  };
  styles: Record<string, any>;
}

export const BusinessHoursBlock = ({ content, styles }: BusinessHoursBlockProps) => {
  // Check if today is in the list
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const isOpenToday = () => {
    const todayHours = content.hours.find(hour => 
      hour.day.toLowerCase() === today.toLowerCase()
    );
    return todayHours ? !todayHours.closed : false;
  };

  return (
    <div 
      className="business-hours-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: styles.textColor || '#000000' }}>
              Business Hours
            </CardTitle>
            <span className={`text-xs px-2 py-1 rounded ${isOpenToday() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isOpenToday() ? 'Open Today' : 'Closed Today'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {content.hours.map((hour, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-2 ${
                  hour.day.toLowerCase() === today.toLowerCase() ? 'bg-muted rounded-md' : ''
                }`}
              >
                <span className="font-medium">{hour.day}</span>
                <span>
                  {hour.closed ? (
                    <span className="text-muted-foreground">Closed</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {hour.open} - {hour.close}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
