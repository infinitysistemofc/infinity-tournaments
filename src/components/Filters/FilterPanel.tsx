import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FilterPanelProps {
  children: ReactNode;
  onClear: () => void;
  hasActiveFilters: boolean;
  resultCount?: number;
}

export const FilterPanel = ({
  children,
  onClear,
  hasActiveFilters,
  resultCount,
}: FilterPanelProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{t("common.filters")}</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {t("common.clearFilters")}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>

      {resultCount !== undefined && (
        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
          {t("common.resultsFound", { count: resultCount })}
        </div>
      )}
    </Card>
  );
};
