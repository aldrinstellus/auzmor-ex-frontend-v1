export interface ITeam {
  category: { categoryId: string; name: string };
  createdAt: string;
  description: string;
  id: string;
  name: string;
  orgId: string;
  recentMembers: string[];
  totalMembers: number;
}
