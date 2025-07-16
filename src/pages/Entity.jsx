
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Plus, GitMerge, Loader2 } from 'lucide-react';
import { useEntities } from "@/hooks/api";
import { useAccounts } from "@/hooks/api";
import { useTransactions } from "@/hooks/api";
import CreateEntityModal from "../components/entities/CreateEntityModal";
import ManageEntityRulesModal from "../components/entities/ManageEntityRulesModal";
import EntityCard from "../components/entities/EntityCard";

export default function EntityPage() {
  const [rules, setRules] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);

  // Use the new hooks
  const { entities, isLoading, createEntity, updateEntity } = useEntities();
  const { accounts } = useAccounts();
  const { transactions, updateTransaction } = useTransactions();

  const handleSaveEntity = async (formData) => {
    try {
      if (editingEntity) {
        await updateEntity(editingEntity.id, formData);
      } else {
        await createEntity(formData);
      }
      setEditingEntity(null);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving entity:', error);
    }
  };

  const handleEditEntity = (entity) => {
    setEditingEntity(entity);
    setShowCreateModal(true);
  };
  
  const applyRulesToTransactions = async () => {
    setIsProcessing(true);
    try {
      const transactionsToUpdate = [];

      transactions.forEach(tx => {
          for (const rule of rules) {
              if (rule.source_account_ids.includes(tx.account_id) && tx.financial_entity_id !== rule.target_entity_id) {
                  transactionsToUpdate.push({ id: tx.id, updates: { financial_entity_id: rule.target_entity_id } });
                  break;
              }
          }
      });

      if (transactionsToUpdate.length > 0) {
          await Promise.all(transactionsToUpdate.map(t => updateTransaction(t.id, t.updates)));
      }
    } catch (error) {
      console.error('Error applying rules:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAccountsForEntity = (entityId) => {
    const accountIds = new Set();
    rules
      .filter(rule => rule.target_entity_id === entityId)
      .forEach(rule => {
        rule.source_account_ids.forEach(id => accountIds.add(id));
      });
    return accounts.filter(acc => accountIds.has(acc.id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Entities</h1>
          <p className="text-gray-500 mt-1">Separate and manage finances for your businesses or properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowRulesModal(true)}>
            <GitMerge className="w-4 h-4 mr-2" />
            Manage Rules
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>
      
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-indigo-800 max-w-2xl">
                Use rules to automatically assign transactions from specific bank accounts to your entities. After setting up rules, you can apply them to your existing transactions.
            </p>
            <Button onClick={applyRulesToTransactions} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : "Apply Rules to Existing Transactions"}
            </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <p>Loading entities...</p>
      ) : entities.length === 0 ? (
        <Card className="card-shadow border-0 text-center py-24">
          <CardContent className="space-y-4">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-10 h-10 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Create Your First Financial Entity
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Separate your finances by creating entities for things like a small business, a rental property, or a personal project.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Entity
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map(entity => (
            <EntityCard 
              key={entity.id} 
              entity={entity} 
              accounts={getAccountsForEntity(entity.id)}
              onEdit={handleEditEntity}
            />
          ))}
        </div>
      )}

      <CreateEntityModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingEntity(null);
        }}
        onSave={handleSaveEntity}
        entity={editingEntity}
      />
      
      <ManageEntityRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
