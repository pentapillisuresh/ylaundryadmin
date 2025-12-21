import React from 'react';

const StatsCard = ({ 
  icon, 
  title, 
  value, 
  change, 
  color = 'primary',
  bgColor,
  textColor
}) => {
  
  // Default color configurations if not provided
  const colorConfigs = {
    primary: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      text: 'text-blue-600'
    },
    success: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      text: 'text-emerald-600'
    },
    warning: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      text: 'text-amber-600'
    },
    danger: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      text: 'text-red-600'
    },
    info: {
      bg: 'bg-cyan-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      text: 'text-cyan-600'
    }
  };
  
  const config = colorConfigs[color] || colorConfigs.primary;
  
  // Use provided colors or default ones
  const finalBgColor = bgColor || config.bg;
  const finalIconBg = config.iconBg;
  const finalIconColor = textColor || config.iconColor;
  const finalTextColor = config.text;
  
  // Determine change color
  const changeColor = change?.startsWith('+') 
    ? 'text-emerald-600' 
    : 'text-red-600';
  
  return (
    <div className={`${finalBgColor} rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          {change && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${changeColor}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`${finalIconBg} ${finalIconColor} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
      
      {/* Optional: Progress bar for percentage changes */}
      {change && change.includes('%') && (
        <div className="mt-4">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${finalIconBg} rounded-full`}
              style={{ 
                width: change.match(/\d+/)?.[0] + '%' || '50%' 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;