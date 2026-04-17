// import { motion } from 'framer-motion';
// import { Shield, Wallet, Landmark, Swords, Users, FileText, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
// import { ProgressRing } from './ui/ProgressRing';
// import { cn } from '@/utils/cn';

// interface ZoneCardProps {
//   id: string;
//   name: string;
//   sanskritName: string;
//   icon: string;
//   progress: number;
//   status: string;
//   statusMessage: string;
//   isComplete: boolean;
//   onClick: () => void;
//   index: number;
// }

// const iconMap: Record<string, typeof Shield> = {
//   Shield,
//   Wallet,
//   Landmark,
//   Swords,
//   Users,
//   FileText,
// };

// const statusIcons: Record<string, typeof AlertTriangle> = {
//   'needs-attention': AlertTriangle,
//   'on-track': TrendingUp,
//   'building': TrendingUp,
//   'winning': CheckCircle,
// };

// export function ZoneCard({
//   name,
//   sanskritName,
//   icon,
//   progress,
//   status,
//   statusMessage,
//   isComplete,
//   onClick,
//   index,
// }: ZoneCardProps) {
//   const Icon = iconMap[icon] || Shield;
//   const StatusIcon = statusIcons[status] || TrendingUp;

//   const getStatusColor = () => {
//     switch (status) {
//       case 'needs-attention': return 'text-matka-clay';
//       case 'winning': return 'text-palm-green';
//       default: return 'text-river-teal';
//     }
//   };

//   const getBorderStyle = () => {
//     if (isComplete) return 'border-palm-green zone-complete';
//     if (status === 'needs-attention') return 'border-matka-clay/40';
//     return 'border-parchment-dark/30';
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.3 }}
//       whileHover={{ scale: 1.02, y: -2 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className={cn(
//         'bg-card-white rounded-xl p-4 cursor-pointer transition-shadow duration-200',
//         'shadow-md hover:shadow-lg border',
//         getBorderStyle()
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between mb-3">
//         <div className={cn(
//           'w-12 h-12 rounded-xl flex items-center justify-center',
//           isComplete ? 'bg-palm-green/10' : 'bg-svarajya-blue/10'
//         )}>
//           <Icon className={cn(
//             'w-6 h-6',
//             isComplete ? 'text-palm-green' : 'text-svarajya-blue'
//           )} />
//         </div>
//         <ProgressRing progress={progress} size={48} strokeWidth={3} />
//       </div>

//       {/* Title */}
//       <h3 className="font-serif text-lg font-semibold text-fort-stone mb-0.5">
//         {name}
//       </h3>
//       <p className="text-xs text-fort-stone/50 uppercase tracking-wider mb-3">
//         {sanskritName}
//       </p>

//       {/* Status */}
//       <div className={cn('flex items-start gap-2', getStatusColor())}>
//         <StatusIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
//         <p className="text-sm leading-tight">{statusMessage}</p>
//       </div>

//       {/* Visual crack/damage indicator for low progress */}
//       {progress < 50 && status === 'needs-attention' && (
//         <div className="mt-3 pt-3 border-t border-dashed border-matka-clay/30">
//           {/* <p className="text-xs text-matka-clay italic">Tap to strengthen</p> */}
//         </div>
//       )}
//     </motion.div>
//   );
// }
