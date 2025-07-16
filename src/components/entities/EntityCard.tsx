import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, Edit, Link2 } from 'lucide-react';

const entityTypeIcons = {
  Business: Briefcase,
  Rental: Building,
  "Personal Project": Briefcase,
  Other: Briefcase
};

export default function EntityCard({ entity, accounts, onEdit }) {
  const Icon = entityTypeIcons[entity.type] || Briefcase;

  return (
    <Card className="card-shadow-lg border-0 bg-white flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{entity.name}</CardTitle>
              <Badge variant="outline" className="mt-1">{entity.type}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => onEdit(entity)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entity.description && <p className="text-sm text-gray-600 mb-4">{entity.description}</p>}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Link2 className="w-4 h-4" /> Linked Accounts</h4>
          {accounts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {accounts.map(account => (
                <Badge key={account.id} variant="secondary">{account.account_name}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No accounts linked. Go to "Manage Rules" to link accounts.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Transactions</Button>
      </CardFooter>
    </Card>
  );
}