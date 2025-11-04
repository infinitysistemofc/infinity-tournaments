import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressBarSimpleProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBarSimple = ({
  current,
  max,
  label,
  showPercentage = false,
}: ProgressBarSimpleProps) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        {label && <span className="font-medium">{label}</span>}
        {showPercentage && (
          <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Progress value={percentage} className="h-2" />
      </motion.div>
    </div>
  );
};

export default ProgressBarSimple;
