import React from 'react';
import { BlockStyles } from '@/types/block';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface FormField {
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
}

interface FormBlockProps {
  content: {
    fields: FormField[];
    submitText: string;
    submitAction: string;
  };
  styles?: {
    container?: BlockStyles;
    input?: BlockStyles;
    label?: BlockStyles;
    button?: BlockStyles;
  };
}

export function FormBlock({ content, styles = {} }: FormBlockProps) {
  // Helper function to apply container styles
  const applyContainerStyles = (additionalClasses?: string) => {
    const containerStyles = styles.container || {};
    const textAlignClass = containerStyles.textAlign ? {
      'text-left': containerStyles.textAlign === 'left',
      'text-center': containerStyles.textAlign === 'center',
      'text-right': containerStyles.textAlign === 'right',
    } : {};

    return {
      className: cn(
        'space-y-4',
        additionalClasses,
        textAlignClass
      ),
      style: {
        backgroundColor: containerStyles.backgroundColor || 'transparent',
        padding: containerStyles.padding || '0',
        margin: containerStyles.margin,
        borderRadius: containerStyles.borderRadius || '0',
        borderWidth: containerStyles.borderWidth || '0',
        borderColor: containerStyles.borderColor,
        borderStyle: containerStyles.borderStyle,
        boxShadow: containerStyles.boxShadow,
        width: containerStyles.width,
        minHeight: containerStyles.minHeight,
        maxWidth: containerStyles.maxWidth
      }
    };
  };

  // Helper function to apply input styles
  const applyInputStyles = (additionalClasses?: string) => {
    const inputStyles = styles.input || {};
    return {
      className: cn('w-full', additionalClasses),
      style: {
        backgroundColor: inputStyles.backgroundColor || 'transparent',
        color: inputStyles.textColor || 'inherit',
        borderRadius: inputStyles.borderRadius || '0.375rem',
        borderWidth: inputStyles.borderWidth || '1px',
        borderColor: inputStyles.borderColor || 'hsl(var(--input))',
        borderStyle: inputStyles.borderStyle || 'solid',
        fontSize: inputStyles.fontSize,
        padding: inputStyles.padding || '0.5rem',
        fontFamily: inputStyles.fontFamily,
        '&:focus': {
          outline: 'none',
          borderColor: inputStyles.borderColor || 'hsl(var(--input))',
          backgroundColor: inputStyles.backgroundColor || 'transparent',
        }
      }
    };
  };

  // Helper function to apply label styles
  const applyLabelStyles = (additionalClasses?: string) => {
    const labelStyles = styles.label || {};
    const textAlignClass = labelStyles.textAlign ? {
      'text-left': labelStyles.textAlign === 'left',
      'text-center': labelStyles.textAlign === 'center',
      'text-right': labelStyles.textAlign === 'right',
    } : {};

    return {
      className: cn('block mb-2', additionalClasses, textAlignClass),
      style: {
        color: labelStyles.textColor || 'inherit',
        fontSize: labelStyles.fontSize,
        fontWeight: labelStyles.fontWeight || '500',
        fontFamily: labelStyles.fontFamily
      }
    };
  };

  // Helper function to apply button styles
  const applyButtonStyles = () => {
    const buttonStyles = styles.button || {};
    const textAlignClass = buttonStyles.textAlign ? {
      'text-left': buttonStyles.textAlign === 'left',
      'text-center': buttonStyles.textAlign === 'center',
      'text-right': buttonStyles.textAlign === 'right',
    } : {};

    return {
      className: cn(
        'mt-6 w-full transition-colors duration-200',
        textAlignClass
      ),
      style: {
        backgroundColor: buttonStyles.backgroundColor || 'hsl(var(--primary))',
        color: buttonStyles.textColor || 'hsl(var(--primary-foreground))',
        borderRadius: buttonStyles.borderRadius || '0.375rem',
        padding: buttonStyles.padding || '0.5rem 1rem',
        fontSize: buttonStyles.fontSize,
        fontWeight: buttonStyles.fontWeight || '500',
        borderWidth: buttonStyles.borderWidth || '0',
        borderColor: buttonStyles.borderColor,
        borderStyle: buttonStyles.borderStyle,
        cursor: 'pointer',
        fontFamily: buttonStyles.fontFamily,
        '&:hover': {
          opacity: 0.9
        }
      }
    };
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.label} className="space-y-2">
            <Label {...applyLabelStyles()}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              {...applyInputStyles()}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        );
      default:
        return (
          <div key={field.label} className="space-y-2">
            <Label {...applyLabelStyles()}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type={field.type}
              {...applyInputStyles()}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        );
    }
  };

  return (
    <div {...applyContainerStyles('rounded-lg')}>
      <form className="space-y-4">
        {content.fields.map(renderField)}
        <button {...applyButtonStyles()}>
          {content.submitText}
        </button>
      </form>
    </div>
  );
}
