
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

interface FormField {
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
  options?: string[];
}

interface FormBlockProps {
  content: {
    fields: FormField[];
    submitText: string;
    submitAction: string;
  };
  styles: Record<string, any>;
}

export const FormBlock = ({ content, styles }: FormBlockProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (label: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form data according to submitAction
    setSubmitted(true);
    toast.success("Form submitted successfully!");
  };

  const renderField = (field: FormField, index: number) => {
    switch (field.type.toLowerCase()) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`field-${index}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`field-${index}`}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.label] || ''}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
              style={{
                backgroundColor: styles.fieldBgColor || '#FFFFFF',
                borderRadius: styles.fieldBorderRadius || '4px',
                borderColor: styles.fieldBorderColor || '#E2E8F0',
              }}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`field-${index}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={`field-${index}`}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.label] || ''}
              onChange={(e) => handleInputChange(field.label, e.target.value)}
              style={{
                backgroundColor: styles.fieldBgColor || '#FFFFFF',
                borderRadius: styles.fieldBorderRadius || '4px',
                borderColor: styles.fieldBorderColor || '#E2E8F0',
              }}
            />
          </div>
        );
      case 'checkbox':
        return (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`field-${index}`}
              checked={!!formData[field.label]}
              onCheckedChange={(checked) => handleInputChange(field.label, checked)}
            />
            <Label htmlFor={`field-${index}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        );
      case 'select':
        return (
          <div key={index} className="space-y-2">
            <Label htmlFor={`field-${index}`}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select 
              value={formData[field.label] || ''} 
              onValueChange={(value) => handleInputChange(field.label, value)}
            >
              <SelectTrigger id={`field-${index}`}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, i) => (
                  <SelectItem key={i} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div 
        className="form-block w-full my-4"
        style={{
          backgroundColor: styles.backgroundColor || 'transparent',
          padding: styles.padding || '16px',
          borderRadius: styles.borderRadius || '8px',
        }}
      >
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-medium mb-2" style={{ color: styles.textColor || '#000000' }}>Thank You!</h3>
            <p className="text-muted-foreground">Your form has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="form-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle style={{ color: styles.textColor || '#000000' }}>
            Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {content.fields.map(renderField)}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit}
            style={{
              backgroundColor: styles.buttonColor || '#3B82F6',
              color: styles.buttonTextColor || '#FFFFFF',
            }}
          >
            {content.submitText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
