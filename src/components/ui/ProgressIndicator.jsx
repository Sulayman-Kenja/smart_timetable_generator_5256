import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  variant = 'horizontal',
  showLabels = true,
  size = 'default'
}) => {
  const sizeClasses = {
    sm: {
      circle: 'w-6 h-6',
      icon: 14,
      text: 'text-xs',
      spacing: 'space-x-2'
    },
    default: {
      circle: 'w-8 h-8',
      icon: 16,
      text: 'text-sm',
      spacing: 'space-x-4'
    },
    lg: {
      circle: 'w-10 h-10',
      icon: 20,
      text: 'text-base',
      spacing: 'space-x-6'
    }
  };

  const classes = sizeClasses[size];

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStepStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-success text-success-foreground border-success',
          line: 'bg-success',
          text: 'text-foreground font-medium'
        };
      case 'current':
        return {
          circle: 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/20',
          line: 'bg-border',
          text: 'text-foreground font-medium'
        };
      case 'pending':
        return {
          circle: 'bg-muted text-muted-foreground border-border',
          line: 'bg-border',
          text: 'text-muted-foreground'
        };
      default:
        return {
          circle: 'bg-muted text-muted-foreground border-border',
          line: 'bg-border',
          text: 'text-muted-foreground'
        };
    }
  };

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const styles = getStepStyles(status);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id || index} className="flex items-start space-x-3">
              {/* Step Circle */}
              <div className="relative flex-shrink-0">
                <div className={`
                  ${classes.circle} rounded-full border-2 flex items-center justify-center
                  transition-all duration-200 ease-smooth
                  ${styles.circle}
                `}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={classes.icon} />
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </div>
                
                {/* Connecting Line */}
                {!isLast && (
                  <div className={`
                    absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4
                    transition-colors duration-200
                    ${styles.line}
                  `} />
                )}
              </div>

              {/* Step Content */}
              {showLabels && (
                <div className="flex-1 min-w-0 pt-1">
                  <p className={`font-medium ${styles.text} ${classes.text}`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`flex items-center ${classes.spacing}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const styles = getStepStyles(status);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id || index} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div className={`
                ${classes.circle} rounded-full border-2 flex items-center justify-center
                transition-all duration-200 ease-smooth
                ${styles.circle}
              `}>
                {status === 'completed' ? (
                  <Icon name="Check" size={classes.icon} />
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              {showLabels && (
                <div className="mt-2 text-center">
                  <p className={`font-medium ${styles.text} ${classes.text}`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className={`
                flex-1 h-0.5 mx-4 min-w-8
                transition-colors duration-200
                ${styles.line}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;