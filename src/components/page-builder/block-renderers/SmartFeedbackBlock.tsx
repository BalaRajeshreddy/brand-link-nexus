
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SmartFeedbackBlockProps {
  content: {
    question: string;
    options: string[];
    allowComments: boolean;
  };
  styles: Record<string, any>;
}

export const SmartFeedbackBlock = ({ content, styles }: SmartFeedbackBlockProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    // In a real app, this would submit the feedback data to a backend
    setSubmitted(true);
    toast.success("Thank you for your feedback!");
  };

  if (submitted) {
    return (
      <div 
        className="smart-feedback-block w-full my-4"
        style={{
          backgroundColor: styles.backgroundColor || 'transparent',
          padding: styles.padding || '16px',
          borderRadius: styles.borderRadius || '8px',
        }}
      >
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-medium mb-2" style={{ color: styles.textColor || '#000000' }}>Thank You!</h3>
            <p className="text-muted-foreground">Your feedback has been recorded.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="smart-feedback-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle style={{ color: styles.textColor || '#000000' }}>
            {content.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={setSelectedOption} className="space-y-3">
            {content.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {content.allowComments && selectedOption && (
            <div className="mt-4">
              <Label htmlFor="comment" className="mb-2 block">Additional Comments</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full"
          >
            Submit Feedback
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
