
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  name: string;
  role: string;
  photo: string;
}

interface TeamBlockProps {
  content: {
    members: TeamMember[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const TeamBlock = ({ content, styles }: TeamBlockProps) => {
  const getGridColumns = () => {
    const numMembers = content.members.length;
    if (numMembers <= 1) return 'grid-cols-1';
    if (numMembers === 2) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderCards = () => (
    <div 
      className={`grid ${getGridColumns()} gap-4`}
      style={{ gap: styles.gap || '16px' }}
    >
      {content.members.map((member, index) => (
        <Card key={index} style={{ borderRadius: styles.cardBorderRadius || '8px' }}>
          <CardContent className="p-4 text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarImage src={member.photo} alt={member.name} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-lg" style={{ color: styles.textColor || '#000000' }}>
              {member.name}
            </h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-3" style={{ gap: styles.gap || '16px' }}>
      {content.members.map((member, index) => (
        <Card key={index} style={{ borderRadius: styles.cardBorderRadius || '8px' }}>
          <CardContent className="p-3">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium" style={{ color: styles.textColor || '#000000' }}>
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div 
      className="team-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      {content.displayType === 'list' ? renderList() : renderCards()}
    </div>
  );
};
