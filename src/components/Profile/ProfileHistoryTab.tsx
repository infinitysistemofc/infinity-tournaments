import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FilterPanel } from "@/components/Filters/FilterPanel";
import { FilterSelect } from "@/components/Filters/FilterSelect";
import { FilterCheckbox } from "@/components/Filters/FilterCheckbox";
import { useFilters, HistoryFilters } from "@/hooks/useFilters";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface TournamentHistory {
  id: string;
  tournament: {
    id: string;
    name: string;
  };
  joined_at: string;
  seed?: number;
  status: string;
}

interface ProfileHistoryTabProps {
  history: TournamentHistory[];
}

export const ProfileHistoryTab = ({ history }: ProfileHistoryTabProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { filters, updateFilter, clearFilters, hasActiveFilters } =
    useFilters<HistoryFilters>("player-history-filters", {});

  const periodOptions = [
    { value: "all", label: t("common.all") },
    { value: "7d", label: t("common.last7Days") },
    { value: "30d", label: t("common.last30Days") },
    { value: "90d", label: t("common.last90Days") },
    { value: "1y", label: t("common.last1Year") },
  ];

  const statusOptions = [
    { value: "registered", label: t("tournament.registered") },
    { value: "active", label: t("tournament.active") },
    { value: "eliminated", label: t("tournament.eliminated") },
    { value: "winner", label: t("tournament.winner") },
  ];

  const filteredHistory = history.filter((item) => {
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false;
    }

    if (filters.period && filters.period !== "all") {
      const date = new Date(item.joined_at);
      const now = new Date();
      const days = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365,
      }[filters.period];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        if (date < cutoff) return false;
      }
    }

    return true;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "winner":
        return "default";
      case "active":
        return "secondary";
      case "eliminated":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <FilterPanel
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredHistory.length}
      >
        <FilterSelect
          label={t("common.period")}
          value={filters.period}
          onChange={(value) => updateFilter("period", value)}
          options={periodOptions}
          placeholder={t("common.selectPeriod")}
        />

        <FilterCheckbox
          label={t("common.status")}
          options={statusOptions}
          selectedValues={filters.status || []}
          onChange={(values) => updateFilter("status", values)}
        />
      </FilterPanel>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tournament.tournament")}</TableHead>
              <TableHead>{t("common.date")}</TableHead>
              <TableHead>{t("tournament.seed")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/tournaments/${item.tournament.id}`)}
                >
                  <TableCell className="font-medium">
                    {item.tournament.name}
                  </TableCell>
                  <TableCell>
                    {new Date(item.joined_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.seed || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {t(`tournament.${item.status}`)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {t("common.noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
