import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBankData } from "@/hooks/useBankData";
import { accountApi } from "@/api/client";

/**
 * Example Page Component
 * 
 * This demonstrates React patterns and best practices:
 * - Functional components with hooks
 * - State management with useState
 * - Side effects with useEffect
 * - Performance optimization with useMemo and useCallback
 * - Error handling and loading states
 * - API integration with custom hooks
 * 
 * Angular Comparison:
 * - React: Functional component with hooks
 * - Angular: Class component with @Component decorator and lifecycle hooks
 * - React: useState for local state
 * - Angular: class properties and @Input/@Output decorators
 * - React: useEffect for side effects
 * - Angular: ngOnInit, ngOnDestroy, etc.
 */

interface ExampleData {
  id: string;
  name: string;
  value: number;
  status: 'active' | 'inactive';
}

export default function ExamplePage() {
  // State management - equivalent to Angular class properties
  const [data, setData] = useState<ExampleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<ExampleData | null>(null);

  // Custom hook usage - equivalent to Angular services
  const { bankData, isLoading: bankDataLoading } = useBankData();

  // Computed values with useMemo - equivalent to Angular getters
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const activeItemsCount = useMemo(() => {
    return filteredData.filter(item => item.status === 'active').length;
  }, [filteredData]);

  // Event handlers with useCallback - equivalent to Angular methods
  const handleItemClick = useCallback((item: ExampleData) => {
    setSelectedItem(item);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleAddItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Example API call
      const newItem: ExampleData = {
        id: Date.now().toString(),
        name: `Item ${data.length + 1}`,
        value: Math.floor(Math.random() * 1000),
        status: 'active'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(prev => [...prev, newItem]);
    } catch (err) {
      setError('Failed to add item');
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  // Side effects with useEffect - equivalent to Angular lifecycle hooks
  useEffect(() => {
    // ComponentDidMount equivalent
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: ExampleData[] = [
          { id: '1', name: 'Example Item 1', value: 100, status: 'active' },
          { id: '2', name: 'Example Item 2', value: 200, status: 'inactive' },
          { id: '3', name: 'Example Item 3', value: 300, status: 'active' },
        ];
        
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array = run only on mount

  // Effect for logging selected item changes
  useEffect(() => {
    if (selectedItem) {
      console.log('Selected item changed:', selectedItem);
    }
  }, [selectedItem]); // Runs when selectedItem changes

  // Cleanup effect - equivalent to Angular ngOnDestroy
  useEffect(() => {
    return () => {
      // Cleanup function
      console.log('ExamplePage component unmounting');
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600">Error: {error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-2"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Example Page</h1>
          <p className="text-gray-500 mt-1">
            Demonstrates React patterns and best practices
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {activeItemsCount} Active Items
          </Badge>
          <Button onClick={handleAddItem} disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Data Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item) => (
          <Card 
            key={item.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleItemClick(item)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold">${item.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge 
                    variant={item.status === 'active' ? 'default' : 'secondary'}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Item Details */}
      {selectedItem && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Selected Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>ID:</strong> {selectedItem.id}</div>
              <div><strong>Name:</strong> {selectedItem.name}</div>
              <div><strong>Value:</strong> ${selectedItem.value}</div>
              <div><strong>Status:</strong> {selectedItem.status}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Data Integration Example */}
      {bankData && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Data Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              Bank data loaded: {bankDataLoading ? 'Loading...' : 'Ready'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Angular Equivalent Structure:
 * 
 * @Component({
 *   selector: 'app-example-page',
 *   templateUrl: './example-page.component.html',
 *   styleUrls: ['./example-page.component.css']
 * })
 * export class ExamplePageComponent implements OnInit, OnDestroy {
 *   // State properties
 *   data: ExampleData[] = [];
 *   loading = false;
 *   error: string | null = null;
 *   searchTerm = '';
 *   selectedItem: ExampleData | null = null;
 *   
 *   // Computed properties
 *   get filteredData(): ExampleData[] {
 *     return this.data.filter(item => 
 *       item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
 *     );
 *   }
 *   
 *   get activeItemsCount(): number {
 *     return this.filteredData.filter(item => item.status === 'active').length;
 *   }
 *   
 *   constructor(private bankDataService: BankDataService) {}
 *   
 *   ngOnInit(): void {
 *     this.fetchInitialData();
 *   }
 *   
 *   ngOnDestroy(): void {
 *     console.log('ExamplePage component destroying');
 *   }
 *   
 *   handleItemClick(item: ExampleData): void {
 *     this.selectedItem = item;
 *   }
 *   
 *   handleSearchChange(event: any): void {
 *     this.searchTerm = event.target.value;
 *   }
 *   
 *   async handleAddItem(): Promise<void> {
 *     this.loading = true;
 *     try {
 *       // API call logic
 *     } catch (err) {
 *       this.error = 'Failed to add item';
 *     } finally {
 *       this.loading = false;
 *     }
 *   }
 * }
 */ 