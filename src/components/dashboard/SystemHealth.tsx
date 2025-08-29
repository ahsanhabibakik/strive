import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';


interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'checking';
  message: string;
  lastChecked: Date;
  responseTime?: number;
}

// Mock health data - in real app, this would come from API
const getSystemHealth = (): HealthCheck[] => [
  {
    name: 'Database',
    status: 'healthy',
    message: 'All connections active',
    lastChecked: new Date(),
    responseTime: 45
  },
  {
    name: 'API Services',
    status: 'healthy',
    message: 'All endpoints responding',
    lastChecked: new Date(Date.now() - 1000 * 60),
    responseTime: 120
  },
  {
    name: 'Email Service',
    status: 'warning',
    message: 'High queue volume',
    lastChecked: new Date(Date.now() - 1000 * 60 * 2),
    responseTime: 350
  },
  {
    name: 'External APIs',
    status: 'healthy',
    message: 'All integrations working',
    lastChecked: new Date(Date.now() - 1000 * 60 * 3),
    responseTime: 200
  },
  {
    name: 'File Storage',
    status: 'healthy',
    message: 'Storage available: 78%',
    lastChecked: new Date(Date.now() - 1000 * 60 * 5),
    responseTime: 80
  }
];

const statusConfig = {
  healthy: {
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Healthy'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    label: 'Warning'
  },
  error: {
    icon: XCircleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Error'
  },
  checking: {
    icon: ClockIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Checking'
  }
};

export function SystemHealth() {
  const healthChecks = getSystemHealth();
  
  const overallStatus = healthChecks.some(check => check.status === 'error') 
    ? 'error'
    : healthChecks.some(check => check.status === 'warning')
    ? 'warning'
    : 'healthy';

  const overallConfig = statusConfig[overallStatus];

  return (
    <div className="bg-white shadow-xs rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
            <p className="mt-1 text-sm text-gray-500">
              Real-time system status and monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn('p-1 rounded-lg', overallConfig.bgColor)}>
              <overallConfig.icon className={cn('h-6 w-6', overallConfig.color)} />
            </div>
            <span className={cn('text-sm font-medium', overallConfig.color)}>
              {overallConfig.label}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {healthChecks.map((check) => {
            const config = statusConfig[check.status];
            
            return (
              <div
                key={check.name}
                className="relative rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-1 rounded', config.bgColor)}>
                      <config.icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {check.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {check.message}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Checked {new Date(check.lastChecked).toLocaleTimeString()}
                  </span>
                  {check.responseTime && (
                    <span className={cn(
                      'px-2 py-1 rounded-full',
                      check.responseTime < 100 
                        ? 'bg-green-100 text-green-600'
                        : check.responseTime < 300
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    )}>
                      {check.responseTime}ms
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}