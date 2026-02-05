import React, { useState, useEffect } from 'react';
import { firebaseService } from '@/lib/firebaseService';
import { motion } from 'framer-motion';
import { Truck, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { indianStates } from '@/lib/validations';

const ShippingCostSettings = () => {
  const [shippingCosts, setShippingCosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultCost, setDefaultCost] = useState('0');

  useEffect(() => {
    loadShippingCosts();
  }, []);

  const loadShippingCosts = async () => {
    try {
      setLoading(true);
      const response = await firebaseService.getShippingCosts();
      if (response.success && response.data) {
        setShippingCosts(response.data || {});
        setDefaultCost(response.data.default || '0');
      }
    } catch (error) {
      console.error('Failed to load shipping costs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await firebaseService.updateShippingCosts({
        ...shippingCosts,
        default: parseFloat(defaultCost) || 0
      });

      if (response.success) {
        toast({
          title: "Settings Saved",
          description: "Shipping cost settings have been updated successfully.",
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shipping cost settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStateCostChange = (state, value) => {
    setShippingCosts(prev => ({
      ...prev,
      [state]: parseFloat(value) || 0
    }));
  };

  const handleRemoveState = (state) => {
    setShippingCosts(prev => {
      const updated = { ...prev };
      delete updated[state];
      return updated;
    });
  };

  const handleAddState = (state) => {
    if (!shippingCosts[state]) {
      setShippingCosts(prev => ({
        ...prev,
        [state]: 0
      }));
    }
  };

  const configuredStates = Object.keys(shippingCosts).filter(key => key !== 'default');
  const availableStates = indianStates.filter(state => !configuredStates.includes(state));

  if (loading) {
    return <p className="text-gray-500 text-center py-8">Loading shipping costs...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Shipping Cost Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Default Shipping Cost</h3>
            <p className="text-sm text-gray-600 mb-3">
              This cost applies to states not specifically configured below.
            </p>
            <Input
              type="number"
              value={defaultCost}
              onChange={(e) => setDefaultCost(e.target.value)}
              placeholder="0.00"
              className="max-w-xs"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">State-Specific Shipping Costs</h3>
            
            {configuredStates.length === 0 ? (
              <p className="text-gray-500 text-sm">No state-specific costs configured. Add states below to set custom shipping costs.</p>
            ) : (
              <div className="space-y-3">
                {configuredStates.map((state) => (
                  <motion.div
                    key={state}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="font-medium text-gray-700 flex items-center">
                        {state}
                      </div>
                      <Input
                        type="number"
                        value={shippingCosts[state]}
                        onChange={(e) => handleStateCostChange(state, e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveState(state)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {availableStates.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Add State</h3>
              <select
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddState(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Select a state...</option>
                {availableStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>Default Shipping:</strong> ₹{parseFloat(defaultCost).toFixed(2)}</p>
            {configuredStates.length > 0 && (
              <>
                <p className="font-medium mt-4">Custom Rates:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {configuredStates.map(state => (
                    <li key={state}>
                      {state}: ₹{parseFloat(shippingCosts[state]).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingCostSettings;
